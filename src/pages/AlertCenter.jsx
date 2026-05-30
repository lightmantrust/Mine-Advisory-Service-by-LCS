import { useState } from "react";
import Layout from "../components/Layout";

const DEMO_ALERTS = [
  { id: 1, severity: "CRITICAL", agent: "PHANTOM", project: "Buena Fortuna Gold", message: "GMV misrepresentation detected. In-situ metal value presented as project value without cost deduction.", time: "2 min ago", read: false },
  { id: 2, severity: "CRITICAL", agent: "Sir Juan Miami", project: "Cloverdale Mine", message: "Cross-domain contradiction: geological continuity does not support stated production schedule. Open-pit ramp assumes continuous ore that geological data contradicts.", time: "14 min ago", read: false },
  { id: 3, severity: "SERIOUS", agent: "DELTA", project: "Record Ridge Project", message: "QA/QC protocol failure — blank contamination rate 3.2x threshold in mineralised intervals. Assay database integrity compromised.", time: "1 hr ago", read: false },
  { id: 4, severity: "SERIOUS", agent: "Dr. Sarah Chen", project: "Buena Fortuna Gold", message: "85% of resource classified as Inferred. NPV calculation treats Inferred equivalent to Measured/Indicated. Resource conversion assumption unsupported.", time: "1 hr ago", read: true },
  { id: 5, severity: "MODERATE", agent: "JURA", project: "Kansanshi Copper Extension", message: "Zambia Mines and Minerals Development Act 2015 — government carried interest of 20% not reflected in financial model.", time: "2 hr ago", read: true },
  { id: 6, severity: "MODERATE", agent: "Mike Donovan", project: "Cloverdale Mine", message: "CAPEX estimate from 2019 PEA applied to 2024 production schedule without inflation adjustment. Estimated shortfall: +38% on capital cost basis.", time: "3 hr ago", read: true },
  { id: 7, severity: "MINOR", agent: "SIGMA", project: "Mt Vernon Gold Mine", message: "No social licence documentation submitted. Community consultation status unknown. Tom Rivera flagged CANNOT_SCORE for Section 10.", time: "5 hr ago", read: true },
];

const SEV_COLOR = { CRITICAL: "#e31c3d", SERIOUS: "#fdb81e", MODERATE: "#02bfe7", MINOR: "#a8c0d6" };
const SEV_BG = { CRITICAL: "#e31c3d15", SERIOUS: "#fdb81e15", MODERATE: "#02bfe715", MINOR: "#1c3a5e" };

export default function AlertCenter() {
  const [alerts, setAlerts] = useState(DEMO_ALERTS);
  const [filter, setFilter] = useState("ALL");

  const unread = alerts.filter(a => !a.read).length;
  const filtered = filter === "ALL" ? alerts : alerts.filter(a => a.severity === filter);

  const markRead = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));

  return (
    <Layout activePage="alerts">
      <header style={{ background: "linear-gradient(135deg, #0b1829 0%, #112e51 60%, #1c3a5e 100%)", padding: "48px 40px 36px", borderBottom: "3px solid var(--red)" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", color: "var(--red)", textTransform: "uppercase", marginBottom: "6px" }}>
          Swarm Alert System — Real-Time Flag Monitor
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text)" }}>Alert Center</h1>
          {unread > 0 && (
            <div style={{ background: "var(--red)", color: "#fff", fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "2px" }}>
              {unread} UNREAD
            </div>
          )}
        </div>
        <p style={{ fontSize: "14px", color: "var(--subtext)" }}>Critical findings, Red Team flags, and fraud detection alerts across all active projects.</p>
      </header>

      <div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>

        {/* FILTER BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {["ALL", "CRITICAL", "SERIOUS", "MODERATE", "MINOR"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "6px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                background: filter === f ? (SEV_COLOR[f] ?? "var(--accent)") : "var(--surface)",
                color: filter === f ? (f === "ALL" ? "var(--bg)" : "var(--bg)") : "var(--subtext)",
                border: `1px solid ${filter === f ? (SEV_COLOR[f] ?? "var(--accent)") : "var(--border)"}`,
                cursor: "pointer", fontFamily: "var(--font-body)",
              }}>
                {f}
              </button>
            ))}
          </div>
          <button onClick={markAllRead} style={{
            padding: "6px 14px", fontSize: "11px", fontWeight: 700,
            background: "transparent", color: "var(--subtext)",
            border: "1px solid var(--border)", cursor: "pointer", fontFamily: "var(--font-body)",
          }}>
            Mark All Read
          </button>
        </div>

        {/* ALERT LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map(alert => (
            <div key={alert.id}
              onClick={() => markRead(alert.id)}
              style={{
                background: alert.read ? "var(--surface)" : SEV_BG[alert.severity],
                borderLeft: `4px solid ${SEV_COLOR[alert.severity]}`,
                padding: "16px 20px",
                cursor: "pointer",
                opacity: alert.read ? 0.7 : 1,
                transition: "all 0.15s",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{
                      fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", padding: "2px 8px",
                      background: `${SEV_COLOR[alert.severity]}20`, color: SEV_COLOR[alert.severity],
                      border: `1px solid ${SEV_COLOR[alert.severity]}`,
                    }}>{alert.severity}</span>
                    <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{alert.agent}</span>
                    <span style={{ fontSize: "12px", color: "var(--subtext)" }}>→</span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>{alert.project}</span>
                    {!alert.read && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: SEV_COLOR[alert.severity] }} />}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.6 }}>{alert.message}</p>
                </div>
                <div style={{ fontSize: "11px", color: "var(--subtext)", marginLeft: "16px", whiteSpace: "nowrap" }}>{alert.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY COUNTS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginTop: "32px" }}>
          {["CRITICAL", "SERIOUS", "MODERATE", "MINOR"].map(sev => {
            const count = alerts.filter(a => a.severity === sev).length;
            return (
              <div key={sev} style={{ background: "var(--surface)", borderTop: `3px solid ${SEV_COLOR[sev]}`, padding: "16px 20px" }}>
                <div style={{ fontSize: "10px", color: "var(--subtext)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>{sev}</div>
                <div style={{ fontSize: "32px", fontWeight: 700, fontFamily: "var(--font-mono)", color: SEV_COLOR[sev] }}>{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
