#!/bin/bash
# ══════════════════════════════════════════════════════════════════════════════
# Mine Advisory Service by LCS — v6.0
# setup_github.sh — Automated GitHub Repository Setup & Push
#
# PREREQUISITES:
#   1. GitHub CLI installed: https://cli.github.com
#      macOS:   brew install gh
#      Windows: winget install --id GitHub.cli
#      Linux:   see https://cli.github.com/manual/installation
#
#   2. Authenticated:
#      gh auth login
#
#   3. Run this script from the root of the project folder:
#      chmod +x setup_github.sh
#      ./setup_github.sh
#
# Lightman Consultancy Services (LCS) / Lightman Trust Group
# Steven Wood — CEO & Founder
# ══════════════════════════════════════════════════════════════════════════════

set -e  # Exit on any error

# ─── CONFIG ──────────────────────────────────────────────────────────────────

REPO_NAME="MineAdvisoryService-by-LCS"
REPO_DESCRIPTION="Mine Advisory Service by LCS v6.0 — Institutional Mining Due Diligence Platform | 12-Agent Claude AI Swarm | 18-Section QP Framework | Lightman Trust Group"
GITHUB_USERNAME="lightmantrust"   # ← Your GitHub username
INITIAL_BRANCH="main"
VERSION_TAG="v6.0.0"
TAG_MESSAGE="Mine Advisory Service by LCS v6.0 — Full rebuild. Claude API (Sonnet 4 + Opus 4). 12-agent swarm. 18-section institutional framework. Entity-schema-driven reporting. No OpenAI. No Google Jules."

# ─── COLOURS ─────────────────────────────────────────────────────────────────

TEAL='\033[0;36m'
GREEN='\033[0;32m'
AMBER='\033[0;33m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

print_header() { echo -e "\n${TEAL}${BOLD}══ $1 ══${RESET}"; }
print_ok()     { echo -e "${GREEN}✓${RESET} $1"; }
print_warn()   { echo -e "${AMBER}⚠${RESET} $1"; }
print_err()    { echo -e "${RED}✗${RESET} $1"; }

# ─── PRE-FLIGHT CHECKS ───────────────────────────────────────────────────────

print_header "Mine Advisory Service by LCS — v6.0 GitHub Setup"
echo -e "Repository: ${BOLD}${GITHUB_USERNAME}/${REPO_NAME}${RESET}"
echo -e "Version tag: ${BOLD}${VERSION_TAG}${RESET}"
echo ""

# Check gh CLI
if ! command -v gh &> /dev/null; then
    print_err "GitHub CLI (gh) not found."
    echo "  Install: https://cli.github.com"
    echo "  macOS:   brew install gh"
    echo "  Then:    gh auth login"
    exit 1
fi
print_ok "GitHub CLI found: $(gh --version | head -1)"

# Check git
if ! command -v git &> /dev/null; then
    print_err "git not found. Please install git."
    exit 1
fi
print_ok "git found: $(git --version)"

# Check auth
if ! gh auth status &> /dev/null; then
    print_err "GitHub CLI not authenticated."
    echo "  Run: gh auth login"
    exit 1
fi
print_ok "GitHub CLI authenticated as: $(gh api user --jq .login)"

# ─── GIT INIT ────────────────────────────────────────────────────────────────

print_header "Initialising Git Repository"

if [ ! -d ".git" ]; then
    git init --initial-branch=${INITIAL_BRANCH}
    print_ok "Git repository initialised (branch: ${INITIAL_BRANCH})"
else
    print_warn ".git already exists — skipping init"
    # Ensure we're on main
    git checkout -B ${INITIAL_BRANCH} 2>/dev/null || true
fi

# Git config (use GitHub username for commits)
git config user.name "${GITHUB_USERNAME}"
git config user.email "${GITHUB_USERNAME}@users.noreply.github.com"
print_ok "Git config set"

# ─── STAGE ALL FILES ─────────────────────────────────────────────────────────

print_header "Staging Files"

git add .
STAGED=$(git diff --cached --name-only | wc -l | tr -d ' ')
print_ok "Staged ${STAGED} files"

# Show what's being committed
echo ""
git diff --cached --name-only | head -40
if [ "$STAGED" -gt 40 ]; then
    echo "  ... and $((STAGED - 40)) more files"
fi

# ─── INITIAL COMMIT ──────────────────────────────────────────────────────────

print_header "Creating Initial Commit"

git commit -m "feat: Mine Advisory Service by LCS v6.0 — Complete rebuild

BREAKING CHANGE: Full rebuild from scratch. Abandoned OpenAI + Google Jules.

AI Core:
- Claude Sonnet 4 (claude-sonnet-4-20250514) — all domain agents
- Claude Opus 4 (claude-opus-4-20250514) — Sir Juan Miami Red Team only
- Zero OpenAI dependencies

12-Agent Swarm Architecture:
- Tier 0: ARIA (ingestion) + SIGMA (gap mapping)
- Tier 1: Dr. Sarah Chen + James Okafor + Linda Marsh + Tom Rivera + Mike Donovan
- Tier 2: Marcus Sterling + VEGA + JURA
- Tier 3: DELTA + PHANTOM + Sir Juan Miami (Opus 4)
- Tier 4: APEX synthesis

18-Section Institutional Framework — all sections weighted and computable
Entity-schema-driven reporting — no hardcoded project data
Dynamic gen_reports.py — reads from AnalysisResult JSON entity
Full React frontend — 7 pages with LCS visual standard

Visual Standard: bg:#0b1829 accent:#02bfe7 Source Sans 3 + Source Code Pro
Branding: Mine Advisory Service by LCS — Steven Wood, CEO, Lightman Trust Group

Co-authored-by: Claude (Anthropic) <noreply@anthropic.com>"

print_ok "Initial commit created"

# ─── CREATE GITHUB REPO ──────────────────────────────────────────────────────

print_header "Creating GitHub Repository"

# Check if repo already exists
if gh repo view "${GITHUB_USERNAME}/${REPO_NAME}" &> /dev/null; then
    print_warn "Repository ${GITHUB_USERNAME}/${REPO_NAME} already exists"
    echo "  Pushing to existing repository..."
    git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git" 2>/dev/null || \
        git remote set-url origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
else
    gh repo create "${GITHUB_USERNAME}/${REPO_NAME}" \
        --description "${REPO_DESCRIPTION}" \
        --public \
        --source=. \
        --remote=origin \
        --push=false
    print_ok "Repository created: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
fi

# ─── PUSH ────────────────────────────────────────────────────────────────────

print_header "Pushing to GitHub"

git push -u origin ${INITIAL_BRANCH}
print_ok "Pushed to: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/tree/${INITIAL_BRANCH}"

# ─── TAG v6.0.0 ──────────────────────────────────────────────────────────────

print_header "Tagging ${VERSION_TAG}"

git tag -a "${VERSION_TAG}" -m "${TAG_MESSAGE}"
git push origin "${VERSION_TAG}"
print_ok "Tagged ${VERSION_TAG} and pushed"

# ─── CREATE GITHUB RELEASE ───────────────────────────────────────────────────

print_header "Creating GitHub Release"

gh release create "${VERSION_TAG}" \
    --title "Mine Advisory Service by LCS ${VERSION_TAG}" \
    --notes "## Mine Advisory Service by LCS ${VERSION_TAG}

### Complete Rebuild — Claude API Only

This release represents a full rebuild of the LCS Mine Advisory Engine under a new repository and name.

**What changed:**
- Renamed: LCS Mine Advisory Engine → Mine Advisory Service by LCS
- AI Core: OpenAI → Anthropic Claude API (Sonnet 4 + Opus 4)
- Build tool: Abandoned Google Jules AI
- Agent count: 5 QP agents → 12-agent swarm across 4 tiers
- Data layer: Hardcoded Python dict → Entity-schema-driven
- Sections: 18-section computed scoring (not manual entry)

**12-Agent Swarm:**
| Tier | Agents |
|------|--------|
| 0 — Intake | ARIA, SIGMA |
| 1 — QP Domain | Dr. Sarah Chen, James Okafor, Linda Marsh, Tom Rivera, Mike Donovan |
| 2 — Cross-Domain | Marcus Sterling, VEGA, JURA |
| 3 — Validation | DELTA, PHANTOM, Sir Juan Miami (Opus 4) |
| 4 — Synthesis | APEX |

**Visual Standard:** bg:#0b1829 · accent:#02bfe7 · Source Sans 3 + Source Code Pro

**Platform:** Mine Advisory Service by LCS — Lightman Consultancy Services (LCS), Lightman Trust Group  
**Author:** Steven Wood — CEO & Founder, Lightman Trust Group"

print_ok "GitHub Release created: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/releases/tag/${VERSION_TAG}"

# ─── SETUP DEVELOP BRANCH ────────────────────────────────────────────────────

print_header "Setting Up Branch Structure"

git checkout -b develop
git push -u origin develop
git checkout ${INITIAL_BRANCH}
print_ok "Branch 'develop' created and pushed"
print_ok "Branch structure: main (stable releases) + develop (active development)"

# ─── DONE ────────────────────────────────────────────────────────────────────

echo ""
echo -e "${TEAL}${BOLD}══════════════════════════════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}  Mine Advisory Service by LCS — v6.0 DEPLOYED${RESET}"
echo -e "${TEAL}${BOLD}══════════════════════════════════════════════════════${RESET}"
echo ""
echo -e "  ${BOLD}Repository:${RESET} https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo -e "  ${BOLD}Release:${RESET}    https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/releases/tag/${VERSION_TAG}"
echo -e "  ${BOLD}Branches:${RESET}   main (stable) · develop (active)"
echo ""
echo -e "  ${BOLD}Next steps:${RESET}"
echo -e "  1. Set ANTHROPIC_API_KEY in your environment:"
echo -e "     export ANTHROPIC_API_KEY=sk-ant-..."
echo -e "  2. Install dependencies:  npm install"
echo -e "  3. Run frontend:          npm run dev"
echo -e "  4. Run analysis:          npm run analyse"
echo -e "  5. Generate reports:      python3 gen_reports.py"
echo ""
echo -e "  ${TEAL}Mine Advisory Service by LCS — Lightman Trust Group${RESET}"
echo -e "  ${TEAL}Steven Wood — CEO & Founder${RESET}"
echo ""
