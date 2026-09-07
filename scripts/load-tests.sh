#!/usr/bin/env bash
# =============================================================
# SurgiMart — Load & Performance Tests
# =============================================================
# Usage: chmod +x load-tests.sh && ./load-tests.sh
# =============================================================

BASE="${2:-http://localhost:3000}"
PASS=0; FAIL=0

G='\033[0;32m'; R='\033[0;31m'; Y='\033[1;33m'
B='\033[0;34m'; C='\033[0;36m'; NC='\033[0m'

ok()   { echo -e "  ${G}✓${NC} $1"; ((PASS++)); }
fail() { echo -e "  ${R}✗${NC} $1 — expected $2, got $3"; ((FAIL++)); }
hdr()  { echo -e "\n${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n${C}  $1${NC}\n${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

# ── response time helper ──────────────────────────────────────
check_time() {
  local label="$1" limit_ms="$2" url="$3"
  local t; t=$(curl -s -o /dev/null -w "%{time_total}" "$url")
  local ms; ms=$(python3 -c "print(int($t * 1000))")
  if [[ $ms -le $limit_ms ]]; then
    ok "$label — ${ms}ms (≤ ${limit_ms}ms)"
  else
    fail "$label" "≤${limit_ms}ms" "${ms}ms"
  fi
}

# ── concurrent requests ──────────────────────────────────────
concurrent_all_200() {
  local label="$1" n="$2" url="$3"
  local tmp; tmp=$(mktemp -d)
  for i in $(seq 1 "$n"); do
    curl -s -o /dev/null -w "%{http_code}" "$url" > "$tmp/r$i" &
  done
  wait
  local bad=0
  for i in $(seq 1 "$n"); do
    [[ "$(cat "$tmp/r$i")" != "200" ]] && ((bad++))
  done
  rm -rf "$tmp"
  [[ $bad -eq 0 ]] && ok "$label — $n requests, all 200" || fail "$label" "all 200" "$bad failures out of $n"
}

# =============================================================
# 1 — RESPONSE TIMES
# =============================================================
hdr "1 · Response time thresholds"
check_time  "GET /api/health"                      200   "$BASE/api/health"
check_time  "GET / (homepage)"                    3000   "$BASE/"
check_time  "GET /shop"                           3000   "$BASE/shop"
check_time  "GET /api/orders (seed order)"         800   "$BASE/api/orders?orderNumber=SM-TEST0001&email=buyer@test.com"
check_time  "GET /faq"                            2000   "$BASE/faq"
check_time  "GET /contact"                        2000   "$BASE/contact"

# =============================================================
# 2 — CONCURRENT LOAD
# =============================================================
hdr "2 · Concurrent load"
concurrent_all_200 "20 simultaneous GET /"         20   "$BASE/"
concurrent_all_200 "50 simultaneous GET /api/health" 50 "$BASE/api/health"
concurrent_all_200 "10 simultaneous GET /shop"     10   "$BASE/shop"

# =============================================================
# 3 — IDEMPOTENCY
# =============================================================
hdr "3 · Idempotency — same input same output"

R1=$(curl -s "$BASE/api/health")
R2=$(curl -s "$BASE/api/health")
[[ "$R1" == "$R2" ]] && ok "Health endpoint is idempotent" || fail "Health endpoint idempotent" "same response" "different"

R1=$(curl -s "$BASE/api/orders?orderNumber=SM-TEST0001&email=buyer@test.com")
R2=$(curl -s "$BASE/api/orders?orderNumber=SM-TEST0001&email=buyer@test.com")
[[ "$R1" == "$R2" ]] && ok "Order lookup is idempotent" || fail "Order lookup idempotent" "same response" "different"

# =============================================================
# 4 — LARGE PAYLOAD HANDLING
# =============================================================
hdr "4 · Large payload rejection"
big=$(python3 -c "print('{\"email\":\"x@y.com\",\"junk\":\"' + 'a'*1100000 + '\"}')")
code=$(echo "$big" | curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" -H "Origin: $BASE" --data-binary @- "$BASE/api/newsletter")
[[ "$code" == "400" || "$code" == "413" ]] && ok "1MB+ body → 400 or 413 (got $code)" || fail "1MB+ body rejected" "400 or 413" "$code"

# =============================================================
# 5 — RATE LIMIT RECOVERY (after window)
# =============================================================
hdr "5 · Rate limit recovery"
echo "  Triggering rate limit, then waiting 65s for window reset..."
for i in $(seq 1 20); do
  curl -s -o /dev/null -X POST -H "Content-Type: application/json" \
    -H "Origin: $BASE" -d "{\"email\":\"rl$i@t.com\"}" "$BASE/api/newsletter" &
done
wait
echo "  Waiting 65 seconds for rate limit window to expire..."
sleep 65
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" -H "Origin: $BASE" \
  -d '{"email":"recovery@test.com"}' "$BASE/api/newsletter")
[[ "$code" == "200" || "$code" == "201" ]] && ok "Rate limit allows requests after window reset" || fail "Rate limit recovery" "200 or 201" "$code"

# =============================================================
# SUMMARY
# =============================================================
echo ""
echo -e "${B}════════════════════════════════════════════════════${NC}"
TOTAL=$((PASS + FAIL))
echo -e "  Total: ${C}$TOTAL${NC}  Passed: ${G}$PASS${NC}  Failed: ${R}$FAIL${NC}"
echo -e "${B}════════════════════════════════════════════════════${NC}"
[[ $FAIL -eq 0 ]] && { echo -e "${G}  All load tests passed.${NC}"; exit 0; } \
                  || { echo -e "${R}  $FAIL test(s) failed.${NC}"; exit 1; }
