/**
 * Mine Advisory Service by LCS — v6.0
 * validateResults.ts — Tier 3 Sequential Validation Engine
 *
 * Execution order: DELTA (QA/QC) → PHANTOM (Anti-Fraud) → Sir Juan Miami (Red Team)
 * Sir Juan Miami runs on Claude Opus 4 — highest reasoning model.
 *
 * Lightman Consultancy Services (LCS) / Lightman Trust Group
 */

import Anthropic from "npm:@anthropic-ai/sdk@0.27.0";

const client = new Anthropic();

// ─── VALIDATION AGENT PROMPTS ─────────────────────────────────────────────────

const DELTA_PROMPT = `You are DELTA — Data Integrity & QA/QC Auditor, Mine Advisory Service by LCS v6.0.
MANDATE: Audit raw data claims underpinning geological and metallurgical analysis. Penalise every QA/QC failure.

AUDIT:
1. ASSAY QA/QC: blank insertion rate (min 1:20), CRM insertion rate (min 1:20), duplicate rate (min 1:20), CRM performance (within 2σ), contamination events, umpire lab used.
2. LAB ACCREDITATION: ISO 17025 confirmed, analytical method appropriate (fire assay for Au, ICP-MS for multi-element), chain of custody present.
3. STATISTICAL INTEGRITY: grade distribution methodology appropriate, outlier top-cut documented, composite interval consistency, specific gravity measurements adequate.
4. DATABASE AUDIT: drill hole database internally consistent (collar/survey/assay tables), depth discrepancies present, missing intervals, historical vs modern data integration.

Return ONLY valid JSON:
{"agent":"DELTA","qaqc_audit":{"blank_rate_compliant":true,"crm_rate_compliant":true,"duplicate_rate_compliant":true,"crm_performance":"PASS|MARGINAL|FAIL","contamination_events":0,"umpire_lab_used":false},"lab_accreditation":{"iso17025_confirmed":true,"method_appropriate":true,"coc_present":true},"statistical_integrity":{"distribution_correct":true,"outlier_treatment_documented":true,"sg_measurements_adequate":true},"database_audit":{"internally_consistent":true,"depth_discrepancies":false,"missing_intervals":false},"overall_data_integrity":"HIGH|MEDIUM|LOW|CRITICAL_FAILURE","delta_flags":[],"delta_verdict":"string"}`;

const PHANTOM_PROMPT = `You are PHANTOM — Anti-Fraud & Seller Bias Detection Agent, Mine Advisory Service by LCS v6.0.
MANDATE: Detect every form of misrepresentation. Assume vendor document contains at least one misleading element.

DETECT:
1. GMV MISREPRESENTATION: in-situ metal value presented as project value without cost deduction? Compare any quoted value against realistic economic value after mining, processing, CAPEX and OPEX.
2. CHERRY-PICKED INTERCEPTS: headline intercepts representative of full resource, or best 1–3 holes? Downhole vs true width correction applied?
3. RESOURCE CLASSIFICATION ABUSE: Inferred resources used in economic analysis? Reserve/resource conversion assumed 100%?
4. OUTDATED STUDIES: cost data significantly older than resource estimate? Inflation adjustment applied?
5. SELECTIVE OMISSION: gaps in QA/QC data, absent low-grade intercepts, only highest-grade domain reported?
6. IMPLAUSIBLE RECOVERIES: gold heap leach above 85%, CIL above 95%, Cu SX-EW above 92% without testwork justification?
7. JURISDICTION MISMATCH: discount rate too low for political risk? Tax/royalty understated?
8. LINGUISTIC BIAS: excessive "world-class/district-scale/company-making/transformational", absent risk sections, passive voice on negatives?
9. TEAM VERIFICATION: named QPs appear in professional registries? Company incorporation verifiable?

SEVERITY: CRITICAL | SERIOUS | MODERATE

Return ONLY valid JSON:
{"agent":"PHANTOM","fraud_flags":[{"type":"string","severity":"CRITICAL|SERIOUS|MODERATE","description":"string","evidence":"string"}],"gmv_misrepresentation":false,"cherry_pick_detected":false,"resource_classification_abuse":false,"outdated_studies":false,"selective_omission":false,"implausible_recoveries":false,"jurisdiction_mismatch":false,"linguistic_bias_score":0,"team_verification_passed":true,"overall_fraud_risk":"LOW|MEDIUM|HIGH|CRITICAL","phantom_verdict":"string"}`;

const SIR_JUAN_PROMPT = `You are Sir Juan Miami, Chief Validation Officer — Red Team Agent, Mine Advisory Service by LCS v6.0.
AI MODEL: You are running on Claude Opus 4 — the highest reasoning model in the swarm.
MANDATE: Find logical failures no single-domain expert would catch. You are the final institutional safeguard.

FIND:
1. CROSS-DOMAIN LOGICAL CONTRADICTIONS: geological assumptions vs mining method (narrow vein with bulk mining?), metallurgical recovery vs financial model, production schedule vs geological continuity, environmental risk vs discount rate, jurisdiction risk vs financing structure.
2. ASSUMPTION DEPENDENCY CHAINS: identify chains where if assumption A fails, assumption B collapses. Map failure cascade. Which single failure causes largest value destruction?
3. MISSING RISKS NOT FLAGGED BY ANY AGENT: technology readiness at commercial scale, offtake risk (no named buyer), infrastructure concentration risk, key person risk, first-mover risk in jurisdiction.
4. SCORING RECALIBRATIONS: any section scored inconsistently with flags raised? If section scored 40 but flags justify 70, recalibrate.
5. FINAL RED TEAM VERDICT: What must be true for this project to be investable? What is the single most likely reason for project failure? The 5 hardest questions an institutional investor would ask that current submission cannot answer.

STANDARD: Senior partner review at a tier-one mining investment bank. Every finding specific, evidenced, actionable. No vague concerns. No hedging without quantification. Never soften critical findings.

Return ONLY valid JSON:
{"agent":"Sir Juan Miami","cross_domain_contradictions":[{"domains_affected":[],"description":"string","severity":"CRITICAL|SERIOUS|MODERATE"}],"assumption_dependency_chains":[{"chain":[],"failure_point":"string","value_impact":"string"}],"missing_risks":[{"risk":"string","severity":"CRITICAL|SERIOUS|MODERATE","mitigation_available":false}],"scoring_recalibrations":[{"section":"string","original_score":0,"recalibrated_score":0,"reason":"string"}],"investability_conditions":[],"primary_failure_mode":"string","five_hardest_questions":[],"red_team_finding":"string","red_team_verdict":"PASS|CONDITIONAL|FAIL","confidence_in_verdict":85}`;

// ─── AGENT RUNNER ─────────────────────────────────────────────────────────────

async function runValidationAgent(
  agentId: string,
  systemPrompt: string,
  allPriorOutputs: Record<string, unknown>,
  model = "claude-sonnet-4-20250514"
): Promise<Record<string, unknown>> {
  const briefing = `COMPLETE PRIOR ANALYSIS — ALL TIER 0, 1, 2 AGENT OUTPUTS:
${JSON.stringify(allPriorOutputs, null, 2)}

You are the ${agentId} validation agent. Analyse the complete picture from all prior agents.
Apply your specific validation mandate. Return ONLY valid JSON as specified.`;

  console.log(`[Tier 3] Running ${agentId}${model.includes("opus") ? " (Claude Opus 4 — elevated reasoning)" : ""}...`);
  const start = Date.now();

  try {
    const response = await client.messages.create({
      model,
      max_tokens: agentId === "sirjuan_redteam" ? 6000 : 3000,
      temperature: agentId === "sirjuan_redteam" ? 0.05 : 0.1,
      system: systemPrompt,
      messages: [{ role: "user", content: briefing }],
    });

    const raw = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const clean = raw.replace(/```json\n?|```\n?/g, "").trim();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`[Tier 3] ${agentId} complete — ${elapsed}s`);
    return JSON.parse(clean);
  } catch (e) {
    console.error(`[Tier 3] ${agentId} failed:`, e);
    return { agent_id: agentId, error: true, message: String(e) };
  }
}

// ─── TIER 3 SEQUENTIAL PIPELINE ───────────────────────────────────────────────

export async function runTier3Validation(
  allPriorOutputs: Record<string, unknown>
): Promise<{
  delta_qaqc: Record<string, unknown>;
  phantom_fraud: Record<string, unknown>;
  sirjuan_redteam: Record<string, unknown>;
}> {
  console.log("\n[Tier 3] Starting sequential validation pipeline...");

  // DELTA runs first — QA/QC audit
  const delta = await runValidationAgent(
    "delta_qaqc",
    DELTA_PROMPT,
    allPriorOutputs,
    "claude-sonnet-4-20250514"
  );

  // PHANTOM runs second — receives DELTA output too
  const phantom = await runValidationAgent(
    "phantom_fraud",
    PHANTOM_PROMPT,
    { ...allPriorOutputs, delta_output: delta },
    "claude-sonnet-4-20250514"
  );

  // SIR JUAN MIAMI runs last — receives ALL outputs — uses Claude Opus 4
  const sirjuan = await runValidationAgent(
    "sirjuan_redteam",
    SIR_JUAN_PROMPT,
    { ...allPriorOutputs, delta_output: delta, phantom_output: phantom },
    "claude-opus-4-20250514"  // ONLY agent using Opus 4
  );

  console.log("[Tier 3] All validation agents complete.");
  console.log("[Tier 3] Red Team Verdict:", (sirjuan as Record<string, string>).red_team_verdict ?? "UNKNOWN");

  return { delta_qaqc: delta, phantom_fraud: phantom, sirjuan_redteam: sirjuan };
}

// ─── KYC GATE — JUAN GONZALEZ SIMULATION ─────────────────────────────────────
// In production, Juan Gonzalez (human) reviews the deal.
// This function provides the structured schema his clearance must populate.

export interface KYCClearance {
  officer: "Juan Gonzalez";
  kyc_status: "PASS" | "CONDITIONAL" | "FAIL";
  counterparty_verified: boolean;
  sanctions_clear: boolean;
  pep_identified: boolean;
  aml_risk_rating: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  jurisdiction_fatf_status: string;
  conditions: string[];
  block_reason: string | null;
  kyc_file_reference: string;
  gonzalez_clearance: boolean;
  timestamp: string;
}

export function createKYCClearance(
  status: "PASS" | "CONDITIONAL" | "FAIL",
  details: Partial<KYCClearance> = {}
): KYCClearance {
  return {
    officer: "Juan Gonzalez",
    kyc_status: status,
    counterparty_verified: status !== "FAIL",
    sanctions_clear: status !== "FAIL",
    pep_identified: false,
    aml_risk_rating: status === "PASS" ? "LOW" : status === "CONDITIONAL" ? "MEDIUM" : "HIGH",
    jurisdiction_fatf_status: "Grey List — Enhanced Monitoring Required",
    conditions: [],
    block_reason: status === "FAIL" ? "Beneficial ownership unresolved" : null,
    kyc_file_reference: `KYC-${Date.now()}`,
    gonzalez_clearance: status !== "FAIL",
    timestamp: new Date().toISOString(),
    ...details,
  };
}
