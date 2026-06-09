# Mine Advisory Service by LCS — v6.0
## Deployment Guide

---

## Option 1 — Vercel (Recommended — Easiest)

### Step 1: Connect GitHub to Vercel

1. Go to **https://vercel.com** on your phone browser
2. Sign up / log in with your GitHub account
3. Tap **Add New Project**
4. Select your repo: `lightmantrust/Mine-Advisory-Service-by-LCS`
5. Vercel auto-detects Vite — tap **Deploy**

### Step 2: Add Environment Variables in Vercel

1. In Vercel → your project → **Settings** → **Environment Variables**
2. Add these two variables:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-your-actual-key` |
| `VITE_ANTHROPIC_API_KEY` | `sk-ant-api03-your-actual-key` |

3. Set Environment to: **Production, Preview, Development**
4. Tap **Save**
5. Go to **Deployments** → tap **Redeploy**

### Step 3: Your app is live

Vercel gives you a URL like: `https://mine-advisory-service-by-lcs.vercel.app`

Every push to `main` branch automatically redeploys.

---

## Option 2 — Netlify (Alternative)

1. Go to **https://netlify.com** on your phone
2. Sign up / log in with GitHub
3. Tap **Add new site** → **Import an existing project**
4. Select GitHub → select your repo
5. Build settings are auto-detected from `netlify.toml`
6. Tap **Deploy site**
7. Go to **Site configuration** → **Environment variables**
8. Add `ANTHROPIC_API_KEY` with your key
9. Trigger a redeploy

---

## Option 3 — Local Development

```bash
# 1. Clone the repo
git clone https://github.com/lightmantrust/Mine-Advisory-Service-by-LCS
cd Mine-Advisory-Service-by-LCS

# 2. Create .env file
cp .env.example .env
# Edit .env — add your ANTHROPIC_API_KEY

# 3. Install dependencies
npm install

# 4. Start the app
npm run dev
# Opens at http://localhost:3000

# 5. Seed demo project data
npm run seed

# 6. Generate HTML reports
python3 gen_reports.py
```

---

## GitHub Secrets Required

For CI/CD (GitHub Actions) to work, add these in:
**GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value |
|-------------|-------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `VITE_ANTHROPIC_API_KEY` | Same key |
| `VERCEL_TOKEN` | From vercel.com → Account Settings → Tokens |
| `VERCEL_ORG_ID` | From vercel.json in your Vercel project settings |
| `VERCEL_PROJECT_ID` | From vercel.json in your Vercel project settings |

The first two are required. The Vercel secrets are only needed if you want automatic Vercel deploys from GitHub Actions.

---

## Architecture When Deployed

```
User Browser
     │
     ▼
Vercel CDN (serves React app)
     │
     ├── Static files: index.html, JS bundle, CSS
     │
     └── /api/analyse (serverless function)
              │
              ▼
         Anthropic API
         (Claude Sonnet 4 + Opus 4)
              │
              ▼
         JSON analysis result
              │
              ▼
         Back to browser → displayed in UI
```

The API key **never reaches the browser**. It stays in the Vercel serverless function on the server side.

---

## Verify Deployment Working

1. Open your deployed URL
2. Go to **Dashboard** tab
3. Scroll to **Submit New Project**
4. Fill in: Name = `Test Gold Project`, Commodity = `Au`, Location = `Nevada, USA`
5. Tap **Run 16-Agent Swarm Analysis**
6. Watch the pipeline animate through all 7 tiers
7. Result appears in **18-Section** tab

If the analysis runs and returns a score — deployment is 100% operational.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "ANTHROPIC_API_KEY not configured" | Add the env variable in Vercel/Netlify settings |
| Analysis fails silently | Check browser console (F12) for error details |
| Build fails | Check Node.js version is 18+ |
| CORS error in browser console | You're calling Anthropic directly — make sure `/api/analyse` route is working |
| 404 on page refresh | Check `vercel.json` rewrites or `netlify.toml` redirects are in place |

---

**Mine Advisory Service by LCS — v6.0**
*Lightman Consultancy Services (LCS) · Lightman Trust Group*
*Steven W. — Principal QP & CEO Founder*
