#!/usr/bin/env bash
# =============================================================
# SurgiMart — Run All Tests
# Runs every test type in order. Exits 1 if any test fails.
# =============================================================
# Usage:
#   chmod +x run-all-tests.sh
#   ./run-all-tests.sh
# =============================================================

BASE="${BASE_URL:-http://localhost:3000}"
FAILED_SUITES=()

G='\033[0;32m'; R='\033[0;31m'; Y='\033[1;33m'
B='\033[0;34m'; C='\033[0;36m'; NC='\033[0m'

section() { echo -e "\n${B}══════════════════════════════════════════════${NC}"; echo -e "${C}  $1${NC}"; echo -e "${B}══════════════════════════════════════════════${NC}"; }
pass()    { echo -e "${G}  ✓ $1 passed${NC}"; }
fail()    { echo -e "${R}  ✗ $1 FAILED${NC}"; FAILED_SUITES+=("$1"); }

# ── wait for app ──────────────────────────────────────────────
section "Waiting for app at $BASE"
for i in $(seq 1 30); do
  curl -s "$BASE/api/health" > /dev/null 2>&1 && break
  echo -n "."
  sleep 1
done
echo ""
curl -s "$BASE/api/health" > /dev/null 2>&1 || { echo -e "${R}App not running at $BASE. Start with: make docker-dev${NC}"; exit 1; }
echo -e "${G}  App is up.${NC}"

# =============================================================
# 1 — TypeScript check
# =============================================================
section "1 · TypeScript (npx tsc --noEmit)"
if npx tsc --noEmit 2>&1; then
  pass "TypeScript"
else
  fail "TypeScript"
fi

# =============================================================
# 2 — ESLint
# =============================================================
section "2 · ESLint (npx eslint src)"
if npx eslint "src/**/*.{ts,tsx}" --max-warnings 0 2>&1; then
  pass "ESLint"
else
  fail "ESLint"
fi

# =============================================================
# 3 — Unit + Component tests
# =============================================================
section "3 · Unit + Component tests (npm test)"
if npm test -- --watchAll=false --passWithNoTests 2>&1; then
  pass "Unit tests"
else
  fail "Unit tests"
fi

# =============================================================
# 4 — Coverage check
# =============================================================
section "4 · Coverage (lines ≥ 80%)"
COVERAGE_OUT=$(npm test -- --coverage --watchAll=false --coverageReporters=text-summary 2>&1)
echo "$COVERAGE_OUT" | tail -20
LINES=$(echo "$COVERAGE_OUT" | grep -oP 'Lines\s+:\s+\K[\d.]+' | head -1)
if [[ -n "$LINES" ]] && awk "BEGIN{exit !($LINES >= 80)}"; then
  pass "Coverage (${LINES}% lines)"
else
  fail "Coverage (${LINES:-unknown}% lines — need ≥80%)"
fi

# =============================================================
# 5 — Build check
# =============================================================
section "5 · Production build (npm run build)"
if npm run build 2>&1; then
  pass "Build"
else
  fail "Build"
fi

# =============================================================
# 6 — npm audit
# =============================================================
section "6 · Security audit (npm audit --audit-level=high)"
if npm audit --audit-level=high 2>&1; then
  pass "npm audit"
else
  fail "npm audit — high/critical vulnerabilities found"
fi

# =============================================================
# 7 — Code quality checks
# =============================================================
section "7 · Code quality (no any / no console.log / no @ts-ignore)"

ANY_COUNT=$(grep -rn "\bany\b" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "//.*any" | wc -l)
if [[ $ANY_COUNT -eq 0 ]]; then
  pass "No 'any' types in src/"
else
  echo -e "${R}  ✗ Found $ANY_COUNT 'any' usage(s):${NC}"
  grep -rn "\bany\b" src/ --include="*.ts" --include="*.tsx" | grep -v "//.*any" | head -10
  FAILED_SUITES+=("any types ($ANY_COUNT found)")
fi

LOG_COUNT=$(grep -rn "console\.log" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
[[ $LOG_COUNT -eq 0 ]] && pass "No console.log in src/" || { echo -e "${R}  ✗ Found $LOG_COUNT console.log(s)${NC}"; FAILED_SUITES+=("console.log ($LOG_COUNT found)"); }

TS_IGNORE=$(grep -rn "@ts-ignore" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
[[ $TS_IGNORE -eq 0 ]] && pass "No @ts-ignore in src/" || { echo -e "${R}  ✗ Found $TS_IGNORE @ts-ignore(s)${NC}"; FAILED_SUITES+=("@ts-ignore ($TS_IGNORE found)"); }

# =============================================================
# 8 — Curl API tests
# =============================================================
section "8 · API curl tests (all routes + security)"
if bash "$(dirname "$0")/api-curl-tests.sh" --base "$BASE" 2>&1; then
  pass "Curl API tests"
else
  fail "Curl API tests"
fi

# =============================================================
# 9 — Load tests
# =============================================================
section "9 · Load + performance tests"
if bash "$(dirname "$0")/load-tests.sh" --base "$BASE" 2>&1; then
  pass "Load tests"
else
  fail "Load tests"
fi

# =============================================================
# 10 — Playwright E2E
# =============================================================
section "10 · Playwright E2E tests"
if npx playwright test 2>&1; then
  pass "Playwright E2E"
else
  fail "Playwright E2E"
  echo -e "${Y}  Run: npx playwright show-report${NC}"
fi

# =============================================================
# FINAL SUMMARY
# =============================================================
echo ""
echo -e "${B}══════════════════════════════════════════════════════${NC}"
echo -e "${C}  FINAL RESULTS${NC}"
echo -e "${B}══════════════════════════════════════════════════════${NC}"

if [[ ${#FAILED_SUITES[@]} -eq 0 ]]; then
  echo -e "${G}  All test suites passed. SurgiMart is clean.${NC}"
  exit 0
else
  echo -e "${R}  ${#FAILED_SUITES[@]} suite(s) failed:${NC}"
  for s in "${FAILED_SUITES[@]}"; do
    echo -e "    ${R}✗${NC} $s"
  done
  exit 1
fi
