/**
 * Mine Advisory Service by LCS — v6.0
 * functions/server.ts — Local Development Server
 *
 * Runs a local Deno HTTP server on port 8000.
 * Vite dev server proxies /api calls here.
 * Use this during local development instead of Vercel functions.
 *
 * Run: deno run --allow-net --allow-env functions/server.ts
 * OR:  npm run server
 *
 * Lightman Consultancy Services (LCS) / Lightman Trust Group
 */

const PORT = 8000;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function handleAnalyse(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST required" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "ANTHROPIC_API_KEY not set",
        help: "Add ANTHROPIC_API_KEY to your .env file and restart the server",
      }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    console.log(`[server] Forwarding to Anthropic — model: ${body.model ?? "default"}`);

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      console.error("[server] Anthropic error:", anthropicRes.status, data);
    } else {
      console.log("[server] Anthropic response received — stop_reason:", data.stop_reason);
    }

    return new Response(JSON.stringify(data), {
      status: anthropicRes.status,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[server] Error:", error);
    return new Response(
      JSON.stringify({ error: "Server error", message: (error as Error).message }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
}

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  console.log(`[server] ${req.method} ${url.pathname}`);

  if (url.pathname === "/analyse" || url.pathname === "/api/analyse") {
    return handleAnalyse(req);
  }

  if (url.pathname === "/health") {
    return new Response(
      JSON.stringify({
        status: "ok",
        engine: "Mine Advisory Service by LCS v6.0",
        anthropic_key_set: !!Deno.env.get("ANTHROPIC_API_KEY"),
      }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ error: "Not found", endpoints: ["/analyse", "/health"] }),
    { status: 404, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
  );
}

// ─── START SERVER ─────────────────────────────────────────────────────────────
console.log("═".repeat(55));
console.log("  Mine Advisory Service by LCS — v6.0");
console.log("  Local Development Server");
console.log("═".repeat(55));
console.log(`  Listening on: http://localhost:${PORT}`);
console.log(`  API endpoint: http://localhost:${PORT}/analyse`);
console.log(`  Health check: http://localhost:${PORT}/health`);
console.log(`  API key set:  ${!!Deno.env.get("ANTHROPIC_API_KEY")}`);
console.log("═".repeat(55));
console.log("");

Deno.serve({ port: PORT }, handleRequest);
