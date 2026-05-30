const AGENTS = [
  { id: "ARIA", tier: 0, label: "Intake" },
  { id: "SIGMA", tier: 0, label: "Gap Map" },
  { id: "Dr. Chen", tier: 1, label: "Geology" },
  { id: "Okafor", tier: 1, label: "Mining" },
  { id: "Marsh", tier: 1, label: "Metallurgy" },
  { id: "Rivera", tier: 1, label: "Environmental" },
  { id: "Donovan", tier: 1, label: "Financial" },
  { id: "Sterling", tier: 2, label: "Quant" },
  { id: "VEGA", tier: 2, label: "Comparables" },
  { id: "JURA", tier: 2, label: "Regulatory" },
  { id: "DELTA", tier: 3, label: "QA/QC" },
  { id: "PHANTOM", tier: 3, label: "Anti-Fraud" },
  { id: "Sir Juan", tier: 3, label: "Red Team", opus: true },
  { id: "APEX", tier: 4, label: "Synthesis" },
];

const TIER_COLOR = ["#02bfe7", "#6fc3df", "#fdb81e", "#e31c3d", "#4aa564"];

export default function AgentStatusPanel({ agentStatuses = {} }) {
  return (
    <div style={{ background: "var(--surface)", padding: "20px", borderTop: "3px solid var(--accent)" }}>
      <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "16px" }}>
        Swarm Status
      </div>
      {[0,1,2,3,4].map(tier => (
        <div key={tier} style={{ marginBottom: "12px" }}>
          <div style={{ fontSize: "9px", color: "var(--subtext)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
            T{tier} · {["Intake","QP Domain","Cross-Domain","Validation","Synthesis"][tier]}
          </div>
          {AGENTS.filter(a => a.tier === tier).map(agent => {
            const status = agentStatuses[agent.id] ?? "ready";
            const statusColor = { ready: "#4aa564", running: "#fdb81e", complete: "#02bfe7", error: "#e31c3d" }[status];
            return (
              <div key={agent.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "5px 8px",
                borderLeft: `3px solid ${TIER_COLOR[tier]}`,
                marginBottom: "3px",
                background: status === "running" ? "#fdb81e10" : "transparent",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text)", fontWeight: 600 }}>{agent.id}</span>
                  {agent.opus && <span style={{ fontSize: "8px", color: "var(--amber)", border: "1px solid var(--amber)", padding: "1px 4px" }}>OPUS</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: statusColor }} />
                  <span style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: statusColor, letterSpacing: "0.04em" }}>{status.toUpperCase()}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
