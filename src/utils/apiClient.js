/**
 * Mine Advisory Service by LCS — v6.0
 * src/utils/apiClient.js — Smart API Client
 *
 * Automatically routes Claude API calls to the correct endpoint:
 *   - Claude artifacts  → uses artifact proxy (no key needed)
 *   - Local dev         → uses Vite proxy → /api/analyse
 *   - Vercel deploy     → /api/analyse (serverless function)
 *   - Netlify deploy    → /.netlify/functions/analyse
 *
 * Lightman Consultancy Services (LCS) / Lightman Trust Group
 */

// Detect environment
const isClaudeArtifact = window.location.hostname.includes("claude.ai") ||
                          window.location.hostname === "localhost" && !import.meta.env.VITE_API_URL;

const isNetlify       = window.location.hostname.includes("netlify.app") ||
                         import.meta.env.VITE_API_URL?.includes("netlify");

// Resolve correct API endpoint
export const API_ENDPOINT = (() => {
  if (isClaudeArtifact) return "https://api.anthropic.com/v1/messages";
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (isNetlify) return "/.netlify/functions/analyse";
  return "/api/analyse"; // Default — Vercel or local dev with Vite proxy
})();

// Headers — only include API key for direct Anthropic calls (Claude artifacts)
const buildHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  if (isClaudeArtifact && import.meta.env.VITE_ANTHROPIC_API_KEY) {
    headers["x-api-key"] = import.meta.env.VITE_ANTHROPIC_API_KEY;
    headers["anthropic-version"] = "2023-06-01";
  }
  return headers;
};

/**
 * Core Claude API call
 * @param {object} params - { model, max_tokens, system, messages, temperature }
 * @returns {Promise<object>} Anthropic API response
 */
export async function callClaude({ model, max_tokens, system, messages, temperature = 0.1 }) {
  const response = await fetch(API_ENDPOINT, {
    method:  "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      model:       model      ?? "claude-sonnet-4-20250514",
      max_tokens:  max_tokens ?? 4000,
      temperature,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error ${response.status}: ${err}`);
  }

  return response.json();
}

/**
 * Extract text from Claude API response
 * @param {object} data - Raw Anthropic API response
 * @returns {string} Extracted text content
 */
export function extractText(data) {
  return (data.content ?? [])
    .filter(block => block.type === "text")
    .map(block => block.text)
    .join("");
}

/**
 * Parse JSON from Claude response, stripping markdown fences
 * @param {object} data - Raw Anthropic API response
 * @returns {object} Parsed JSON
 */
export function extractJSON(data) {
  const raw = extractText(data);
  const clean = raw.replace(/```json\n?|```\n?/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error("[apiClient] JSON parse failed. Raw:", raw.slice(0, 500));
    throw new Error(`Failed to parse Claude response as JSON: ${e.message}`);
  }
}

/**
 * Run full project analysis through all 16 agents
 * @param {object} projectData - Project submission form data
 * @param {string} systemPrompt - Full swarm system prompt
 * @returns {Promise<object>} Complete AnalysisResult entity
 */
export async function runProjectAnalysis(projectData, systemPrompt) {
  const userMessage = buildProjectBriefing(projectData);

  const data = await callClaude({
    model:       "claude-sonnet-4-20250514",
    max_tokens:  4000,
    temperature: 0.1,
    system:      systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  return extractJSON(data);
}

/**
 * Build the user-turn briefing from project form data
 */
function buildProjectBriefing(p) {
  return `Analyse this mining project submission through the full 16-agent swarm:

PROJECT NAME:        ${p.name ?? "Not provided"}
COMMODITY:           ${p.commodity ?? "Not provided"}
LOCATION:            ${p.location ?? "Not provided"}
STUDY STAGE:         ${p.stage ?? "Not provided"}
RESOURCE:            ${p.resource ?? "Not provided"}
CAPEX:               ${p.capex ?? "Not provided"}
NPV:                 ${p.npv ?? "Not provided"}
IRR:                 ${p.irr ?? "Not provided"}
METAL PRICE BASIS:   ${p.price_assumption ?? "Not provided"}
DOCUMENTS SUBMITTED: ${p.documents ?? "Investor presentation only"}
ADDITIONAL NOTES:    ${p.notes ?? "None"}

Apply all 16 agents across 7 tiers. Zero-trust posture. Return ONLY valid JSON — no markdown, no commentary.`;
}
