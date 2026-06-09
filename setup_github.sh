#!/bin/bash
# Mine Advisory Service by LCS — v6.0
# setup_github.sh — GitHub Repository Setup & Push
# Run: chmod +x setup_github.sh && ./setup_github.sh
# Requires: gh CLI authenticated (gh auth login)

set -e

REPO_NAME="Mine-Advisory-Service-by-LCS"
GITHUB_USERNAME="lightmantrust"
INITIAL_BRANCH="main"
VERSION_TAG="v6.0.0"
REPO_DESC="Mine Advisory Service by LCS v6.0 — 16-Agent Swarm | Claude Sonnet 4 + Opus 4 | Lightman Trust Group"

TEAL='\033[0;36m'; GREEN='\033[0;32m'; AMBER='\033[0;33m'; RED='\033[0;31m'; BOLD='\033[1m'; RESET='\033[0m'
ok()  { echo -e "${GREEN}✓${RESET} $1"; }
warn(){ echo -e "${AMBER}⚠${RESET}  $1"; }
err() { echo -e "${RED}✗${RESET}  $1"; }
hdr() { echo -e "\n${TEAL}${BOLD}══ $1 ══${RESET}"; }

hdr "Mine Advisory Service by LCS v6.0 — GitHub Setup"
echo -e "  Repo: ${BOLD}${GITHUB_USERNAME}/${REPO_NAME}${RESET} · Tag: ${BOLD}${VERSION_TAG}${RESET}"

command -v gh  &>/dev/null || { err "GitHub CLI not found: https://cli.github.com"; exit 1; }
command -v git &>/dev/null || { err "git not found"; exit 1; }
gh auth status &>/dev/null || { err "Run: gh auth login"; exit 1; }
ok "Pre-flight checks passed"

hdr "Security Check"
if [ -f ".env" ] && ! grep -q "^\.env$" .gitignore 2>/dev/null; then
  err ".env is NOT in .gitignore — aborting to protect API key"; exit 1
fi
ok "API key files are gitignored"

hdr "Git Init"
[ ! -d ".git" ] && git init --initial-branch=${INITIAL_BRANCH} && ok "Git initialised"
git config user.name  "${GITHUB_USERNAME}"
git config user.email "${GITHUB_USERNAME}@users.noreply.github.com"
chmod +x setup_github.sh

hdr "Staging & Commit"
git add .
STAGED=$(git diff --cached --name-only | wc -l | tr -d ' ')
ok "Staged ${STAGED} files"
git commit -m "feat: Mine Advisory Service by LCS v6.0 — Complete production build

16-Agent Swarm: 12 AI (Claude Sonnet 4 + Opus 4) + 4 Human (LCS)
7-Tier pipeline: KYC Gate → Intake → QP Domain → Cross-Domain → Validation → Synthesis → Sign-Off
CORS proxy via Vercel/Netlify serverless | Smart API routing | Entity-schema reporting
Co-authored-by: Claude (Anthropic) <noreply@anthropic.com>"
ok "Commit created"

hdr "GitHub Repository"
if gh repo view "${GITHUB_USERNAME}/${REPO_NAME}" &>/dev/null; then
  warn "Repo exists — pushing to existing"
  git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git" 2>/dev/null || \
    git remote set-url origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
else
  gh repo create "${GITHUB_USERNAME}/${REPO_NAME}" --description "${REPO_DESC}" --public --source=. --remote=origin --push=false
  ok "Repository created"
fi

hdr "Push"
git push -u origin ${INITIAL_BRANCH} --force-with-lease 2>/dev/null || git push -u origin ${INITIAL_BRANCH}
ok "Pushed to https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"

hdr "Tag ${VERSION_TAG}"
git tag -d "${VERSION_TAG}" 2>/dev/null || true
git tag -a "${VERSION_TAG}" -m "Mine Advisory Service by LCS ${VERSION_TAG} — Complete production build"
git push origin "${VERSION_TAG}" --force
ok "Tagged ${VERSION_TAG}"

hdr "GitHub Release"
gh release delete "${VERSION_TAG}" --yes 2>/dev/null || true
gh release create "${VERSION_TAG}" \
  --title "Mine Advisory Service by LCS ${VERSION_TAG}" \
  --notes "Complete production rebuild. 16-Agent Swarm. Claude Sonnet 4 + Opus 4. See QUICKSTART.md to get started."
ok "Release published"

hdr "Branch Structure"
git checkout -b develop 2>/dev/null || true
git push -u origin develop 2>/dev/null || true
git checkout ${INITIAL_BRANCH}
ok "Branches: main + develop"

echo ""
echo -e "${TEAL}${BOLD}══════════════════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}  v6.0.0 DEPLOYED SUCCESSFULLY${RESET}"
echo -e "${TEAL}${BOLD}══════════════════════════════════════════${RESET}"
echo ""
echo "  Repository: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo "  Release:    https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/releases/tag/${VERSION_TAG}"
echo ""
echo "  Next: node test-connection.js"
echo "        npm install && npm run dev:full"
echo "        Connect repo to Vercel for live deployment"
echo ""
