#!/usr/bin/env bash
# =============================================================
# SurgiMart — API Curl Test Suite
# Covers every route + every audit finding from system_auditm.md
# =============================================================
# Usage:
#   chmod +x api-curl-tests.sh
#   ./api-curl-tests.sh
#   ./api-curl-tests.sh --base http://localhost:3000
# =============================================================

BASE="${2:-http://localhost:3000}"
PASS=0; FAIL=0; SKIP=0

G='\033[0;32m'; R='\033[0;31m'; Y='\033[1;33m'
B='\033[0;34m'; C='\033[0;36m'; NC='\033[0m'

# ── helpers ──────────────────────────────────────────────────
ok()  { echo -e "  ${G}✓${NC} $1"; ((PASS++)); }
fail(){ echo -e "  ${R}✗${NC} $1"; echo -e "    ${Y}expected:${NC} $2"; echo -e "    ${R}got:${NC} $3"; ((FAIL++)); }
skip(){ echo -e "  ${C}○${NC} $1 (skipped — $2)"; ((SKIP++)); }

assert_status() {
  local label="$1" want="$2"
  local got; got=$(curl -s -o /dev/null -w "%{http_code}" "${@:3}")
  [[ "$got" == "$want" ]] && ok "$label" || fail "$label" "$want" "$got"
}

assert_status_in() {
  # pass when status is any of the listed codes e.g. "200 201"
  local label="$1" codes="$2"
  local got; got=$(curl -s -o /dev/null -w "%{http_code}" "${@:3}")
  [[ "$codes" == *"$got"* ]] && ok "$label (HTTP $got)" || fail "$label" "one of: $codes" "$got"
}

assert_body_has() {
  local label="$1" needle="$2"
  local body; body=$(curl -s "${@:3}")
  echo "$body" | grep -q "$needle" && ok "$label" || fail "$label" "body contains '$needle'" "not found in: ${body:0:120}"
}

assert_body_not() {
  local label="$1" needle="$2"
  local body; body=$(curl -s "${@:3}")
  echo "$body" | grep -q "$needle" && fail "$label" "body must NOT contain '$needle'" "found it" || ok "$label"
}

assert_header_has() {
  local label="$1" needle="$2"
  local hdrs; hdrs=$(curl -s -I "${@:3}")
  echo "$hdrs" | grep -qi "$needle" && ok "$label" || fail "$label" "header contains '$needle'" "not found"
}

assert_header_not() {
  local label="$1" needle="$2"
  local hdrs; hdrs=$(curl -s -I "${@:3}")
  echo "$hdrs" | grep -qi "$needle" && fail "$label" "header must NOT contain '$needle'" "found it" || ok "$label"
}

hdr() { echo -e "\n${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; echo -e "${C}  $1${NC}"; echo -e "${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

POST() { curl -s -X POST -H "Content-Type: application/json" -H "Origin: $BASE" "$@"; }
POST_status() { curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -H "Origin: $BASE" "$@"; }

# ── wait for server ──────────────────────────────────────────
echo -e "${Y}Waiting for server at $BASE ...${NC}"
for i in $(seq 1 30); do
  curl -s "$BASE/api/health" > /dev/null 2>&1 && break
  sleep 1
done
echo ""

# =============================================================
# 1 — HEALTH
# =============================================================
hdr "1 · Health check"
assert_status       "GET /api/health → 200"              "200"  "$BASE/api/health"
assert_body_has     "body.status = ok"                   '"status":"ok"'       "$BASE/api/health"
assert_body_has     "body.database = connected"          '"database":"connected"' "$BASE/api/health"
assert_header_has   "Content-Type is application/json"   "application/json"    "$BASE/api/health"

# =============================================================
# 2 — PAGE ROUTES
# =============================================================
hdr "2 · Page routes (all → 200)"
for p in "/" "/shop" "/contact" "/about" "/faq" "/blog" "/wishlist" "/track-order" "/login" "/wholesale"; do
  assert_status "GET $p → 200" "200" "$BASE$p"
done

# =============================================================
# 3 — PROTECTED ROUTES
# =============================================================
hdr "3 · Protected routes redirect unauthenticated"
# middleware must respond 302/307 or redirect chain ends at login
for p in "/account" "/account/orders"; do
  got=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$p")
  # 302/307 = redirect, or follow and check final URL contains login
  if [[ "$got" == "302" || "$got" == "307" ]]; then
    ok "GET $p → redirect ($got)"
  else
    final=$(curl -s -o /dev/null -w "%{url_effective}" -L "$BASE$p")
    [[ "$final" == *"login"* ]] && ok "GET $p → lands on /login after redirect" || fail "GET $p → must redirect unauthenticated" "302 or /login" "$got / $final"
  fi
done

# =============================================================
# 4 — 404 HANDLING
# =============================================================
hdr "4 · 404 handling (M-9 fix check)"
assert_status "Unknown route → 404"           "404" "$BASE/this-page-xyz-does-not-exist"
assert_status "Unknown product slug → 404"    "404" "$BASE/product/slug-that-does-not-exist-xyz"
# custom 404 page must render — body should NOT be Next.js default
assert_body_not "No raw Next.js 404 text in body" '"__NEXT_DATA__"' "$BASE/this-page-xyz-does-not-exist"

# =============================================================
# 5 — ORDERS API
# =============================================================
hdr "5 · /api/orders"

# GET — validation
assert_status     "GET no params → 400"                             "400" "$BASE/api/orders"
assert_status     "GET only orderNumber → 400"                      "400" "$BASE/api/orders?orderNumber=SM-TEST0001"
assert_status     "GET only email → 400"                            "400" "$BASE/api/orders?email=buyer@test.com"
assert_status     "GET wrong order → 404"                           "404" "$BASE/api/orders?orderNumber=SM-FAKEFAKE&email=x@x.com"
assert_status     "GET seed order SM-TEST0001 → 200"                "200" "$BASE/api/orders?orderNumber=SM-TEST0001&email=buyer@test.com"
assert_body_has   "Seed order has orderNumber field"                '"orderNumber"' "$BASE/api/orders?orderNumber=SM-TEST0001&email=buyer@test.com"

# M-6: enumeration delay — wrong order must take ≥500ms
start=$(date +%s%N)
curl -s "$BASE/api/orders?orderNumber=SM-NOTREAL1&email=x@x.com" > /dev/null
elapsed=$(( ($(date +%s%N) - start) / 1000000 ))
[[ $elapsed -ge 490 ]] && ok "M-6: Order miss delay ≥500ms (got ${elapsed}ms)" || fail "M-6: Order miss delay ≥500ms" "≥500ms" "${elapsed}ms"

# POST — validation
assert_status     "POST empty body → 400"                           "400" -d '{}' "$BASE/api/orders"
assert_status     "POST invalid email → 400"                        "400" -d '{"email":"notanemail","items":[]}' "$BASE/api/orders"
assert_status     "POST missing items → 400"                        "400" -d '{"email":"x@x.com"}' "$BASE/api/orders"

# =============================================================
# 6 — NEWSLETTER
# =============================================================
hdr "6 · /api/newsletter (H-4, H-5 fix check)"
assert_status_in  "POST valid email → 200 or 201"               "200 201" -d '{"email":"curl-nl@test.com"}' "$BASE/api/newsletter"
assert_status     "POST no email → 400"                         "400"     -d '{}' "$BASE/api/newsletter"
assert_status     "POST invalid email format → 400"             "400"     -d '{"email":"notvalid"}' "$BASE/api/newsletter"
assert_status     "POST empty string email → 400"               "400"     -d '{"email":""}' "$BASE/api/newsletter"

# H-5: rate limit — spam until 429
echo -n "  Checking H-5 rate limit on newsletter"
hit429=0
for i in $(seq 1 20); do
  code=$(POST_status -d "{\"email\":\"rl$i@test.com\"}" "$BASE/api/newsletter")
  [[ "$code" == "429" ]] && { hit429=1; echo " (hit at req #$i)"; break; }
done
[[ $hit429 -eq 1 ]] && ok "H-5: Rate limit triggers 429 on newsletter spam" || fail "H-5: Rate limit on newsletter" "429 within 20 requests" "never triggered"

# =============================================================
# 7 — QUOTE
# =============================================================
hdr "7 · /api/quote (M-7, H-10 fix check)"
QUOTE_BODY='{"name":"Dr. Ahmad Khan","email":"quote-curl@hospital.pk","phone":"+923001234567","organization":"City Hospital","productName":"Scalpel Set","quantity":50,"message":"Need bulk pricing"}'
assert_status_in  "POST valid quote → 200 or 201"          "200 201"  -d "$QUOTE_BODY" "$BASE/api/quote"
assert_status     "POST missing name → 400"                "400"      -d '{"email":"x@x.com"}' "$BASE/api/quote"
assert_status     "POST missing email → 400"               "400"      -d '{"name":"Test"}' "$BASE/api/quote"
assert_status     "POST empty body → 400"                  "400"      -d '{}' "$BASE/api/quote"

# M-7: malformed JSON must NOT crash with 500
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" -H "Origin: $BASE" \
  --data 'NOT_JSON' "$BASE/api/quote")
[[ "$code" != "500" ]] && ok "M-7: Malformed JSON → not 500 (got $code)" || fail "M-7: Malformed JSON must not return 500" "400 or 422" "500"

# =============================================================
# 8 — STOCK NOTIFY
# =============================================================
hdr "8 · /api/stock-notify (H-6 fix check)"
assert_status_in  "POST valid data → 200 or 201"     "200 201"  -d '{"email":"sn-curl@test.com","productId":"prod-123"}' "$BASE/api/stock-notify"
assert_status     "POST no email → 400"              "400"      -d '{"productId":"prod-123"}' "$BASE/api/stock-notify"
assert_status     "POST no productId → 400"          "400"      -d '{"email":"x@x.com"}' "$BASE/api/stock-notify"
assert_status     "POST empty body → 400"            "400"      -d '{}' "$BASE/api/stock-notify"

# H-6: rate limit
echo -n "  Checking H-6 rate limit on stock-notify"
hit429=0
for i in $(seq 1 12); do
  code=$(POST_status -d "{\"email\":\"sn$i@test.com\",\"productId\":\"p$i\"}" "$BASE/api/stock-notify")
  [[ "$code" == "429" ]] && { hit429=1; echo " (hit at req #$i)"; break; }
done
[[ $hit429 -eq 1 ]] && ok "H-6: Rate limit triggers 429 on stock-notify spam" || fail "H-6: Rate limit on stock-notify" "429 within 12 requests" "never triggered"

# =============================================================
# 9 — WHOLESALE
# =============================================================
hdr "9 · /api/wholesale (M-7 fix check)"
WS_BODY='{"businessName":"Lahore Medical","contactName":"Usman","email":"ws-curl@test.com","phone":"+923001234567","country":"Pakistan","monthlyVolume":"50000","productCategories":["Surgical"]}'
assert_status_in  "POST valid wholesale → 200 or 201"   "200 201"  -d "$WS_BODY" "$BASE/api/wholesale"
assert_status     "POST missing businessName → 400"     "400"      -d '{"email":"x@x.com"}' "$BASE/api/wholesale"
assert_status     "POST empty body → 400"               "400"      -d '{}' "$BASE/api/wholesale"

# M-7: malformed body
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" -H "Origin: $BASE" \
  --data 'NOT_JSON{{' "$BASE/api/wholesale")
[[ "$code" != "500" ]] && ok "M-7: Wholesale malformed JSON → not 500 (got $code)" || fail "M-7" "400 or 422" "500"

# =============================================================
# 10 — PAYMENT INTENT  (C-1, C-5 fix checks)
# =============================================================
hdr "10 · /api/create-payment-intent (C-1, C-5, H-1)"

# C-1: client must NOT be able to dictate the amount
body=$(POST -d '{"amount":1,"idempotencyKey":"attack-c1"}' "$BASE/api/create-payment-intent")
assert_body_not "C-1: clientSecret NOT returned for client-sent amount=1" '"clientSecret"' <(echo "$body")

# correct shape but empty cart — should get 400 (no items = nothing to charge)
code=$(POST_status -d '{"cartItems":[],"idempotencyKey":"test-empty-cart"}' "$BASE/api/create-payment-intent")
[[ "$code" == "400" || "$code" == "422" ]] && ok "POST empty cartItems → 400 or 422" || fail "POST empty cartItems" "400 or 422" "$code"

# missing idempotencyKey
assert_status "POST missing idempotencyKey → 400" "400" -X POST \
  -H "Content-Type: application/json" -H "Origin: $BASE" \
  -d '{"cartItems":[{"id":"p1","qty":1}]}' "$BASE/api/create-payment-intent"

# C-5: internal errors must not leak SDK details
body=$(POST -d '{"cartItems":[{"id":"fake-id-xyz","qty":1}],"idempotencyKey":"test-leak"}' "$BASE/api/create-payment-intent")
assert_body_not "C-5: Stripe SDK error not in response"    'stripe_id'                <(echo "$body")
assert_body_not "C-5: Stack trace not in response"         'at Object.<'              <(echo "$body")
assert_body_not "C-5: Prisma error not in response"        'PrismaClient'             <(echo "$body")

# H-1: rate limit
echo -n "  Checking H-1 rate limit on payment-intent"
hit429=0
for i in $(seq 1 14); do
  code=$(POST_status -d "{\"cartItems\":[],\"idempotencyKey\":\"rl-pi-$i\"}" "$BASE/api/create-payment-intent")
  [[ "$code" == "429" ]] && { hit429=1; echo " (hit at req #$i)"; break; }
done
[[ $hit429 -eq 1 ]] && ok "H-1: Rate limit triggers 429 on payment-intent spam" || fail "H-1: Rate limit on payment-intent" "429 within 14 requests" "never triggered"

# =============================================================
# 11 — STRIPE WEBHOOK  (C-2, C-3, C-6 fix checks)
# =============================================================
hdr "11 · /api/stripe/webhook (C-2, C-3, C-6)"

# C-6: no signature header → 400
assert_status "C-6: No stripe-signature → 400"     "400" -X POST \
  -H "Content-Type: application/json" \
  -d '{"type":"payment_intent.succeeded"}' "$BASE/api/stripe/webhook"

# C-6: empty signature → 400
assert_status "C-6: Empty stripe-signature → 400"  "400" -X POST \
  -H "Content-Type: application/json" -H "stripe-signature: " \
  -d '{"type":"payment_intent.succeeded"}' "$BASE/api/stripe/webhook"

# C-6: bad signature → 400
assert_status "C-6: Invalid signature → 400"       "400" -X POST \
  -H "Content-Type: application/json" \
  -H "stripe-signature: t=111,v1=badbadbadbad" \
  -d '{"type":"payment_intent.succeeded"}' "$BASE/api/stripe/webhook"

# =============================================================
# 12 — REVALIDATE (H-7 fix check)
# =============================================================
hdr "12 · /api/revalidate (H-7)"

# No secret at all → 401 or 403
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d '{"_type":"product"}' "$BASE/api/revalidate")
[[ "$code" == "401" || "$code" == "403" ]] && ok "H-7: No secret → 401 or 403" || fail "H-7: No secret" "401 or 403" "$code"

# Wrong secret → 403
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -H "sanity-webhook-signature: wrongsecret" \
  -d '{"_type":"product"}' "$BASE/api/revalidate")
[[ "$code" == "403" ]] && ok "H-7: Wrong signature → 403" || fail "H-7: Wrong signature" "403" "$code"

# =============================================================
# 13 — CSRF PROTECTION (H-3 fix check)
# =============================================================
hdr "13 · CSRF protection on all POST routes (H-3)"

for route in "/api/newsletter" "/api/quote" "/api/orders" "/api/wholesale" "/api/stock-notify" "/api/create-payment-intent"; do
  # No Origin header
  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"csrf@test.com"}' "$BASE$route")
  [[ "$code" == "403" || "$code" == "400" ]] && ok "H-3: $route — no Origin → 403/400" || fail "H-3: $route — no Origin" "403 or 400" "$code"

  # Cross-site Origin
  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -H "Origin: https://evil-attacker.com" \
    -d '{"email":"csrf@test.com"}' "$BASE$route")
  [[ "$code" == "403" ]] && ok "H-3: $route — evil origin → 403" || fail "H-3: $route — evil origin" "403" "$code"
done

# =============================================================
# 14 — INTERNAL ERROR LEAKS (C-5 general)
# =============================================================
hdr "14 · Internal errors must never leak to client (C-5)"

for route in "/api/orders" "/api/quote" "/api/wholesale" "/api/newsletter"; do
  body=$(curl -s -X POST -H "Content-Type: application/json" -H "Origin: $BASE" \
    --data 'NOT_JSON' "$BASE$route")
  assert_body_not "C-5: $route — no SyntaxError in response"    'SyntaxError'                 <(echo "$body")
  assert_body_not "C-5: $route — no stack trace in response"    'at Object.<'                 <(echo "$body")
  assert_body_not "C-5: $route — no Prisma details"             'PrismaClientKnownRequest'    <(echo "$body")
  assert_body_not "C-5: $route — no file path in response"      '/src/app/api'                <(echo "$body")
done

# 404 body must be clean too
body=$(curl -s "$BASE/api/orders?orderNumber=SM-FAKEFAKE&email=x@x.com")
assert_body_not "C-5: Order 404 — no SQL in response"    'SELECT'     <(echo "$body")
assert_body_not "C-5: Order 404 — no prisma in response" 'prisma'     <(echo "$body")

# =============================================================
# 15 — HTTP METHOD ENFORCEMENT
# =============================================================
hdr "15 · Wrong HTTP methods → 405"
assert_status "DELETE /api/orders → 405"         "405" -X DELETE  "$BASE/api/orders"
assert_status "PUT /api/newsletter → 405"        "405" -X PUT     "$BASE/api/newsletter"
assert_status "PATCH /api/health → 405"          "405" -X PATCH   "$BASE/api/health"
assert_status "DELETE /api/quote → 405"          "405" -X DELETE  "$BASE/api/quote"

# =============================================================
# 16 — RESPONSE HEADERS
# =============================================================
hdr "16 · Security response headers"
assert_header_not "X-Powered-By not exposed"                  "X-Powered-By: Next.js"    "$BASE/api/health"
assert_header_has "Health → Content-Type: application/json"   "application/json"         "$BASE/api/health"

# =============================================================
# 17 — SENSITIVE FILE EXPOSURE
# =============================================================
hdr "17 · Sensitive file exposure"
assert_status ".env not accessible → 404"          "404" "$BASE/.env"
assert_status ".env.local not accessible → 404"    "404" "$BASE/.env.local"
assert_status "package.json not accessible → 404"  "404" "$BASE/package.json"
assert_status "prisma schema not accessible → 404" "404" "$BASE/prisma/schema.prisma"

# =============================================================
# 18 — INJECTION ATTACKS
# =============================================================
hdr "18 · Injection attacks"

# SQL injection in query string
body=$(curl -s "$BASE/api/orders?orderNumber=SM-1'+OR+'1'='1&email=x@x.com")
assert_body_not "SQL injection in orderNumber — no SQL error"  "error in your SQL"  <(echo "$body")
assert_body_not "SQL injection — no table names"               "public.\"Order\""   <(echo "$body")

# XSS in POST body
body=$(POST -d '{"email":"<script>alert(1)</script>@test.com"}' "$BASE/api/newsletter")
assert_body_not "XSS in email — script tag not reflected"     '<script>'  <(echo "$body")

# Oversized body → 400 or 413
big=$(python3 -c "print('{\"email\":\"x@y.com\",\"junk\":\"' + 'a'*1100000 + '\"}')")
code=$(echo "$big" | curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" -H "Origin: $BASE" --data-binary @- "$BASE/api/newsletter")
[[ "$code" == "400" || "$code" == "413" ]] && ok "Oversized body (1MB+) → 400 or 413 (got $code)" || fail "Oversized body" "400 or 413" "$code"

# Path traversal
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/../../../etc/passwd")
[[ "$code" == "400" || "$code" == "404" || "$code" == "403" ]] && ok "Path traversal → 40x" || fail "Path traversal" "40x" "$code"

# =============================================================
# SUMMARY
# =============================================================
echo ""
echo -e "${B}════════════════════════════════════════════════════${NC}"
echo -e "${C}  RESULTS${NC}"
echo -e "${B}════════════════════════════════════════════════════${NC}"
TOTAL=$((PASS + FAIL))
echo -e "  Total:   ${C}$TOTAL${NC}"
echo -e "  Passed:  ${G}$PASS${NC}"
echo -e "  Failed:  ${R}$FAIL${NC}"
[[ $SKIP -gt 0 ]] && echo -e "  Skipped: ${Y}$SKIP${NC}"
echo ""
if [[ $FAIL -eq 0 ]]; then
  echo -e "${G}  All curl tests passed.${NC}"
  exit 0
else
  echo -e "${R}  $FAIL test(s) failed — see above.${NC}"
  exit 1
fi
