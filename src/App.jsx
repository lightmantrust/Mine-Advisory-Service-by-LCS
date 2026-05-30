import { useState } from "react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AnalysisView from "./pages/AnalysisView";
import Benchmarking from "./pages/Benchmarking";
import AlertCenter from "./pages/AlertCenter";
import FieldIntel from "./pages/FieldIntel";
import TechnicalNarrative from "./pages/TechnicalNarrative";
import "./styles/tokens.css";

const PAGES = {
  landing: Landing,
  dashboard: Dashboard,
  analysis: AnalysisView,
  benchmarking: Benchmarking,
  alerts: AlertCenter,
  field: FieldIntel,
  narrative: TechnicalNarrative,
};

export default function App() {
  const [page, setPage] = useState("landing");
  const PageComponent = PAGES[page] ?? Landing;
  return <PageComponent onNavigate={setPage} />;
}
