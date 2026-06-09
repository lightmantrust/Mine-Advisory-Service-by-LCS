# Mine Advisory Service by LCS — v6.0
## Quick Start Guide — Up in 5 Minutes

---

## What You Need First

| Requirement | How to Get It |
|---|---|
| Node.js 18+ | https://nodejs.org |
| Deno | https://deno.com (optional — for backend functions) |
| Anthropic API Key | https://console.anthropic.com |
| Python 3 | https://python.org (optional — for HTML reports) |

---

## Step 1 — Get Your API Key

1. Go to **https://console.anthropic.com**
2. Sign in → **API Keys** → **Create Key**
3. Name it: `LCS Mine Advisory Service`
4. **Copy it immediately** — shown once only

---

## Step 2 — Set Up the Project

```bash
# Clone or download the repo
git clone https://github.com/lightmantrust/Mine-Advisory-Service-by-LCS
cd Mine-Advisory-Service-by-LCS

# Create your environment file
cp .env.example .env
```

Open `.env` and replace both lines that say `sk-ant-api03-PASTE-YOUR-KEY-HERE` with your real key:
```
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
VITE_ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

---

## Step 3 — Verify Connection

```bash
node test-connection.js
```

Expected output:
```
✓  API key found: sk-ant-api03-...
✓  Claude response: "LCS Mine Advisory Service v6.0 connection verified."
CONNECTION VERIFIED — READY TO RUN
```

---

## Step 4 — Install & Run

**Option A — Vercel Deploy (easiest, no terminal needed)**
See DEPLOYMENT.md → Option 1

**Option B — Local Development**

Open two terminal windows:

**Terminal 1 — Backend API server:**
```bash
npm run server
# Deno server starts on http://localhost:8000
```

**Terminal 2 — Frontend:**
```bash
npm install
npm run dev
# React app opens at http://localhost:3000
```

**Or run both together:**
```bash
npm install
npm run dev:full
```

---

## Step 5 — Load Demo Data & Test

```bash
# In a third terminal — seed demo projects
npm run seed

# Generate HTML reports for the demo projects
python3 gen_reports.py
```

---

## Step 6 — Run Your First Analysis

1. Open **http://localhost:3000**
2. Tap **Dashboard** tab
3. Fill in the **Submit New Project** form:
   - Project Name: `Atacama Lithium Test`
   - Commodity: `Li`
   - Location: `Chile`
   - Study Stage: `PFS`
   - Documents: `NI 43-101 Technical Report, PEA`
4. Tap **▶ RUN 16-AGENT SWARM ANALYSIS**
5. Watch the pipeline animate through all 7 tiers
6. Result appears in the **18-Section** tab

---

## What Each Script Does

| Command | What It Does |
|---|---|
| `npm run dev` | Start React frontend (port 3000) |
| `npm run server` | Start Deno API proxy server (port 8000) |
| `npm run dev:full` | Start both frontend and server together |
| `npm run seed` | Load 3 demo projects into lcs_reports/ |
| `npm run report` | Generate HTML reports from lcs_reports/ data |
| `npm run analyse` | Run full pipeline on a project via Deno |
| `npm run build` | Build for production deployment |
| `node test-connection.js` | Verify API key is working |

---

## Folder Structure — What Goes Where

| Folder | Purpose |
|---|---|
| `incoming_files/` | Drop client PDF documents here for ingestion |
| `lcs_reports/` | Generated analysis results and HTML reports |
| `mining_docs/` | Reference project documents |
| `agents/` | All 16 agent system prompts |
| `functions/` | Deno TypeScript backend logic |
| `src/` | React frontend source |
| `api/` | Vercel serverless functions |

---

## The 16-Agent Pipeline

```
Juan Gonzalez (KYC Gate)
    ↓
ARIA → SIGMA (Intake)
    ↓
Dr. Chen + Okafor + Marsh + Kyle Jackson + Rivera + Donovan (QP Domain — parallel)
    ↓
Sterling + VEGA + JURA + Francis Nault (Cross-Domain — parallel)
    ↓
DELTA → PHANTOM → Sir Juan Miami (Validation — sequential, Opus 4 Red Team)
    ↓
APEX (Synthesis)
    ↓
Steven W. (Principal QP Sign-Off)
```

---

**Mine Advisory Service by LCS — v6.0**
*Lightman Consultancy Services (LCS) · Lightman Trust Group*
*Steven W. — Principal QP & CEO Founder*
