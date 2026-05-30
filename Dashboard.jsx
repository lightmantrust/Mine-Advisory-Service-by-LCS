import { useState } from "react";
import Layout from "../components/Layout";
import "../styles/tokens.css";

const DEMO_PROJECTS = [
  { id: "1", name: "Salar de Atacama Lithium", commodity: "Li₂CO₃", location: "Antofagasta, Chile", score: 38, verdict: "Go", tl: "Green", stage: "PFS", buy_low: 200, buy_high: 450 },
  { id: "2", name: "Kansanshi Copper Extension", commodity: "Cu", location: "N-W Province, Zambia", score: 52, verdict: "Conditional", tl: "Amber", stage: "PEA", buy_low: 150, buy_high: 300 },
  { id: "3", name: "Buena Fortuna Gold", commodity: "Au-Ag", location: "San Juan, Argentina", score: 82, verdict: "No-Go", tl: "Red", stage: "Exploration", buy_low: 0.5, buy_high: 2 },
  { id: "4", name: "Cloverdale Mine", commodity: "Au", location: "Nye County, Nevada", score: 65, verdict: "No-Go", tl: "Red", stage: "PEA", buy_low: 50, buy_high: 150 },
  { id: "5", name: "Record Ridge Project", commodity: "MgO", location: "Rossland, BC, Canada", score: 46, verdict: "No-Go", tl: "Red", stage: "Scoping", buy_low: 5, buy_high: 15 },
];

const TL_COLOR = { Green: "#4aa564", Amber: "#fdb81e", Red: "#e31c3d" };
const VERDICT_COLOR = { Go: "#4aa564", Conditional: "#fdb81e", "No-Go": "#e31c3d" };

const AGENTS = [
  { id: "ARIA", tier: 0, role: "Intake", status: "ready" },
  { id: "SIGMA", tier: 0, role: "Gap Map", status: "ready" },
  { id: "Dr. Chen", tier: 1, role: "Geology", status: "ready" },
  { id: "Okafor", tier: 1, role: "Mining", status: "ready" },
  { id: "Marsh", tier: 1, role: "Metallurgy", status: "ready" },
  { id: "Rivera", tier: 1, role: "Environmental", status: "ready" },
  { id: "Donovan", tier: 1, role: "Financial", status: "ready" },
  { id: "Sterling", tier: 2, role: "Quant", status: "ready" },
  { id: "VEGA", tier: 2, role: "Comparables", status: "ready" },
  { id: "JURA", tier: 2, role: "Regulatory", status: "ready" },
  { id: "DELTA", tier: 3, role: "QA/QC", status: "ready" },
  { id: "PHANTOM", tier: 3, role: "Anti-Fraud", status: "ready" },
  { id: "Sir Juan", tier: 3, role: "Red Team", status: "ready", opus: true },
  { id: "APEX", tier: 4, role: "Synthesis", status: "ready" },
];

const TIER_COLORS = ["#02bfe7", "#6fc3df", "#fdb81e", "#e31c3d", "#4aa564"];

export default function Dashboard() {
  const [selected, setSelected] = useState(null);

  return (
    <Layout activePage="dashboard">
      {/* GRADIENT HEADER */}
      <header style={{
        background: "linear-gradient(135deg, #0b1829 0%, #112e51 60%, #1c3a5e 100%)",
        padding: "48px 40px 36px",
        borderBottom: "3px solid var(--accent)",
      }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "8px" }}>
          Lightman Consultancy Services · Institutional Mining DD Platform
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>
          Project Dashboard
        </h1>
        <p style={{ fontSize: "14px", color: "var(--subtext)" }}>
          Mine Advisory Service by LCS v6.0 · 12-Agent AI Swarm · Claude Opus 4 Red Team
        </p>

        {/* STAT ROW */}
        <div style={{ display: "flex", gap: "40px", marginTop: "28px", flexWrap: "wrap" }}>
          {[
            { label: "Active Projects", value: DEMO_PROJECTS.length },
            { label: "Go Verdicts", value: DEMO_PROJECTS.filter(p => p.verdict === "Go").length, color: "var(--green)" },
            { label: "Conditional", value: DEMO_PROJECTS.filter(p => p.verdict === "Conditional").length, color: "var(--amber)" },
            { label: "No-Go", value: DEMO_PROJECTS.filter(p => p.verdict === "No-Go").length, color: "var(--red)" },
            { label: "Agents Loaded", value: 14 },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: "10px", color: "var(--subtext)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>{s.label}</div>
              <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-mono)", color: s.color ?? "var(--text)" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </header>

      <div style={{ padding: "40px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", maxWidth: "1400px", margin: "0 auto" }}>

        {/* PROJECT TABLE */}
        <div>
          <div className="section-header">Active Projects</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {DEMO_PROJECTS.map(p => (
              <div key={p.id}
                onClick={() => setSelected(selected?.id === p.id ? null : p)}
                style={{
                  background: "var(--surface)",
                  borderTop: `3px solid ${TL_COLOR[p.tl]}`,
                  padding: "20px 24px",
                  cursor: "pointer",
                  border: selected?.id === p.id ? `1px solid ${TL_COLOR[p.tl]}` : "1px solid var(--border)",
                  borderTopWidth: "3px",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", marginBottom: "2px" }}>{p.name}</div>
                    <div style={{ fontSize: "13px", color: "var(--subtext)" }}>{p.commodity} · {p.location} · {p.stage}</div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "10px", color: "var(--subtext)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Score</div>
                      <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-mono)", color: TL_COLOR[p.tl] }}>{p.score}</div>
                    </div>
                    <div style={{
                      padding: "6px 14px",
                      background: `${TL_COLOR[p.tl]}20`,
                      color: TL_COLOR[p.tl],
                      border: `1px solid ${TL_COLOR[p.tl]}`,
                      fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em",
                    }}>
                      {p.verdict}
                    </div>
                  </div>
                </div>
                {selected?.id === p.id && (
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", gap: "32px" }}>
                    <div>
                      <div style={{ fontSize: "10px", color: "var(--subtext)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Buy Signal</div>
                      <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                        ${p.buy_low}M — ${p.buy_high}M
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", color: "var(--subtext)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Traffic Light</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: TL_COLOR[p.tl], boxShadow: `0 0 8px ${TL_COLOR[p.tl]}` }} />
                        <span style={{ fontSize: "14px", fontWeight: 700, color: TL_COLOR[p.tl] }}>{p.tl}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AGENT SWARM PANEL */}
        <div>
          <div className="section-header">12-Agent Swarm Status</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[0, 1, 2, 3, 4].map(tier => (
              <div key={tier}>
                <div style={{ fontSize: "10px", color: "var(--subtext)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", marginTop: tier > 0 ? "12px" : 0 }}>
                  Tier {tier} — {["Intake", "QP Domain", "Cross-Domain", "Validation", "Synthesis"][tier]}
                </div>
                {AGENTS.filter(a => a.tier === tier).map(agent => (
                  <div key={agent.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "var(--surface)",
                    borderLeft: `3px solid ${TIER_COLORS[tier]}`,
                    marginBottom: "4px",
                  }}>
                    <div>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", fontFamily: agent.opus ? "var(--font-mono)" : "inherit" }}>
                        {agent.id}
                      </span>
                      {agent.opus && (
                        <span style={{ marginLeft: "6px", fontSize: "9px", color: "var(--amber)", border: "1px solid var(--amber)", padding: "1px 5px", letterSpacing: "0.06em" }}>OPUS 4</span>
                      )}
                      <div style={{ fontSize: "11px", color: "var(--subtext)" }}>{agent.role}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 4px var(--green)" }} />
                      <span style={{ fontSize: "10px", color: "var(--green)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>READY</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* UPLOAD ZONE */}
          <div style={{ marginTop: "24px" }}>
            <div className="section-header">Submit New Project</div>
            <div style={{
              background: "var(--panel)",
              border: "2px dashed var(--accent)",
              padding: "28px 20px",
              textAlign: "center",
              cursor: "pointer",
            }}>
              <div style={{ fontSize: "28px", color: "var(--accent)", marginBottom: "8px" }}>⬆</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent)", marginBottom: "4px" }}>Drop Mining Documents</div>
              <div style={{ fontSize: "11px", color: "var(--subtext)" }}>NI 43-101 · JORC · PEA · PFS · Feasibility</div>
              <div style={{ fontSize: "10px", color: "var(--border)", marginTop: "8px" }}>PDF · TXT · JSON accepted</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
