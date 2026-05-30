import Layout from "../components/Layout";

const TIERS = [
  { tier: 0, label: "Intake", agents: ["ARIA — Document Ingestion & Trust Classification", "SIGMA — Gap Mapping & Agent Briefing"], color: "#02bfe7" },
  { tier: 1, label: "QP Domain Analysis", agents: ["Dr. Sarah Chen — Geology", "James Okafor — Mining Engineering", "Linda Marsh — Metallurgy", "Tom Rivera — Environmental", "Mike Donovan — Financial"], color: "#6fc3df", parallel: true },
  { tier: 2, label: "Cross-Domain Intelligence", agents: ["Marcus Sterling — Quantitative Stress-Testing", "VEGA — Comparables & Market Intelligence", "JURA — Jurisdictional & Regulatory"], color: "#fdb81e", parallel: true },
  { tier: 3, label: "Validation Layer", agents: ["DELTA — QA/QC & Data Integrity", "PHANTOM — Anti-Fraud & Seller Bias", "Sir Juan Miami — Red Team (Opus 4)"], color: "#e31c3d" },
  { tier: 4, label: "Synthesis & Delivery", agents: ["APEX — Score Computation & Report Generation"], color: "#4aa564" },
];

const STATS = [
  { value: "12", label: "AI Agents" },
  { value: "18", label: "Scored Sections" },
  { value: "4", label: "Execution Tiers" },
  { value: "5", label: "Mineral Categories" },
];

export default function Landing() {
  return (
    <Layout activePage="landing">
      {/* HERO */}
      <section style={{
        background: "linear-gradient(160deg, #0b1829 0%, #112e51 50%, #1c3a5e 100%)",
        padding: "80px 40px 60px",
        borderBottom: "3px solid var(--accent)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px" }}>
          Lightman Consultancy Services · Lightman Trust Group
        </div>
        <h1 style={{ fontSize: "42px", fontWeight: 700, color: "var(--text)", marginBottom: "12px", lineHeight: 1.2 }}>
          Mine Advisory Service<br />
          <span style={{ color: "var(--accent)" }}>by LCS</span>
        </h1>
        <div style={{
          display: "inline-block",
          background: "var(--panel)",
          border: "1px solid var(--accent)",
          padding: "4px 18px",
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          color: "var(--accent)",
          letterSpacing: "0.1em",
          marginBottom: "24px",
        }}>v6.0 INSTITUTIONAL</div>
        <p style={{ fontSize: "17px", color: "var(--subtext)", maxWidth: "640px", margin: "0 auto 40px", lineHeight: 1.7 }}>
          Institutional-grade mining asset due diligence powered by a 12-agent Claude AI swarm.
          Every project scored across 18 sections by a full Qualified Person simulation team.
        </p>

        {/* STAT ROW */}
        <div style={{ display: "flex", gap: "48px", justifyContent: "center", flexWrap: "wrap" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "var(--subtext)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PIPELINE */}
      <section style={{ padding: "60px 40px", maxWidth: "1000px", margin: "0 auto" }}>
        <div className="section-header">AI Swarm Pipeline — 4-Tier Execution</div>

        {TIERS.map((tier, i) => (
          <div key={tier.tier} style={{ display: "flex", gap: "24px", marginBottom: "8px", alignItems: "stretch" }}>
            {/* CONNECTOR LINE */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "40px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: tier.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#0b1829", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
                T{tier.tier}
              </div>
              {i < TIERS.length - 1 && (
                <div style={{ width: "2px", flex: 1, background: `linear-gradient(${tier.color}, ${TIERS[i+1].color})`, minHeight: "20px" }} />
              )}
            </div>

            {/* TIER CARD */}
            <div style={{
              flex: 1,
              background: "var(--surface)",
              borderLeft: `4px solid ${tier.color}`,
              padding: "18px 20px",
              marginBottom: i < TIERS.length - 1 ? "8px" : 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: tier.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {tier.label}
                </div>
                {tier.parallel && (
                  <span style={{ fontSize: "10px", padding: "2px 8px", background: `${tier.color}20`, color: tier.color, border: `1px solid ${tier.color}`, letterSpacing: "0.08em" }}>
                    PARALLEL
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {tier.agents.map(agent => (
                  <div key={agent} style={{
                    padding: "4px 12px",
                    background: "var(--panel)",
                    fontSize: "12px",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}>
                    {agent}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* MINERAL CATEGORIES */}
      <section style={{ padding: "0 40px 60px", maxWidth: "1000px", margin: "0 auto" }}>
        <div className="section-header">Mineral Categories Supported</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
          {[
            { cat: "Precious Metals", examples: "Au · Ag · Pt · Pd", color: "#fdb81e" },
            { cat: "Battery & Critical", examples: "Li · Ni · Co · Graphite", color: "#02bfe7" },
            { cat: "Base Metals", examples: "Cu · Zn · Pb · Sn", color: "#6fc3df" },
            { cat: "Bulk Commodities", examples: "Fe · Coal · Potash", color: "#a8c0d6" },
            { cat: "Industrial Minerals", examples: "MgO · Silica · Fluorite", color: "#d4a8e0" },
          ].map(m => (
            <div key={m.cat} style={{ background: "var(--surface)", borderTop: `3px solid ${m.color}`, padding: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: m.color, marginBottom: "6px" }}>{m.cat}</div>
              <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--subtext)" }}>{m.examples}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TRAFFIC LIGHT KEY */}
      <section style={{ padding: "0 40px 80px", maxWidth: "1000px", margin: "0 auto" }}>
        <div className="section-header">Scoring & Verdict Framework</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { verdict: "Go", tl: "Green", range: "Score ≤ 49", color: "#4aa564", desc: "Economically defensible value confirmed. Proceed to investment committee." },
            { verdict: "Conditional", tl: "Amber", range: "Score 50–59", color: "#fdb81e", desc: "Value potential present but material conditions must be satisfied before capital deployment." },
            { verdict: "No-Go", tl: "Red", range: "Score ≥ 60", color: "#e31c3d", desc: "Insufficient evidence of real economic value. Do not deploy capital at any price." },
          ].map(v => (
            <div key={v.verdict} style={{ background: "var(--surface)", borderTop: `3px solid ${v.color}`, padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: v.color, boxShadow: `0 0 8px ${v.color}` }} />
                <span style={{ fontSize: "18px", fontWeight: 700, color: v.color }}>{v.verdict}</span>
                <span style={{ fontSize: "11px", color: "var(--subtext)", fontFamily: "var(--font-mono)" }}>{v.tl}</span>
              </div>
              <div style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color: v.color, marginBottom: "8px" }}>{v.range}</div>
              <p style={{ fontSize: "13px", color: "var(--subtext)", lineHeight: 1.6 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
