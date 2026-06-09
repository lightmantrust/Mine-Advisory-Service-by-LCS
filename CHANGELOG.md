# Changelog — Mine Advisory Service by LCS

All notable changes to this project documented here.

---

## [6.0.0] — 2026-06-09

### Complete Rebuild — Claude API Only

**Breaking Changes:**
- Full rebuild from scratch. Previous versions (v5.x) abandoned.
- AI core migrated from OpenAI GPT-4o → Anthropic Claude API
- Google Jules AI build workflow removed
- Repository renamed: `LCS-Mine-Advisory-Engine` → `Mine-Advisory-Service-by-LCS`

**New — 16-Agent Swarm Architecture:**

| Tier | New Agents Added |
|------|-----------------|
| T-1 | Juan Gonzalez (Human) — KYC/AML Pre-Pipeline Gate |
| T0  | ARIA, SIGMA |
| T1  | Dr. Sarah Chen, James Okafor, Linda Marsh, **Kyle Jackson (Human)**, Tom Rivera, Mike Donovan |
| T2  | Marcus Sterling, VEGA, JURA, **Francis Nault (Human)** |
| T3  | DELTA, PHANTOM, Sir Juan Miami (Opus 4) |
| T4  | APEX |
| T5  | **Steven W. (Human)** — Principal QP Sign-Off |

**New — Backend & Deployment:**
- `api/analyse.js` — Vercel serverless function (CORS proxy)
- `netlify/functions/analyse.js` — Netlify alternative
- `functions/server.ts` — Local Deno development server
- `vercel.json` — Vercel deployment configuration
- `netlify.toml` — Netlify deployment configuration
- `src/utils/apiClient.js` — Smart API client (dev/Vercel/Netlify routing)
- `src/utils/systemPrompt.js` — Full 16-agent system prompt as module

**New — Frontend:**
- `src/App.jsx` — Full production UI (1,580 lines, 8 views)
- `src/components/ErrorBoundary.jsx` — React error boundary
- `src/styles/global.css` — Global CSS reset and base styles
- Smart API endpoint routing — works in all environments without CORS

**New — Data & Reporting:**
- `functions/runQPSwarm.ts` — True parallel Tier 1+2 execution via Promise.all()
- `functions/validateResults.ts` — Tier 3 sequential validation pipeline
- `functions/seedProjects.ts` — Full demo project data seeder
- `gen_reports.py` — Rebuilt as entity-schema-driven (no hardcoded data)

**New — Developer Experience:**
- `test-connection.js` — API connection verification script
- `QUICKSTART.md` — 5-minute setup guide
- `DEPLOYMENT.md` — Vercel/Netlify/local deployment guide
- `CHANGELOG.md` — This file
- `.github/workflows/build.yml` — CI/CD pipeline

**Agents — AI Models:**
- All domain agents: `claude-sonnet-4-20250514`
- Sir Juan Miami (Red Team only): `claude-opus-4-20250514`

---

## [5.6.0] — 2026-05-25 (Abandoned)

**Note:** v5.6 was the last release of the old `LCS-Mine-Advisory-Engine` repository.
Built with Google Jules AI + OpenAI GPT-4o. Abandoned due to:
- Persistent conflicts between Google Jules AI commits and manual development
- OpenAI API dependency creating architectural constraints
- Flat file structure requiring complete reorganisation

v5.6 features carried forward into v6.0:
- 18-section framework (all sections)
- Carbon/IBM Design System aesthetic (replaced with LCS USWDS standard)
- Sir Juan Miami and Marcus Sterling agent concepts
- 7 demo project data payloads

---

## [5.1.0] — 2026-05-15

- Multi-mineral engine (Li/Ni/Co, Cu/Zn, Fe/Coal, Au/Ag)
- 18-section framework introduced
- Ripple Effect Risk Modelling
- Document Trust Classification Tier 1–5
- Carbon/IBM Design System UI
- CEO sign-off footer

---

**Mine Advisory Service by LCS**
*Lightman Consultancy Services (LCS) · Lightman Trust Group*
*Steven W. — Principal QP & CEO Founder*
