const scoreColor = (s) => s <= 35 ? "#4aa564" : s <= 55 ? "#fdb81e" : "#e31c3d";

export default function ScoreCard({ sectionNumber, sectionName, score, agent, domain, rationale, redFlags = [], concerns = [] }) {
  const color = scoreColor(score);
  return (
    <div style={{
      background: "var(--surface)",
      borderTop: `3px solid ${color}`,
      padding: "16px 20px",
      position: "relative",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--subtext)" }}>§{String(sectionNumber).padStart(2,"0")}</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>{sectionName}</span>
          </div>
          <div style={{ fontSize: "11px", color: color }}>{agent}</div>
          {rationale && <p style={{ fontSize: "12px", color: "var(--subtext)", marginTop: "6px", lineHeight: 1.5 }}>{rationale}</p>}
        </div>
        <div style={{ textAlign: "right", marginLeft: "16px" }}>
          <div style={{ fontSize: "32px", fontWeight: 700, fontFamily: "var(--font-mono)", color }}>{score}</div>
          <div style={{ fontSize: "10px", color: "var(--subtext)" }}>/100</div>
        </div>
      </div>

      {/* SCORE BAR */}
      <div style={{ marginTop: "10px", height: "2px", background: "var(--border)" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color }} />
      </div>

      {/* FLAGS */}
      {redFlags.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {redFlags.map((f, i) => (
            <div key={i} style={{ fontSize: "11px", color: "var(--red)", padding: "3px 0", borderTop: i === 0 ? "1px solid var(--border)" : "none" }}>
              ⚠ {f}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
