/**
 * Mine Advisory Service by LCS — v6.0
 * netlify/functions/analyse.js — Netlify Serverless Function
 *
 * Alternative to Vercel. Same proxy logic.
 * Deploy to Netlify if preferred over Vercel.
 */

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type":                 "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: "ANTHROPIC_API_KEY not set in Netlify environment variables" }),
    };
  }

  try {
    const body = JSON.parse(event.body ?? "{}");
    const { model, max_tokens, system, messages, temperature } = body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method:  "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:       model       ?? "claude-sonnet-4-20250514",
        max_tokens:  max_tokens  ?? 4000,
        temperature: temperature ?? 0.1,
        system,
        messages,
      }),
    });

    const data = await response.json();
    return { statusCode: response.status, headers, body: JSON.stringify(data) };

  } catch (error) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: "Server error", message: error.message }),
    };
  }
};
