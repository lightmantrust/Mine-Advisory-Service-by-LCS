#!/usr/bin/env python3
"""
Mine Advisory Service by LCS — v6.0
gen_reports.py — Entity-Schema-Driven Report Generator

Rebuilt from scratch. No hardcoded project data.
Reads from: lcs_reports/<project_id>/result.json (AnalysisResult entity)
Outputs:    lcs_reports/<project_id>/report.html

Visual Standard: USASpending.gov/USWDS palette
Fonts: Source Sans 3 + Source Code Pro
bg:#0b1829  surface:#112e51  panel:#1c3a5e
accent:#02bfe7  amber:#fdb81e  green:#4aa564  red:#e31c3d  text:#f0f4f8

Steven Wood — CEO & Founder, Lightman Trust Group
Lightman Consultancy Services (LCS) — © 2026 Lightman Trust Group
"""

import json
import os
import sys
import uuid
from datetime import datetime
from pathlib import Path

# ─── COLOUR HELPERS ──────────────────────────────────────────────────────────

TRAFFIC_COLORS = {"Green": "#4aa564", "Amber": "#fdb81e", "Red": "#e31c3d"}
VERDICT_COLORS = {"Go": "#4aa564", "Conditional": "#fdb81e", "No-Go": "#e31c3d"}
SEV_COLORS = {"CRITICAL": "#e31c3d", "SERIOUS": "#fdb81e", "MODERATE": "#02bfe7", "MINOR": "#a8c0d6"}
DOMAIN_COLORS = {
    "geology": "#02bfe7", "mining": "#6fc3df", "metallurgy": "#fdb81e",
    "environmental": "#4aa564", "financial": "#a8c0d6", "cross": "#d4a8e0",
    "validation": "#ff8c42", "redteam": "#e31c3d"
}

def score_color(score: int) -> str:
    if score <= 35: return "#4aa564"
    if score <= 55: return "#fdb81e"
    return "#e31c3d"

# ─── CSS ─────────────────────────────────────────────────────────────────────

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&family=Source+Code+Pro:wght@400;600;700&display=swap');
:root{--bg:#0b1829;--surface:#112e51;--panel:#1c3a5e;--accent:#02bfe7;--amber:#fdb81e;--green:#4aa564;--red:#e31c3d;--text:#f0f4f8;--subtext:#a8c0d6;--border:#1e3a5a;--font-body:'Source Sans 3',sans-serif;--font-mono:'Source Code Pro',monospace}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:var(--font-body);font-size:15px;line-height:1.6}
nav{position:sticky;top:0;z-index:100;background:var(--surface);border-bottom:2px solid var(--accent);display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:56px}
.brand{font-size:12px;font-weight:700;color:var(--accent);letter-spacing:.1em;text-transform:uppercase}
.nav-links{display:flex;gap:4px}
.nav-links a{padding:6px 14px;font-size:12px;font-weight:600;letter-spacing:.06em;color:var(--subtext);text-decoration:none}
.nav-links a:hover{color:var(--accent)}
header{background:linear-gradient(135deg,#0b1829 0%,#112e51 50%,#1c3a5e 100%);padding:60px 40px 40px;border-bottom:3px solid var(--accent)}
.engine-label{font-size:10px;font-weight:700;letter-spacing:.16em;color:var(--accent);text-transform:uppercase;margin-bottom:8px}
h1{font-size:30px;font-weight:700;color:var(--text);margin-bottom:4px}
.meta-row{display:flex;gap:32px;margin-top:20px;flex-wrap:wrap}
.meta-item{display:flex;flex-direction:column;gap:2px}
.meta-label{font-size:10px;color:var(--subtext);text-transform:uppercase;letter-spacing:.08em}
.meta-value{font-size:15px;font-weight:600;color:var(--text)}
.verdict-panel{background:var(--surface);border-top:3px solid var(--accent);padding:40px;display:grid;grid-template-columns:auto auto auto 1fr;gap:48px;align-items:center}
.verdict-block{display:flex;flex-direction:column;gap:6px}
.verdict-label{font-size:10px;color:var(--subtext);text-transform:uppercase;letter-spacing:.1em;font-weight:700}
.verdict-value{font-size:36px;font-weight:700;font-family:var(--font-mono)}
.buy-range{font-size:28px;font-weight:700;color:var(--accent);font-family:var(--font-mono)}
main{padding:40px;max-width:1400px;margin:0 auto}
.section-header{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);padding-bottom:10px;border-bottom:2px solid var(--accent);margin-bottom:20px;margin-top:48px}
.section-header:first-child{margin-top:0}
.card{background:var(--surface);border-top:3px solid var(--accent);padding:24px;margin-bottom:16px}
.card-amber{border-top-color:var(--amber)}.card-red{border-top-color:var(--red)}.card-green{border-top-color:var(--green)}
table{width:100%;border-collapse:collapse;margin-top:8px}
thead tr{background:var(--accent)}
thead th{padding:10px 14px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--bg)}
tbody tr{border-bottom:1px solid var(--border)}
tbody td{padding:12px 14px;font-size:14px;vertical-align:top}
.concern-item{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)}
.concern-item:last-child{border-bottom:none}
.concern-num{font-family:var(--font-mono);font-size:12px;color:var(--accent);min-width:28px;padding-top:2px}
.ripple-chain{padding:16px;background:var(--panel);border-left:3px solid var(--red);margin-bottom:12px}
.ripple-badge{display:inline-block;padding:2px 10px;border-radius:2px;font-size:11px;font-weight:700;letter-spacing:.08em;margin-bottom:10px}
.ripple-steps{font-size:13px;color:var(--text);font-family:var(--font-mono)}
.exec-summary{font-size:15px;line-height:1.8;color:var(--text);background:var(--panel);padding:24px;border-left:4px solid var(--accent)}
.red-team-box{background:#1a0a0a;border:1px solid var(--red);border-left:4px solid var(--red);padding:24px}
.missing-doc{padding:10px 16px;background:var(--panel);border-left:3px solid var(--amber);margin-bottom:8px;font-size:14px}
.condition-item{padding:12px 16px;background:var(--panel);border-left:3px solid var(--green);margin-bottom:8px;font-size:14px}
.question-num{font-family:var(--font-mono);color:var(--amber);font-size:11px;margin-bottom:2px}
.print-btn{position:fixed;bottom:32px;right:32px;background:var(--accent);color:var(--bg);border:none;padding:12px 24px;font-family:var(--font-body);font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;box-shadow:0 4px 20px rgba(2,191,231,.3)}
footer{background:var(--surface);border-top:2px solid var(--border);padding:32px 40px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:24px;margin-top:80px}
.footer-brand{font-size:12px;font-weight:700;color:var(--accent);letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px}
.footer-text{font-size:11px;color:var(--subtext);line-height:1.7}
@media print{nav,.print-btn{display:none}}
"""

# ─── SECTION ROW ─────────────────────────────────────────────────────────────

def render_section_row(s: dict) -> str:
    score = s.get("score", 50)
    color = score_color(score)
    return f"""<tr>
      <td style="font-family:var(--font-mono);color:var(--subtext)">{s.get('section_number','')}</td>
      <td style="font-weight:600;color:var(--text)">{s.get('section_name','')}</td>
      <td><span style="font-size:20px;font-weight:700;font-family:var(--font-mono);color:{color}">{score}</span></td>
      <td style="color:var(--subtext);font-size:13px">{s.get('agent','')}</td>
      <td style="color:#c8d8e8;font-size:13px">{s.get('rationale','')}</td>
    </tr>"""

# ─── RIPPLE CHAIN ────────────────────────────────────────────────────────────

def render_ripple(chain: dict) -> str:
    sev = chain.get("severity", "MODERATE")
    color = SEV_COLORS.get(sev, "#a8c0d6")
    steps = chain.get("chain", [])
    steps_html = " <span style='color:{c}'>→</span> ".format(c=color).join(
        f"<span style='background:var(--surface);padding:3px 8px;border:1px solid var(--border)'>{s}</span>" for s in steps
    )
    return f"""<div class="ripple-chain" style="border-left-color:{color}">
      <span class="ripple-badge" style="background:{color}20;color:{color};border:1px solid {color}">{sev}</span>
      <div class="ripple-steps">{steps_html}</div>
    </div>"""

# ─── FULL REPORT TEMPLATE ────────────────────────────────────────────────────

def render_report(result: dict) -> str:
    meta = result.get("report_metadata", {})
    tl = result.get("traffic_light", "Amber")
    verdict = result.get("verdict", "Conditional")
    score = result.get("composite_score", 0)
    buy_low = result.get("buy_signal_low_usd_m")
    buy_high = result.get("buy_signal_high_usd_m")
    buy_str = f"${buy_low}M — ${buy_high}M" if buy_low is not None else "—"
    tl_color = TRAFFIC_COLORS.get(tl, "#fdb81e")
    v_color = VERDICT_COLORS.get(verdict, "#fdb81e")
    rt_verdict = result.get("red_team_verdict", "CONDITIONAL")
    rt_color = "#4aa564" if rt_verdict == "PASS" else "#e31c3d"

    section_rows = "".join(render_section_row(s) for s in result.get("section_scores", []))
    concerns_html = "".join(
        f'<div class="concern-item"><div class="concern-num">{str(i+1).zfill(2)}</div><div>{c}</div></div>'
        for i, c in enumerate(result.get("top_concerns", []))
    )
    questions_html = "".join(
        f'<div style="padding:12px 0;border-bottom:1px solid var(--border)"><div class="question-num">Q{str(i+1).zfill(2)}</div>{q}</div>'
        for i, q in enumerate(result.get("seller_questions", []))
    )
    ripple_html = "".join(render_ripple(c) for c in result.get("ripple_chains", []))
    missing_html = "".join(f'<div class="missing-doc">⚠ {d}</div>' for d in result.get("missing_documents", []))
    conditions_html = "".join(f'<div class="condition-item">✓ {c}</div>' for c in result.get("investability_conditions", []))

    project_name = meta.get("project_name", result.get("project_name", "Mining Project"))
    commodity    = meta.get("commodity", result.get("commodity", "—"))
    location     = meta.get("location", result.get("location", "—"))
    date_gen     = meta.get("date_generated", datetime.now().strftime("%d %B %Y"))
    engine_ver   = meta.get("engine_version", "v6.0")
    report_id    = meta.get("report_id", str(uuid.uuid4())[:8].upper())

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Mine Advisory Service by LCS — {project_name} — {engine_ver}</title>
<style>{CSS}</style>
</head>
<body>

<nav>
  <div class="brand">Mine Advisory Service by LCS — {engine_ver}</div>
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
  <div class="engine-label">Lightman Consultancy Services (LCS) · Institutional Mining Due Diligence · {engine_ver}</div>
  <h1>{project_name} — Due Diligence Report</h1>
  <div class="meta-row">
    <div class="meta-item"><div class="meta-label">Commodity</div><div class="meta-value">{commodity}</div></div>
    <div class="meta-item"><div class="meta-label">Location</div><div class="meta-value">{location}</div></div>
    <div class="meta-item"><div class="meta-label">Report Date</div><div class="meta-value">{date_gen}</div></div>
    <div class="meta-item"><div class="meta-label">Engine</div><div class="meta-value" style="font-family:var(--font-mono)">{engine_ver}</div></div>
    <div class="meta-item"><div class="meta-label">Report ID</div><div class="meta-value" style="font-family:var(--font-mono);font-size:12px">{report_id}</div></div>
    <div class="meta-item"><div class="meta-label">Trust Tier</div><div class="meta-value">Tier {result.get('trust_tier_applied','—')}</div></div>
  </div>
</header>

<div class="verdict-panel" id="verdict">
  <div class="verdict-block">
    <div class="verdict-label">Composite Score</div>
    <div class="verdict-value" style="color:{tl_color}">{score:.1f}</div>
    <div style="font-size:11px;color:var(--subtext)">/ 100 risk scale (lower = better)</div>
  </div>
  <div class="verdict-block">
    <div class="verdict-label">Verdict</div>
    <div class="verdict-value" style="color:{v_color}">{verdict}</div>
  </div>
  <div class="verdict-block">
    <div class="verdict-label">Traffic Light</div>
    <div style="display:flex;align-items:center;gap:10px;margin-top:6px">
      <div style="width:16px;height:16px;border-radius:50%;background:{tl_color};box-shadow:0 0 10px {tl_color}"></div>
      <span style="font-size:20px;font-weight:700;color:{tl_color}">{tl}</span>
    </div>
  </div>
  <div class="verdict-block">
    <div class="verdict-label">Buy Signal Range</div>
    <div class="buy-range">{buy_str}</div>
    <div style="font-size:11px;color:var(--subtext);margin-top:4px">{result.get('buy_signal_methodology','Post-tax NPV basis')}</div>
  </div>
</div>

<main>

<div class="section-header">Executive Summary</div>
<div class="exec-summary">{result.get('executive_summary','Analysis complete. See findings below.')}</div>

<div class="section-header" id="scores">18-Section QP Scoring Matrix</div>
<div class="card">
<table>
  <thead><tr><th>#</th><th>Section</th><th>Score</th><th>Agent</th><th>Summary</th></tr></thead>
  <tbody>{section_rows}</tbody>
</table>
</div>

<div class="section-header" id="concerns">Top Concerns</div>
<div class="card card-red">{concerns_html}</div>

{'<div class="section-header" id="ripple">Ripple Risk Chains</div><div class="card card-red">' + ripple_html + '</div>' if ripple_html else ''}

{'<div class="section-header">Missing Documents</div><div>' + missing_html + '</div>' if missing_html else ''}

<div class="section-header" id="questions">Seller Questions — Required Responses</div>
<div class="card card-amber">{questions_html}</div>

<div class="section-header" id="redteam">Red Team — Sir Juan Miami, Chief Validation Officer</div>
<div class="red-team-box">
  <div style="display:inline-block;margin-bottom:16px;padding:4px 16px;font-size:11px;font-weight:700;letter-spacing:.12em;background:{rt_color}20;color:{rt_color};border:1px solid {rt_color}">
    RED TEAM: {rt_verdict}
  </div>
  <p style="font-size:14px;color:var(--text);line-height:1.8">{result.get('red_team_finding','Red team analysis pending.')}</p>
</div>

{'<div class="section-header">Investability Conditions</div><div>' + conditions_html + '</div>' if conditions_html else ''}

</main>

<button class="print-btn" onclick="window.print()">Print / Export PDF</button>

<footer>
  <div>
    <div class="footer-brand">Mine Advisory Service by LCS — {engine_ver}</div>
    <div class="footer-text">
      12-Agent AI Swarm · Claude Opus 4 Red Team · 18-Section Institutional Framework<br/>
      Lightman Consultancy Services (LCS) · Lightman Trust Group<br/>
      Steven Wood — CEO &amp; Founder, Lightman Trust Group
    </div>
  </div>
  <div style="text-align:right">
    <div class="footer-text">
      Report ID: {report_id}<br/>
      Generated: {date_gen}<br/>
      © 2026 Lightman Trust Group — Confidential · Institutional Use Only
    </div>
  </div>
</footer>

</body>
</html>"""

# ─── MAIN ────────────────────────────────────────────────────────────────────

def generate_report(result_path: str) -> str:
    """Generate HTML report from AnalysisResult JSON file."""
    with open(result_path, "r", encoding="utf-8") as f:
        result = json.load(f)

    html = render_report(result)

    output_dir = Path(result_path).parent
    output_path = output_dir / "report.html"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"✓ Report generated: {output_path}")
    return str(output_path)


def batch_generate(reports_dir: str = "lcs_reports") -> None:
    """Walk lcs_reports/ and generate HTML for every result.json found."""
    reports_path = Path(reports_dir)
    generated = 0
    errors = 0

    for result_file in sorted(reports_path.rglob("result.json")):
        try:
            generate_report(str(result_file))
            generated += 1
        except Exception as e:
            print(f"✗ Error processing {result_file}: {e}")
            errors += 1

    print(f"\nMine Advisory Service by LCS — v6.0 Report Generator")
    print(f"Generated: {generated} reports | Errors: {errors}")


if __name__ == "__main__":
    if len(sys.argv) == 2:
        # Single file mode: python gen_reports.py lcs_reports/project_id/result.json
        generate_report(sys.argv[1])
    else:
        # Batch mode: python gen_reports.py
        batch_generate()
