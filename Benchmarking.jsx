import Layout from "../components/Layout";

const PEERS = [
  { mine: "Salar de Atacama", operator: "SQM", commodity: "Li", aisc: 3200, capex_t: 18000, irr: 28, quartile: 1 },
  { mine: "Escondida", operator: "BHP", commodity: "Cu", aisc: 1.42, capex_t: 14000, irr: 22, quartile: 1 },
  { mine: "Kibali", operator: "Barrick", commodity: "Au", aisc: 834, capex_t: 11500, irr: 18, quartile: 2 },
  { mine: "Oyu Tolgoi UG", operator: "Rio Tinto", commodity: "Cu-Au", aisc: 1.89, capex_t: 27000, irr: 15, quartile: 2 },
  { mine: "Lihir", operator: "Newmont", commodity: "Au", aisc: 1580, capex_t: 9500, irr: 11, quartile: 3 },
];

const TRANSACTIONS = [
  { target: "Yamana Gold", acquirer: "Pan American", date: "2023-03", ev_usdm: 4800, commodity: "Au", multiple: "EV/oz: $520" },
  { target: "Codelco Andina", acquirer: "Anglo American", date: "2023-09", ev_usdm: 2100, commodity: "Cu", multiple: "EV/lb: $0.38" },
  { target: "Sigma Lithium", acquirer: "Various (bid)", date: "2023-06", ev_usdm: 3500, commodity: "Li", multiple: "EV/t Li2CO3: $2,800" },
];

const Q_COLOR = { 1: "#4aa564", 2: "#a8c0d6", 3: "#fdb81e", 4: "#e31c3d" };

export default function Benchmarking() {
  return (
    <Layout activePage="benchmarking">
      <header style={{ background: "linear-gradient(135deg, #0b1829 0%, #112e51 60%, #1c3a5e 100%)", padding: "48px 40px 36px", borderBottom: "3px solid var(--accent)" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "6px" }}>VEGA · Validated Externals & Global Analytics</div>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text)" }}>Peer Benchmarking & Market Intelligence</h1>
        <p style={{ fontSize: "14px", color: "var(--subtext)", marginTop: "6px" }}>Real-world context anchoring · Precedent transactions · Cost curve positioning</p>
      </header>

      <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>

        <div className="section-header">Peer Mine Benchmarks</div>
        <div style={{ background: "var(--surface)", borderTop: "3px solid var(--accent)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--accent)" }}>
                {["Mine", "Operator", "Commodity", "AISC", "CAPEX/tonne", "IRR %", "Cost Quartile"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bg)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PEERS.map((p, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text)" }}>{p.mine}</td>
                  <td style={{ padding: "12px 16px", color: "var(--subtext)" }}>{p.operator}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{p.commodity}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", color: "var(--text)" }}>{p.aisc.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", color: "var(--text)" }}>${p.capex_t.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", color: "var(--text)" }}>{p.irr}%</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", fontSize: "11px", fontWeight: 700, background: `${Q_COLOR[p.quartile]}20`, color: Q_COLOR[p.quartile], border: `1px solid ${Q_COLOR[p.quartile]}` }}>
                      Q{p.quartile}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section-header" style={{ marginTop: "40px" }}>Precedent M&A Transactions</div>
        <div style={{ background: "var(--surface)", borderTop: "3px solid var(--amber)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--amber)" }}>
                {["Target", "Acquirer", "Date", "EV (USD M)", "Commodity", "Multiple"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bg)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((t, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text)" }}>{t.target}</td>
                  <td style={{ padding: "12px 16px", color: "var(--subtext)" }}>{t.acquirer}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", color: "var(--subtext)" }}>{t.date}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", color: "var(--green)", fontWeight: 700 }}>${t.ev_usdm.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{t.commodity}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text)" }}>{t.multiple}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  );
}
