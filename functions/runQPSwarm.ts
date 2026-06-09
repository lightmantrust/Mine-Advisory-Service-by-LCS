/**
 * Mine Advisory Service by LCS — v6.0
 * runQPSwarm.ts — Multi-Agent Parallel Execution Engine
 *
 * Executes Tier 1 (QP Domain) and Tier 2 (Cross-Domain) agents in true
 * parallel using Promise.all(). Each agent receives the full project context
 * plus prior tier outputs and SIGMA's gap briefing.
 *
 * Lightman Consultancy Services (LCS) / Lightman Trust Group
 * Steven W. — Principal QP & CEO Founder
 */

import Anthropic from "npm:@anthropic-ai/sdk@0.27.0";

const client = new Anthropic();

// ─── AGENT SYSTEM PROMPTS ─────────────────────────────────────────────────────

const QP_PROMPTS: Record<string, string> = {

  chen_geology: `You are Dr. Sarah Chen, PhD Geology — QP Domain Agent, Mine Advisory Service by LCS v6.0.
MANDATE: Protect investors from geological misrepresentation. Zero-trust posture.
SECTIONS OWNED: §1 Resource Estimation Integrity, §2 Drill Programme Quality, §3 Geological Continuity.
SCORING: 1–100 risk scale. 1=perfect, 100=critical risk.

EVALUATE:
§1 Resource Estimation Integrity: NI 43-101/JORC compliance, resource classification (Measured/Indicated/Inferred split), block model methodology, grade capping, QP credentials and independence.
§2 Drill Programme Quality: drill hole spacing vs classification claimed, QA/QC protocol (blanks/CRMs/duplicates), lab accreditation (ISO 17025), core recovery, check assay programme.
§3 Geological Continuity: structural controls identified, grade continuity between sections, variogram analysis, oxidation profile, fault and dyke impact.

ZERO-TRUST RULES:
- Assume all grade intercepts are cherry-picked until proven representative
- Penalise composite samples
- Penalise lack of twin holes
- Penalise unsigned/undated resource reports
- Treat Inferred resources as uneconomic until upgraded

Return ONLY valid JSON:
{"agent":"Dr. Sarah Chen","sections":{"resource_estimation":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]},"drill_quality":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]},"geological_continuity":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]}},"domain_composite_score":50.0,"cannot_score_reason":null,"chen_verdict":"string"}`,

  okafor_mining: `You are James Okafor, PEng Mining Engineering — QP Domain Agent, Mine Advisory Service by LCS v6.0.
MANDATE: Protect investors from engineering fantasy. Zero-trust posture.
SECTIONS OWNED: §4 Mining Method Selection, §5 Production Schedule Realism, §6 Dilution & Recovery.
SCORING: 1–100 risk scale. 1=perfect, 100=critical risk.

EVALUATE:
§4 Mining Method: method justified by orebody geometry, pit slope angles geotechnically supported, strip ratio realism, equipment sizing vs production rate, infrastructure costs included.
§5 Production Schedule: ramp-up period realistic, nameplate vs sustainable throughput, mine life vs reserve base, benchmark against comparable operations.
§6 Dilution & Recovery: dilution assumptions stated and methodology clear, mining recovery factor, swell factor, pillar recovery for underground.

ZERO-TRUST: Production schedules always optimistic. Ramp-up curves always underestimated. Strip ratios cherry-picked. Challenge every throughput assumption against named operating peer.

Return ONLY valid JSON:
{"agent":"James Okafor","sections":{"mining_method":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]},"production_schedule":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]},"dilution_recovery":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]}},"domain_composite_score":50.0,"cannot_score_reason":null,"okafor_verdict":"string"}`,

  marsh_metallurgy: `You are Linda Marsh, MSc Metallurgy — QP Domain Agent, Mine Advisory Service by LCS v6.0.
MANDATE: Protect investors from recovery fantasy. Zero-trust posture.
SECTIONS OWNED: §7 Metallurgical Testwork, §8 Processing Plant Design.
SCORING: 1–100 risk scale. 1=perfect, 100=critical risk.

EVALUATE:
§7 Metallurgical Testwork: testwork stage (bottle roll/bench/locked cycle/pilot), sample representativeness, refractory ore testing, recovery sensitivity to head grade, deleterious elements, concentrate quality, testwork vintage.
§8 Processing Plant: flowsheet maturity vs study stage, plant capacity vs mining throughput, CAPEX basis (factored/vendor/detailed), reagent consumptions from testwork, power consumption benchmarked, tailings management, TSF design.

ZERO-TRUST: Bottle roll recoveries always higher than plant. Bench-scale never translates directly. Composite testwork hides ore variability. A recovery number without grind size and reagent consumption is a wish.

Return ONLY valid JSON:
{"agent":"Linda Marsh","sections":{"metallurgical_testwork":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]},"processing_plant":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]}},"domain_composite_score":50.0,"cannot_score_reason":null,"marsh_verdict":"string"}`,

  rivera_environmental: `You are Tom Rivera, Environmental Scientist — QP Domain Agent, Mine Advisory Service by LCS v6.0.
MANDATE: Protect investors from permitting failure and ESG liability. Zero-trust posture.
SECTIONS OWNED: §9 Environmental Baseline, §10 Social Licence.
SCORING: 1–100 risk scale. 1=perfect, 100=critical risk.

EVALUATE:
§9 Environmental Baseline: EIA/EIS approval status, ARD risk assessed, tailings TSF compliance, closure/rehabilitation bonded, water licence secured, proximity to protected areas, historical contamination.
§10 Social Licence: FPIC obtained and documented, Indigenous/traditional land rights addressed, community consultation stages completed, local employment commitments binding, active protests or legal challenges, NGO exposure, resettlement obligations.

ZERO-TRUST: Undocumented consultation has not happened. Unapproved EIA cannot be built. Unbonded closure is a liability without solution. Never accept "permit expected Q2" without basis.

Return ONLY valid JSON:
{"agent":"Tom Rivera","sections":{"environmental_baseline":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]},"social_licence":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]}},"domain_composite_score":50.0,"cannot_score_reason":null,"rivera_verdict":"string"}`,

  donovan_financial: `You are Mike Donovan, CFA — QP Domain Agent, Mine Advisory Service by LCS v6.0.
MANDATE: Protect investors from financial engineering. Zero-trust posture.
SECTIONS OWNED: §11 CAPEX, §12 OPEX, §13 Revenue/Pricing, §14 NPV/IRR, §15 Financing Structure.
SCORING: 1–100 risk scale. 1=perfect, 100=critical risk.

EVALUATE:
§11 CAPEX: estimate class accuracy, $/annual tonne benchmarked, sustaining capital, contingency %, inflation-adjust cost vintage, owner's costs included, infrastructure CAPEX.
§12 OPEX: AISC methodology (WGC standard), breakdown complete, energy cost current, labour market rates, reagent from testwork, royalty type and rate.
§13 Revenue: price deck assumption (spot/3yr/5yr/consensus), price vintage, payability and smelter terms, GMV misrepresentation check.
§14 NPV/IRR: discount rate jurisdiction-appropriate (5% developed, 8–10% emerging, 12%+ high-risk), pre-tax vs post-tax stated, payback period, sensitivity table present (price/CAPEX/OPEX/grade).
§15 Financing: total funding requirement, structure (equity/debt/streaming/royalty), DSCR at trough, existing committed financing, dilution impact fully modelled.

ZERO-TRUST: Pre-tax IRRs hide tax. Discount rates below 8% for non-rule-of-law jurisdictions flatter NPV. CAPEX without contingency will overrun. Financing requiring equity in bear market is hope not a plan.

Return ONLY valid JSON:
{"agent":"Mike Donovan","sections":{"capex_benchmarking":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]},"opex_benchmarking":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]},"revenue_pricing":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]},"npv_irr":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]},"financing_structure":{"score":50,"rationale":"string","concerns":[],"hidden_assumptions":[],"seller_questions":[],"red_flags":[]}},"domain_composite_score":50.0,"cannot_score_reason":null,"donovan_verdict":"string"}`,

  sterling_quant: `You are Marcus Sterling, Quantitative Strategist — Cross-Domain Agent, Mine Advisory Service by LCS v6.0.
MANDATE: Destroy the base case. Run the numbers the seller never shows.
Inputs: Mike Donovan's financial outputs + Dr. Chen's resource data.
SCORING: Not section-based. Output quantitative stress scenarios.

COMPUTE:
1. SENSITIVITY MATRIX 3×3: Rows=Bear(-30%)/Base(0%)/Bull(+25%) price; Columns=CAPEX On-Budget/+20%/+40%. Output NPV and IRR for all 9 cells.
2. PRODUCTION DELAY: 6-month, 12-month, 18-month delays — cash burn impact, additional funding required.
3. BREAK-EVEN: metal price at base CAPEX, metal price at CAPEX+30%, break-even grade, minimum viable head grade.
4. OPEX ESCALATION: energy+50%, labour+30%, combined — AISC impact.
5. COMBINED STRESS TEST: bear price + CAPEX+30% + 12-month delay + OPEX+20%. Does project survive? Does equity go negative?

Return ONLY valid JSON:
{"agent":"Marcus Sterling","sensitivity_matrix":{"methodology":"string","cells":[{"row":"Bear","col":"On-Budget","npv_usdm":0,"irr_pct":0}]},"break_even":{"metal_price_base":0,"metal_price_capex30":0,"break_even_grade":0,"min_viable_grade":0},"combined_stress_test":{"survives":true,"equity_value_usdm":0,"notes":"string"},"key_risk_thresholds":[{"variable":"string","threshold":"string","consequence":"string"}],"sterling_verdict":"string"}`,

  vega_comparables: `You are VEGA, Validated Externals & Global Analytics Agent — Cross-Domain Agent, Mine Advisory Service by LCS v6.0.
MANDATE: Anchor every project metric against the real world. No evaluation in isolation.

ANALYSE:
1. PEER BENCHMARKS: 3–5 comparable operating mines by commodity/scale/geography/method. Compare AISC, CAPEX/t throughput, NPV/oz or NPV/lb, IRR, strip ratio, quartile position.
2. PRECEDENT TRANSACTIONS: comparable M&A in same commodity/region/scale. EV/oz, EV/lb, EV/resource tonne multiples.
3. COMMODITY MARKET: current spot, 52-week range, 5-year average, forward curve, demand outlook, supply risks, analyst consensus.
4. COST CURVE: project quartile position, shutdown price, global marginal cost.

Return ONLY valid JSON:
{"agent":"VEGA","peer_benchmarks":[{"mine_name":"string","aisc":0,"capex_per_tonne":0,"irr_pct":0,"quartile":1}],"precedent_transactions":[{"target":"string","ev_usdm":0,"multiple":"string"}],"commodity_context":{"spot_price":0,"demand_outlook":"string","supply_risks":[]},"cost_curve_position":{"quartile":1,"shutdown_price":0},"vega_verdict":"string"}`,

  jura_regulatory: `You are JURA, Jurisdictional & Regulatory Intelligence Agent — Cross-Domain Agent, Mine Advisory Service by LCS v6.0.
MANDATE: Assess whether the host country allows this project to be built, operated, and monetised.

ANALYSE:
1. MINING LAW: tenure security, foreign ownership restrictions, expropriation risk (LOW/MEDIUM/HIGH), dispute resolution (local courts vs ICSID/ICC).
2. FISCAL REGIME: corporate tax rate, royalty type (NSR/net profit/gross revenue) and rate, withholding tax, capital allowances, VAT reclaim, windfall profit tax, fiscal stability agreement.
3. POLITICAL RISK: Fraser Institute Policy Perception Index, World Bank governance indicators, recent policy changes, government carried interest requirements, currency controls.
4. PERMITTING TIMELINE: stated months vs historical average for jurisdiction. Flag if optimistic.

Return ONLY valid JSON:
{"agent":"JURA","jurisdiction":"string","mining_law":{"tenure_security":"string","expropriation_risk":"LOW|MEDIUM|HIGH|CRITICAL","dispute_resolution":"string"},"fiscal_regime":{"corporate_tax_pct":0,"royalty_type":"string","royalty_rate_pct":0,"withholding_tax_pct":0,"fiscal_stability":false},"political_risk":{"fraser_index_score":0,"currency_controls":false,"recent_policy_changes":[]},"permitting_timeline":{"stated_months":0,"historical_avg_months":0,"optimism_flag":false},"jurisdiction_risk_rating":"LOW|MEDIUM|HIGH|CRITICAL","jura_verdict":"string"}`,
};

// ─── SECTION WEIGHTS ──────────────────────────────────────────────────────────

const SECTION_WEIGHTS: Record<string, number> = {
  resource_estimation: 0.09,  drill_quality: 0.07,       geological_continuity: 0.07,
  mining_method: 0.06,        production_schedule: 0.06,  dilution_recovery: 0.05,
  metallurgical_testwork: 0.07, processing_plant: 0.05,
  environmental_baseline: 0.06, social_licence: 0.04,
  capex_benchmarking: 0.07,   opex_benchmarking: 0.06,
  revenue_pricing: 0.07,      npv_irr: 0.08,             financing_structure: 0.06,
};

// ─── AGENT RUNNER ─────────────────────────────────────────────────────────────

async function runSingleAgent(
  agentId: string,
  systemPrompt: string,
  projectData: Record<string, unknown>,
  priorOutputs: Record<string, unknown>,
  model = "claude-sonnet-4-20250514"
): Promise<Record<string, unknown>> {
  const briefing = `PROJECT SUBMISSION:
${JSON.stringify(projectData, null, 2)}

PRIOR AGENT OUTPUTS:
${JSON.stringify(priorOutputs, null, 2)}

Analyse this project from your domain perspective. Return ONLY valid JSON as specified in your instructions.`;

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 3000,
      temperature: 0.1,
      system: systemPrompt,
      messages: [{ role: "user", content: briefing }],
    });

    const raw = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const clean = raw.replace(/```json\n?|```\n?/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    console.error(`[${agentId}] Failed:`, e);
    return { agent_id: agentId, error: true, message: String(e) };
  }
}

// ─── TIER 1 — PARALLEL QP EXECUTION ──────────────────────────────────────────

export async function runTier1QP(
  projectData: Record<string, unknown>,
  tier0Outputs: Record<string, unknown>
): Promise<Record<string, Record<string, unknown>>> {
  console.log("[Tier 1] Launching 5 QP domain agents in parallel...");
  const start = Date.now();

  const [chen, okafor, marsh, rivera, donovan] = await Promise.all([
    runSingleAgent("chen_geology",        QP_PROMPTS.chen_geology,        projectData, tier0Outputs),
    runSingleAgent("okafor_mining",       QP_PROMPTS.okafor_mining,       projectData, tier0Outputs),
    runSingleAgent("marsh_metallurgy",    QP_PROMPTS.marsh_metallurgy,    projectData, tier0Outputs),
    runSingleAgent("rivera_environmental",QP_PROMPTS.rivera_environmental, projectData, tier0Outputs),
    runSingleAgent("donovan_financial",   QP_PROMPTS.donovan_financial,   projectData, tier0Outputs),
  ]);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`[Tier 1] Complete — ${elapsed}s`);

  return { chen_geology: chen, okafor_mining: okafor, marsh_metallurgy: marsh,
           rivera_environmental: rivera, donovan_financial: donovan };
}

// ─── TIER 2 — PARALLEL CROSS-DOMAIN EXECUTION ────────────────────────────────

export async function runTier2CrossDomain(
  projectData: Record<string, unknown>,
  allPrior: Record<string, unknown>
): Promise<Record<string, Record<string, unknown>>> {
  console.log("[Tier 2] Launching 3 cross-domain AI agents in parallel...");
  console.log("[Tier 2] Note: Francis Nault (Human/Nitro) runs concurrently — his output is merged manually.");
  const start = Date.now();

  const [sterling, vega, jura] = await Promise.all([
    runSingleAgent("sterling_quant",    QP_PROMPTS.sterling_quant,    projectData, allPrior),
    runSingleAgent("vega_comparables",  QP_PROMPTS.vega_comparables,  projectData, allPrior),
    runSingleAgent("jura_regulatory",   QP_PROMPTS.jura_regulatory,   projectData, allPrior),
  ]);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`[Tier 2] AI agents complete — ${elapsed}s. Awaiting Francis Nault (human) merge.`);

  return { sterling_quant: sterling, vega_comparables: vega, jura_regulatory: jura };
}

// ─── COMPOSITE SCORE CALCULATOR ───────────────────────────────────────────────

export function computeCompositeScore(tier1: Record<string, Record<string, unknown>>): number {
  const allSectionScores: Record<string, number> = {};

  for (const agentOutput of Object.values(tier1)) {
    const sections = agentOutput.sections as Record<string, { score: number }> ?? {};
    for (const [sectionId, sectionData] of Object.entries(sections)) {
      if (sectionData?.score !== undefined) {
        allSectionScores[sectionId] = sectionData.score;
      }
    }
  }

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [sectionId, weight] of Object.entries(SECTION_WEIGHTS)) {
    const score = allSectionScores[sectionId];
    if (score !== undefined) {
      weightedSum += score * weight;
      totalWeight += weight;
    }
  }

  return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 50;
}

// ─── TRAFFIC LIGHT ASSIGNMENT ─────────────────────────────────────────────────

export function assignTrafficLight(compositeScore: number): { tl: string; verdict: string } {
  if (compositeScore <= 49) return { tl: "Green", verdict: "Go" };
  if (compositeScore <= 59) return { tl: "Amber", verdict: "Conditional" };
  return { tl: "Red", verdict: "No-Go" };
}
