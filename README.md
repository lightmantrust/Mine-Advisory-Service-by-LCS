# Mine Advisory Service by LCS — v6.0

## Institutional Multi-Mineral Due Diligence Platform

The **Mine Advisory Service by LCS v6.0** is an institutional-grade mining asset analysis platform developed by **Lightman Consultancy Services (LCS)** within the **Lightman Trust Group** ecosystem. It deploys a complete **16-agent swarm (12 AI + 4 Human)** across 7 execution tiers to determine the real and economically defensible value of any mining project submitted for due diligence.

**AI Core:** Claude Sonnet 4 (domain agents) + Claude Opus 4 (Red Team — Sir Juan Miami)
**Human Team:** Steven W. · Juan Gonzalez · Kyle Jackson · Francis Nault
**Framework:** React/JSX · Deno backend · LCS Visual Standard (USWDS palette)
**Reporting:** Automated branded HTML + PDF report generation
**Data Layer:** Entity-based JSON schema — fully dynamic, no hardcoded data
**Version:** v6.0.0 — Full rebuild. Zero OpenAI. Zero Google Jules. Claude API only.

---

🏢 About
Mine Advisory Service by LCS is a product of Lightman Consultancy Services (LCS), the primary operating brand of the Lightman Trust Group (LTG) — a multi-jurisdictional sovereign enterprise structured under a Cook Islands Trust with supporting entities across Wyoming, South Dakota, Nevada, Delaware, Philippines, and Vietnam.
LCS advisory services encompass hard asset advisory, institutional mining due diligence, SBLC issuance advisory, and gem and jewellery services including diamond valuation.
© 2026 Lightman Trust Group
Mine Advisory Service by LCS v6.0
Steven W. — Principal QP & CEO Founder, Lightman Trust Group
Lightman Consultancy Services (LCS) — Confidential · Institutional Use Only

---

## 🛡️ 18-Section Institutional Framework

Every project is scored across 18 sections using a 1–100 risk scale (1 = perfect, 100 = critical risk):

| # | Section | Domain |
|---|---------|--------|
| 1 | Resource Estimation Integrity | Geology |
| 2 | Drill Programme Quality | Geology |
| 3 | Geological Continuity | Geology |
| 4 | Mining Method Selection | Mining |
| 5 | Production Schedule Realism | Mining |
| 6 | Dilution & Recovery | Mining |
| 7 | Metallurgical Testwork | Metallurgy |
| 8 | Processing Plant Design | Metallurgy |
| 9 | Environmental Baseline | Environmental |
| 10 | Social Licence | Environmental |
| 11 | CAPEX Benchmarking | Financial |
| 12 | OPEX Benchmarking | Financial |
| 13 | Revenue & Metal Pricing | Financial |
| 14 | NPV/IRR Sensitivity | Financial |
| 15 | Financing Structure | Financial |
| 16 | Jurisdiction & Regulatory | Cross-Domain |
| 17 | Team Credibility | Validation |
| 18 | Exit Strategy | Red Team |

---

## 🤖 16-Agent Swarm (12 AI + 4 Human) — 7-Tier Execution

### TIER -1 — PRE-PIPELINE GATE (Hard gate — nothing proceeds without clearance)

| Agent | Type | Role |
|-------|------|------|
| **Juan Gonzalez** | 👤 Human | Intake Officer — KYC/AML compliance, sanctions screening, counterparty verification, deal authentication. FAIL = pipeline blocked entirely. No exceptions. |

### TIER 0 — INTAKE (Sequential, must complete before Tier 1)

| Agent | Type | Role |
|-------|------|------|
| **ARIA** | 🤖 AI | Automated document ingestion, Trust Tier classification (1–5), entity schema population |
| **SIGMA** | 🤖 AI | Gap mapping, missing document detection, pre-analysis briefing to all QP agents |

### TIER 1 — QP DOMAIN ANALYSIS (Parallel execution — 5 AI + 1 Human simultaneously)

| Agent | Type | Domain | Sections |
|-------|------|--------|----------|
| **Dr. Sarah Chen, PhD Geology** | 🤖 AI | Resource estimation, QA/QC, continuity | 1–3 |
| **James Okafor, PEng Mining** | 🤖 AI | Engineering realism, production scheduling | 4–6 |
| **Linda Marsh, MSc Metallurgy** | 🤖 AI | Process assumptions, testwork validation | 7–8 |
| **Kyle Jackson** | 👤 Human | Metallurgy · Refinery · Flow Sheet · Recovery Rate — downstream flowsheet, refinery agreements, plant-gate recovery validation | Refinery |
| **Tom Rivera, Environmental Sci.** | 🤖 AI | Permitting, ESG, social licence | 9–10 |
| **Mike Donovan, CFA Financial** | 🤖 AI | NPV/IRR, price deck, financing survivability | 11–15 |

### TIER 2 — CROSS-DOMAIN INTELLIGENCE (Parallel execution — 3 AI + 1 Human simultaneously)

| Agent | Type | Role |
|-------|------|------|
| **Marcus Sterling** | 🤖 AI | Quantitative Strategist — sensitivity matrix, stress-testing, break-even analysis |
| **VEGA** | 🤖 AI | Comparables, peer benchmarking, market intelligence, precedent transactions |
| **JURA** | 🤖 AI | Jurisdictional analysis — mining law, royalties, tax regime, political risk |
| **Francis Nault** | 👤 Human | Nitro Commodities — live commodity pricing via Nitro platform, offtake assessment, market access risk |

### TIER 3 — VALIDATION LAYER (Sequential — DELTA → PHANTOM → Sir Juan Miami)

| Agent | Type | Role |
|-------|------|------|
| **DELTA** | 🤖 AI | Data integrity — QA/QC audit, assay validation, statistical integrity, database audit |
| **PHANTOM** | 🤖 AI | Anti-fraud — seller bias detection, GMV misrepresentation, cherry-pick detection, linguistic bias scoring |
| **Sir Juan Miami, Chief Validation Officer** | 🤖 AI | Cross-domain Red Team — logic gaps, assumption chains, missing risks, final audit **(Claude Opus 4)** |

### TIER 4 — SYNTHESIS & DELIVERY

| Agent | Type | Role |
|-------|------|------|
| **APEX** | 🤖 AI | Score computation, ripple chain analysis, buy signal calculation, report synthesis, HTML/PDF delivery |

### TIER 5 — PRINCIPAL SIGN-OFF (Final authority — report release gate)

| Agent | Type | Role |
|-------|------|------|
| **Steven W.** | 👤 Human | Principal QP · Mines & Diamonds · NI 43-101/JORC · PFS/PEA — reviews APEX output, exercises full QP authority, issues final institutional sign-off. Diamond and gemstone projects receive specialist override review. No report is released without Steven W. approval. |

---

## 🏗️ Pipeline Architecture

DEAL SUBMISSION
│
▼
┌─────────────────────────────────────┐
│  TIER -1 · Juan Gonzalez            │
│  KYC/AML Gate — PASS or BLOCKED     │
└──────────────────┬──────────────────┘
│ PASS
▼
┌─────────────────────────────────────┐
│  TIER 0 · ARIA → SIGMA              │
│  Document Ingestion & Gap Mapping   │
└──────────────────┬──────────────────┘
▼
┌─────────────────────────────────────┐
│  TIER 1 · PARALLEL QP DOMAIN        │
│  Chen · Okafor · Marsh · Kyle J.    │
│  Rivera · Donovan                   │
└──────────────────┬──────────────────┘
▼
┌─────────────────────────────────────┐
│  TIER 2 · PARALLEL CROSS-DOMAIN     │
│  Sterling · VEGA · JURA · Nault     │
└──────────────────┬──────────────────┘
▼
┌─────────────────────────────────────┐
│  TIER 3 · SEQUENTIAL VALIDATION     │
│  DELTA → PHANTOM → Sir Juan Miami   │
└──────────────────┬──────────────────┘
▼
┌─────────────────────────────────────┐
│  TIER 4 · APEX SYNTHESIS            │
│  Score · Report · Buy Signal        │
└──────────────────┬──────────────────┘
▼
┌─────────────────────────────────────┐
│  TIER 5 · Steven W. — Sign-Off      │
│  Principal QP · Final Release Gate  │
└─────────────────────────────────────┘
---


## 📁 Repository Structure

Mine-Advisory-Service-by-LCS/
├── agents/
│   ├── tier0/                    ← ARIA, SIGMA
│   ├── tier1/                    ← 5 AI QP domain agents
│   ├── tier2/                    ← Sterling, VEGA, JURA
│   ├── tier3/                    ← DELTA, PHANTOM, Sir Juan Miami
│   ├── tier4/                    ← APEX
│   ├── human/                    ← Juan Gonzalez, Kyle Jackson,
│   │                                Francis Nault, Steven W.
│   └── orchestrator.config.json  ← Master pipeline sequencer
├── entities/
│   ├── Project.json
│   ├── Document.json
│   ├── QPOutput.json
│   └── AnalysisResult.json
├── functions/
│   ├── analyseProject.ts         ← Claude API orchestrator
│   ├── buildAgentBriefing.ts
│   ├── generateReport.ts
│   ├── ingestDocument.ts
│   └── loadAgentConfig.ts
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── AgentStatusPanel.jsx
│   │   └── ScoreCard.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AnalysisView.jsx
│   │   ├── Benchmarking.jsx
│   │   ├── AlertCenter.jsx
│   │   ├── FieldIntel.jsx
│   │   └── TechnicalNarrative.jsx
│   ├── styles/
│   │   └── tokens.css
│   ├── App.jsx
│   └── main.jsx
├── incoming_files/               ← Client document drop zone
├── lcs_reports/                  ← Generated report output
├── mining_docs/                  ← Source project documents
├── gen_reports.py                ← Entity-driven report generator
├── .env.example                  ← Environment variable template
├── .gitignore
├── deno.json
├── index.html
├── package.json
└── vite.config.js

---

## 🚦 Traffic Light Scoring

| Score | Traffic Light | Verdict | Meaning |
|-------|--------------|---------|---------|
| ≤ 49 | 🟢 Green | **Go** | Economically defensible value confirmed. Proceed to investment committee. |
| 50–59 | 🟡 Amber | **Conditional** | Value potential present. Material conditions must be satisfied before capital deployment. |
| ≥ 60 | 🔴 Red | **No-Go** | Insufficient evidence of real economic value. Do not deploy capital at any price. |

*Scale is inverse: lower score = better project. 1 = perfect, 100 = critical risk.*

---

## 📋 Document Trust Tiers

| Tier | Classification | Examples | Weight |
|------|---------------|----------|--------|
| **Tier 1** | NI 43-101 / JORC — QP-signed, independent firm | Technical Reports, Resource Statements | 1.00× |
| **Tier 2** | Signed Feasibility — named authors, company-signed | Feasibility Studies, PFS | 0.85× |
| **Tier 3** | Preliminary Study — incomplete authorship | PEA, Scoping Studies | 0.65× |
| **Tier 4** | Vendor Document — no independent sign-off | Investor Presentations, Marketing Decks | 0.40× |
| **Tier 5** | Unverifiable — anonymous, undated | No authorship, unverifiable source | 0.10× |

---

## 📊 Mineral Categories Supported

| Category | Commodities | Key Considerations |
|----------|------------|-------------------|
| **Precious Metals** | Au · Ag · Pt · Pd | Fire assay QA/QC, cut-off grade sensitivity, royalty burden |
| **Battery & Critical** | Li · Ni · Co · Graphite · V | Grade continuity, brine vs hard rock, battery-grade spec |
| **Base Metals** | Cu · Zn · Pb · Sn | By-product credits, smelter terms, concentrate penalties |
| **Bulk Commodities** | Fe · Coal · Potash | Strip ratio, logistics infrastructure, moisture penalty |
| **Industrial Minerals** | MgO · Silica · Fluorite · Barite | Processing route maturity, market demand validation |
| **Diamonds & Gems** | Diamonds · Emerald · Ruby · Sapphire | Steven W. specialist override — GIA grading, size distribution, rough valuation |

---

## ⚙️ Technical Stack

| Layer | Technology |
|-------|-----------|
| AI Core — Domain Agents | Claude Sonnet 4 (`claude-sonnet-4-20250514`) |
| AI Core — Red Team | Claude Opus 4 (`claude-opus-4-20250514`) |
| Frontend | React 18 · JSX · Vite |
| Backend | Deno · TypeScript |
| Visual Standard | USWDS palette · Source Sans 3 · Source Code Pro |
| Report Generation | Python 3 (`gen_reports.py`) · HTML/PDF |
| Data Layer | Entity-based JSON schema |
| Package Management | npm + Deno |

---

## 🚀 Getting Started


---

## 📊 Mineral Categories Supported

- **Precious Metals** — Gold, Silver: fire assay QA/QC, cut-off grade sensitivity, royalty burden
- **Battery & Critical Minerals** — Lithium, Nickel, Cobalt: grade continuity, brine vs hard rock, battery-grade spec
- **Base Metals** — Copper, Zinc, Lead: by-product credits, smelter terms, concentrate penalties
- **Bulk Commodities** — Iron Ore, Coal: strip ratio, logistics infrastructure, moisture penalty
- **Industrial Minerals** — Magnesium, Potash: processing route maturity, market demand validation

---

## 🚦 Traffic Light Scoring

| Score | Status | Verdict |
|-------|--------|---------|
| ≥60 | 🟢 Green | INVESTABLE |
| 50–59 | 🟡 Amber | CONDITIONAL |
| <50 | 🔴 Red | NO-GO |

---

## Document Trust Tiers

| Tier | Description |
|------|-------------|
| Tier 1 | NI 43-101 / JORC, QP-signed, independent firm |
| Tier 2 | Internal feasibility, named authors, company-signed |
| Tier 3 | PEA, preliminary scoping, incomplete authorship |
| Tier 4 | Investor presentations, vendor marketing documents |
| Tier 5 | Anonymous, undated, unverifiable source |

---

🏢 About
Mine Advisory Service by LCS is a product of Lightman Consultancy Services (LCS), the primary operating brand of the Lightman Trust Group (LTG) — a multi-jurisdictional sovereign enterprise structured under a Cook Islands Trust with supporting entities across Wyoming, South Dakota, Nevada, Delaware, Philippines, and Vietnam.
LCS advisory services encompass hard asset advisory, institutional mining due diligence, SBLC issuance advisory, and gem and jewellery services including diamond valuation.
**© 2026 Lightman Trust Group**  
*Mine Advisory Service by LCS v6.0 — Steven Wood, CEO & Founder, Lightman Trust Group*  
© 2026 Lightman Trust Group
Mine Advisory Service by LCS v6.0
Steven W. — Principal QP & CEO Founder, Lightman Trust Group
Lightman Consultancy Services (LCS) — Confidential · Institutional Use Only
