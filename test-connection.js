/**
 * Mine Advisory Service by LCS — v6.0
 * test-connection.js — API Connection Verification
 *
 * Run this BEFORE starting the app to verify your API key works.
 * Usage: node test-connection.js
 *
 * Lightman Consultancy Services (LCS) / Lightman Trust Group
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env manually
try {
  const env = readFileSync(resolve(".env"), "utf8");
  env.split("\n").forEach(line => {
    const [key, ...vals] = line.split("=");
    if (key && !key.startsWith("#") && vals.length) {
      process.env[key.trim()] = vals.join("=").trim();
    }
  });
} catch {
  // .env not found — use existing environment variables
}

const API_KEY = process.env.ANTHROPIC_API_KEY;

console.log("═".repeat(55));
console.log("  Mine Advisory Service by LCS — v6.0");
console.log("  API Connection Test");
console.log("═".repeat(55));
console.log("");

if (!API_KEY || API_KEY.includes("PASTE-YOUR-KEY")) {
  console.error("✗  ANTHROPIC_API_KEY not set");
  console.error("   1. Open .env file");
  console.error("   2. Replace sk-ant-api03-PASTE-YOUR-KEY-HERE with your real key");
  console.error("   3. Run this script again");
  process.exit(1);
}

console.log(`✓  API key found: ${API_KEY.slice(0, 20)}...`);
console.log("   Testing connection to Anthropic...");
console.log("");

try {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type":      "application/json",
      "x-api-key":         API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 50,
      messages: [{
        role:    "user",
        content: "Reply with exactly: LCS Mine Advisory Service v6.0 connection verified.",
      }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(`✗  Anthropic API error ${response.status}:`);
    console.error("  ", JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const text = data.content?.[0]?.text ?? "";
  console.log(`✓  Claude response: "${text}"`);
  console.log("");
  console.log("═".repeat(55));
  console.log("  CONNECTION VERIFIED — READY TO RUN");
  console.log("═".repeat(55));
  console.log("");
  console.log("  Next steps:");
  console.log("  1. npm install");
  console.log("  2. npm run server    (terminal 1 — Deno API server)");
  console.log("  3. npm run dev       (terminal 2 — React frontend)");
  console.log("  4. Open http://localhost:3000");
  console.log("");

} catch (error) {
  console.error("✗  Connection failed:", error.message);
  console.error("   Check your internet connection and API key");
  process.exit(1);
}
