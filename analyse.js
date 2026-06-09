/**
 * Mine Advisory Service by LCS — v6.0
 * api/analyse.js — Vercel Serverless Function
 *
 * Proxies Claude API calls from the frontend to Anthropic.
 * Fixes CORS — browser cannot call Anthropic directly.
 * API key stays server-side — never exposed to the browser.
 *
 * Lightman Consultancy Services (LCS) / Lightman Trust Group
 * Steven W. — Principal QP & CEO Founder
 */

export default async function handler(req, res) {
  // CORS headers — allow frontend to call this endpoint
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "ANTHROPIC_API_KEY not configured.",
      help: "Add ANTHROPIC_API_KEY to your Vercel environment variables or local .env file",
    });
  }

  try {
    const { model, max_tokens, system, messages, temperature } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request body. messages array required." });
    }

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":         "application/json",
        "x-api-key":            apiKey,
        "anthropic-version":    "2023-06-01",
        "anthropic-beta":       "messages-2023-12-15",
      },
      body: JSON.stringify({
        model:       model       ?? "claude-sonnet-4-20250514",
        max_tokens:  max_tokens  ?? 4000,
        temperature: temperature ?? 0.1,
        system,
        messages,
      }),
    });

    if (!anthropicResponse.ok) {
      const errorBody = await anthropicResponse.text();
      console.error("[api/analyse] Anthropic error:", anthropicResponse.status, errorBody);
      return res.status(anthropicResponse.status).json({
        error:   "Anthropic API error",
        status:  anthropicResponse.status,
        details: errorBody,
      });
    }

    const data = await anthropicResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("[api/analyse] Server error:", error);
    return res.status(500).json({
      error:   "Internal server error",
      message: error.message,
    });
  }
}
