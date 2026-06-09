# Mine Advisory Service by LCS — v6.0

## Institutional Multi-Mineral Due Diligence Platform

The **Mine Advisory Service by LCS v6.0** is an institutional-grade mining asset analysis platform developed by **Lightman Consultancy Services (LCS)** within the **Lightman Trust Group** ecosystem. It deploys a **16-agent swarm (12 AI + 4 Human)** across 7 execution tiers to determine the real and economically defensible value of any mining project submitted for due diligence.

**AI Core:** Claude Sonnet 4 (domain agents) + Claude Opus 4 (Red Team — Sir Juan Miami)
**Human Team:** Steven W. · Juan Gonzalez · Kyle Jackson · Francis Nault
**Framework:** React 18 / Vite · Deno backend · LCS Visual Standard (USWDS palette)
**Deployment:** Vercel / Netlify / Local
**Version:** v6.0.0 — Full rebuild. Zero OpenAI. Zero Google Jules. Claude API only.

---

## Quick Start

```bash
git clone https://github.com/lightmantrust/Mine-Advisory-Service-by-LCS
cd Mine-Advisory-Service-by-LCS
cp .env.example .env        # add your ANTHROPIC_API_KEY
npm install
npm run dev                  # http://localhost:3000
npm run seed                 # load demo projects
python3 gen_reports.py       # generate HTML reports
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel/Netlify deployment.

---

## 🛡️ 18-Section Institutional Framework

Every project scored 1–100 across 18 sections (1=perfect, 100=critical risk):

| # | Section | Agent | Weight |
|---|---------|-------|--------|
| 1 | Resource Estimation Integrity | Dr. Sarah Chen | 9% |
| 2 | Drill Programme Quality | Dr. Sarah Chen | 7% |
| 3 | Geological Continuity | Dr. Sarah Chen | 7% |
| 4 | Mining Method Selection | James Okafor | 6% |
| 5 | Production Schedule Realism | James Okafor | 6% |
| 6 | Dilution & Recovery | James Okafor | 5% |
| 7 | Metallurgical Testwork | Linda Marsh | 7% |
| 8 | Processing Plant Design | Kyle Jackson | 5% |
| 9 | Environmental Baseline | Tom Rivera | 6% |
| 10 | Social Licence | Tom Rivera | 4% |
| 11 | CAPEX Benchmarking | Mike Donovan | 7% |
| 12 | OPEX Benchmarking | Mike Donovan | 6% |
| 13 | Revenue & Metal Pricing | Mike Donovan | 7% |
| 14 | NPV/IRR Sensitivity | Mike Donovan | 8% |
| 15 | Financing Structure | Mike Donovan | 6% |
| 16 | Jurisdiction & Regulatory | JURA | 5% |
| 17 | Team Credibility | PHANTOM | 4% |
| 18 | Exit Strategy | Sir Juan Miami | 4% |

---

## 🤖 16-Agent Swarm (12 AI + 4 Human) — 7-Tier Execution

### TIER -1 — PRE-PIPELINE GATE (Hard gate — nothing proceeds without clearance)
| Agent | Type | Role |
|-------|------|------|
| **Juan Gonzalez** | 👤 Human | Intake Officer — KYC/AML, sanctions screening, counterparty verification. FAIL = pipeline blocked. |

### TIER 0 — INTAKE (Sequential)
| Agent | Type | Role |
|-------|------|------|
| **ARIA** | 🤖 AI | Document ingestion, Trust Tier 1–5 classification, entity schema population |
| **SIGMA** | 🤖 AI | Gap mapping, missing document detection, pre-analysis briefing |

### TIER 1 — QP DOMAIN ANALYSIS (Parallel — 5 AI + 1 Human)
| Agent | Type | Sections |
|-------|------|----------|
| **Dr. Sarah Chen, PhD Geology** | 🤖 AI | §1–3 |
| **James Okafor, PEng Mining** | 🤖 AI | §4–6 |
| **Linda Marsh, MSc Metallurgy** | 🤖 AI | §7–8 |
| **Kyle Jackson** | 👤 Human | Refinery · Flow Sheet · Recovery Rate |
| **Tom Rivera, Environmental Sci.** | 🤖 AI | §9–10 |
| **Mike Donovan, CFA Financial** | 🤖 AI | §11–15 |

### TIER 2 — CROSS-DOMAIN INTELLIGENCE (Parallel — 3 AI + 1 Human)
| Agent | Type | Role |
|-------|------|------|
| **Marcus Sterling** | 🤖 AI | Quantitative Strategist — stress-testing, sensitivity, break-even |
| **VEGA** | 🤖 AI | Comparables, peer benchmarking, precedent transactions |
| **JURA** | 🤖 AI | Mining law, royalties, tax regime, political risk |
| **Francis Nault** | 👤 Human | Nitro Commodities — live pricing, offtake, market access |

### TIER 3 — VALIDATION LAYER (Sequential — DELTA → PHANTOM → Sir Juan Miami)
| Agent | Type | Role |
|-------|------|------|
| **DELTA** | 🤖 AI | QA/QC audit, assay validation, database integrity |
| **PHANTOM** | 🤖 AI | Anti-fraud — GMV misrepresentation, seller bias, deception detection |
| **Sir Juan Miami, Chief Validation Officer** | 🤖 AI | Cross-domain Red Team — final audit **(Claude Opus 4)** |

### TIER 4 — SYNTHESIS & DELIVERY
| Agent | Type | Role |
|-------|------|------|
| **APEX** | 🤖 AI | Score computation, ripple chains, buy signal, report generation |

### TIER 5 — PRINCIPAL SIGN-OFF (Report release gate)
| Agent | Type | Role |
|-------|------|------|
| **Steven W.** | 👤 Human | Principal QP · Mines & Diamonds · NI 43-101/JORC · Final authority |

---

## 🏗️ Pipeline Architecture

```
DEAL SUBMISSION
      │
      ▼
┌──────────────────────────────────────┐
│  TIER -1 · Juan Gonzalez             │
│  KYC/AML Gate — PASS or BLOCKED      │
└───────────────────┬──────────────────┘
                    │ PASS
                    ▼
┌──────────────────────────────────────┐
│  TIER 0 · ARIA → SIGMA               │
│  Document Ingestion & Gap Mapping    │
└───────────────────┬──────────────────┘
                    ▼
┌──────────────────────────────────────┐
│  TIER 1 · PARALLEL QP DOMAIN         │
│  Chen · Okafor · Marsh · Kyle J.     │
│  Rivera · Donovan                    │
└───────────────────┬──────────────────┘
                    ▼
┌──────────────────────────────────────┐
│  TIER 2 · PARALLEL CROSS-DOMAIN      │
│  Sterling · VEGA · JURA · Nault      │
└───────────────────┬──────────────────┘
                    ▼
┌──────────────────────────────────────┐
│  TIER 3 · SEQUENTIAL VALIDATION      │
│  DELTA → PHANTOM → Sir Juan Miami    │
└───────────────────┬──────────────────┘
                    ▼
┌──────────────────────────────────────┐
│  TIER 4 · APEX SYNTHESIS             │
│  Score · Ripple Chains · Report      │
└───────────────────┬──────────────────┘
                    ▼
┌──────────────────────────────────────┐
│  TIER 5 · Steven W. Sign-Off         │
│  Principal QP · Final Release Gate   │
└──────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
Mine-Advisory-Service-by-LCS/
├── .github/workflows/       ← CI/CD — auto build + Vercel deploy
├── agents/
│   ├── human/               ← Juan Gonzalez, Kyle Jackson, Francis Nault, Steven W.
│   ├── tier0/               ← ARIA, SIGMA
│   ├── tier1/               ← 5 AI QP domain agents
│   ├── tier2/               ← Sterling, VEGA, JURA
│   ├── tier3/               ← DELTA, PHANTOM, Sir Juan Miami
│   ├── tier4/               ← APEX
│   └── orchestrator.config.json
├── api/
│   └── analyse.js           ← Vercel serverless function (API proxy)
├── entities/                ← JSON schema definitions
├── functions/               ← Deno TypeScript backend
│   ├── analyseProject.ts
│   ├── runQPSwarm.ts
│   ├── validateResults.ts
│   ├── seedProjects.ts
│   └── generateReport.ts
├── netlify/functions/       ← Netlify alternative
├── src/
│   ├── App.jsx              ← Full production UI (1,500+ lines)
│   ├── components/          ← Shared components + ErrorBoundary
│   ├── pages/               ← Individual page components
│   ├── styles/              ← Global CSS + design tokens
│   └── utils/               ← API client + system prompt
├── incoming_files/          ← Client document drop zone
├── lcs_reports/             ← Generated report output
├── gen_reports.py           ← Entity-driven HTML report generator
├── DEPLOYMENT.md            ← Deployment guide
├── vercel.json              ← Vercel config
├── netlify.toml             ← Netlify config
├── .env.example             ← Environment variable template
├── package.json
├── deno.json
└── vite.config.js
```

---

## 🚦 Traffic Light Scoring

| Score | Traffic Light | Verdict |
|-------|--------------|---------|
| ≤ 49 | 🟢 Green | **Go** — Investable |
| 50–59 | 🟡 Amber | **Conditional** — Conditions required |
| ≥ 60 | 🔴 Red | **No-Go** — Do not deploy capital |

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| AI — Domain Agents | Claude Sonnet 4 (`claude-sonnet-4-20250514`) |
| AI — Red Team | Claude Opus 4 (`claude-opus-4-20250514`) |
| Frontend | React 18 · JSX · Vite 5 |
| Backend | Deno · TypeScript |
| API Proxy | Vercel Serverless / Netlify Functions |
| Report Engine | Python 3 · gen_reports.py |
| Visual Standard | USWDS · Source Sans 3 · Source Code Pro |

---

## 🔐 Security

- API key stays server-side in Vercel/Netlify function — never reaches browser
- `incoming_files/` gitignored — client documents never committed
- `lcs_reports/` output gitignored — report data stays local
- Juan Gonzalez KYC gate — all deals screened before pipeline entry

---

**© 2026 Lightman Trust Group**
*Mine Advisory Service by LCS v6.0 · Steven W. — Principal QP & CEO Founder*
*Lightman Consultancy Services (LCS) — Confidential · Institutional Use Only*
