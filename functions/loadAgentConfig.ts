/**
 * loadAgentConfig.ts
 * Loads agent JSON config from the agents/ directory
 */

export async function loadAgentConfig(agentId: string): Promise<Record<string, unknown>> {
  const path = new URL(`../agents/${agentId}.agent.json`, import.meta.url);
  const text = await Deno.readTextFile(path);
  return JSON.parse(text);
}
