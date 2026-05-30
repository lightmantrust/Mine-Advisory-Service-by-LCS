/**
 * Mine Advisory Service by LCS — v6.0
 * analyseProject.ts — Claude API Orchestrator
 * Lightman Consultancy Services (LCS) / Lightman Trust Group
 *
 * Replaces: npm:openai@4.28.0 (abandoned)
 * AI Core: Anthropic Claude Sonnet 4 (domain agents) + Opus 4 (Sir Juan Miami)
 */

import Anthropic from "npm:@anthropic-ai/sdk@0.27.0";
import { loadAgentConfig } from "./loadAgentConfig.ts";
import { buildAgentBriefing } from "./buildAgentBriefing.ts";

const client = new Anthropic();

// ─── AGENT EXECUTION ────────────────────────────────────────────────────────

export async function runAgent(
  agentId: string,
  projectData: Record<string, unknown>,
  priorOutputs: Record<string, unknown> = {},
  documentText: string = ""
): Promise<Record<string, unknown>> {
  const agentConfig = await loadAgentConfig(agentId);

  const model = agentConfig.model ?? "claude-sonnet-4-20250514";
  const temperature = agentConfig.temperature ?? 0.1;
  const maxTokens = agentConfig.max_tokens ?? 4000;

  const briefing = buildAgentBriefing(projectData, priorOutputs, documentText, agentConfig);

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: agentConfig.system_prompt,
    messages: [{ role: "user", content: briefing }],
  });

  const rawText = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  // Strip markdown code fences if present
  const cleaned = rawText.replace(/```json\n?|```\n?/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error(`[${agentId}] JSON parse failed. Raw output:`, rawText.slice(0, 500));
    return { agent_id: agentId, parse_error: true, raw: rawText };
  }
}

// ─── TIER ORCHESTRATION ─────────────────────────────────────────────────────

export async function runTier0(
  projectData: Record<string, unknown>,
  documentText: string
): Promise<{ aria: Record<string, unknown>; sigma: Record<string, unknown> }> {
  console.log("[Tier 0] Running ARIA — document ingestion...");
  const aria = await runAgent("tier0/aria", projectData, {}, documentText);

  console.log("[Tier 0] Running SIGMA — gap mapping...");
  const sigma = await runAgent("tier0/sigma", projectData, { aria }, documentText);

  return { aria, sigma };
}

export async function runTier1Parallel(
  projectData: Record<string, unknown>,
  tier0Outputs: Record<string, unknown>,
  documentText: string
): Promise<Record<string, Record<string, unknown>>> {
  console.log("[Tier 1] Running QP domain agents in parallel...");

  const agents = [
    "tier1/chen_geology",
    "tier1/okafor_mining",
    "tier1/marsh_metallurgy",
    "tier1/rivera_environmental",
    "tier1/donovan_financial",
  ];

  const results = await Promise.all(
    agents.map((agentId) =>
      runAgent(agentId, projectData, tier0Outputs, documentText)
    )
  );

  return {
    chen_geology: results[0],
    okafor_mining: results[1],
    marsh_metallurgy: results[2],
    rivera_environmental: results[3],
    donovan_financial: results[4],
  };
}

export async function runTier2Parallel(
  projectData: Record<string, unknown>,
  allPrior: Record<string, unknown>,
  documentText: string
): Promise<Record<string, Record<string, unknown>>> {
  console.log("[Tier 2] Running cross-domain intelligence in parallel...");

  const agents = [
    "tier2/sterling_quant",
    "tier2/vega_comparables",
    "tier2/jura_regulatory",
  ];

  const results = await Promise.all(
    agents.map((agentId) =>
      runAgent(agentId, projectData, allPrior, documentText)
    )
  );

  return {
    sterling_quant: results[0],
    vega_comparables: results[1],
    jura_regulatory: results[2],
  };
}

export async function runTier3Sequential(
  projectData: Record<string, unknown>,
  allPrior: Record<string, unknown>,
  documentText: string
): Promise<Record<string, Record<string, unknown>>> {
  console.log("[Tier 3] Running DELTA — QA/QC audit...");
  const delta = await runAgent("tier3/delta_qaqc", projectData, allPrior, documentText);

  console.log("[Tier 3] Running PHANTOM — fraud detection...");
  const phantom = await runAgent("tier3/phantom_fraud", projectData, { ...allPrior, delta }, documentText);

  console.log("[Tier 3] Running Sir Juan Miami — Red Team validation (Opus 4)...");
  const sirjuan = await runAgent(
    "tier3/sirjuan_redteam",
    projectData,
    { ...allPrior, delta, phantom },
    documentText
  );

  return { delta_qaqc: delta, phantom_fraud: phantom, sirjuan_redteam: sirjuan };
}

export async function runTier4(
  projectData: Record<string, unknown>,
  allPrior: Record<string, unknown>
): Promise<Record<string, unknown>> {
  console.log("[Tier 4] Running APEX — synthesis and report generation...");
  return await runAgent("tier4/apex_synthesis", projectData, allPrior, "");
}

// ─── MAIN PIPELINE ──────────────────────────────────────────────────────────

export async function analyseProject(
  projectData: Record<string, unknown>,
  documentText: string
): Promise<Record<string, unknown>> {
  const start = Date.now();
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Mine Advisory Service by LCS — v6.0`);
  console.log(`  Project: ${projectData.project_name ?? "Unknown"}`);
  console.log(`  Commodity: ${projectData.commodity ?? "Unknown"}`);
  console.log(`${"═".repeat(60)}\n`);

  // TIER 0 — Sequential intake
  const tier0 = await runTier0(projectData, documentText);

  // TIER 1 — Parallel QP analysis
  const tier1 = await runTier1Parallel(projectData, tier0, documentText);

  // TIER 2 — Parallel cross-domain
  const tier2 = await runTier2Parallel(projectData, { ...tier0, ...tier1 }, documentText);

  // TIER 3 — Sequential validation
  const tier3 = await runTier3Sequential(
    projectData,
    { ...tier0, ...tier1, ...tier2 },
    documentText
  );

  // TIER 4 — Synthesis
  const apex = await runTier4(projectData, { ...tier0, ...tier1, ...tier2, ...tier3 });

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Analysis complete — ${elapsed}s`);
  console.log(`  Verdict: ${(apex as Record<string, string>).verdict ?? "Unknown"}`);
  console.log(`  Traffic Light: ${(apex as Record<string, string>).traffic_light ?? "Unknown"}`);
  console.log(`${"═".repeat(60)}\n`);

  return {
    pipeline_outputs: { tier0, tier1, tier2, tier3 },
    apex_result: apex,
    elapsed_seconds: parseFloat(elapsed),
  };
}
