/**
 * generateReport.ts
 * Mine Advisory Service by LCS — v6.0
 * Generates institutional HTML report from APEX entity output
 * Visual Standard: USASpending.gov/USWDS palette — bg:#0b1829, accent:#02bfe7
 * Fonts: Source Sans 3 + Source Code Pro
 */

export function generateReport(apexResult: Record<string, unknown>): string {
  const r = apexResult as Record<string, unknown>;

  const trafficColor: Record<string, string> = {
    Green: "#4aa564",
    Amber: "#fdb81e",
    Red: "#e31c3d",
  };

  const verdictColor: Record<string, string> = {
    Go: "#4aa564",
    Conditional: "#fdb81e",
    "No-Go": "#e31c3d",
  };

  const tl = (r.traffic_light as string) ?? "Amber";
  const verdict = (r.verdict as string) ?? "Conditional";
  const score = typeof r.composite_score === "number" ? r.composite_score.toFixed(1) : "—";
  const buyLow = typeof r.buy_signal_low_usd_m === "number" ? `$${r.buy_signal_low_usd_m}M` : "—";
  const buyHigh = typeof r.buy_signal_high_usd_m === "number" ? `$${r.buy_signal_high_usd_m}M` : "—";

  const meta = (r.report_metadata as Record<string, string>) ?? {};
  const sectionScores = (r.section_scores as Record<string, unknown>[]) ?? [];
  const topConcerns = (r.top_concerns as string[]) ?? [];
  const sellerQuestions = (r.seller_questions as string[]) ?? [];
  const rippleChains = (r.ripple_chains as Record<string, unknown>[]) ?? [];
  const missingDocs = (r.missing_documents as string[]) ?? [];
  const investabilityConditions = (r.investability_conditions as string[]) ?? [];

  const scoreRow = (s: Record<string, unknown>) => {
    const sc = s.score as number;
    const color = sc <= 35 ? "#4aa564" : sc <= 55 ? "#fdb81e" : "#e31c3d";
    return `
      <tr>
        <td>${s.section_number}</td>
        <td>${s.section_name}</td>
        <td><span style="color:${color};font-weight:700;font-family:'Source Code Pro',monospace">${sc}</span></td>
        <td style="color:#a8c0d6">${s.agent ?? ""}</td>
        <td style="color:#c8d8e8;font-size:13px">${s.rationale ?? ""}</td>
      </tr>`;
  };

  const rippleRow = (chain: Record<string, unknown>) => {
    const steps = (chain.chain as string[]) ?? [];
    const sev = (chain.severity as string) ?? "MODERATE";
    const sevColor = sev === "CRITICAL" ? "#e31c3d" : sev === "SERIOUS" ? "#fdb81e" : "#a8c0d6";
    return `
      <div class="ripple-chain">
        <span class="ripple-badge" style="background:${sevColor}20;color:${sevColor};border:1px solid ${sevColor}">${sev}</span>
        <div class="ripple-steps">${steps.map((s, i) => `<span>${s}</span>${i < steps.length - 1 ? " → " : ""}`).join("")}</div>
      </div>`;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Mine Advisory Service by LCS — ${meta.project_name ?? "Project"} — v6.0</title>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&family=Source+Code+Pro:wght@400;600&display=swap" rel="stylesheet" />
<style>
  :root {
    --bg: #0b1829;
    --surface: #112e51;
    --panel: #1c3a5e;
    --accent: #02bfe7;
    --amber: #fdb81e;
    --green: #4aa564;
    --red: #e31c3d;
    --text: #f0f4f8;
    --subtext: #a8c0d6;
    --border: #1e3a5a;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Source Sans 3', sans-serif; font-size: 15px; line-height: 1.6; }

  /* STICKY NAV */
  nav {
    position: sticky; top: 0; z-index: 100;
    background: var(--surface);
    border-bottom: 2px solid var(--accent);
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 40px;
  }
  nav .brand { font-size: 13px; font-weight: 600; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase; }
  nav .nav-links { display: flex; gap: 24px; }
  nav .nav-links a { color: var(--subtext); text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; }
  nav .nav-links a:hover { color: var(--accent); }

  /* GRADIENT HEADER */
  header {
    background: linear-gradient(135deg, #0b1829 0%, #112e51 50%, #1c3a5e 100%);
    padding: 60px 40px 40px;
    border-bottom: 3px solid var(--accent);
  }
  header .engine-label { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; color: var(--accent); text-transform: uppercase; margin-bottom: 8px; }
  header h1 { font-size: 32px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  header .meta-row { display: flex; gap: 32px; margin-top: 20px; flex-wrap: wrap; }
  header .meta-item { display: flex; flex-direction: column; gap: 2px; }
  header .meta-label { font-size: 11px; color: var(--subtext); text-transform: uppercase; letter-spacing: 0.08em; }
  header .meta-value { font-size: 15px; font-weight: 600; color: var(--text); }

  /* VERDICT PANEL */
  .verdict-panel {
    background: var(--surface);
    border-top: 3px solid var(--accent);
    padding: 40px;
    display: grid;
    grid-template-columns: auto auto auto 1fr;
    gap: 48px;
    align-items: center;
  }
  .verdict-block { display: flex; flex-direction: column; gap: 6px; }
  .verdict-label { font-size: 11px; color: var(--subtext); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; }
  .verdict-value { font-size: 36px; font-weight: 700; font-family: 'Source Code Pro', monospace; }
  .traffic-pill {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--panel);
    border-radius: 4px;
    padding: 10px 24px;
    border: 1px solid var(--border);
  }
  .traffic-dot { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; }
  .buy-range { font-size: 28px; font-weight: 700; color: var(--accent); font-family: 'Source Code Pro', monospace; }

  /* MAIN CONTENT */
  main { padding: 40px; max-width: 1400px; margin: 0 auto; }

  /* SECTION HEADERS */
  .section-header {
    font-size: 13px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--accent);
    padding-bottom: 12px;
    border-bottom: 2px solid var(--accent);
    margin-bottom: 24px;
    margin-top: 48px;
  }
  .section-header:first-child { margin-top: 0; }

  /* CARDS */
  .card {
    background: var(--surface);
    border-top: 3px solid var(--accent);
    border-radius: 2px;
    padding: 24px;
    margin-bottom: 16px;
  }
  .card-amber { border-top-color: var(--amber); }
  .card-red { border-top-color: var(--red); }
  .card-green { border-top-color: var(--green); }

  /* TABLE */
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  thead tr { background: var(--accent); }
  thead th { padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--bg); }
  tbody tr { border-bottom: 1px solid var(--border); }
  tbody tr:hover { background: var(--panel); }
  tbody td { padding: 12px 14px; font-size: 14px; vertical-align: top; }

  /* LIST ITEMS */
  .concern-item { display: flex; gap: 10px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .concern-item:last-child { border-bottom: none; }
  .concern-num { font-family: 'Source Code Pro', monospace; font-size: 12px; color: var(--accent); min-width: 28px; padding-top: 2px; }
  .concern-text { font-size: 14px; color: var(--text); }

  .question-item { padding: 12px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
  .question-item:last-child { border-bottom: none; }
  .question-num { font-family: 'Source Code Pro', monospace; color: var(--amber); font-size: 12px; margin-bottom: 2px; }

  /* RIPPLE CHAINS */
  .ripple-chain { padding: 16px; background: var(--panel); border-left: 3px solid var(--red); margin-bottom: 12px; }
  .ripple-badge { display: inline-block; padding: 2px 10px; border-radius: 2px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 10px; }
  .ripple-steps { font-size: 14px; color: var(--text); font-family: 'Source Code Pro', monospace; }

  /* EXECUTIVE SUMMARY */
  .exec-summary { font-size: 15px; line-height: 1.8; color: var(--text); background: var(--panel); padding: 24px; border-left: 4px solid var(--accent); }

  /* RED TEAM */
  .red-team-box { background: #1a0a0a; border: 1px solid var(--red); border-left: 4px solid var(--red); padding: 24px; }
  .red-team-verdict { display: inline-block; padding: 4px 16px; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; margin-bottom: 16px; }

  /* MISSING DOCS */
  .missing-doc { padding: 10px 16px; background: var(--panel); border-left: 3px solid var(--amber); margin-bottom: 8px; font-size: 14px; }

  /* INVESTABILITY */
  .condition-item { padding: 12px 16px; background: var(--panel); border-left: 3px solid var(--green); margin-bottom: 8px; font-size: 14px; }

  /* PRINT BUTTON */
  .print-btn {
    position: fixed; bottom: 32px; right: 32px;
    background: var(--accent); color: var(--bg);
    border: none; padding: 12px 24px;
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 700; font-size: 13px;
    letter-spacing: 0.08em; text-transform: uppercase;
    cursor: pointer; border-radius: 2px;
    box-shadow: 0 4px 20px rgba(2,191,231,0.3);
  }
  .print-btn:hover { background: #00a8cc; }

  /* FOOTER */
  footer {
    background: var(--surface);
    border-top: 2px solid var(--border);
    padding: 32px 40px;
    margin-top: 80px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 24px;
  }
  footer .footer-brand { font-size: 13px; font-weight: 700; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
  footer .footer-text { font-size: 12px; color: var(--subtext); line-height: 1.7; }

  @media print {
    nav, .print-btn { display: none; }
    body { background: #fff; color: #000; }
    .section-header { color: #0b1829; border-color: #0b1829; }
  }
</style>
</head>
<body>

<nav>
  <div class="brand">Mine Advisory Service by LCS — v6.0</div>
  <div class="nav-links">
    <a href="#verdict">Verdict</a>
    <a href="#scores">Scores</a>
    <a href="#concerns">Concerns</a>
    <a href="#ripple">Risk Chains</a>
    <a href="#questions">Questions</a>
    <a href="#redteam">Red Team</a>
  </div>
</nav>

<header>
  <div class="engine-label">Lightman Consultancy Services (LCS) — Institutional Mining Due Diligence</div>
  <h1>${meta.project_name ?? "Mining Project"} — Due Diligence Report</h1>
  <div class="meta-row">
    <div class="meta-item"><div class="meta-label">Commodity</div><div class="meta-value">${meta.commodity ?? "—"}</div></div>
    <div class="meta-item"><div class="meta-label">Location</div><div class="meta-value">${meta.location ?? "—"}</div></div>
    <div class="meta-item"><div class="meta-label">Report Date</div><div class="meta-value">${meta.date_generated ?? new Date().toLocaleDateString()}</div></div>
    <div class="meta-item"><div class="meta-label">Engine</div><div class="meta-value" style="font-family:'Source Code Pro',monospace">${meta.engine_version ?? "v6.0"}</div></div>
    <div class="meta-item"><div class="meta-label">Report ID</div><div class="meta-value" style="font-family:'Source Code Pro',monospace;font-size:12px">${meta.report_id ?? "—"}</div></div>
  </div>
</header>

<div class="verdict-panel" id="verdict">
  <div class="verdict-block">
    <div class="verdict-label">Composite Score</div>
    <div class="verdict-value" style="color:${trafficColor[tl] ?? "#fdb81e"}">${score}</div>
    <div style="font-size:11px;color:var(--subtext)">/ 100 risk scale</div>
  </div>
  <div class="verdict-block">
    <div class="verdict-label">Verdict</div>
    <div class="verdict-value" style="color:${verdictColor[verdict] ?? "#fdb81e"}">${verdict}</div>
  </div>
  <div class="verdict-block">
    <div class="verdict-label">Traffic Light</div>
    <div class="traffic-pill">
      <div class="traffic-dot" style="background:${trafficColor[tl] ?? "#fdb81e"}"></div>
      <span style="font-weight:700;font-size:15px">${tl}</span>
    </div>
  </div>
  <div class="verdict-block">
    <div class="verdict-label">Buy Signal Range</div>
    <div class="buy-range">${buyLow} — ${buyHigh}</div>
    <div style="font-size:12px;color:var(--subtext);margin-top:4px">${r.buy_signal_methodology ?? "Post-tax NPV basis"}</div>
  </div>
</div>

<main>

  <div class="section-header">Executive Summary</div>
  <div class="exec-summary">${r.executive_summary ?? "Analysis complete. See section scores and findings below."}</div>

  <div class="section-header" id="scores">18-Section Scoring Matrix</div>
  <div class="card">
    <table>
      <thead><tr><th>#</th><th>Section</th><th>Score</th><th>Agent</th><th>Summary</th></tr></thead>
      <tbody>${sectionScores.map((s) => scoreRow(s as Record<string, unknown>)).join("")}</tbody>
    </table>
  </div>

  <div class="section-header" id="concerns">Top Concerns</div>
  <div class="card card-red">
    ${topConcerns.map((c, i) => `<div class="concern-item"><div class="concern-num">${String(i + 1).padStart(2, "0")}</div><div class="concern-text">${c}</div></div>`).join("")}
  </div>

  ${rippleChains.length > 0 ? `
  <div class="section-header" id="ripple">Ripple Risk Chains</div>
  <div class="card card-red">
    ${rippleChains.map((c) => rippleRow(c as Record<string, unknown>)).join("")}
  </div>` : ""}

  ${missingDocs.length > 0 ? `
  <div class="section-header">Missing Documents</div>
  <div>${missingDocs.map((d) => `<div class="missing-doc">⚠ ${d}</div>`).join("")}</div>` : ""}

  <div class="section-header" id="questions">Seller Questions — Required Responses</div>
  <div class="card card-amber">
    ${sellerQuestions.map((q, i) => `<div class="question-item"><div class="question-num">Q${String(i + 1).padStart(2, "0")}</div>${q}</div>`).join("")}
  </div>

  <div class="section-header" id="redteam">Red Team — Sir Juan Miami, Chief Validation Officer</div>
  <div class="red-team-box">
    <div class="red-team-verdict" style="background:${(r.red_team_verdict === "PASS") ? "#4aa56420" : "#e31c3d20"};color:${(r.red_team_verdict === "PASS") ? "#4aa564" : "#e31c3d"};border:1px solid ${(r.red_team_verdict === "PASS") ? "#4aa564" : "#e31c3d"}">
      RED TEAM: ${r.red_team_verdict ?? "CONDITIONAL"}
    </div>
    <p style="color:var(--text);font-size:15px;line-height:1.8">${r.red_team_finding ?? "Red team analysis pending."}</p>
  </div>

  ${investabilityConditions.length > 0 ? `
  <div class="section-header">Investability Conditions</div>
  <div>${investabilityConditions.map((c) => `<div class="condition-item">✓ ${c}</div>`).join("")}</div>` : ""}

</main>

<button class="print-btn" onclick="window.print()">Print / Export PDF</button>

<footer>
  <div>
    <div class="footer-brand">Mine Advisory Service by LCS — v6.0</div>
    <div class="footer-text">
      12-Agent AI Swarm · 18-Section Institutional Framework · Claude Opus 4 Red Team<br />
      Lightman Consultancy Services (LCS) · Lightman Trust Group<br />
      Steven Wood — CEO & Founder, Lightman Trust Group
    </div>
  </div>
  <div style="text-align:right">
    <div class="footer-text">
      Report ID: ${meta.report_id ?? "—"}<br />
      Generated: ${meta.date_generated ?? new Date().toISOString()}<br />
      © 2026 Lightman Trust Group — Confidential · Institutional Use Only
    </div>
  </div>
</footer>

</body>
</html>`;
}
