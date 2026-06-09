import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:       "#060f1e",
  surface:  "#0d2137",
  panel:    "#142a45",
  card:     "#1a3354",
  deep:     "#030b15",
  accent:   "#02bfe7",
  accentDim:"#0189a8",
  gold:     "#d4af37",
  amber:    "#fdb81e",
  green:    "#3db56b",
  red:      "#e31c3d",
  redDim:   "#8a0f23",
  text:     "#eef2f7",
  sub:      "#8aacca",
  muted:    "#4a6a8a",
  border:   "#1e3a5a",
  mono:     "'Source Code Pro','Courier New',monospace",
  body:     "'Source Sans 3','Segoe UI',sans-serif",
};

const glow = (col, px=8) => `0 0 ${px}px ${col}40, 0 0 ${px*2}px ${col}20`;

// ─── ALL 16 AGENTS ─────────────────────────────────────────────────────────────
const AGENTS = [
  { id:"juan_gonzalez", name:"Juan Gonzalez", tier:-1, tLabel:"Pre-Pipeline Gate", type:"human",
    role:"Intake Officer", spec:"KYC/AML · Deal Screening · Sanctions", init:"JG", col:C.gold,
    badge:"HUMAN", blocking:true, exec:"sequential",
    mandate:"Every deal passes KYC/AML screening before entering the swarm. FAIL = full block. No exceptions.",
    sections:["Counterparty KYC","Sanctions Screening","AML Risk","Deal Authentication"] },
  { id:"aria", name:"ARIA", tier:0, tLabel:"Intake", type:"ai",
    role:"Document Ingestion", spec:"Trust Tier 1–5 · Entity Extraction", init:"AR", col:C.accent,
    badge:"SONNET 4", exec:"sequential",
    mandate:"Ingest all submitted documents. Classify, assign Trust Tier, extract key metrics, flag gaps.",
    sections:["Document Classification","Trust Tier","Data Extraction","Gap Inventory"] },
  { id:"sigma", name:"SIGMA", tier:0, tLabel:"Intake", type:"ai",
    role:"Gap Mapping", spec:"Missing Docs · Pre-Analysis Briefing", init:"SG", col:C.accent,
    badge:"SONNET 4", exec:"sequential",
    mandate:"Map documentation gaps and issue pre-analysis briefing to all QP agents before Tier 1 fires.",
    sections:["Gap Map","Risk Posture","Agent Briefing","Inconsistency Detection"] },
  { id:"chen", name:"Dr. Sarah Chen", tier:1, tLabel:"QP Domain", type:"ai",
    role:"PhD Geology", spec:"Resource Estimation · Drill QA/QC · Continuity", init:"SC", col:"#5bc8e8",
    badge:"SONNET 4", exec:"parallel", sections_n:[1,2,3],
    mandate:"Protect investors from geological misrepresentation. Resource must be real and continuous.",
    sections:["Resource Estimation","Drill Programme","Geological Continuity"] },
  { id:"okafor", name:"James Okafor", tier:1, tLabel:"QP Domain", type:"ai",
    role:"PEng Mining", spec:"Engineering Realism · Production Schedule", init:"JO", col:"#5bc8e8",
    badge:"SONNET 4", exec:"parallel", sections_n:[4,5,6],
    mandate:"Protect investors from engineering fantasy. The mine must be physically buildable as described.",
    sections:["Mining Method","Production Schedule","Dilution & Recovery"] },
  { id:"marsh", name:"Linda Marsh", tier:1, tLabel:"QP Domain", type:"ai",
    role:"MSc Metallurgy", spec:"Process Assumptions · Testwork Validation", init:"LM", col:"#5bc8e8",
    badge:"SONNET 4", exec:"parallel", sections_n:[7,8],
    mandate:"Protect investors from recovery fantasy. Testwork must support the financial model.",
    sections:["Metallurgical Testwork","Processing Plant Design"] },
  { id:"kyle_jackson", name:"Kyle Jackson", tier:1, tLabel:"QP Domain", type:"human",
    role:"Refinery & Flowsheet", spec:"Metallurgy · Refinery · Recovery Rate", init:"KJ", col:C.gold,
    badge:"HUMAN", exec:"parallel",
    mandate:"Validate downstream flowsheet, refinery agreements, and plant-gate recovery rates.",
    sections:["Refinery Flowsheet","Recovery Rate Audit","Refinery Terms","Downstream Risk"] },
  { id:"rivera", name:"Tom Rivera", tier:1, tLabel:"QP Domain", type:"ai",
    role:"Environmental Sci.", spec:"Permitting · ESG · Social Licence", init:"TR", col:"#5bc8e8",
    badge:"SONNET 4", exec:"parallel", sections_n:[9,10],
    mandate:"Protect investors from permitting failure and ESG liability.",
    sections:["Environmental Baseline","Social Licence"] },
  { id:"donovan", name:"Mike Donovan", tier:1, tLabel:"QP Domain", type:"ai",
    role:"CFA Financial", spec:"NPV/IRR Realism · Financing Survivability", init:"MD", col:"#5bc8e8",
    badge:"SONNET 4", exec:"parallel", sections_n:[11,12,13,14,15],
    mandate:"Protect investors from financial engineering. The model must survive a commodity cycle.",
    sections:["CAPEX","OPEX","Revenue & Pricing","NPV/IRR","Financing Structure"] },
  { id:"sterling", name:"Marcus Sterling", tier:2, tLabel:"Cross-Domain", type:"ai",
    role:"Quantitative Strategist", spec:"Stress-Testing · Sensitivity · Break-Even", init:"MS", col:C.amber,
    badge:"SONNET 4", exec:"parallel",
    mandate:"Destroy the base case. Run the numbers the seller never shows.",
    sections:["Sensitivity Matrix 3×3","Break-Even Analysis","Delay Scenarios","Combined Stress Test"] },
  { id:"vega", name:"VEGA", tier:2, tLabel:"Cross-Domain", type:"ai",
    role:"Comparables Agent", spec:"Peer Benchmarking · M&A · Market Intel", init:"VG", col:C.amber,
    badge:"SONNET 4", exec:"parallel",
    mandate:"Anchor every project metric against the real world. No evaluation in isolation.",
    sections:["Peer Benchmarks","Precedent Transactions","Cost Curve Position","Market Context"] },
  { id:"jura", name:"JURA", tier:2, tLabel:"Cross-Domain", type:"ai",
    role:"Regulatory Agent", spec:"Mining Law · Tax · Political Risk", init:"JR", col:C.amber,
    badge:"SONNET 4", exec:"parallel",
    mandate:"Assess whether the host country allows this project to be built, operated, and monetised.",
    sections:["Mining Law & Tenure","Fiscal Regime","Political Risk","Permitting Timeline"] },
  { id:"francis_nault", name:"Francis Nault", tier:2, tLabel:"Cross-Domain", type:"human",
    role:"Nitro Commodities", spec:"Market Intelligence · Offtake · Live Pricing", init:"FN", col:C.gold,
    badge:"HUMAN", exec:"parallel",
    mandate:"Validate commodity market access, live pricing via Nitro, and real offtake buyer appetite.",
    sections:["Nitro Price Feed","Offtake Assessment","Market Access Risk","Pricing Mechanism"] },
  { id:"delta", name:"DELTA", tier:3, tLabel:"Validation", type:"ai",
    role:"QA/QC Auditor", spec:"Assay Validation · Statistical Integrity", init:"DL", col:C.red,
    badge:"SONNET 4", exec:"sequential",
    mandate:"Audit raw data claims. Penalize every QA/QC failure. Never accept assay data at face value.",
    sections:["Assay QA/QC Protocol","Lab Accreditation","Statistical Integrity","Database Audit"] },
  { id:"phantom", name:"PHANTOM", tier:3, tLabel:"Validation", type:"ai",
    role:"Anti-Fraud Agent", spec:"GMV Detection · Seller Bias · Deception", init:"PH", col:C.red,
    badge:"SONNET 4", exec:"sequential",
    mandate:"Detect every form of misrepresentation. Assume every vendor document contains at least one misleading element.",
    sections:["GMV Misrepresentation","Cherry-Pick Detection","Linguistic Bias Score","Team Verification"] },
  { id:"sirjuan", name:"Sir Juan Miami", tier:3, tLabel:"Validation", type:"ai",
    role:"Chief Validation Officer", spec:"Cross-Domain Red Team · Final Logic Audit", init:"SJ", col:C.red,
    badge:"OPUS 4", exec:"sequential", opus:true,
    mandate:"Find logical failures no single-domain expert would catch. Final institutional safeguard before report.",
    sections:["Cross-Domain Contradictions","Assumption Dependency Chains","Missing Risks","Red Team Verdict"] },
  { id:"apex", name:"APEX", tier:4, tLabel:"Synthesis", type:"ai",
    role:"Synthesis Engine", spec:"Score Computation · Report Generation", init:"AX", col:C.green,
    badge:"SONNET 4", exec:"sequential",
    mandate:"Compute final weighted composite score. Generate institutional report. Calculate buy signal.",
    sections:["Score Computation","Ripple Chain Analysis","Buy Signal","Report Generation"] },
  { id:"steven_w", name:"Steven W.", tier:5, tLabel:"Principal Sign-Off", type:"human",
    role:"Principal QP · Founder", spec:"Mines & Diamonds · NI 43-101/JORC · PFS/PEA", init:"SW", col:C.gold,
    badge:"PRINCIPAL QP", exec:"sequential", principal:true,
    mandate:"Principal QP authority. Reviews APEX output. Issues final institutional sign-off. Diamonds specialist override.",
    sections:["QP Review","NI 43-101/JORC Compliance","Final Verdict Override","Diamond Advisory"] },
];

const TIER_META = {
  "-1":{ label:"Pre-Pipeline Gate", col:C.gold,    exec:"sequential", desc:"KYC/AML — hard gate, nothing proceeds without clearance" },
  "0": { label:"Intake",            col:C.accent,   exec:"sequential", desc:"ARIA → SIGMA — sequential document ingestion and gap mapping" },
  "1": { label:"QP Domain",         col:"#5bc8e8",  exec:"parallel",   desc:"5 AI + 1 Human — all 6 run simultaneously" },
  "2": { label:"Cross-Domain",      col:C.amber,    exec:"parallel",   desc:"3 AI + 1 Human — all 4 run simultaneously" },
  "3": { label:"Validation",        col:C.red,      exec:"sequential", desc:"DELTA → PHANTOM → Sir Juan Miami — strict sequence" },
  "4": { label:"Synthesis",         col:C.green,    exec:"sequential", desc:"APEX — score computation and report generation" },
  "5": { label:"Principal Sign-Off",col:C.gold,     exec:"sequential", desc:"Steven W. — final QP authority and report release gate" },
};

const SECTIONS_18 = [
  { n:1,  name:"Resource Estimation Integrity", agent:"Dr. Sarah Chen",  domain:"geology",      weight:0.09 },
  { n:2,  name:"Drill Programme Quality",        agent:"Dr. Sarah Chen",  domain:"geology",      weight:0.07 },
  { n:3,  name:"Geological Continuity",          agent:"Dr. Sarah Chen",  domain:"geology",      weight:0.07 },
  { n:4,  name:"Mining Method Selection",        agent:"James Okafor",    domain:"mining",       weight:0.06 },
  { n:5,  name:"Production Schedule Realism",    agent:"James Okafor",    domain:"mining",       weight:0.06 },
  { n:6,  name:"Dilution & Recovery",            agent:"James Okafor",    domain:"mining",       weight:0.05 },
  { n:7,  name:"Metallurgical Testwork",         agent:"Linda Marsh",     domain:"metallurgy",   weight:0.07 },
  { n:8,  name:"Processing Plant Design",        agent:"Linda Marsh",     domain:"metallurgy",   weight:0.05 },
  { n:9,  name:"Environmental Baseline",         agent:"Tom Rivera",      domain:"environmental",weight:0.06 },
  { n:10, name:"Social Licence",                 agent:"Tom Rivera",      domain:"environmental",weight:0.04 },
  { n:11, name:"CAPEX Benchmarking",             agent:"Mike Donovan",    domain:"financial",    weight:0.07 },
  { n:12, name:"OPEX Benchmarking",              agent:"Mike Donovan",    domain:"financial",    weight:0.06 },
  { n:13, name:"Revenue & Metal Pricing",        agent:"Mike Donovan",    domain:"financial",    weight:0.07 },
  { n:14, name:"NPV/IRR Sensitivity",            agent:"Mike Donovan",    domain:"financial",    weight:0.08 },
  { n:15, name:"Financing Structure",            agent:"Mike Donovan",    domain:"financial",    weight:0.06 },
  { n:16, name:"Jurisdiction & Regulatory",      agent:"JURA",            domain:"cross",        weight:0.05 },
  { n:17, name:"Team Credibility",               agent:"PHANTOM",         domain:"validation",   weight:0.04 },
  { n:18, name:"Exit Strategy",                  agent:"Sir Juan Miami",  domain:"redteam",      weight:0.04 },
];

const DOMAIN_COLORS = { geology:"#02bfe7", mining:"#5bc8e8", metallurgy:C.amber, environmental:C.green, financial:"#8aacca", cross:"#c4a0e0", validation:C.red, redteam:"#ff6b6b" };

const DEMO_PROJECTS = [
  { id:"p1", name:"Salar de Atacama Lithium", commodity:"Li₂CO₃", location:"Antofagasta, Chile",
    score:38, verdict:"Go", tl:"Green", stage:"PFS", buy_low:200, buy_high:450, alerts:1,
    exec_summary:"Strong brine resource with NI 43-101 compliant Tier 1 documentation. Positive NPV at base lithium price deck. Social licence risk manageable. Primary concern is current lithium oversupply through 2025 and DLE technology readiness at commercial scale.",
    section_scores:[28,32,31,35,38,34,42,39,29,44,41,36,52,43,38,33,27,41],
    concerns:["Li₂CO₃ spot at $14,200/t below model assumption of $16,500/t — Francis Nault Nitro price flag","DLE technology at TRL 6 — not yet proven at commercial scale for this brine chemistry","No signed offtake agreement — buyer appetite unconfirmed at project scale"],
    questions:["Provide sensitivity table at $12,000, $14,000, $16,000, $18,000/t Li₂CO₃","Confirm DLE pilot plant results at target production volumes","Name offtake counterparty and confirm battery-grade specification acceptance"],
    ripples:[{chain:["Li spot below model price","Revenue 14% below base case","NPV compression","Financing covenant risk"],sev:"SERIOUS"},{chain:["DLE TRL 6 risk","Commissioning delay 12–18 months","Capital overrun +20%","Equity dilution required"],sev:"MODERATE"}],
    red_team:"Project fundamentally sound but exposed to two independent risks that, combined, could destroy the financing case. Li price recovery is a market call, not a project decision. DLE technology risk is the primary concern — no comparable commercial-scale operation exists for this specific brine chemistry. Investable only with a strategic partner who carries technology risk.",
    rt_verdict:"CONDITIONAL", trust_tier:1 },
  { id:"p2", name:"Kansanshi Copper Extension", commodity:"Cu", location:"N-W Province, Zambia",
    score:52, verdict:"Conditional", tl:"Amber", stage:"PEA", buy_low:150, buy_high:300, alerts:3,
    exec_summary:"Credible geological foundations with Tier 1 resource. Financial model carries material deficiencies including unadjusted 2019 CAPEX basis and omission of Zambia 2024 royalty regime. Financing structure as proposed will not survive trough copper pricing.",
    section_scores:[35,42,38,44,55,48,49,51,38,52,72,64,41,58,74,36,31,53],
    concerns:["CAPEX basis from 2019 PEA — estimated shortfall +28% on inflation-adjusted basis","Zambia 2024 royalty (6% NSR base metals) absent from financial model — $38M NPV impact","DSCR at $3.20/lb Cu projects covenant breach — debt structure fails at trough pricing","Government 20% carried interest unmodelled in equity waterfall"],
    questions:["Restate financial model applying Zambia Mines Act 2024 royalty schedule","Reconcile CAPEX to 2024 cost basis using MACE or ENR indices with line-item breakdown","Demonstrate DSCR at $3.20/lb and $3.50/lb under proposed financing structure","Provide government carried interest negotiation outcome and equity waterfall impact"],
    ripples:[{chain:["2019 CAPEX unadjusted","Capital shortfall at construction","Equity dilution","IRR compression","Project finance covenant breach"],sev:"CRITICAL"},{chain:["Omitted Zambia royalty","OPEX understated 3-4%","NPV overstated $38M","Financing gap materialises"],sev:"SERIOUS"},{chain:["Bench-scale testwork only","Recovery uncertainty ±8%","Revenue sensitivity unquantified","Model confidence degraded"],sev:"MODERATE"}],
    red_team:"Primary failure mode: financing structure assumes project-level debt in a jurisdiction without established mining project finance precedent. DSCR at trough copper ($3.20/lb) falls below 1.0x, triggering covenant breach. Equity dilution path under bear scenario reduces NPV to negative. These are curable deficiencies — not structural flaws — but they must be resolved before any capital deployment.",
    rt_verdict:"CONDITIONAL", trust_tier:2 },
  { id:"p3", name:"Buena Fortuna Gold", commodity:"Au-Ag", location:"San Juan, Argentina",
    score:82, verdict:"No-Go", tl:"Red", stage:"Exploration", buy_low:0.5, buy_high:2, alerts:6,
    exec_summary:"PHANTOM identified critical GMV misrepresentation — $2.3B in-situ metal value presented as project value without processing cost deduction. Actual economic value estimated $800K–$2M. 85% of resource is Inferred. No metallurgical testwork. Argentine currency controls add additional repatriation risk.",
    section_scores:[78,82,74,85,88,79,91,85,62,71,88,82,86,89,92,68,75,80],
    concerns:["GMV FRAUD FLAG — $2.3B in-situ presented as value, actual economic value $800K–$2M (PHANTOM)","85% resource classified as Inferred — unsuitable for economic analysis","Zero metallurgical testwork submitted — recovery rate entirely assumed","Argentine BCRA currency controls — USD repatriation severely restricted","QA/QC documentation absent — assay data unverifiable"],
    questions:["Explain how $2.3B in-situ metal value translates to project acquisition value after costs","Provide independent QP-signed NI 43-101 or JORC resource statement","Provide metallurgical testwork — minimum bottle roll for heap leach assessment","Confirm mechanism for USD repatriation under current BCRA regulations"],
    ripples:[{chain:["GMV misrepresentation","No real economic value established","Any capital deployed at quoted price is immediate loss","No pathway to recovery"],sev:"CRITICAL"},{chain:["85% Inferred resource","Cannot be used in mining plan","No reserve to mine","Project has no economic foundation"],sev:"CRITICAL"}],
    red_team:"This submission fails on fraud grounds before geological assessment begins. The GMV misrepresentation is not a calculation error — it is a fundamental misrepresentation of how mining projects are valued. Do not engage further without receiving a complete NI 43-101 technical report from an independent QP. Current ask price has no relationship to any credible economic value.",
    rt_verdict:"FAIL", trust_tier:4 },
];

const sc = s => s <= 35 ? C.green : s <= 55 ? C.amber : C.red;
const tlCol = tl => ({ Green:C.green, Amber:C.amber, Red:C.red })[tl] ?? C.amber;
const sevCol = s => ({ CRITICAL:C.red, SERIOUS:C.amber, MODERATE:C.accent, MINOR:C.sub })[s] ?? C.sub;

// ─── CLAUDE API ANALYSIS ──────────────────────────────────────────────────────
const FULL_SYSTEM_PROMPT = `You are the Mine Advisory Service by LCS v6.0 — a 16-agent institutional mining due diligence swarm operated by Lightman Consultancy Services (LCS), Lightman Trust Group.

SWARM COMPOSITION:
- Tier -1 (Human): Juan Gonzalez — KYC/AML gate
- Tier 0 (AI): ARIA (ingestion), SIGMA (gap mapping)  
- Tier 1 (Parallel — 5 AI + 1 Human): Dr. Sarah Chen (Geology §1-3), James Okafor (Mining §4-6), Linda Marsh (Metallurgy §7-8), Kyle Jackson (Refinery/Downstream), Tom Rivera (Environmental §9-10), Mike Donovan (Financial §11-15)
- Tier 2 (Parallel — 3 AI + 1 Human): Marcus Sterling (Stress-testing), VEGA (Comparables), JURA (Regulatory), Francis Nault (Nitro Commodities/Offtake)
- Tier 3 (Sequential AI): DELTA (QA/QC), PHANTOM (Anti-fraud), Sir Juan Miami (Red Team — Claude Opus 4)
- Tier 4 (AI): APEX (Synthesis)
- Tier 5 (Human): Steven W. (Principal QP Sign-Off)

18-SECTION FRAMEWORK (score 1-100, 1=perfect, 100=critical risk):
§1 Resource Estimation Integrity (weight 9%)
§2 Drill Programme Quality (7%)
§3 Geological Continuity (7%)
§4 Mining Method Selection (6%)
§5 Production Schedule Realism (6%)
§6 Dilution & Recovery (5%)
§7 Metallurgical Testwork (7%)
§8 Processing Plant Design (5%)
§9 Environmental Baseline (6%)
§10 Social Licence (4%)
§11 CAPEX Benchmarking (7%)
§12 OPEX Benchmarking (6%)
§13 Revenue & Metal Pricing (7%)
§14 NPV/IRR Sensitivity (8%)
§15 Financing Structure (6%)
§16 Jurisdiction & Regulatory (5%)
§17 Team Credibility (4%)
§18 Exit Strategy (4%)

ZERO-TRUST POSTURE: Penalise absence of evidence. Never infer from silence. Assume vendor claims are optimistic until independently verified.

SCORING THRESHOLDS: ≤49 = Go (Green), 50-59 = Conditional (Amber), ≥60 = No-Go (Red). Scale is inverse — lower = better project.

PHANTOM FRAUD CHECKS: GMV misrepresentation, cherry-picked intercepts, Inferred resource in economic analysis, outdated cost basis presented as current, implausible recovery rates.

SIR JUAN MIAMI RED TEAM: Cross-domain contradictions, assumption dependency chains, risks missed by individual domain agents.

Return ONLY valid JSON (no markdown, no commentary):
{
  "project_name": string,
  "commodity": string,
  "composite_score": number,
  "traffic_light": "Green"|"Amber"|"Red",
  "verdict": "Go"|"Conditional"|"No-Go",
  "buy_signal_low_usd_m": number,
  "buy_signal_high_usd_m": number,
  "buy_signal_methodology": string,
  "trust_tier_applied": number,
  "executive_summary": string,
  "section_scores": [{"n":1,"name":"Resource Estimation Integrity","score":50,"agent":"Dr. Sarah Chen","rationale":"string"},...all 18],
  "top_concerns": [string x5],
  "seller_questions": [string x5],
  "ripple_chains": [{"chain":[string],"severity":"CRITICAL"|"SERIOUS"|"MODERATE"}],
  "fraud_flags": [string],
  "red_team_finding": string,
  "red_team_verdict": "PASS"|"CONDITIONAL"|"FAIL",
  "investability_conditions": [string],
  "missing_documents": [string],
  "kyc_status": "PASS"|"CONDITIONAL"|"FAIL",
  "nitro_price_note": string
}`;

// ─── SMART API ENDPOINT ──────────────────────────────────────────────────────
// Routes to the correct backend based on environment:
//   Claude artifacts  → direct Anthropic (handled by artifact proxy)
//   Vercel deploy     → /api/analyse (serverless function)
//   Netlify deploy    → /.netlify/functions/analyse
//   Local dev         → /api/analyse (Vite proxy → Deno server)
const getApiEndpoint = () => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("netlify.app"))  return "/.netlify/functions/analyse";
    if (host.includes("claude.ai"))    return "https://api.anthropic.com/v1/messages";
    if (host === "localhost" || host === "127.0.0.1") return "/api/analyse";
  }
  return "/api/analyse";
};

const buildApiHeaders = () => {
  const endpoint = getApiEndpoint();
  const headers = { "Content-Type": "application/json" };
  // Only add API key for direct Anthropic calls (Claude artifact environment)
  if (endpoint.includes("anthropic.com") && import.meta.env?.VITE_ANTHROPIC_API_KEY) {
    headers["x-api-key"] = import.meta.env.VITE_ANTHROPIC_API_KEY;
    headers["anthropic-version"] = "2023-06-01";
  }
  return headers;
};

async function runAnalysis(projectData) {
  const userMessage = `Analyse this mining project submission through the full 16-agent swarm:

PROJECT NAME:        ${projectData.name ?? "Not provided"}
COMMODITY:           ${projectData.commodity ?? "Not provided"}
LOCATION:            ${projectData.location ?? "Not provided"}
STUDY STAGE:         ${projectData.stage ?? "Not provided"}
RESOURCE:            ${projectData.resource || "Not specified"}
CAPEX:               ${projectData.capex || "Not specified"}
NPV:                 ${projectData.npv || "Not specified"}
IRR:                 ${projectData.irr || "Not specified"}
METAL PRICE BASIS:   ${projectData.price_assumption || "Not specified"}
DOCUMENTS SUBMITTED: ${projectData.documents || "Investor presentation only"}
ADDITIONAL NOTES:    ${projectData.notes || "None"}

Apply all 16 agents across 7 tiers. Zero-trust posture. Return ONLY valid JSON — no markdown, no commentary.`;

  const endpoint = getApiEndpoint();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: buildApiHeaders(),
    body: JSON.stringify({
      model:       "claude-sonnet-4-20250514",
      max_tokens:  4000,
      temperature: 0.1,
      system:      FULL_SYSTEM_PROMPT,
      messages:    [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error ${response.status}: ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const raw = (data.content ?? [])
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("") ?? "";
  const clean = raw.replace(/```json\n?|```\n?/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error(`Claude returned invalid JSON. Raw: ${raw.slice(0, 300)}`);
  }
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const px = style => ({ fontFamily: C.body, ...style });

function Nav({ active, setActive, alertCount }) {
  const tabs = [
    { id:"landing",       label:"Overview" },
    { id:"dashboard",     label:"Dashboard" },
    { id:"analysis",      label:"18-Section" },
    { id:"swarm",         label:"Swarm" },
    { id:"benchmarking",  label:"Benchmarking" },
    { id:"alerts",        label:"Alerts", badge: alertCount },
    { id:"field",         label:"Field Intel" },
    { id:"narrative",     label:"Report" },
  ];
  return (
    <nav style={{ position:"sticky", top:0, zIndex:200, background:C.surface,
      borderBottom:`2px solid ${C.accent}`, display:"flex", alignItems:"center",
      justifyContent:"space-between", padding:"0 24px", height:52, flexShrink:0,
      boxShadow:`0 4px 24px ${C.deep}80` }}>
      <div style={{ display:"flex", alignItems:"center", gap:20 }}>
        <div>
          <div style={px({ fontSize:11, fontWeight:800, color:C.accent, letterSpacing:"0.14em",
            textTransform:"uppercase" })}>Mine Advisory Service</div>
          <div style={px({ fontSize:9, color:C.sub, letterSpacing:"0.06em" })}>
            by LCS — v6.0 · Lightman Trust Group</div>
        </div>
        <div style={{ width:1, height:26, background:C.border }} />
        <div style={{ display:"flex", gap:2, flexWrap:"wrap" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)} style={px({
              padding:"4px 12px", fontSize:11, fontWeight:700, letterSpacing:"0.05em",
              color: active === t.id ? C.bg : C.sub,
              background: active === t.id ? C.accent : "transparent",
              border:"none", cursor:"pointer", position:"relative", transition:"all 0.15s",
              display:"flex", alignItems:"center", gap:5,
            })}>
              {t.label}
              {t.badge > 0 && <span style={{ fontSize:9, background:C.red, color:"#fff",
                borderRadius:9, padding:"1px 5px", fontWeight:800 }}>{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:C.green,
            boxShadow:glow(C.green,6) }} />
          <span style={px({ fontSize:9, color:C.green, fontFamily:C.mono, letterSpacing:"0.06em" })}>
            16 AGENTS ACTIVE</span>
        </div>
        <div style={px({ fontSize:9, padding:"3px 10px", background:C.panel,
          border:`1px solid ${C.border}`, color:C.accent, fontFamily:C.mono })}>
          CLAUDE API LIVE</div>
      </div>
    </nav>
  );
}

function Hdr({ eyebrow, title, subtitle, stats=[], borderCol=C.accent }) {
  return (
    <div style={{ background:`linear-gradient(135deg, ${C.deep} 0%, ${C.surface} 55%, ${C.panel} 100%)`,
      padding:"44px 32px 32px", borderBottom:`3px solid ${borderCol}` }}>
      <div style={px({ fontSize:9, fontWeight:800, letterSpacing:"0.2em", color:borderCol,
        textTransform:"uppercase", marginBottom:8 })}>{eyebrow}</div>
      <h1 style={px({ fontSize:24, fontWeight:700, color:C.text, marginBottom:4, lineHeight:1.2 })}>{title}</h1>
      {subtitle && <p style={px({ fontSize:13, color:C.sub })}>{subtitle}</p>}
      {stats.length > 0 && (
        <div style={{ display:"flex", gap:40, marginTop:24, flexWrap:"wrap" }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={px({ fontSize:9, color:C.sub, textTransform:"uppercase",
                letterSpacing:"0.1em", marginBottom:2 })}>{s.label}</div>
              <div style={px({ fontSize:26, fontWeight:700, fontFamily:C.mono,
                color:s.color ?? C.text, lineHeight:1 })}>{s.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ children, col=C.accent, style={} }) {
  return <div style={{ background:C.card, borderTop:`3px solid ${col}`,
    border:`1px solid ${C.border}`, borderTopWidth:3, ...style }}>{children}</div>;
}

function SHdr({ children, style={} }) {
  return <div style={px({ fontSize:10, fontWeight:800, letterSpacing:"0.16em",
    textTransform:"uppercase", color:C.accent, paddingBottom:10,
    borderBottom:`2px solid ${C.accent}`, marginBottom:18, marginTop:36,
    fontFamily:C.body, ...style })}>{children}</div>;
}

function AgentPill({ agent, status="ready", compact=false }) {
  const isH = agent.type === "human";
  const statCol = { ready:C.green, running:C.amber, complete:C.accent, idle:C.muted, error:C.red }[status];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding: compact ? "5px 8px":"8px 12px",
      background:C.surface, borderLeft:`3px solid ${agent.col}`,
      opacity: status === "idle" ? 0.5 : 1, transition:"all 0.3s" }}>
      <div style={{ width:28, height:28, borderRadius: isH ? "50%" : 2,
        background:`${agent.col}20`, border:`2px solid ${agent.col}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:9, fontWeight:800, color:agent.col, fontFamily:C.mono, flexShrink:0 }}>
        {agent.init}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={px({ fontSize:11, fontWeight:700, color:C.text, truncate:true })}>{agent.name}</div>
        <div style={px({ fontSize:9, color:agent.col })}>{agent.role}</div>
      </div>
      {agent.opus && <span style={px({ fontSize:8, padding:"1px 5px", background:`${C.amber}20`,
        color:C.amber, border:`1px solid ${C.amber}` })}>OPUS</span>}
      <div style={{ display:"flex", alignItems:"center", gap:3 }}>
        <div style={{ width:5, height:5, borderRadius:"50%", background:statCol,
          boxShadow: status==="running" ? glow(statCol,4) : "none",
          animation: status==="running" ? "pulse 1s infinite" : "none" }} />
        <span style={px({ fontSize:8, color:statCol, fontFamily:C.mono,
          letterSpacing:"0.04em" })}>{status.toUpperCase()}</span>
      </div>
    </div>
  );
}

function ScoreBar({ score, height=3 }) {
  const c = sc(score);
  return (
    <div style={{ height, background:C.border, marginTop:8 }}>
      <div style={{ height:"100%", width:`${score}%`, background:c, transition:"width 0.6s ease" }} />
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({ onNavigate }) {
  const tiers = [-1,0,1,2,3,4,5];
  return (
    <div>
      <div style={{ background:`linear-gradient(160deg, ${C.deep} 0%, ${C.surface} 50%, ${C.panel} 100%)`,
        padding:"72px 40px 60px", borderBottom:`3px solid ${C.accent}`, textAlign:"center" }}>
        <div style={px({ fontSize:10, fontWeight:800, letterSpacing:"0.22em", color:C.accent,
          textTransform:"uppercase", marginBottom:12 })}>
          Lightman Consultancy Services · Lightman Trust Group</div>
        <h1 style={px({ fontSize:42, fontWeight:800, color:C.text, marginBottom:8, lineHeight:1.15 })}>
          Mine Advisory Service<br />
          <span style={{ color:C.accent }}>by LCS</span>
        </h1>
        <div style={px({ display:"inline-block", background:C.panel, border:`1px solid ${C.accent}`,
          padding:"4px 18px", fontFamily:C.mono, fontSize:12, color:C.accent,
          letterSpacing:"0.12em", marginBottom:20 })}>v6.0 INSTITUTIONAL · CLAUDE API</div>
        <p style={px({ fontSize:16, color:C.sub, maxWidth:600, margin:"0 auto 40px", lineHeight:1.7 })}>
          16-agent AI swarm across 7 execution tiers. Every mining project scored
          across 18 sections by a full Qualified Person simulation team — with 4 human
          LCS specialists embedded at critical gates.
        </p>
        <div style={{ display:"flex", gap:48, justifyContent:"center", flexWrap:"wrap", marginBottom:40 }}>
          {[{v:"16",l:"Total Agents"},{v:"12",l:"AI (Claude)"},{v:"4",l:"Human (LCS)"},
            {v:"7",l:"Exec Tiers"},{v:"18",l:"Scored Sections"},{v:"∞",l:"Mineral Categories"}].map(s => (
            <div key={s.l} style={{ textAlign:"center" }}>
              <div style={px({ fontSize:40, fontWeight:800, fontFamily:C.mono, color:C.accent, lineHeight:1 })}>{s.v}</div>
              <div style={px({ fontSize:10, color:C.sub, textTransform:"uppercase", letterSpacing:"0.1em", marginTop:2 })}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <button onClick={() => onNavigate("dashboard")} style={px({
            padding:"12px 32px", background:C.accent, color:C.bg, border:"none",
            fontSize:13, fontWeight:800, letterSpacing:"0.1em", cursor:"pointer",
            textTransform:"uppercase", boxShadow:glow(C.accent,12) })}>
            Open Dashboard →</button>
          <button onClick={() => onNavigate("swarm")} style={px({
            padding:"12px 32px", background:"transparent", color:C.accent,
            border:`1px solid ${C.accent}`, fontSize:13, fontWeight:800,
            letterSpacing:"0.1em", cursor:"pointer", textTransform:"uppercase" })}>
            View 16-Agent Swarm</button>
        </div>
      </div>

      <div style={{ padding:"48px 40px", maxWidth:1100, margin:"0 auto" }}>
        <SHdr style={{ marginTop:0 }}>7-Tier Pipeline Architecture</SHdr>
        {tiers.map((tier, ti) => {
          const meta = TIER_META[String(tier)];
          const agents = AGENTS.filter(a => a.tier === tier);
          return (
            <div key={tier} style={{ marginBottom:4 }}>
              <div style={{ display:"flex", gap:0, alignItems:"stretch" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:48, flexShrink:0 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:meta.col,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:10, fontWeight:800, color:C.bg, fontFamily:C.mono, flexShrink:0,
                    boxShadow:glow(meta.col, 6) }}>
                    {tier===-1?"T-1":`T${tier}`}</div>
                  {ti < tiers.length-1 && (
                    <div style={{ width:2, flex:1, minHeight:12, background:`linear-gradient(${meta.col}, ${TIER_META[String(tiers[ti+1])].col})` }} />
                  )}
                </div>
                <div style={{ flex:1, background:C.surface, borderLeft:`4px solid ${meta.col}`,
                  padding:"14px 18px", marginBottom:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <span style={px({ fontSize:12, fontWeight:800, color:meta.col,
                      letterSpacing:"0.08em", textTransform:"uppercase" })}>{meta.label}</span>
                    {meta.exec === "parallel" && (
                      <span style={px({ fontSize:9, padding:"2px 7px", background:`${meta.col}20`,
                        color:meta.col, border:`1px solid ${meta.col}`, letterSpacing:"0.1em" })}>PARALLEL</span>
                    )}
                    <span style={px({ fontSize:11, color:C.sub })}>{meta.desc}</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {agents.map(a => (
                      <div key={a.id} style={{ display:"flex", alignItems:"center", gap:5,
                        padding:"4px 10px", background:C.panel, border:`1px solid ${C.border}` }}>
                        <div style={{ width:18, height:18, borderRadius: a.type==="human"?"50%":2,
                          background:`${a.col}25`, border:`1px solid ${a.col}`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:8, fontWeight:800, color:a.col, fontFamily:C.mono }}>
                          {a.init}</div>
                        <span style={px({ fontSize:11, fontWeight:600, color:C.text })}>{a.name}</span>
                        {a.opus && <span style={px({ fontSize:8, color:C.amber, border:`1px solid ${C.amber}`, padding:"1px 4px" })}>OPUS</span>}
                        {a.type==="human" && <span style={px({ fontSize:8, color:C.gold, border:`1px solid ${C.gold}`, padding:"1px 4px" })}>HUMAN</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <SHdr>Traffic Light Verdict</SHdr>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[{v:"Go",tl:"Green",range:"Score ≤ 49",col:C.green,desc:"Economically defensible value confirmed. Proceed to investment committee."},
            {v:"Conditional",tl:"Amber",range:"Score 50–59",col:C.amber,desc:"Value potential present. Material conditions must be satisfied before capital deployment."},
            {v:"No-Go",tl:"Red",range:"Score ≥ 60",col:C.red,desc:"Insufficient evidence of real economic value. Do not deploy capital at any price."}].map(v => (
            <div key={v.v} style={{ background:C.surface, borderTop:`3px solid ${v.col}`, padding:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <div style={{ width:12, height:12, borderRadius:"50%", background:v.col, boxShadow:glow(v.col,6) }} />
                <span style={px({ fontSize:18, fontWeight:800, color:v.col })}>{v.v}</span>
              </div>
              <div style={px({ fontSize:12, fontFamily:C.mono, color:v.col, marginBottom:8 })}>{v.range}</div>
              <p style={px({ fontSize:12, color:C.sub, lineHeight:1.6 })}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SUBMIT FORM ──────────────────────────────────────────────────────────────
function SubmitForm({ onSubmit, isAnalysing }) {
  const [f, setF] = useState({ name:"", commodity:"", location:"", stage:"PEA",
    resource:"", capex:"", npv:"", irr:"", price_assumption:"", documents:"Investor presentation", notes:"" });
  const up = (k,v) => setF(p => ({...p,[k]:v}));
  const inp = { background:C.panel, border:`1px solid ${C.border}`, color:C.text,
    padding:"8px 12px", fontSize:13, fontFamily:C.body, width:"100%", outline:"none" };
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`,
      borderTop:`3px solid ${C.accent}`, padding:20 }}>
      <div style={px({ fontSize:11, fontWeight:800, letterSpacing:"0.12em", color:C.accent,
        textTransform:"uppercase", marginBottom:16 })}>Submit New Project for Analysis</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        {[["Project Name","name","text"],["Commodity","commodity","text"],
          ["Location","location","text"],["Resource","resource","text"],
          ["CAPEX Estimate","capex","text"],["NPV (USD M)","npv","text"],
          ["IRR %","irr","text"],["Metal Price Assumption","price_assumption","text"]].map(([label,key]) => (
          <div key={key}>
            <div style={px({ fontSize:9, color:C.sub, textTransform:"uppercase",
              letterSpacing:"0.1em", marginBottom:4 })}>{label}</div>
            <input value={f[key]} onChange={e => up(key, e.target.value)}
              placeholder={label} style={inp} />
          </div>
        ))}
      </div>
      <div style={{ marginBottom:10 }}>
        <div style={px({ fontSize:9, color:C.sub, textTransform:"uppercase",
          letterSpacing:"0.1em", marginBottom:4 })}>Study Stage</div>
        <select value={f.stage} onChange={e => up("stage",e.target.value)}
          style={{ ...inp, cursor:"pointer" }}>
          {["Grassroots","Exploration","PEA","PFS","Feasibility","Construction","Production"].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom:10 }}>
        <div style={px({ fontSize:9, color:C.sub, textTransform:"uppercase",
          letterSpacing:"0.1em", marginBottom:4 })}>Documents Submitted</div>
        <textarea value={f.documents} onChange={e => up("documents",e.target.value)}
          placeholder="List all submitted documents (NI 43-101, PEA, etc.)"
          style={{ ...inp, height:60, resize:"vertical" }} />
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={px({ fontSize:9, color:C.sub, textTransform:"uppercase",
          letterSpacing:"0.1em", marginBottom:4 })}>Additional Notes</div>
        <textarea value={f.notes} onChange={e => up("notes",e.target.value)}
          placeholder="Any additional context for the analysis"
          style={{ ...inp, height:60, resize:"vertical" }} />
      </div>
      <button onClick={() => onSubmit(f)} disabled={isAnalysing || !f.name || !f.commodity}
        style={px({ padding:"10px 24px", background: isAnalysing ? C.panel : C.accent,
          color: isAnalysing ? C.sub : C.bg, border:"none", fontSize:12, fontWeight:800,
          letterSpacing:"0.1em", cursor: isAnalysing ? "not-allowed" : "pointer",
          textTransform:"uppercase", width:"100%",
          boxShadow: isAnalysing ? "none" : glow(C.accent,8) })}>
        {isAnalysing ? "⟳ SWARM RUNNING — ANALYSING..." : "▶ RUN 16-AGENT SWARM ANALYSIS"}
      </button>
    </div>
  );
}

// ─── PIPELINE PROGRESS ────────────────────────────────────────────────────────
function PipelineProgress({ statuses }) {
  const tiers = [-1,0,1,2,3,4,5];
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`,
      borderTop:`3px solid ${C.accent}`, padding:20 }}>
      <div style={px({ fontSize:11, fontWeight:800, letterSpacing:"0.12em",
        color:C.accent, textTransform:"uppercase", marginBottom:16 })}>Pipeline Execution</div>
      {tiers.map(tier => {
        const meta = TIER_META[String(tier)];
        const tierAgents = AGENTS.filter(a => a.tier === tier);
        return (
          <div key={tier} style={{ marginBottom:10 }}>
            <div style={px({ fontSize:9, color:meta.col, textTransform:"uppercase",
              letterSpacing:"0.1em", marginBottom:6, fontWeight:700 })}>
              {tier===-1?"T-1":`T${tier}`} · {meta.label}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              {tierAgents.map(a => (
                <AgentPill key={a.id} agent={a} status={statuses[a.id] ?? "idle"} compact />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function Dashboard({ projects, onSelectProject, selectedProject, onAnalyse, agentStatuses, isAnalysing }) {
  return (
    <div>
      <Hdr eyebrow="LCS · Institutional Mining DD Platform"
        title="Project Dashboard"
        subtitle="Mine Advisory Service by LCS v6.0 · 16-Agent Swarm · Claude API"
        stats={[
          { label:"Active Projects", value:projects.length },
          { label:"Go", value:projects.filter(p=>p.verdict==="Go").length, color:C.green },
          { label:"Conditional", value:projects.filter(p=>p.verdict==="Conditional").length, color:C.amber },
          { label:"No-Go", value:projects.filter(p=>p.verdict==="No-Go").length, color:C.red },
          { label:"Total Alerts", value:projects.reduce((a,p)=>a+p.alerts,0), color:C.red },
        ]} />
      <div style={{ padding:"28px 32px", display:"grid", gridTemplateColumns:"1fr 340px",
        gap:28, maxWidth:1400, margin:"0 auto" }}>
        <div>
          <SHdr style={{ marginTop:0 }}>Active Projects</SHdr>
          {projects.map(p => {
            const c = tlCol(p.tl);
            const isSel = selectedProject?.id === p.id;
            return (
              <div key={p.id} onClick={() => onSelectProject(isSel ? null : p)}
                style={{ background:C.surface, borderTop:`3px solid ${c}`,
                  border:`1px solid ${isSel ? c : C.border}`, borderTopWidth:3,
                  padding:"16px 20px", cursor:"pointer", marginBottom:10,
                  transition:"all 0.15s", boxShadow: isSel ? `0 0 20px ${c}20` : "none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ flex:1 }}>
                    <div style={px({ fontSize:15, fontWeight:700, color:C.text, marginBottom:3 })}>{p.name}</div>
                    <div style={px({ fontSize:12, color:C.sub })}>{p.commodity} · {p.location} · {p.stage}</div>
                  </div>
                  <div style={{ display:"flex", gap:12, alignItems:"center", flexShrink:0 }}>
                    {p.alerts > 0 && <div style={px({ fontSize:9, padding:"2px 7px",
                      background:`${C.red}20`, color:C.red, border:`1px solid ${C.red}` })}>
                      {p.alerts} ALERTS</div>}
                    <div style={{ textAlign:"right" }}>
                      <div style={px({ fontSize:9, color:C.sub, letterSpacing:"0.1em" })}>SCORE</div>
                      <div style={px({ fontSize:28, fontWeight:800, fontFamily:C.mono,
                        color:c, lineHeight:1 })}>{p.score}</div>
                    </div>
                    <div style={{ padding:"6px 14px", background:`${c}20`, color:c,
                      border:`1px solid ${c}`, fontSize:11, fontWeight:800,
                      fontFamily:C.body, letterSpacing:"0.06em" }}>{p.verdict}</div>
                  </div>
                </div>
                <ScoreBar score={p.score} />
                {isSel && (
                  <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}`,
                    display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
                    <div>
                      <div style={px({ fontSize:9, color:C.sub, textTransform:"uppercase", letterSpacing:"0.1em" })}>Buy Signal</div>
                      <div style={px({ fontSize:16, fontWeight:800, fontFamily:C.mono, color:C.accent })}>
                        ${p.buy_low}M — ${p.buy_high}M</div>
                    </div>
                    <div>
                      <div style={px({ fontSize:9, color:C.sub, textTransform:"uppercase", letterSpacing:"0.1em" })}>Traffic Light</div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
                        <div style={{ width:10, height:10, borderRadius:"50%", background:c,
                          boxShadow:glow(c,6) }} />
                        <span style={px({ fontSize:14, fontWeight:800, color:c })}>{p.tl}</span>
                      </div>
                    </div>
                    <div>
                      <div style={px({ fontSize:9, color:C.sub, textTransform:"uppercase", letterSpacing:"0.1em" })}>Trust Tier</div>
                      <div style={px({ fontSize:14, fontWeight:800, color:C.text, marginTop:4 })}>Tier {p.trust_tier}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div>
          <SHdr style={{ marginTop:0 }}>New Analysis</SHdr>
          <SubmitForm onSubmit={onAnalyse} isAnalysing={isAnalysing} />
          {isAnalysing && (
            <div style={{ marginTop:12 }}>
              <PipelineProgress statuses={agentStatuses} />
            </div>
          )}

          <SHdr>LCS Human Team</SHdr>
          {AGENTS.filter(a => a.type==="human").map(a => (
            <div key={a.id} style={{ display:"flex", gap:10, alignItems:"flex-start",
              padding:"10px 12px", background:C.surface,
              borderLeft:`3px solid ${C.gold}`, marginBottom:6 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:`${C.gold}20`,
                border:`2px solid ${C.gold}`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:10, fontWeight:800, color:C.gold,
                flexShrink:0, fontFamily:C.mono }}>{a.init}</div>
              <div style={{ flex:1 }}>
                <div style={px({ fontSize:12, fontWeight:800, color:C.text })}>{a.name}</div>
                <div style={px({ fontSize:10, color:C.gold })}>{a.role}</div>
                <div style={px({ fontSize:9, color:C.sub })}>{a.spec}</div>
                <div style={px({ fontSize:9, color:C.muted, fontFamily:C.mono, marginTop:2 })}>
                  T{a.tier} · {a.tLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ANALYSIS PAGE ────────────────────────────────────────────────────────────
function AnalysisView({ project }) {
  const [expanded, setExpanded] = useState(null);
  if (!project) return (
    <div style={{ padding:60, textAlign:"center" }}>
      <div style={px({ fontSize:32, color:C.muted, marginBottom:12 })}>📊</div>
      <div style={px({ fontSize:16, color:C.sub })}>Select a project from Dashboard to view 18-section analysis</div>
    </div>
  );
  const scores = project.section_scores ?? SECTIONS_18.map(()=>50);
  const avg = project.score;
  const c = tlCol(project.tl);
  return (
    <div>
      <Hdr eyebrow={`18-Section QP Analysis · ${project.commodity} · ${project.location}`}
        title={project.name} subtitle="Full QP simulation team · All 18 sections scored · Ripple chains computed"
        borderCol={c}
        stats={[
          { label:"Composite Score", value:avg, color:c },
          { label:"Verdict", value:project.verdict, color:c },
          { label:"Traffic Light", value:project.tl, color:c },
          { label:"Buy Signal", value:`$${project.buy_low}M–$${project.buy_high}M`, color:C.accent },
          { label:"Trust Tier", value:`Tier ${project.trust_tier}` },
        ]} />
      <div style={{ padding:"28px 32px", maxWidth:1300, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:28 }}>
          <div>
            <SHdr style={{ marginTop:0 }}>18-Section Score Matrix</SHdr>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:32 }}>
              {SECTIONS_18.map((s, i) => {
                const score = scores[i] ?? 50;
                const dc = DOMAIN_COLORS[s.domain];
                const isExp = expanded === s.n;
                return (
                  <div key={s.n} onClick={() => setExpanded(isExp ? null : s.n)}
                    style={{ background:C.surface, borderTop:`3px solid ${sc(score)}`,
                      border:`1px solid ${isExp ? sc(score) : C.border}`, borderTopWidth:3,
                      padding:"12px 14px", cursor:"pointer", transition:"all 0.15s" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div style={{ flex:1 }}>
                        <div style={px({ fontSize:9, color:C.sub, fontFamily:C.mono, marginBottom:3 })}>
                          §{String(s.n).padStart(2,"0")}</div>
                        <div style={px({ fontSize:11, fontWeight:700, color:C.text, lineHeight:1.3 })}>{s.name}</div>
                        <div style={px({ fontSize:9, color:dc, marginTop:2 })}>{s.agent}</div>
                      </div>
                      <div style={px({ fontSize:24, fontWeight:800, fontFamily:C.mono,
                        color:sc(score), minWidth:44, textAlign:"right" })}>{score}</div>
                    </div>
                    <ScoreBar score={score} />
                    {isExp && (
                      <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
                        <div style={px({ fontSize:10, color:C.sub, lineHeight:1.5 })}>
                          Weight: {(s.weight*100).toFixed(0)}% · Domain: <span style={{ color:dc }}>{s.domain}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <SHdr>Executive Summary</SHdr>
            <div style={{ background:C.surface, borderLeft:`4px solid ${C.accent}`,
              padding:20, marginBottom:32, fontSize:14, lineHeight:1.8, color:C.text,
              fontFamily:C.body }}>
              {project.exec_summary}</div>

            <SHdr>Ripple Risk Chains — Sir Juan Miami</SHdr>
            {(project.ripples ?? []).map((r,i) => {
              const rc = sevCol(r.sev);
              return (
                <div key={i} style={{ background:C.surface, borderLeft:`4px solid ${rc}`,
                  padding:"14px 18px", marginBottom:8 }}>
                  <span style={px({ fontSize:9, fontWeight:800, padding:"2px 8px",
                    background:`${rc}20`, color:rc, border:`1px solid ${rc}`,
                    letterSpacing:"0.1em", marginBottom:10, display:"inline-block" })}>{r.sev}</span>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5, alignItems:"center",
                    fontFamily:C.mono, fontSize:11, marginTop:8 }}>
                    {r.chain.map((step,si) => (
                      <span key={si} style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <span style={{ background:C.panel, padding:"3px 8px",
                          border:`1px solid ${C.border}`, color:C.text }}>{step}</span>
                        {si < r.chain.length-1 && <span style={{ color:rc }}>→</span>}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <SHdr style={{ marginTop:0 }}>Top Concerns</SHdr>
            <div style={{ background:C.surface, borderTop:`3px solid ${C.red}`,
              border:`1px solid ${C.border}`, padding:16, marginBottom:20 }}>
              {(project.concerns ?? []).map((c2,i) => (
                <div key={i} style={{ display:"flex", gap:8, padding:"8px 0",
                  borderBottom: i < project.concerns.length-1 ? `1px solid ${C.border}` : "none" }}>
                  <span style={px({ fontSize:10, color:C.accent, fontFamily:C.mono,
                    minWidth:22, paddingTop:1 })}>{String(i+1).padStart(2,"0")}</span>
                  <span style={px({ fontSize:12, color:C.text, lineHeight:1.5 })}>{c2}</span>
                </div>
              ))}
            </div>

            <SHdr>Seller Questions</SHdr>
            <div style={{ background:C.surface, borderTop:`3px solid ${C.amber}`,
              border:`1px solid ${C.border}`, padding:16, marginBottom:20 }}>
              {(project.questions ?? []).map((q,i) => (
                <div key={i} style={{ padding:"8px 0",
                  borderBottom: i < project.questions.length-1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={px({ fontSize:9, color:C.amber, fontFamily:C.mono, marginBottom:2 })}>
                    Q{String(i+1).padStart(2,"0")}</div>
                  <div style={px({ fontSize:12, color:C.text, lineHeight:1.5 })}>{q}</div>
                </div>
              ))}
            </div>

            <SHdr>Red Team — Sir Juan Miami</SHdr>
            <div style={{ background:"#0a0508", border:`1px solid ${C.red}`,
              borderLeft:`4px solid ${C.red}`, padding:16, marginBottom:20 }}>
              <div style={px({ fontSize:9, fontWeight:800, padding:"2px 10px",
                background:`${C.red}20`, color:C.red, border:`1px solid ${C.red}`,
                letterSpacing:"0.12em", marginBottom:12, display:"inline-block" })}>
                RED TEAM: {project.rt_verdict}</div>
              <p style={px({ fontSize:12, color:C.text, lineHeight:1.7 })}>{project.red_team}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SWARM PAGE ───────────────────────────────────────────────────────────────
function SwarmView() {
  const [exp, setExp] = useState(null);
  const tiers = [-1,0,1,2,3,4,5];
  return (
    <div>
      <Hdr eyebrow="16-Agent Swarm Architecture · 12 AI + 4 Human"
        title="Agent Roster — All 7 Tiers"
        subtitle="Click any agent to expand mandate and section ownership"
        stats={[
          { label:"AI Agents", value:12 },
          { label:"Human Agents", value:4, color:C.gold },
          { label:"Exec Tiers", value:7 },
          { label:"Parallel Tiers", value:2 },
          { label:"Opus 4 Agent", value:1, color:C.amber },
          { label:"Principal QP", value:"Steven W.", color:C.gold },
        ]} />
      <div style={{ padding:"28px 32px", maxWidth:1200, margin:"0 auto" }}>
        {tiers.map((tier, ti) => {
          const meta = TIER_META[String(tier)];
          const agents = AGENTS.filter(a => a.tier === tier);
          const cols = agents.length === 1 ? "1fr" : agents.length <= 2 ? "1fr 1fr" : agents.length <= 4 ? "repeat(2,1fr)" : "repeat(3,1fr)";
          return (
            <div key={tier} style={{ marginBottom:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 16px",
                background:`${meta.col}12`, borderLeft:`4px solid ${meta.col}`, marginBottom:8 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:meta.col,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:10, fontWeight:800, color:C.bg, fontFamily:C.mono, flexShrink:0,
                  boxShadow:glow(meta.col,8) }}>
                  {tier===-1?"T-1":`T${tier}`}</div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={px({ fontSize:13, fontWeight:800, color:meta.col,
                      letterSpacing:"0.08em", textTransform:"uppercase" })}>{meta.label}</span>
                    {meta.exec==="parallel" && (
                      <span style={px({ fontSize:9, padding:"2px 7px", background:`${meta.col}20`,
                        border:`1px solid ${meta.col}`, color:meta.col, letterSpacing:"0.1em" })}>PARALLEL</span>
                    )}
                  </div>
                  <div style={px({ fontSize:11, color:C.sub })}>{meta.desc}</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:cols, gap:8, marginBottom:16 }}>
                {agents.map(a => {
                  const isExp = exp === a.id;
                  const isH = a.type === "human";
                  return (
                    <div key={a.id} onClick={() => setExp(isExp ? null : a.id)}
                      style={{ background: isExp ? C.panel : C.surface,
                        borderTop:`3px solid ${a.col}`, border:`1px solid ${isExp ? a.col : C.border}`,
                        borderTopWidth:3, padding:"14px 16px", cursor:"pointer",
                        transition:"all 0.2s", boxShadow: isExp ? `0 0 20px ${a.col}15` : "none" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                        <div style={{ width:38, height:38, borderRadius: isH ? "50%" : 3,
                          background:`${a.col}18`, border:`2px solid ${a.col}`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:11, fontWeight:800, color:a.col, fontFamily:C.mono, flexShrink:0 }}>
                          {a.init}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                            <span style={px({ fontSize:12, fontWeight:800, color:C.text })}>{a.name}</span>
                            <span style={px({ fontSize:8, fontWeight:700, padding:"2px 6px",
                              background:`${a.col}20`, color:a.col, border:`1px solid ${a.col}`,
                              letterSpacing:"0.08em" })}>{a.badge}</span>
                            {a.opus && <span style={px({ fontSize:8, padding:"2px 6px",
                              background:`${C.amber}20`, color:C.amber, border:`1px solid ${C.amber}` })}>RED TEAM</span>}
                            {a.principal && <span style={px({ fontSize:8, padding:"2px 6px",
                              background:`${C.gold}20`, color:C.gold, border:`1px solid ${C.gold}` })}>FINAL AUTHORITY</span>}
                          </div>
                          <div style={px({ fontSize:10, color:a.col, marginTop:1 })}>{a.role}</div>
                          <div style={px({ fontSize:9, color:C.sub })}>{a.spec}</div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <div style={{ width:5, height:5, borderRadius:"50%", background:C.green,
                            boxShadow:glow(C.green,4) }} />
                          <span style={px({ fontSize:8, color:C.green, fontFamily:C.mono })}>READY</span>
                        </div>
                      </div>
                      {isExp && (
                        <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
                          <p style={px({ fontSize:11, color:C.sub, fontStyle:"italic",
                            lineHeight:1.6, marginBottom:10 })}>"{a.mandate}"</p>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                            {a.sections.map(sec => (
                              <span key={sec} style={px({ fontSize:9, padding:"3px 8px",
                                background:C.deep, color:a.col, border:`1px solid ${C.border}` })}>{sec}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {ti < tiers.length-1 && (
                <div style={{ display:"flex", justifyContent:"center", margin:"4px 0 8px" }}>
                  <div style={{ fontSize:16, color:C.border }}>↓</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── BENCHMARKING PAGE ────────────────────────────────────────────────────────
function Benchmarking() {
  const peers = [
    { mine:"Salar de Atacama", op:"SQM", com:"Li", aisc:3200, capex_t:18000, irr:28, q:1 },
    { mine:"Escondida", op:"BHP", com:"Cu", aisc:1.42, capex_t:14000, irr:22, q:1 },
    { mine:"Kibali", op:"Barrick", com:"Au", aisc:834, capex_t:11500, irr:18, q:2 },
    { mine:"Oyu Tolgoi UG", op:"Rio Tinto", com:"Cu-Au", aisc:1.89, capex_t:27000, irr:15, q:2 },
    { mine:"Lihir", op:"Newmont", com:"Au", aisc:1580, capex_t:9500, irr:11, q:3 },
    { mine:"Tenke Fungurume", op:"CMOC", com:"Cu-Co", aisc:1.65, capex_t:16000, irr:14, q:2 },
  ];
  const txs = [
    { target:"Yamana Gold", acq:"Pan American", date:"2023-03", ev:4800, com:"Au", mult:"EV/oz: $520" },
    { target:"Sigma Lithium", acq:"Various (bid)", date:"2023-06", ev:3500, com:"Li", mult:"EV/t Li2CO3: $2,800" },
    { target:"Codelco Andina", acq:"Anglo American", date:"2023-09", ev:2100, com:"Cu", mult:"EV/lb: $0.38" },
    { target:"OZ Minerals", acq:"BHP", date:"2023-02", ev:6400, com:"Cu-Au", mult:"EV/oz AuEq: $380" },
  ];
  const qc = { 1:C.green, 2:"#8aacca", 3:C.amber, 4:C.red };
  const th = { padding:"10px 14px", textAlign:"left", fontSize:10, fontWeight:800,
    letterSpacing:"0.08em", textTransform:"uppercase", color:C.bg, fontFamily:C.body };
  const td = { padding:"11px 14px", fontSize:12, borderBottom:`1px solid ${C.border}`, fontFamily:C.body };
  return (
    <div>
      <Hdr eyebrow="VEGA + Francis Nault · Comparables & Market Intelligence"
        title="Benchmarking & M&A Intelligence"
        subtitle="Peer mine performance · Precedent transactions · Cost curve positioning · Nitro market data" />
      <div style={{ padding:"28px 32px", maxWidth:1400, margin:"0 auto" }}>
        <SHdr style={{ marginTop:0 }}>Peer Mine Benchmarks — VEGA</SHdr>
        <div style={{ background:C.surface, borderTop:`3px solid ${C.accent}`,
          border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:32 }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:C.accent }}>
              {["Mine","Operator","Commodity","AISC","CAPEX/t","IRR %","Cost Quartile"].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{peers.map((p,i) => (
              <tr key={i} style={{ background: i%2===0 ? C.surface : C.panel }}>
                <td style={{ ...td, fontWeight:700, color:C.text }}>{p.mine}</td>
                <td style={{ ...td, color:C.sub }}>{p.op}</td>
                <td style={{ ...td, fontFamily:C.mono, color:C.accent }}>{p.com}</td>
                <td style={{ ...td, fontFamily:C.mono }}>{p.aisc.toLocaleString()}</td>
                <td style={{ ...td, fontFamily:C.mono }}>${p.capex_t.toLocaleString()}</td>
                <td style={{ ...td, fontFamily:C.mono }}>{p.irr}%</td>
                <td style={td}><span style={{ padding:"3px 10px", fontSize:10, fontWeight:800,
                  background:`${qc[p.q]}20`, color:qc[p.q], border:`1px solid ${qc[p.q]}` }}>
                  Q{p.q}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <SHdr>Precedent M&A Transactions — VEGA + Francis Nault</SHdr>
        <div style={{ background:C.surface, borderTop:`3px solid ${C.amber}`,
          border:`1px solid ${C.border}`, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:C.amber }}>
              {["Target","Acquirer","Date","EV (USD M)","Commodity","Multiple"].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{txs.map((t,i) => (
              <tr key={i} style={{ background: i%2===0 ? C.surface : C.panel }}>
                <td style={{ ...td, fontWeight:700, color:C.text }}>{t.target}</td>
                <td style={{ ...td, color:C.sub }}>{t.acq}</td>
                <td style={{ ...td, fontFamily:C.mono, color:C.sub }}>{t.date}</td>
                <td style={{ ...td, fontFamily:C.mono, color:C.green, fontWeight:800 }}>${t.ev.toLocaleString()}</td>
                <td style={{ ...td, fontFamily:C.mono, color:C.accent }}>{t.com}</td>
                <td style={{ ...td, fontSize:12 }}>{t.mult}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ALERTS PAGE ──────────────────────────────────────────────────────────────
function AlertsPage({ alerts, onDismiss }) {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? alerts : alerts.filter(a => a.sev === filter);
  const counts = ["CRITICAL","SERIOUS","MODERATE","MINOR"].reduce((acc,s) => {
    acc[s] = alerts.filter(a => a.sev === s).length; return acc; }, {});
  return (
    <div>
      <Hdr eyebrow="Swarm Alert System · AI + Human Flags"
        title="Alert Center"
        subtitle={`${alerts.filter(a=>!a.read).length} unread · ${alerts.length} total · All active projects`}
        borderCol={C.red}
        stats={[
          { label:"Critical", value:counts.CRITICAL, color:C.red },
          { label:"Serious", value:counts.SERIOUS, color:C.amber },
          { label:"Moderate", value:counts.MODERATE, color:C.accent },
          { label:"Minor", value:counts.MINOR, color:C.sub },
          { label:"Human-Raised", value:alerts.filter(a=>a.human).length, color:C.gold },
        ]} />
      <div style={{ padding:"28px 32px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ display:"flex", gap:6 }}>
            {["ALL","CRITICAL","SERIOUS","MODERATE","MINOR"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={px({
                padding:"5px 12px", fontSize:10, fontWeight:800, letterSpacing:"0.08em",
                background: filter===f ? (sevCol(f) ?? C.accent) : C.surface,
                color: filter===f ? C.bg : C.sub,
                border:`1px solid ${filter===f ? (sevCol(f) ?? C.accent) : C.border}`,
                cursor:"pointer" })}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.length === 0 && (
            <div style={{ padding:40, textAlign:"center" }}>
              <div style={px({ fontSize:14, color:C.sub })}>No alerts in this category</div>
            </div>
          )}
          {filtered.map(a => {
            const rc = sevCol(a.sev);
            return (
              <div key={a.id} style={{ background: a.read ? C.surface : `${rc}08`,
                borderLeft:`4px solid ${rc}`, padding:"14px 18px",
                opacity: a.read ? 0.65 : 1, transition:"all 0.2s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7, flexWrap:"wrap" }}>
                      <span style={px({ fontSize:9, fontWeight:800, padding:"2px 7px",
                        background:`${rc}20`, color:rc, border:`1px solid ${rc}`,
                        letterSpacing:"0.1em" })}>{a.sev}</span>
                      <span style={px({ fontSize:11, fontFamily:C.mono,
                        color: a.human ? C.gold : C.accent })}>{a.agent}</span>
                      {a.human && <span style={px({ fontSize:8, padding:"1px 5px",
                        background:`${C.gold}20`, color:C.gold, border:`1px solid ${C.gold}` })}>HUMAN</span>}
                      <span style={px({ fontSize:10, color:C.sub })}>→</span>
                      <span style={px({ fontSize:11, fontWeight:700, color:C.text })}>{a.project}</span>
                      {!a.read && <div style={{ width:5, height:5, borderRadius:"50%", background:rc }} />}
                    </div>
                    <p style={px({ fontSize:12, color:C.text, lineHeight:1.6 })}>{a.msg}</p>
                  </div>
                  <div style={{ marginLeft:16, display:"flex", flexDirection:"column",
                    alignItems:"flex-end", gap:4 }}>
                    <span style={px({ fontSize:10, color:C.sub, whiteSpace:"nowrap" })}>{a.time}</span>
                    {!a.read && (
                      <button onClick={() => onDismiss(a.id)} style={px({
                        fontSize:9, padding:"2px 8px", background:"transparent",
                        color:C.sub, border:`1px solid ${C.border}`, cursor:"pointer" })}>Dismiss</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── FIELD INTEL PAGE ─────────────────────────────────────────────────────────
function FieldIntel() {
  const comms = [
    { sym:"AU", name:"Gold", price:"3,240", unit:"USD/oz", chg:+1.4, agent:"VEGA" },
    { sym:"CU", name:"Copper", price:"4.82", unit:"USD/lb", chg:-0.6, agent:"Francis Nault · Nitro" },
    { sym:"LI", name:"Lithium Carbonate", price:"14,200", unit:"USD/t", chg:-3.1, agent:"Francis Nault · Nitro" },
    { sym:"NI", name:"Nickel", price:"7.41", unit:"USD/lb", chg:-1.8, agent:"VEGA" },
    { sym:"AG", name:"Silver", price:"32.10", unit:"USD/oz", chg:+2.1, agent:"VEGA" },
    { sym:"CO", name:"Cobalt", price:"14.80", unit:"USD/lb", chg:-0.4, agent:"Francis Nault · Nitro" },
  ];
  const juris = [
    { c:"Canada (BC)", risk:"LOW", f:84, flag:"🇨🇦", note:"Critical minerals fast-track active — 2024" },
    { c:"Australia (WA)", risk:"LOW", f:88, flag:"🇦🇺", note:"Critical Minerals Strategy 2030 in force" },
    { c:"Zambia", risk:"MEDIUM", f:52, flag:"🇿🇲", note:"6% NSR royalty — Mines Act 2024 amended" },
    { c:"Chile", risk:"MEDIUM", f:61, flag:"🇨🇱", note:"Li nationalisation risk — CODELCO priority" },
    { c:"Argentina", risk:"HIGH", f:38, flag:"🇦🇷", note:"RIGI mining incentive enacted — BCRA controls" },
    { c:"DRC", risk:"CRITICAL", f:22, flag:"🇨🇩", note:"Local content elevated — dispute resolution weak" },
  ];
  const rc = { LOW:C.green, MEDIUM:C.amber, HIGH:C.red, CRITICAL:"#8a0000" };
  return (
    <div>
      <Hdr eyebrow="VEGA + JURA + Francis Nault · Market & Regulatory Intelligence"
        title="Field Intelligence"
        subtitle="Live commodity context via Nitro · Jurisdiction risk · Cost curve · Offtake intelligence"
        stats={[
          { label:"Au Spot", value:"$3,240", color:C.amber },
          { label:"Cu Spot", value:"$4.82/lb", color:"#5bc8e8" },
          { label:"Li Spot", value:"$14,200/t", color:C.accent },
          { label:"Nitro Feed", value:"LIVE", color:C.green },
        ]} />
      <div style={{ padding:"28px 32px", maxWidth:1400, margin:"0 auto",
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }}>
        <div>
          <SHdr style={{ marginTop:0 }}>Commodity Price Context</SHdr>
          {comms.map(c2 => (
            <div key={c2.sym} style={{ background:C.surface, borderTop:`3px solid ${C.accent}`,
              border:`1px solid ${C.border}`, padding:"13px 18px", marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:3 }}>
                    <span style={px({ fontSize:14, fontWeight:800, fontFamily:C.mono, color:C.accent })}>{c2.sym}</span>
                    <span style={px({ fontSize:13, fontWeight:700, color:C.text })}>{c2.name}</span>
                    <span style={px({ fontSize:8, padding:"1px 6px",
                      background: c2.agent.includes("Francis") ? `${C.gold}20` : `${C.amber}20`,
                      color: c2.agent.includes("Francis") ? C.gold : C.amber,
                      border:`1px solid ${c2.agent.includes("Francis") ? C.gold : C.amber}` })}>
                      {c2.agent}</span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={px({ fontSize:20, fontWeight:800, fontFamily:C.mono, color:C.text })}>{c2.price}</div>
                  <div style={px({ fontSize:9, color:C.sub })}>{c2.unit}</div>
                  <div style={px({ fontSize:12, fontWeight:800,
                    color: c2.chg >= 0 ? C.green : C.red })}>
                    {c2.chg >= 0 ? "▲" : "▼"} {Math.abs(c2.chg)}%</div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop:12, padding:"12px 16px", background:`${C.gold}10`,
            border:`1px solid ${C.gold}`, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:`${C.gold}25`,
              border:`2px solid ${C.gold}`, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:10, fontWeight:800, color:C.gold, flexShrink:0,
              fontFamily:C.mono }}>FN</div>
            <div>
              <div style={px({ fontSize:11, fontWeight:800, color:C.gold })}>Francis Nault · Nitro Commodities</div>
              <div style={px({ fontSize:10, color:C.sub })}>Live Nitro feed active · Offtake desk monitoring</div>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:C.green,
                boxShadow:glow(C.green,6) }} />
              <span style={px({ fontSize:9, color:C.green, fontFamily:C.mono })}>LIVE</span>
            </div>
          </div>
        </div>
        <div>
          <SHdr style={{ marginTop:0 }}>Jurisdiction Risk Monitor — JURA</SHdr>
          {juris.map(j => (
            <div key={j.c} style={{ background:C.surface, borderLeft:`4px solid ${rc[j.risk]}`,
              border:`1px solid ${C.border}`, padding:"12px 16px", marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:18 }}>{j.flag}</span>
                    <span style={px({ fontSize:13, fontWeight:700, color:C.text })}>{j.c}</span>
                    <span style={px({ fontSize:9, fontWeight:800, padding:"2px 7px",
                      background:`${rc[j.risk]}20`, color:rc[j.risk], border:`1px solid ${rc[j.risk]}` })}>
                      {j.risk}</span>
                  </div>
                  <div style={px({ fontSize:11, color:C.sub })}>{j.note}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0, marginLeft:12 }}>
                  <div style={px({ fontSize:9, color:C.sub })}>Fraser Index</div>
                  <div style={px({ fontSize:24, fontWeight:800, fontFamily:C.mono, color:rc[j.risk] })}>{j.f}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NARRATIVE / REPORT PAGE ──────────────────────────────────────────────────
function NarrativePage({ project }) {
  if (!project) return (
    <div style={{ padding:60, textAlign:"center" }}>
      <div style={px({ fontSize:16, color:C.sub })}>Select a project from Dashboard to view full report</div>
    </div>
  );
  const c = tlCol(project.tl);
  const scores = project.section_scores ?? SECTIONS_18.map(()=>50);
  return (
    <div>
      <Hdr eyebrow="Full Institutional Report · Mine Advisory Service by LCS v6.0"
        title={`${project.name} — Due Diligence Report`}
        subtitle={`${project.commodity} · ${project.location} · ${project.stage}`}
        borderCol={c}
        stats={[
          { label:"Composite Score", value:project.score, color:c },
          { label:"Verdict", value:project.verdict, color:c },
          { label:"Buy Signal", value:`$${project.buy_low}M–$${project.buy_high}M`, color:C.accent },
          { label:"Trust Tier", value:`Tier ${project.trust_tier}` },
          { label:"Red Team", value:project.rt_verdict, color: project.rt_verdict==="PASS" ? C.green : project.rt_verdict==="CONDITIONAL" ? C.amber : C.red },
        ]} />
      <div style={{ padding:"28px 32px", maxWidth:1000, margin:"0 auto" }}>

        <SHdr style={{ marginTop:0 }}>Executive Summary</SHdr>
        <div style={{ background:C.surface, borderLeft:`4px solid ${C.accent}`,
          padding:22, marginBottom:28, fontSize:14, lineHeight:1.85, color:C.text,
          fontFamily:C.body }}>{project.exec_summary}</div>

        <SHdr>18-Section Score Summary</SHdr>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`,
          borderTop:`3px solid ${C.accent}`, overflow:"hidden", marginBottom:28 }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:C.accent }}>
              {["§","Section","Score","Agent"].map(h => (
                <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:10,
                  fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase",
                  color:C.bg, fontFamily:C.body }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{SECTIONS_18.map((s,i) => {
              const score = scores[i] ?? 50;
              return (
                <tr key={s.n} style={{ borderBottom:`1px solid ${C.border}`,
                  background: i%2===0 ? C.surface : C.panel }}>
                  <td style={{ padding:"9px 14px", fontFamily:C.mono, fontSize:11,
                    color:C.sub }}>§{String(s.n).padStart(2,"0")}</td>
                  <td style={{ padding:"9px 14px", fontSize:12, fontWeight:600, color:C.text }}>{s.name}</td>
                  <td style={{ padding:"9px 14px" }}>
                    <span style={{ fontSize:18, fontWeight:800, fontFamily:C.mono, color:sc(score) }}>{score}</span>
                  </td>
                  <td style={{ padding:"9px 14px", fontSize:11, color:DOMAIN_COLORS[s.domain] }}>{s.agent}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>

        <SHdr>Ripple Risk Chains</SHdr>
        {(project.ripples ?? []).map((r,i) => {
          const rc2 = sevCol(r.sev);
          return (
            <div key={i} style={{ background:C.surface, borderLeft:`4px solid ${rc2}`,
              padding:"14px 18px", marginBottom:8 }}>
              <span style={px({ fontSize:9, fontWeight:800, padding:"2px 8px",
                background:`${rc2}20`, color:rc2, border:`1px solid ${rc2}`,
                letterSpacing:"0.1em", marginBottom:10, display:"inline-block" })}>{r.sev}</span>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, alignItems:"center",
                fontFamily:C.mono, fontSize:11, marginTop:8 }}>
                {r.chain.map((step,si) => (
                  <span key={si} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ background:C.panel, padding:"3px 8px",
                      border:`1px solid ${C.border}`, color:C.text }}>{step}</span>
                    {si < r.chain.length-1 && <span style={{ color:rc2 }}>→</span>}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        <SHdr>Top Concerns</SHdr>
        <div style={{ background:C.surface, borderTop:`3px solid ${C.red}`,
          border:`1px solid ${C.border}`, padding:18, marginBottom:28 }}>
          {(project.concerns ?? []).map((c2,i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"10px 0",
              borderBottom: i < project.concerns.length-1 ? `1px solid ${C.border}` : "none" }}>
              <span style={px({ fontSize:11, color:C.accent, fontFamily:C.mono,
                minWidth:28, paddingTop:1 })}>{String(i+1).padStart(2,"0")}</span>
              <span style={px({ fontSize:13, color:C.text, lineHeight:1.6 })}>{c2}</span>
            </div>
          ))}
        </div>

        <SHdr>Seller Questions — Required Responses</SHdr>
        <div style={{ background:C.surface, borderTop:`3px solid ${C.amber}`,
          border:`1px solid ${C.border}`, padding:18, marginBottom:28 }}>
          {(project.questions ?? []).map((q,i) => (
            <div key={i} style={{ padding:"10px 0",
              borderBottom: i < project.questions.length-1 ? `1px solid ${C.border}` : "none" }}>
              <div style={px({ fontSize:10, color:C.amber, fontFamily:C.mono, marginBottom:3 })}>
                Q{String(i+1).padStart(2,"0")}</div>
              <div style={px({ fontSize:13, color:C.text, lineHeight:1.6 })}>{q}</div>
            </div>
          ))}
        </div>

        <SHdr>Red Team — Sir Juan Miami, Chief Validation Officer</SHdr>
        <div style={{ background:"#080308", border:`1px solid ${C.red}`,
          borderLeft:`4px solid ${C.red}`, padding:22, marginBottom:28 }}>
          <div style={px({ fontSize:10, fontWeight:800, padding:"3px 12px",
            background:`${C.red}20`, color:C.red, border:`1px solid ${C.red}`,
            letterSpacing:"0.14em", marginBottom:14, display:"inline-block" })}>
            RED TEAM: {project.rt_verdict}</div>
          <p style={px({ fontSize:13, color:C.text, lineHeight:1.8 })}>{project.red_team}</p>
        </div>

        <div style={{ borderTop:`2px solid ${C.border}`, paddingTop:24, textAlign:"center" }}>
          <div style={px({ fontSize:12, fontWeight:800, color:C.accent, letterSpacing:"0.1em",
            textTransform:"uppercase", marginBottom:6 })}>Mine Advisory Service by LCS — v6.0 · Institutional Report</div>
          <div style={px({ fontSize:11, color:C.sub, lineHeight:1.7 })}>
            Steven W. — Principal QP & CEO Founder, Lightman Trust Group<br />
            Lightman Consultancy Services (LCS) · © 2026 Lightman Trust Group · Confidential · Institutional Use Only
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const INIT_ALERTS = [
  { id:1, sev:"CRITICAL", agent:"PHANTOM", project:"Buena Fortuna Gold", human:false, read:false, time:"3 min ago",
    msg:"GMV misrepresentation detected. $2.3B in-situ metal value presented as project value. Actual economic value $800K–$2M after full cost deduction." },
  { id:2, sev:"CRITICAL", agent:"Sir Juan Miami", project:"Buena Fortuna Gold", human:false, read:false, time:"5 min ago",
    msg:"Cross-domain contradiction: 85% Inferred resource cannot support any mining plan. Financial model uses Inferred as if Measured/Indicated. Fundamental misrepresentation." },
  { id:3, sev:"CRITICAL", agent:"Juan Gonzalez", project:"Undisclosed Vendor", human:true, read:false, time:"18 min ago",
    msg:"KYC FAILED — Beneficial ownership chain unresolved. Sanctions database 67% confidence match. Pipeline blocked pending full AML clearance. Do not proceed." },
  { id:4, sev:"SERIOUS", agent:"DELTA", project:"Record Ridge Project", human:false, read:false, time:"1 hr ago",
    msg:"QA/QC protocol failure — blank contamination rate 3.2× threshold. CRM performance: 4 of 12 standards outside 2σ. Assay database integrity compromised." },
  { id:5, sev:"SERIOUS", agent:"Kyle Jackson", project:"Kansanshi Copper Extension", human:true, read:false, time:"2 hr ago",
    msg:"Flowsheet review: SX-EW assumes 94% cathode purity — no refinery contract confirming acceptance. Zambian smelter payability confirmed at 87%, not 95% in model." },
  { id:6, sev:"SERIOUS", agent:"Francis Nault", project:"Salar de Atacama Lithium", human:true, read:false, time:"2 hr ago",
    msg:"Nitro feed: Li₂CO₃ spot at $14,200/t — 14% below the $16,500/t model assumption. No signed offtake. Battery-grade oversupply thesis confirmed through 2025." },
  { id:7, sev:"MODERATE", agent:"JURA", project:"Kansanshi Copper Extension", human:false, read:true, time:"4 hr ago",
    msg:"Zambia 2024 Mines Act — government carried interest confirmed 20%. Not modelled in equity waterfall. NPV impact: -$38M on attributable basis." },
  { id:8, sev:"MINOR", agent:"SIGMA", project:"Mt Vernon Gold Mine", human:false, read:true, time:"6 hr ago",
    msg:"No social licence documentation submitted. Tom Rivera flagged CANNOT_SCORE for Section 10. Section excluded pending submission." },
];

export default function App() {
  const [page, setPage] = useState("landing");
  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [selectedProject, setSelectedProject] = useState(DEMO_PROJECTS[0]);
  const [alerts, setAlerts] = useState(INIT_ALERTS);
  const [agentStatuses, setAgentStatuses] = useState({});
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700;800&family=Source+Code+Pro:wght@400;600;700&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} body{margin:0;padding:0;background:${C.bg}}`;
    document.head.appendChild(style);
    document.body.style.background = C.bg;
  }, []);

  const runPipelineAnimation = useCallback(async () => {
    const tiers = [-1,0,1,2,3,4,5];
    const parallelTiers = [1,2];
    for (const tier of tiers) {
      const tierAgents = AGENTS.filter(a => a.tier === tier);
      if (parallelTiers.includes(tier)) {
        setAgentStatuses(p => {
          const n = {...p};
          tierAgents.forEach(a => { n[a.id] = "running"; });
          return n;
        });
        await new Promise(r => setTimeout(r, 1800));
        setAgentStatuses(p => {
          const n = {...p};
          tierAgents.forEach(a => { n[a.id] = "complete"; });
          return n;
        });
      } else {
        for (const agent of tierAgents) {
          setAgentStatuses(p => ({...p, [agent.id]: "running"}));
          await new Promise(r => setTimeout(r, tier === 3 ? 1200 : 800));
          setAgentStatuses(p => ({...p, [agent.id]: "complete"}));
        }
      }
    }
  }, []);

  const handleAnalyse = useCallback(async (formData) => {
    if (!formData.name || !formData.commodity) return;
    setIsAnalysing(true);
    setError(null);
    const initStatuses = {};
    AGENTS.forEach(a => { initStatuses[a.id] = "idle"; });
    setAgentStatuses(initStatuses);

    try {
      const [result] = await Promise.all([
        runAnalysis(formData),
        runPipelineAnimation(),
      ]);

      const newProject = {
        id: `p${Date.now()}`,
        name: result.project_name ?? formData.name,
        commodity: result.commodity ?? formData.commodity,
        location: formData.location,
        score: result.composite_score ?? 50,
        verdict: result.verdict ?? "Conditional",
        tl: result.traffic_light ?? "Amber",
        stage: formData.stage,
        buy_low: result.buy_signal_low_usd_m ?? 0,
        buy_high: result.buy_signal_high_usd_m ?? 0,
        alerts: (result.fraud_flags ?? []).length + (result.missing_documents ?? []).length,
        exec_summary: result.executive_summary ?? "",
        section_scores: (result.section_scores ?? []).map(s => s.score ?? 50),
        concerns: result.top_concerns ?? [],
        questions: result.seller_questions ?? [],
        ripples: result.ripple_chains ?? [],
        red_team: result.red_team_finding ?? "",
        rt_verdict: result.red_team_verdict ?? "CONDITIONAL",
        trust_tier: result.trust_tier_applied ?? 3,
      };

      setProjects(p => [newProject, ...p]);
      setSelectedProject(newProject);

      if (newProject.alerts > 0) {
        const newAlert = {
          id: Date.now(), sev: newProject.tl === "Red" ? "CRITICAL" : "SERIOUS",
          agent:"APEX", project:newProject.name, human:false, read:false,
          time:"Just now",
          msg:`Analysis complete. Score: ${newProject.score} — ${newProject.verdict}. ${newProject.alerts} flags raised.`,
        };
        setAlerts(p => [newAlert, ...p]);
      }

      setPage("analysis");
    } catch (e) {
      setError(`Analysis failed: ${e.message}. Check console for details.`);
    } finally {
      setIsAnalysing(false);
    }
  }, [runPipelineAnimation]);

  const dismissAlert = useCallback((id) => {
    setAlerts(p => p.map(a => a.id === id ? {...a, read:true} : a));
  }, []);

  const unreadAlerts = alerts.filter(a => !a.read).length;

  const pages = { landing:Landing, dashboard:Dashboard, analysis:AnalysisView,
    swarm:SwarmView, benchmarking:Benchmarking, alerts:AlertsPage,
    field:FieldIntel, narrative:NarrativePage };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:C.body }}>
      <Nav active={page} setActive={setPage} alertCount={unreadAlerts} />

      {error && (
        <div style={{ background:`${C.red}20`, borderBottom:`2px solid ${C.red}`,
          padding:"10px 24px", display:"flex", justifyContent:"space-between" }}>
          <span style={px({ fontSize:12, color:C.red })}>{error}</span>
          <button onClick={() => setError(null)} style={{ background:"none", border:"none",
            color:C.red, cursor:"pointer", fontSize:14 }}>×</button>
        </div>
      )}

      {page === "landing" && <Landing onNavigate={setPage} />}
      {page === "dashboard" && (
        <Dashboard projects={projects} onSelectProject={p => { setSelectedProject(p); if(p) setPage("analysis"); }}
          selectedProject={selectedProject} onAnalyse={handleAnalyse}
          agentStatuses={agentStatuses} isAnalysing={isAnalysing} />
      )}
      {page === "analysis" && <AnalysisView project={selectedProject} />}
      {page === "swarm" && <SwarmView />}
      {page === "benchmarking" && <Benchmarking />}
      {page === "alerts" && <AlertsPage alerts={alerts} onDismiss={dismissAlert} />}
      {page === "field" && <FieldIntel />}
      {page === "narrative" && <NarrativePage project={selectedProject} />}

      <footer style={{ background:C.surface, borderTop:`2px solid ${C.border}`,
        padding:"22px 32px", display:"flex", justifyContent:"space-between",
        alignItems:"center", marginTop:60, flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={px({ fontSize:11, fontWeight:800, color:C.accent, letterSpacing:"0.1em",
            textTransform:"uppercase", marginBottom:3 })}>Mine Advisory Service by LCS — v6.0</div>
          <div style={px({ fontSize:10, color:C.sub })}>
            16-Agent Swarm · 12 AI (Claude Sonnet 4 + Opus 4) + 4 Human (LCS) · 18-Section Framework<br />
            Steven W. — Principal QP & CEO Founder, Lightman Trust Group</div>
        </div>
        <div style={px({ fontSize:10, color:C.sub, textAlign:"right" })}>
          © 2026 Lightman Trust Group<br />Confidential · Institutional Use Only</div>
      </footer>
    </div>
  );
}
