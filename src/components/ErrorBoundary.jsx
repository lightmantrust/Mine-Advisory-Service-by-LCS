import { Component } from "react";

const C = {
  bg: "#060f1e", surface: "#0d2137", accent: "#02bfe7",
  red: "#e31c3d", text: "#eef2f7", sub: "#8aacca",
};

/**
 * ErrorBoundary — catches React errors gracefully
 * Prevents the entire app from crashing on component errors
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("[MineAdvisoryService] Component error:", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: "100vh", background: C.bg, display: "flex",
        alignItems: "center", justifyContent: "center", padding: 40,
      }}>
        <div style={{
          background: C.surface, borderTop: `3px solid ${C.red}`,
          border: `1px solid ${C.red}`, padding: 40, maxWidth: 600, width: "100%",
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em",
            color: C.red, textTransform: "uppercase", marginBottom: 12 }}>
            Application Error</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 12,
            fontFamily: "'Source Sans 3', sans-serif" }}>
            Something went wrong</h2>
          <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.7, marginBottom: 24,
            fontFamily: "'Source Sans 3', sans-serif" }}>
            The Mine Advisory Service encountered an unexpected error.
            This has been logged. Please refresh the page to continue.
          </p>
          {this.state.error && (
            <div style={{ background: "#0a0508", border: `1px solid ${C.red}`,
              padding: 16, marginBottom: 24, fontFamily: "'Source Code Pro', monospace",
              fontSize: 11, color: "#ff9999", overflowX: "auto" }}>
              {this.state.error.toString()}
            </div>
          )}
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => window.location.reload()} style={{
              padding: "10px 24px", background: C.accent, color: C.bg,
              border: "none", fontSize: 12, fontWeight: 800, letterSpacing: "0.1em",
              cursor: "pointer", textTransform: "uppercase",
              fontFamily: "'Source Sans 3', sans-serif",
            }}>Reload App</button>
            <button onClick={() => this.setState({ hasError: false, error: null })} style={{
              padding: "10px 24px", background: "transparent", color: C.accent,
              border: `1px solid ${C.accent}`, fontSize: 12, fontWeight: 800,
              letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase",
              fontFamily: "'Source Sans 3', sans-serif",
            }}>Try Again</button>
          </div>
          <div style={{ marginTop: 24, fontSize: 11, color: C.sub,
            fontFamily: "'Source Sans 3', sans-serif" }}>
            Mine Advisory Service by LCS v6.0 · Lightman Trust Group
          </div>
        </div>
      </div>
    );
  }
}
