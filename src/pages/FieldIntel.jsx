import Layout from "../components/Layout";

const COMMODITY_DATA = [
  { symbol: "AU", name: "Gold", price: 3240, unit: "USD/oz", change: +1.4, trend: "up", demand: "Jewellery + Central Bank buying elevated. Fed rate cut expectations supporting price." },
  { symbol: "CU", name: "Copper", price: 4.82, unit: "USD/lb", change: -0.6, trend: "down", demand: "Chinese property sector drag. EV transition structural demand intact long-term." },
  { symbol: "LI", name: "Lithium (Carbonate)", price: 14200, unit: "USD/t", change: -3.1, trend: "down", demand: "Supply glut from Australian spodumene. Battery grade oversupply through 2025." },
  { symbol: "NI", name: "Nickel", price: 7.41, unit: "USD/lb", change: -1.8, trend: "down", demand: "Indonesian Class 2 supply surge. Battery-grade premium compressed." },
  { symbol: "AG", name: "Silver", price: 32.10, unit: "USD/oz", change: +2.1, trend: "up", demand: "Solar panel demand growth. Industrial + monetary dual role." },
  { symbol: "ZN", name: "Zinc", price: 1.24, unit: "USD/lb", change: +0.3, trend: "up", demand: "Galvanising demand stable. Chinese smelter cuts reducing supply." },
];

const JURISDICTIONS = [
  { country: "Canada", risk: "LOW", fraser: 84, recent: "BC permitting streamlined for critical minerals", flag: "🇨🇦" },
  { country: "Australia (WA)", risk: "LOW", fraser: 88, recent: "Critical Minerals Strategy 2030 — fast-track pathways", flag: "🇦🇺" },
  { country: "Zambia", risk: "MEDIUM", fraser: 52, recent: "New royalty regime 2024 — stabilised at 6% base metals", flag: "🇿🇲" },
  { country: "Chile", risk: "MEDIUM", fraser: 61, recent: "Lithium nationalisation debate ongoing — CODELCO priority agreements", flag: "🇨🇱" },
  { country: "Argentina", risk: "HIGH", fraser: 38, recent: "Milei deregulation — RIGI mining incentive regime enacted", flag: "🇦🇷" },
  { country: "DRC", risk: "CRITICAL", fraser: 22, recent: "Mining code amendments — local content requirements increased", flag: "🇨🇩" },
];

const RISK_COLOR = { LOW: "#4aa564", MEDIUM: "#fdb81e", HIGH: "#e31c3d", CRITICAL: "#9b0000" };

export default function FieldIntel() {
  return (
    <Layout activePage="field">
      <header style={{ background: "linear-gradient(135deg, #0b1829 0%, #112e51 60%, #1c3a5e 100%)", padding: "48px 40px 36px", borderBottom: "3px solid var(--accent)" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "6px" }}>
          VEGA + JURA · Market & Regulatory Intelligence Feed
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text)" }}>Field Intelligence</h1>
        <p style={{ fontSize: "14px", color: "var(--subtext)", marginTop: "6px" }}>Live commodity pricing context · Jurisdiction risk tracker · Global cost curve positioning</p>
      </header>

      <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>

          {/* COMMODITY PRICES */}
          <div>
            <div className="section-header">Commodity Price Context</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {COMMODITY_DATA.map(c => (
                <div key={c.symbol} style={{ background: "var(--surface)", borderTop: "3px solid var(--accent)", padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{c.symbol}</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{c.name}</span>
                      </div>
                      <p style={{ fontSize: "11px", color: "var(--subtext)", marginTop: "4px", lineHeight: 1.5 }}>{c.demand}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                        {c.price.toLocaleString()}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--subtext)" }}>{c.unit}</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: c.change >= 0 ? "var(--green)" : "var(--red)", marginTop: "2px" }}>
                        {c.change >= 0 ? "▲" : "▼"} {Math.abs(c.change)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* JURISDICTION RISK */}
          <div>
            <div className="section-header">Jurisdiction Risk Monitor</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {JURISDICTIONS.map(j => (
                <div key={j.country} style={{ background: "var(--surface)", borderLeft: `4px solid ${RISK_COLOR[j.risk]}`, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "18px" }}>{j.flag}</span>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>{j.country}</span>
                        <span style={{
                          fontSize: "10px", fontWeight: 700, padding: "2px 8px", letterSpacing: "0.08em",
                          background: `${RISK_COLOR[j.risk]}20`, color: RISK_COLOR[j.risk], border: `1px solid ${RISK_COLOR[j.risk]}`,
                        }}>{j.risk}</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--subtext)", lineHeight: 1.5 }}>{j.recent}</p>
                    </div>
                    <div style={{ textAlign: "right", marginLeft: "16px" }}>
                      <div style={{ fontSize: "10px", color: "var(--subtext)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Fraser</div>
                      <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "var(--font-mono)", color: RISK_COLOR[j.risk] }}>{j.fraser}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FRASER INDEX NOTE */}
            <div style={{ marginTop: "16px", padding: "12px 16px", background: "var(--panel)", borderLeft: "3px solid var(--subtext)", fontSize: "11px", color: "var(--subtext)" }}>
              Fraser Institute Policy Perception Index — 100 = most attractive mining jurisdiction. Score reflects regulatory environment, political risk, and rule of law.
            </div>
          </div>
        </div>

        {/* GLOBAL COST CURVE NOTE */}
        <div style={{ marginTop: "40px" }}>
          <div className="section-header">Cost Curve Methodology — Marcus Sterling</div>
          <div style={{ background: "var(--surface)", borderTop: "3px solid var(--accent)", padding: "24px" }}>
            <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.7, marginBottom: "12px" }}>
              Cost curve positioning is computed by Marcus Sterling (Quantitative Strategist) for each project by comparing the project's stated AISC against the global cost curve for the relevant commodity. Projects in the first quartile (lowest-cost producers) are structurally protected in bear markets. Fourth-quartile projects are the first to be shut down when commodity prices fall.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginTop: "16px" }}>
              {[
                { q: "Q1", label: "0–25th percentile", status: "World-Class", color: "#4aa564" },
                { q: "Q2", label: "25–50th percentile", status: "Competitive", color: "#a8c0d6" },
                { q: "Q3", label: "50–75th percentile", status: "Marginal", color: "#fdb81e" },
                { q: "Q4", label: "75–100th percentile", status: "Uncompetitive", color: "#e31c3d" },
              ].map(q => (
                <div key={q.q} style={{ background: "var(--panel)", borderTop: `3px solid ${q.color}`, padding: "14px" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "var(--font-mono)", color: q.color }}>{q.q}</div>
                  <div style={{ fontSize: "11px", color: "var(--subtext)", marginBottom: "4px" }}>{q.label}</div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: q.color }}>{q.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
