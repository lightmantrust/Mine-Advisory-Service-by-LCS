import { useState } from "react";
import "../styles/tokens.css";

const NAV_LINKS = [
  { href: "#dashboard", label: "Dashboard" },
  { href: "#analysis",  label: "Analysis" },
  { href: "#benchmarking", label: "Benchmarking" },
  { href: "#alerts",    label: "Alerts" },
  { href: "#field",     label: "Field Intel" },
];

export default function Layout({ children, activePage = "dashboard" }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)" }}>

      {/* STICKY TEAL NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "var(--surface)",
        borderBottom: "2px solid var(--accent)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: "56px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Mine Advisory Service
            </span>
            <span style={{ fontSize: "10px", color: "var(--subtext)", letterSpacing: "0.06em" }}>
              by LCS — v6.0 · Lightman Trust Group
            </span>
          </div>
          <div style={{ width: "1px", height: "28px", background: "var(--border)" }} />
          <div style={{ display: "flex", gap: "4px" }}>
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} style={{
                padding: "6px 14px",
                fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em",
                color: activePage === link.label.toLowerCase() ? "var(--bg)" : "var(--subtext)",
                background: activePage === link.label.toLowerCase() ? "var(--accent)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              }}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* ENGINE STATUS */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green)" }} />
            <span style={{ fontSize: "11px", color: "var(--subtext)", fontFamily: "var(--font-mono)" }}>SWARM READY</span>
          </div>
          <div style={{
            background: "var(--panel)", border: "1px solid var(--border)",
            padding: "4px 12px", fontSize: "11px", fontFamily: "var(--font-mono)",
            color: "var(--accent)",
          }}>
            12 AGENTS LOADED
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main>{children}</main>

      {/* FOOTER */}
      <footer style={{
        background: "var(--surface)",
        borderTop: "2px solid var(--border)",
        padding: "28px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: "80px",
      }}>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
            Mine Advisory Service by LCS — v6.0
          </div>
          <div style={{ fontSize: "11px", color: "var(--subtext)" }}>
            12-Agent AI Swarm · Claude Opus 4 Red Team · 18-Section Framework<br />
            Steven Wood — CEO & Founder, Lightman Trust Group
          </div>
        </div>
        <div style={{ fontSize: "11px", color: "var(--subtext)", textAlign: "right" }}>
          © 2026 Lightman Trust Group<br />
          Confidential · Institutional Use Only
        </div>
      </footer>
    </div>
  );
}
