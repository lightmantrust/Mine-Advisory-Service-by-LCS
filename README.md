# Mine Advisory Service by LCS — v6.0

## Institutional Multi-Mineral Due Diligence Platform

The **Mine Advisory Service by LCS v6.0** is an institutional-grade mining asset analysis platform developed by **Lightman Consultancy Services (LCS)** within the **Lightman Trust Group** ecosystem. It simulates a complete **12-agent AI swarm** across 4 execution tiers to determine the real and economically defensible value of any mining project.

**AI Core:** Claude Sonnet 4 (domain agents) + Claude Opus 4 (Red Team validation)  
**Framework:** React/JSX · Deno backend · Carbon/IBM Design System  
**Reporting:** Automated branded HTML + PDF report generation  
**Data Layer:** Entity-based JSON schema — fully dynamic, no hardcoded data  

---

## 🛡️ 18-Section Institutional Framework

Every project is scored across 18 sections (1–100 risk scale, 1=perfect, 100=critical risk):

1. **Resource Estimation Integrity** — Drill density and QA/QC validation
2. **Drill Programme Quality** — Methodology and assay reliability
3. **Geological Continuity** — Grade and structural risk
4. **Mining Method Selection** — Feasibility of extraction assumptions
5. **Production Schedule Realism** — Throughput and ramp-up benchmarking
6. **Dilution & Recovery** — Mining and metallurgical loss realism
7. **Metallurgical Testwork** — Flowsheet and recovery completeness
8. **Processing Plant Design** — CAPEX/OPEX basis for beneficiation
9. **Environmental Baseline** — Permitting status and closure obligations
10. **Social Licence** — Community and stakeholder risk
11. **CAPEX Benchmarking** — Capital cost realism vs industry peers
12. **OPEX Benchmarking** — AISC validation and cost curve positioning
13. **Revenue & Metal Pricing** — Price deck assumption sensitivity
14. **NPV/IRR Sensitivity** — Economic model robustness
15. **Financing Structure** — Survivability through market cycles
16. **Jurisdiction & Regulatory** — Geopolitical and legal stability
17. **Team Credibility** — Experience and track record
18. **Exit Strategy** — Liquidity path and valuation milestones

---

## 🤖 16-Agent Swarm (12 AI + 4 Human) — 7-Tier Execution

### TIER -1 — PRE-PIPELINE GATE (Hard gate — nothing proceeds without clearance)
| Agent | Type | Role |
|-------|------|------|
| **Juan Gonzalez** | 👤 Human | Intake Officer — KYC/AML compliance, sanctions screening, counterparty verification, deal authentication. FAIL = pipeline blocked entirely. |

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
| **Mike Donovan, CFA Financial** | 🤖 AI | NPV/IRR, price deck, financing | 11–15 |

### TIER 2 — CROSS-DOMAIN INTELLIGENCE (Parallel execution — 3 AI + 1 Human simultaneously)
| Agent | Type | Role |
|-------|------|------|
| **Marcus Sterling** | 🤖 AI | Quantitative Strategist — sensitivity, stress-testing, break-even analysis |
| **VEGA** | 🤖 AI | Comparables, peer benchmarking, market intelligence, precedent transactions |
| **JURA** | 🤖 AI | Jurisdictional analysis — mining law, royalties, tax, political risk |
| **Francis Nault** | 👤 Human | Nitro Commodities — live commodity pricing via Nitro platform, offtake assessment, market access risk |

### TIER 3 — VALIDATION LAYER (Sequential — DELTA → PHANTOM → Sir Juan Miami)
| Agent | Type | Role |
|-------|------|------|
| **DELTA** | 🤖 AI | Data integrity — QA/QC audit, assay validation, statistical integrity, database audit |
| **PHANTOM** | 🤖 AI | Anti-fraud — seller bias detection, GMV misrepresentation, deception flags, linguistic bias |
| **Sir Juan Miami, Chief Validation Officer** | 🤖 AI | Cross-domain Red Team — logic gaps, assumption chains, final audit **(Claude Opus 4)** |

### TIER 4 — SYNTHESIS & DELIVERY
| Agent | Type | Role |
|-------|------|------|
| **APEX** | 🤖 AI | Score computation, ripple chain analysis, buy signal calculation, HTML/PDF report generation |

### TIER 5 — PRINCIPAL SIGN-OFF (Final authority — report release gate)
| Agent | Type | Role |
|-------|------|------|
| **Steven W.** | 👤 Human | Principal QP · Mines & Diamonds · NI 43-101/JORC · PFS/PEA — reviews APEX output, exercises QP authority, issues final institutional sign-off. Diamond projects receive specialist override review. No report released without Steven W. approval. |
---

## 🏗️ Architecture

```
incoming_files/ → ARIA → SIGMA → [Parallel QP] → [Cross-Domain] → [Validation] → APEX → lcs_reports/
```

- **Frontend:** React (JSX) with Carbon/IBM Design System tokens
- **Backend:** Deno-based functions — TypeScript
- **AI Core:** Anthropic Claude API (`@anthropic-ai/sdk`) — Sonnet 4 + Opus 4
- **Scoring:** Computed from entity schema — no hardcoded data
- **Reporting:** Dynamic HTML + PDF via `gen_reports.py` and `generateReport.ts`

---

## 📁 Repository Structure

```
MineAdvisoryService-by-LCS/
├── .agents/              ← Agent system prompts + orchestrator config
├── entities/             ← JSON entity schema definitions
├── functions/            ← Deno TypeScript backend functions
├── incoming_files/       ← Client document drop zone
├── lcs_reports/          ← Generated report output
├── mining_docs/          ← Source project documents
├── src/
│   ├── components/       ← Shared UI components
│   └── pages/            ← React page views
├── gen_reports.py        ← Entity-driven report generator
├── deno.json
└── package.json
```

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

**© 2026 Lightman Trust Group**  
*Mine Advisory Service by LCS v6.0 — Steven Wood, CEO & Founder, Lightman Trust Group*  
*Confidential — Institutional Use Only*
