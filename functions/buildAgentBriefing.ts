/**
 * buildAgentBriefing.ts
 * Constructs the user-turn briefing sent to each agent
 * Includes: project data, SIGMA gap analysis, prior agent outputs, document text
 */

export function buildAgentBriefing(
  projectData: Record<string, unknown>,
  priorOutputs: Record<string, unknown>,
  documentText: string,
  agentConfig: Record<string, unknown>
): string {
  const sections: string[] = [];

  sections.push(`## PROJECT SUBMISSION\n\`\`\`json\n${JSON.stringify(projectData, null, 2)}\n\`\`\``);

  if (priorOutputs.sigma) {
    sections.push(`## SIGMA PRE-ANALYSIS BRIEFING\n\`\`\`json\n${JSON.stringify(priorOutputs.sigma, null, 2)}\n\`\`\``);
  }

  if (priorOutputs.aria) {
    sections.push(`## ARIA DOCUMENT INVENTORY\n\`\`\`json\n${JSON.stringify(priorOutputs.aria, null, 2)}\n\`\`\``);
  }

  const agentId = agentConfig.agent_id as string;
  const relevantPrior: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(priorOutputs)) {
    if (key !== "aria" && key !== "sigma") {
      relevantPrior[key] = value;
    }
  }
  if (Object.keys(relevantPrior).length > 0) {
    sections.push(`## PRIOR AGENT OUTPUTS\n\`\`\`json\n${JSON.stringify(relevantPrior, null, 2)}\n\`\`\``);
  }

  if (documentText && documentText.length > 100) {
    const truncated = documentText.length > 50000
      ? documentText.slice(0, 50000) + "\n\n[DOCUMENT TRUNCATED — first 50,000 characters shown]"
      : documentText;
    sections.push(`## SOURCE DOCUMENTS (EXTRACTED TEXT)\n${truncated}`);
  }

  sections.push(`## INSTRUCTION\nYou are ${agentConfig.name} (${agentConfig.agent_id}). Analyse the project submission above and return your findings as strict JSON conforming to your output schema. Do not include any text outside the JSON object. Do not wrap in markdown code fences.`);

  return sections.join("\n\n");
}
