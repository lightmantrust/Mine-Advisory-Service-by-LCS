import { useState } from "react";
import Layout from "../components/Layout";

const SECTIONS = [
  { n: 1, name: "Resource Estimation Integrity", agent: "Dr. Sarah Chen", domain: "geology" },
  { n: 2, name: "Drill Programme Quality", agent: "Dr. Sarah Chen", domain: "geology" },
  { n: 3, name: "Geological Continuity", agent: "Dr. Sarah Chen", domain: "geology" },
  { n: 4, name: "Mining Method Selection", agent: "James Okafor", domain: "mining" },
  { n: 5, name: "Production Schedule Realism", agent: "James Okafor", domain: "mining" },
  { n: 6, name: "Dilution & Recovery", agent: "James Okafor", domain: "mining" },
  { n: 7, name: "Metallurgical Testwork", agent: "Linda Marsh", domain: "metallurgy" },
  { n: 8, name: "Processing Plant Design", agent: "Linda Marsh", domain: "metallurgy" },
  { n: 9, name: "Environmental Baseline", agent: "Tom Rivera", domain: "environmental" },
  { n: 10, name: "Social Licence", agent: "Tom Rivera", domain: "environmental" },
  { n: 11, name: "CAPEX Benchmarking", agent: "Mike Donovan", domain: "financial" },
  { n: 12, name: "OPEX Benchmarking", agent: "Mike Donovan", domain: "financial" },
  { n: 13, name: "Revenue & Metal Pricing", agent: "Mike Donovan", domain: "financial" },
  { n: 14, name: "NPV/IRR Sensitivity", agent: "Mike Donovan", domain: "financial" },
  { n: 15, name: "Financing Structure", agent: "Mike Donovan", domain: "financial" },
  { n: 16, name: "Jurisdiction & Regulatory", agent: "JURA", domain: "cross" },
  { n: 17, name: "Team Credibility", agent: "PHANTOM", domain: "validation" },
  { n: 18, name: "Exit Strategy", agent: "Sir Juan Miami", domain: "redteam" },
];

const DOMAIN_COLORS = { geology: "#02bfe7", mining: "#6fc3df", metallurgy: "#fdb81e", environmental: "#4aa564", financial: "#a8c0d6", cross: "#d4a8e0", validation: "#ff8c42", redteam: "#e31c3d" };

function scoreColor(s) {
  if (s <= 35) return "#4aa564";
  if (s <= 55) return "#fdb81e";
  return "#e31c3d";
}

export default function AnalysisView({ result = null }) {
  const [expandedSection, setExpandedSection] = useState(null);

  // Demo data if no result passed
  const demoScores = SECTIONS.reduce((acc, s) => {
    acc[s.n] = Math.floor(30 + Math.random() * 50);
    return acc;
  }, {});

  const scores = result?.section_scores ?? demoScores;
  const composite = result?.composite_score ?? (Object.values(demoScores).reduce((a, b) => a + b, 0) / 18).toFixed(1);
  const verdict = result?.verdict ?? "Conditional";
  const tl = result?.traffic_light ?? "Amber";
  const tlColor = { Green: "#4aa564", Amber: "#fdb81e", Red: "#e31c3d" }[tl];

  return (
    <Layout activePage="analysis">
      <header style={{ background: "linear-gradient(135deg, #0b1829 0%, #112e51 60%, #1c3a5e 100%)", padding: "48px 40px 36px", borderBottom: "3px solid var(--accent)" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "6px" }}>18-Section QP Analysis</div>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text)" }}>{result?.project_name ?? "Project Analysis View"}</h1>

        {/* VERDICT ROW */}
        <div style={{ display: "flex", gap: "48px", marginTop: "28px", flexWrap: "wrap" }}>
          {[
            { label: "Composite Score", value: composite, mono: true, color: tlColor },
            { label: "Verdict", value: verdict, color: tlColor },
            { label: "Traffic Light", value: tl, color: tlColor },
            { label: "Buy Signal", value: result ? `$${result.buy_signal_low_usd_m}M—$${result.buy_signal_high_usd_m}M` : "$150M—$300M", color: "var(--accent)", mono: true },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: "10px", color: "var(--subtext)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>{item.label}</div>
              <div style={{ fontSize: "26px", fontWeight: 700, color: item.color, fontFamily: item.mono ? "var(--font-mono)" : "inherit" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </header>

      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="section-header">18-Section Score Matrix — QP Simulation Team</div>

        {/* SCORE GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "40px" }}>
          {SECTIONS.map(s => {
            const score = typeof scores === "object" && !Array.isArray(scores) ? (scores[s.n] ?? scores[s.n - 1] ?? 50) : 50;
            const isExpanded = expandedSection === s.n;
            return (
              <div key={s.n}
                onClick={() => setExpandedSection(isExpanded ? null : s.n)}
                style={{
                  background: "var(--surface)",
                  borderTop: `3px solid ${DOMAIN_COLORS[s.domain]}`,
                  padding: "16px",
                  cursor: "pointer",
                  border: isExpanded ? `1px solid ${scoreColor(score)}` : "1px solid var(--border)",
                  borderTopWidth: "3px",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--subtext)", fontFamily: "var(--font-mono)", marginBottom: "4px" }}>§{String(s.n).padStart(2, "0")}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{s.name}</div>
                    <div style={{ fontSize: "11px", color: DOMAIN_COLORS[s.domain], marginTop: "2px" }}>{s.agent}</div>
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-mono)", color: scoreColor(score), minWidth: "52px", textAlign: "right" }}>
                    {score}
                  </div>
                </div>

                {/* SCORE BAR */}
                <div style={{ marginTop: "10px", height: "3px", background: "var(--border)" }}>
                  <div style={{ height: "100%", width: `${score}%`, background: scoreColor(score), transition: "width 0.4s" }} />
                </div>

                {isExpanded && (
                  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)", fontSize: "12px", color: "var(--subtext)" }}>
                    <div style={{ marginBottom: "6px" }}>Domain: <span style={{ color: DOMAIN_COLORS[s.domain] }}>{s.domain}</span></div>
                    <div>Click "Analysis" in nav to view full agent output for this section.</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
