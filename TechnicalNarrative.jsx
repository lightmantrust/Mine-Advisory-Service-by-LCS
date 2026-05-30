import Layout from "../components/Layout";

const DEMO_RESULT = {
  project_name: "Kansanshi Copper Extension",
  commodity: "Cu",
  location: "North-Western Province, Zambia",
  composite_score: 52,
  traffic_light: "Amber",
  verdict: "Conditional",
  buy_signal_low_usd_m: 150,
  buy_signal_high_usd_m: 300,
  executive_summary: "The Kansanshi Copper Extension presents credible geological foundations anchored by a Tier 1 NI 43-101 compliant resource estimate, however material financial model deficiencies — specifically the omission of Zambia's 2024 revised royalty regime and an un-inflation-adjusted CAPEX basis — suppress the economic thesis to conditional status. Sir Juan Miami identified a critical cross-domain contradiction: the jurisdiction discount rate (5%) is inconsistent with the political risk profile flagged by JURA (Fraser Index 52, government carried interest unmodelled). These conditions are curable subject to independent financial model update and regulatory compliance confirmation.",
  red_team_finding: "Primary failure mode: financing structure assumes project-level debt in a jurisdiction without established mining project finance precedent. DSCR at trough copper price ($3.20/lb) falls below 1.0x, triggering covenant breach. Equity dilution path under bear scenario reduces NPV to negative. Investable only if copper price floor confirmed above $3.80/lb through streaming or offtake structure that removes price risk from the debt-service equation.",
  red_team_verdict: "CONDITIONAL",
  investability_conditions: [
    "Independent financial model restatement applying Zambia 2024 royalty regime (6% base metals NSR)",
    "CAPEX inflation adjustment to 2024 cost basis — estimated shortfall +28% on 2019 figures",
    "Financing structure amendment — replace project finance debt with streaming or royalty instrument",
    "Discount rate recalibration from 5% to 8-10% to reflect Zambia political risk profile",
    "Government carried interest (20%) modelled explicitly in equity waterfall",
  ],
  top_concerns: [
    "CAPEX based on 2019 PEA — not inflation-adjusted. Estimated understatement: +28% on 2019 base",
    "Zambia royalty regime (6% base metals NSR from 2024) absent from financial model",
    "Government 20% carried interest not modelled in equity dilution table",
    "Discount rate of 5% underweights Zambia political risk (Fraser Index 52)",
    "DSCR at trough copper price ($3.20/lb) projects covenant breach — debt structure not viable",
    "Metallurgical testwork limited to bench-scale — no locked cycle tests for PFS-stage project",
  ],
  seller_questions: [
    "Provide updated financial model applying Zambia Mines and Minerals Development Act 2015 (amended 2024) royalty schedule — specifically 6% NSR for base metals.",
    "Reconcile CAPEX estimate to current (2024) cost basis using MACE or ENR indices. Provide line-item breakdown.",
    "Demonstrate DSCR at $3.20/lb, $3.50/lb, and $3.80/lb copper under the proposed financing structure.",
    "Provide evidence of government carried interest negotiation outcome and impact on equity waterfall.",
    "Present locked-cycle metallurgical testwork or explain basis for reliance on bench-scale data at PFS stage.",
    "Identify named offtake counterparty or smelter willing to accept concentrate grade and penalties.",
  ],
  ripple_chains: [
    { chain: ["Unadjusted CAPEX (2019 basis)", "Capital shortfall at construction", "Equity dilution required", "IRR compression", "Below-threshold returns for project finance lenders"], severity: "CRITICAL" },
    { chain: ["Omitted Zambia royalty", "OPEX understated by 3-4% revenue", "NPV overstated by ~$40M", "Financing gap materialises at project execution"], severity: "SERIOUS" },
    { chain: ["Bench-scale testwork only", "Recovery uncertainty ±8%", "Revenue sensitivity unquantified", "Financial model confidence degraded"], severity: "MODERATE" },
  ],
};

const SEV_COLOR = { CRITICAL: "#e31c3d", SERIOUS: "#fdb81e", MODERATE: "#02bfe7" };
const TL_COLOR = { Green: "#4aa564", Amber: "#fdb81e", Red: "#e31c3d" };

export default function TechnicalNarrative({ result = DEMO_RESULT }) {
  const tlColor = TL_COLOR[result.traffic_light] ?? "#fdb81e";

  return (
    <Layout activePage="narrative">
      <header style={{ background: "linear-gradient(135deg, #0b1829 0%, #112e51 60%, #1c3a5e 100%)", padding: "48px 40px 36px", borderBottom: "3px solid var(--accent)" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "6px" }}>
          Full Technical Narrative Report · Mine Advisory Service by LCS v6.0
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>{result.project_name}</h1>
        <p style={{ fontSize: "14px", color: "var(--subtext)" }}>{result.commodity} · {result.location}</p>

        {/* VERDICT ROW */}
        <div style={{ display: "flex", gap: "40px", marginTop: "28px", flexWrap: "wrap" }}>
          {[
            { label: "Composite Score", value: result.composite_score, mono: true, color: tlColor },
            { label: "Verdict", value: result.verdict, color: tlColor },
            { label: "Traffic Light", value: result.traffic_light, color: tlColor },
            { label: "Buy Signal", value: `$${result.buy_signal_low_usd_m}M — $${result.buy_signal_high_usd_m}M`, color: "var(--accent)", mono: true },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: "10px", color: "var(--subtext)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>{item.label}</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: item.color, fontFamily: item.mono ? "var(--font-mono)" : "inherit" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </header>

      <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>

        {/* EXECUTIVE SUMMARY */}
        <div className="section-header">Executive Summary</div>
        <div style={{ background: "var(--surface)", borderLeft: "4px solid var(--accent)", padding: "24px", marginBottom: "32px", fontSize: "15px", lineHeight: 1.8, color: "var(--text)" }}>
          {result.executive_summary}
        </div>

        {/* TOP CONCERNS */}
        <div className="section-header">Top Concerns</div>
        <div style={{ background: "var(--surface)", borderTop: "3px solid var(--red)", padding: "20px 24px", marginBottom: "32px" }}>
          {result.top_concerns.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: i < result.top_concerns.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent)", minWidth: "28px", paddingTop: "2px" }}>{String(i+1).padStart(2,"0")}</span>
              <span style={{ fontSize: "14px", color: "var(--text)" }}>{c}</span>
            </div>
          ))}
        </div>

        {/* RIPPLE CHAINS */}
        <div className="section-header">Ripple Risk Chains</div>
        <div style={{ marginBottom: "32px" }}>
          {result.ripple_chains.map((chain, i) => (
            <div key={i} style={{ background: "var(--surface)", borderLeft: `4px solid ${SEV_COLOR[chain.severity]}`, padding: "16px 20px", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", background: `${SEV_COLOR[chain.severity]}20`, color: SEV_COLOR[chain.severity], border: `1px solid ${SEV_COLOR[chain.severity]}`, letterSpacing: "0.08em" }}>
                  {chain.severity}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text)" }}>
                {chain.chain.map((step, si) => (
                  <span key={si} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ background: "var(--panel)", padding: "4px 10px", border: "1px solid var(--border)" }}>{step}</span>
                    {si < chain.chain.length - 1 && <span style={{ color: SEV_COLOR[chain.severity] }}>→</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SELLER QUESTIONS */}
        <div className="section-header">Seller Questions — Required Responses</div>
        <div style={{ background: "var(--surface)", borderTop: "3px solid var(--amber)", padding: "20px 24px", marginBottom: "32px" }}>
          {result.seller_questions.map((q, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < result.seller_questions.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--amber)", marginBottom: "4px" }}>Q{String(i+1).padStart(2,"0")}</div>
              <div style={{ fontSize: "14px", color: "var(--text)" }}>{q}</div>
            </div>
          ))}
        </div>

        {/* RED TEAM */}
        <div className="section-header">Red Team — Sir Juan Miami, Chief Validation Officer</div>
        <div style={{ background: "#1a0a0a", border: "1px solid var(--red)", borderLeft: "4px solid var(--red)", padding: "24px", marginBottom: "32px" }}>
          <div style={{
            display: "inline-block", marginBottom: "16px", padding: "4px 16px",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
            background: "#e31c3d20", color: "var(--red)", border: "1px solid var(--red)",
          }}>RED TEAM: {result.red_team_verdict}</div>
          <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.8 }}>{result.red_team_finding}</p>
        </div>

        {/* INVESTABILITY CONDITIONS */}
        <div className="section-header">Investability Conditions</div>
        <div style={{ marginBottom: "40px" }}>
          {result.investability_conditions.map((c, i) => (
            <div key={i} style={{ background: "var(--surface)", borderLeft: "4px solid var(--green)", padding: "12px 16px", marginBottom: "8px", fontSize: "14px", color: "var(--text)", display: "flex", gap: "12px" }}>
              <span style={{ color: "var(--green)", fontWeight: 700 }}>✓</span> {c}
            </div>
          ))}
        </div>

        {/* CEO SIGN-OFF */}
        <div style={{ borderTop: "2px solid var(--border)", paddingTop: "24px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
            Mine Advisory Service by LCS — v6.0 · Institutional Report
          </div>
          <div style={{ fontSize: "12px", color: "var(--subtext)" }}>
            Steven Wood — CEO & Founder, Lightman Trust Group<br />
            Lightman Consultancy Services (LCS) · © 2026 Lightman Trust Group · Confidential
          </div>
        </div>
      </div>
    </Layout>
  );
}
