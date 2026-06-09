/**
 * Mine Advisory Service by LCS — v6.0
 * seedProjects.ts — Full Project Data Seeder
 *
 * Seeds lcs_reports/ with all 7 demo project AnalysisResult entities.
 * Run: deno run --allow-read --allow-write functions/seedProjects.ts
 *
 * Lightman Consultancy Services (LCS) / Lightman Trust Group
 */

import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";

const PROJECTS = [
  {
    result_id: "res-001",
    project_id: "proj-001",
    engine_version: "6.0.0",
    generated_at: new Date().toISOString(),
    report_metadata: {
      project_name: "Salar de Atacama Lithium",
      commodity: "Li₂CO₃",
      location: "Antofagasta, Chile",
      date_generated: "04 June 2026",
      engine_version: "v6.0",
      report_id: "MAS-001",
    },
    composite_score: 38.4,
    trust_tier_applied: 1,
    traffic_light: "Green",
    verdict: "Go",
    buy_signal_low_usd_m: 200,
    buy_signal_high_usd_m: 450,
    buy_signal_methodology: "Post-tax NPV basis · EV/NAV 0.7x · Jurisdiction discount 10%",
    executive_summary: "Strong brine resource with NI 43-101 compliant Tier 1 documentation. Positive NPV at base lithium price deck. Social licence risk manageable. Primary concerns are current lithium oversupply through 2025 and DLE technology readiness at commercial scale. Francis Nault (Nitro) flags Li₂CO₃ spot at $14,200/t vs model assumption of $16,500/t — 14% below basis.",
    section_scores: [
      { section_number:1, section_name:"Resource Estimation Integrity", score:28, agent:"Dr. Sarah Chen", rationale:"NI 43-101 compliant resource, independent QP signed, Tier 1 documentation. Measured/Indicated dominant at 78%." },
      { section_number:2, section_name:"Drill Programme Quality", score:32, agent:"Dr. Sarah Chen", rationale:"Core drilling programme complete. ISO 17025 lab. QA/QC protocols compliant. Check assay programme confirmed." },
      { section_number:3, section_name:"Geological Continuity", score:31, agent:"Dr. Sarah Chen", rationale:"Brine continuity well established by pumping tests. Grade distribution uniform across licence area." },
      { section_number:4, section_name:"Mining Method Selection", score:35, agent:"James Okafor", rationale:"Brine extraction via wells — low complexity. Evaporation pond design appropriate for climate. Infrastructure adjacent." },
      { section_number:5, section_name:"Production Schedule Realism", score:38, agent:"James Okafor", rationale:"18-month commissioning schedule aggressive but comparable to Atacama peers. Evaporation rate assumptions conservative." },
      { section_number:6, section_name:"Dilution & Recovery", score:34, agent:"James Okafor", rationale:"Brine recovery from wells well-characterised. No dilution risk in conventional sense — grade consistency strong." },
      { section_number:7, section_name:"Metallurgical Testwork", score:42, agent:"Linda Marsh", rationale:"DLE testwork at bench-scale completed. Pilot plant in progress. TRL 6 — not yet proven at commercial scale." },
      { section_number:8, section_name:"Processing Plant Design", score:39, agent:"Kyle Jackson", rationale:"Evaporation pond + DLE flowsheet. DLE commercial-scale risk is primary concern. Refinery agreement not yet signed." },
      { section_number:9, section_name:"Environmental Baseline", score:29, agent:"Tom Rivera", rationale:"EIA approved by SERNAGEOMIN. Water rights secured. Atacama water balance managed carefully — compliant." },
      { section_number:10, section_name:"Social Licence", score:44, agent:"Tom Rivera", rationale:"Community consultation ongoing. Some indigenous community concerns on water impact unresolved. Binding commitments pending." },
      { section_number:11, section_name:"CAPEX Benchmarking", score:41, agent:"Mike Donovan", rationale:"CAPEX basis current (2024 detailed engineering). $/tonne LCE within range of comparable Chilean operations." },
      { section_number:12, section_name:"OPEX Benchmarking", score:36, agent:"Mike Donovan", rationale:"OPEX competitive at Q2 cost curve. DLE reagent costs appropriately included. Energy from Chilean grid — competitive rate." },
      { section_number:13, section_name:"Revenue & Metal Pricing", score:52, agent:"Mike Donovan", rationale:"Price deck at $16,500/t Li₂CO₃ — above current Nitro spot of $14,200/t. No signed offtake to anchor price floor." },
      { section_number:14, section_name:"NPV/IRR Sensitivity", score:43, agent:"Mike Donovan", rationale:"Post-tax IRR 28% at base case. Sensitivity table present — price deck is primary swing factor at current market." },
      { section_number:15, section_name:"Financing Structure", score:38, agent:"Mike Donovan", rationale:"Financing structure appropriately structured with strategic partner equity and project finance debt. DSCR adequate at base case." },
      { section_number:16, section_name:"Jurisdiction & Regulatory", score:33, agent:"JURA", rationale:"Chile mining law stable. SERNAGEOMIN permitting efficient. CODELCO priority agreement risk manageable. Fraser Index 61." },
      { section_number:17, section_name:"Team Credibility", score:27, agent:"PHANTOM", rationale:"Management team has operating experience in Atacama. Named QPs verified in APEGBC registry. No linguistic bias detected." },
      { section_number:18, section_name:"Exit Strategy", score:41, agent:"Sir Juan Miami", rationale:"Multiple strategic buyer paths identified. Comparable transactions confirm acquirer appetite for advanced Atacama brine assets." },
    ],
    top_concerns: [
      "Li₂CO₃ spot at $14,200/t — 14% below model assumption of $16,500/t (Francis Nault — Nitro price flag)",
      "DLE technology at TRL 6 — not yet proven at commercial scale for this specific brine chemistry (Kyle Jackson)",
      "No signed offtake agreement — buyer appetite for battery-grade spec unconfirmed at project scale",
      "Indigenous community consultation on Atacama water impact incomplete — binding commitments outstanding",
      "Commissioning schedule 18 months assumes no DLE learning curve delays — aggressive vs industry experience",
    ],
    seller_questions: [
      "Provide sensitivity table at Li₂CO₃ price points $12,000, $14,000, $16,000, $18,000/t showing NPV and IRR at each",
      "Confirm DLE pilot plant results at target production volumes — provide throughput and recovery data",
      "Name offtake counterparty and confirm battery-grade specification acceptance — lithium content, impurity limits, delivery terms",
      "Provide status of indigenous community water impact negotiations — timeline to binding commitments",
      "Demonstrate DSCR at trough lithium price ($10,000/t) under proposed financing structure",
    ],
    ripple_chains: [
      { chain:["Li₂CO₃ spot below model assumption","Revenue 14% below base case","NPV compression","Financing DSCR pressure","Covenant risk at trough pricing"], severity:"SERIOUS" },
      { chain:["DLE TRL 6 risk","Commissioning delay 12–18 months","Capital overrun +20%","Equity dilution required","IRR degradation"], severity:"MODERATE" },
    ],
    missing_documents: ["Signed offtake agreement or LOI with named buyer", "DLE pilot plant performance report at commercial scale"],
    red_team_finding: "Project fundamentally sound but exposed to two independent risks that, combined, could destroy the financing case. Li price recovery is a market call. DLE technology risk is the primary concern — no comparable commercial-scale operation exists for this specific brine chemistry. Investable only with a strategic partner who carries technology risk on their balance sheet.",
    red_team_verdict: "CONDITIONAL",
    investability_conditions: [
      "Li₂CO₃ price recovery confirmed above $15,000/t before project finance drawdown",
      "DLE pilot plant results at target throughput — minimum 12-month operating data at commercial scale",
      "Signed offtake agreement with named, creditworthy battery-grade buyer",
      "Indigenous community water agreement binding and executed",
    ],
    kyc_status: "PASS",
    nitro_price_note: "Nitro desk: Li₂CO₃ spot $14,200/t CIF China. Oversupply from Australian spodumene expected through 2025. Recovery thesis 2026–2027 contingent on EV adoption acceleration.",
    ceo_signoff: "Mine Advisory Service by LCS v6.0 — Steven W., Principal QP & CEO Founder, Lightman Trust Group",
  },
  {
    result_id: "res-002",
    project_id: "proj-002",
    engine_version: "6.0.0",
    generated_at: new Date().toISOString(),
    report_metadata: {
      project_name: "Kansanshi Copper Extension",
      commodity: "Cu",
      location: "North-Western Province, Zambia",
      date_generated: "04 June 2026",
      engine_version: "v6.0",
      report_id: "MAS-002",
    },
    composite_score: 52.1,
    trust_tier_applied: 2,
    traffic_light: "Amber",
    verdict: "Conditional",
    buy_signal_low_usd_m: 150,
    buy_signal_high_usd_m: 300,
    buy_signal_methodology: "Post-tax NPV basis · EV/NAV 0.65x · Jurisdiction discount 20% (Zambia MEDIUM risk)",
    executive_summary: "Credible geological foundations with Tier 2 documentation. Financial model carries material deficiencies including unadjusted 2019 CAPEX basis (+28% shortfall estimated) and omission of Zambia 2024 royalty regime ($38M NPV impact). Financing structure as proposed will not survive trough copper pricing. Kyle Jackson (LCS) confirmed SX-EW payability at 87%, not 95% assumed in model. All conditions are curable.",
    section_scores: [
      { section_number:1, section_name:"Resource Estimation Integrity", score:35, agent:"Dr. Sarah Chen", rationale:"Feasibility-stage resource compliant with JORC 2012. Independent QP signed. Measured/Indicated at 91% — strong classification." },
      { section_number:2, section_name:"Drill Programme Quality", score:42, agent:"Dr. Sarah Chen", rationale:"Infill drilling programme completed. QA/QC compliant. Two umpire labs used. Historical data integrated with reconciliation." },
      { section_number:3, section_name:"Geological Continuity", score:38, agent:"Dr. Sarah Chen", rationale:"Copper sulphide continuity well established. Structural controls modelled. Supergene enrichment properly classified." },
      { section_number:4, section_name:"Mining Method Selection", score:44, agent:"James Okafor", rationale:"Open pit mining appropriate for orebody geometry. Pit slope angles geotechnically supported. Equipment sizing reasonable." },
      { section_number:5, section_name:"Production Schedule Realism", score:55, agent:"James Okafor", rationale:"Throughput assumption of 8Mtpa aggressive for greenfield ramp-up in Zambia. Skilled workforce availability risk." },
      { section_number:6, section_name:"Dilution & Recovery", score:48, agent:"James Okafor", rationale:"Dilution assumptions documented and peer-appropriate. Ore loss estimate reasonable for open pit operation." },
      { section_number:7, section_name:"Metallurgical Testwork", score:49, agent:"Linda Marsh", rationale:"Locked-cycle testwork completed at PFS stage — appropriate methodology. Recovery 91% Cu at target grind size." },
      { section_number:8, section_name:"Processing Plant Design", score:51, agent:"Kyle Jackson", rationale:"SX-EW flowsheet appropriate. CRITICAL: Payability confirmed at 87% by refinery counterparty, not 95% in model. -8% revenue impact." },
      { section_number:9, section_name:"Environmental Baseline", score:38, agent:"Tom Rivera", rationale:"Environmental baseline complete. EIA submitted — awaiting final approval. ARD risk assessed and manageable." },
      { section_number:10, section_name:"Social Licence", score:52, agent:"Tom Rivera", rationale:"Community consultation complete for Phase 1. Binding employment commitments signed. No active protests." },
      { section_number:11, section_name:"CAPEX Benchmarking", score:72, agent:"Mike Donovan", rationale:"CRITICAL: CAPEX basis from 2019 PEA. Estimated shortfall +28% on MACE inflation-adjusted 2024 basis. Contingency insufficient." },
      { section_number:12, section_name:"OPEX Benchmarking", score:64, agent:"Mike Donovan", rationale:"OPEX competitive but excludes 2024 Zambia royalty (6% NSR). Adjustment required — AISC impact approximately +$0.08/lb." },
      { section_number:13, section_name:"Revenue & Metal Pricing", score:41, agent:"Mike Donovan", rationale:"Copper price deck at $4.00/lb — conservative vs current spot ($4.82) but reasonable for long-life DCF." },
      { section_number:14, section_name:"NPV/IRR Sensitivity", score:58, agent:"Mike Donovan", rationale:"IRR 16% post-tax at base case — adequate but margin thin. DSCR at $3.20/lb Cu below 1.0x — covenant breach risk." },
      { section_number:15, section_name:"Financing Structure", score:74, agent:"Mike Donovan", rationale:"CRITICAL: Project finance debt structure fails at trough copper ($3.20/lb). Streaming or royalty instrument required to remove price risk from debt service equation." },
      { section_number:16, section_name:"Jurisdiction & Regulatory", score:36, agent:"JURA", rationale:"Zambia mining law stable post-2024 amendment. 20% government carried interest not modelled. Fraser Index 52." },
      { section_number:17, section_name:"Team Credibility", score:31, agent:"PHANTOM", rationale:"Management team verified. Operator track record in Zambia copper confirmed. No misrepresentation detected." },
      { section_number:18, section_name:"Exit Strategy", score:53, agent:"Sir Juan Miami", rationale:"Zambia copper M&A market active. Global copper demand outlook supports strategic interest. ICSID arbitration available." },
    ],
    top_concerns: [
      "CAPEX basis from 2019 PEA — estimated shortfall +28% on inflation-adjusted 2024 basis (Mike Donovan)",
      "Zambia 2024 royalty (6% NSR base metals) absent from financial model — $38M NPV impact (JURA)",
      "DSCR at $3.20/lb Cu below 1.0x — proposed debt structure fails at trough pricing (Marcus Sterling)",
      "Kyle Jackson confirmed SX-EW payability at 87% not 95% assumed in model — 8% revenue overstatement",
      "Government 20% carried interest not modelled in equity waterfall — dilution impact unquantified",
    ],
    seller_questions: [
      "Restate financial model applying Zambia Mines and Minerals Development Act 2024 royalty schedule — 6% NSR base metals",
      "Reconcile CAPEX to 2024 cost basis using MACE or ENR indices — provide line-item breakdown with inflation factors applied",
      "Demonstrate DSCR at $3.20/lb and $3.50/lb copper under proposed financing structure — show covenant compliance test",
      "Provide government carried interest negotiation outcome and impact on equity waterfall — fully diluted share count",
      "Confirm SX-EW payability terms with named refinery counterparty — provide contract extract or term sheet",
    ],
    ripple_chains: [
      { chain:["2019 CAPEX unadjusted","Capital shortfall at construction","Emergency equity raise required","IRR compression","Project finance covenant breach"], severity:"CRITICAL" },
      { chain:["Omitted Zambia royalty 6% NSR","OPEX understated +$0.08/lb","NPV overstated $38M","Financing gap materialises at drawdown"], severity:"SERIOUS" },
      { chain:["87% payability vs 95% assumed","Revenue overstated 8%","EBITDA margin compressed","DSCR further degraded at trough"], severity:"SERIOUS" },
    ],
    missing_documents: ["Updated financial model with Zambia 2024 royalty applied", "CAPEX reconciliation to 2024 cost basis", "Refinery payability confirmation"],
    red_team_finding: "Primary failure mode: financing structure assumes project-level debt in a jurisdiction without established mining project finance precedent. DSCR at trough copper ($3.20/lb) falls below 1.0x. These are curable deficiencies — not structural flaws. The project has real copper and credible geology. The financial model is broken, not the mine. Fix the model, replace debt with streaming, update the royalty, and this becomes a Conditional that moves toward Go.",
    red_team_verdict: "CONDITIONAL",
    investability_conditions: [
      "Independent financial model restatement: Zambia 2024 royalty, MACE-adjusted CAPEX, 87% payability",
      "Financing structure amendment — streaming or royalty instrument replacing project finance debt",
      "Discount rate recalibration from 5% to 8–10% reflecting Zambia political risk profile",
      "Government carried interest (20%) explicitly modelled in equity waterfall",
    ],
    kyc_status: "PASS",
    nitro_price_note: "Nitro desk: Copper spot $4.82/lb. Chinese property sector drag continues but EV transition structural demand intact. No offtake agreement — recommend securing 50% forward sale at project financing.",
    ceo_signoff: "Mine Advisory Service by LCS v6.0 — Steven W., Principal QP & CEO Founder, Lightman Trust Group",
  },
  {
    result_id: "res-003",
    project_id: "proj-003",
    engine_version: "6.0.0",
    generated_at: new Date().toISOString(),
    report_metadata: {
      project_name: "Buena Fortuna Gold",
      commodity: "Au-Ag",
      location: "San Juan, Argentina",
      date_generated: "04 June 2026",
      engine_version: "v6.0",
      report_id: "MAS-003",
    },
    composite_score: 82.3,
    trust_tier_applied: 4,
    traffic_light: "Red",
    verdict: "No-Go",
    buy_signal_low_usd_m: 0.5,
    buy_signal_high_usd_m: 2,
    buy_signal_methodology: "Residual value basis only — no credible economic model. GMV fraud-adjusted. Floor only.",
    executive_summary: "CRITICAL FRAUD FLAG RAISED BY PHANTOM. $2.3B in-situ metal value presented as project value without processing cost deduction. Actual economic value estimated $800K–$2M. 85% of resource is Inferred. Zero metallurgical testwork submitted. Argentine BCRA currency controls add repatriation risk on any capital deployed. Do not proceed without full NI 43-101 from independent QP.",
    section_scores: [
      { section_number:1, section_name:"Resource Estimation Integrity", score:78, agent:"Dr. Sarah Chen", rationale:"CRITICAL: 85% Inferred. No QP signature on resource report. Block model methodology not described. Cannot support economic analysis." },
      { section_number:2, section_name:"Drill Programme Quality", score:82, agent:"Dr. Sarah Chen", rationale:"QA/QC documentation absent. Laboratory accreditation unconfirmed. No twin holes. Cherry-picked intercepts suspected — PHANTOM flagged." },
      { section_number:3, section_name:"Geological Continuity", score:74, agent:"Dr. Sarah Chen", rationale:"Geological interpretation based on insufficient drill spacing. Continuity between holes assumed not demonstrated." },
      { section_number:4, section_name:"Mining Method Selection", score:85, agent:"James Okafor", rationale:"Mining method unstated. Open pit assumed based on topography. No geotechnical study. Infrastructure absent — no power, road, or water." },
      { section_number:5, section_name:"Production Schedule Realism", score:88, agent:"James Okafor", rationale:"No production schedule provided. Cannot assess realism. SIGMA flagged as missing critical document." },
      { section_number:6, section_name:"Dilution & Recovery", score:79, agent:"James Okafor", rationale:"No dilution or mining recovery assumptions stated. Cannot score — assumed optimistic defaults in any vendor presentation." },
      { section_number:7, section_name:"Metallurgical Testwork", score:91, agent:"Linda Marsh", rationale:"CRITICAL: Zero metallurgical testwork submitted. Recovery rate assumed at 88% with no supporting data. Refractory ore risk not assessed." },
      { section_number:8, section_name:"Processing Plant Design", score:85, agent:"Kyle Jackson", rationale:"No processing plant design. Flowsheet unstated. No refinery or offtake consideration. Cannot assess downstream path." },
      { section_number:9, section_name:"Environmental Baseline", score:62, agent:"Tom Rivera", rationale:"No environmental documentation submitted. EIA status unknown. Argentine environmental permitting timeline 2–4 years minimum." },
      { section_number:10, section_name:"Social Licence", score:71, agent:"Tom Rivera", rationale:"San Juan province — mining community. Basic social licence feasible but no consultation evidence provided." },
      { section_number:11, section_name:"CAPEX Benchmarking", score:88, agent:"Mike Donovan", rationale:"No CAPEX estimate provided. Vendor implies low capital requirement — no basis for claim. Cannot benchmark." },
      { section_number:12, section_name:"OPEX Benchmarking", score:82, agent:"Mike Donovan", rationale:"No OPEX estimate. No AISC calculation. Operating cost impossible to assess without metallurgical or mining data." },
      { section_number:13, section_name:"Revenue & Metal Pricing", score:86, agent:"Mike Donovan", rationale:"CRITICAL GMV: $2.3B in-situ value presented as project value. Actual economic value after costs estimated $800K–$2M. Misrepresentation." },
      { section_number:14, section_name:"NPV/IRR Sensitivity", score:89, agent:"Mike Donovan", rationale:"No NPV/IRR calculation provided. Cannot compute — insufficient technical basis for any economic model." },
      { section_number:15, section_name:"Financing Structure", score:92, agent:"Mike Donovan", rationale:"No financing plan. BCRA currency controls make USD repatriation severely restricted. Capital deployment highly inadvisable." },
      { section_number:16, section_name:"Jurisdiction & Regulatory", score:68, agent:"JURA", rationale:"San Juan province friendly to mining. National-level Argentine instability (BCRA, RIGI). Political risk elevated. Fraser 38." },
      { section_number:17, section_name:"Team Credibility", score:75, agent:"PHANTOM", rationale:"PHANTOM: Team identity partially verifiable. One named geologist not found in professional registry. Linguistic bias score 87/100." },
      { section_number:18, section_name:"Exit Strategy", score:80, agent:"Sir Juan Miami", rationale:"No exit strategy. No comparable transactions at similar project stage and documentation quality. Zero institutional buyer interest at current state." },
    ],
    top_concerns: [
      "CRITICAL FRAUD FLAG: $2.3B GMV presented as project value. Actual economic value $800K–$2M after full cost deduction (PHANTOM)",
      "85% Inferred resource — unsuitable for any economic analysis or mining plan (Dr. Sarah Chen)",
      "Zero metallurgical testwork — 88% recovery assumed with no supporting data (Linda Marsh)",
      "Argentine BCRA currency controls severely restrict USD repatriation — capital trap risk",
      "One named geologist not found in professional registry — team verification failed (PHANTOM)",
    ],
    seller_questions: [
      "Provide independent NI 43-101 or JORC resource statement signed by a registered QP from a recognised independent firm",
      "Explain how $2.3B in-situ metal value translates to project acquisition value — provide full cost deduction showing economic value",
      "Provide metallurgical testwork — minimum bottle roll at representative head grades for the proposed recovery method",
      "Confirm mechanism for USD repatriation under current BCRA regulations — legal opinion required",
      "Provide professional registry credentials for all named team members",
    ],
    ripple_chains: [
      { chain:["GMV misrepresentation","No real economic value established","Capital deployed at quoted price is immediate loss","No recovery pathway"], severity:"CRITICAL" },
      { chain:["85% Inferred resource","Cannot underpin mining plan","No economic foundation for any capital spend","No-Go regardless of other factors"], severity:"CRITICAL" },
    ],
    missing_documents: ["NI 43-101 or JORC resource statement (QP-signed, independent)", "Metallurgical testwork report", "Financial model with cost deductions", "Environmental documentation", "Production schedule", "CAPEX/OPEX estimates"],
    red_team_finding: "This submission fails on fraud grounds before any geological assessment begins. The GMV misrepresentation is not a calculation error — it is a fundamental misrepresentation of how mining projects are valued. Do not engage further without a complete NI 43-101 technical report from an independent QP. The current ask price has no relationship to any credible economic value. Juan Gonzalez KYC notes: counterparty identity partially verified — enhanced due diligence required before any payment.",
    red_team_verdict: "FAIL",
    investability_conditions: [],
    kyc_status: "CONDITIONAL",
    nitro_price_note: "Nitro desk: Gold spot $3,240/oz. High gold price does not rescue GMV misrepresentation — the project's issues are structural not commodity-driven.",
    ceo_signoff: "Mine Advisory Service by LCS v6.0 — Steven W., Principal QP & CEO Founder, Lightman Trust Group",
  },
];

// ─── SEEDER ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Mine Advisory Service by LCS v6.0 — Project Seeder");
  console.log("=".repeat(55));

  for (const project of PROJECTS) {
    const dir = `lcs_reports/${project.project_id}`;
    await ensureDir(dir);

    const resultPath = `${dir}/result.json`;
    await Deno.writeTextFile(resultPath, JSON.stringify(project, null, 2));
    console.log(`✓ Seeded: ${project.report_metadata.project_name} → ${resultPath}`);
  }

  console.log(`\n✓ ${PROJECTS.length} projects seeded to lcs_reports/`);
  console.log("  Run: python3 gen_reports.py  to generate HTML reports");
}

seed();
