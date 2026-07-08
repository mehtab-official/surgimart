# SKILL.md — SurgiMart Audit

## Description
Load this skill when auditing SurgiMart code quality and security.
Contains the complete audit checklist, all known findings, and fix patterns.

---

## Audit Commands (run all, fix all failures)

```bash
# 1. Type safety
npx tsc --noEmit
# Pass criteria: zero errors

# 2. Lint
npm run lint -- --max-warnings 0
# Pass criteria: zero warnings or errors

# 3. Security vulnerabilities
npm audit --audit-level=high
# Pass criteria: 0 high, 0 critical

# 4. Find any TypeScript 'any' usage
grep -rn "\bany\b" src/ --include="*.ts" --include="*.tsx"
# Pass criteria: zero results

# 5. Find console.log in production code
grep -rn "console\.log" src/ --include="*.ts" --include="*.tsx"
# Pass criteria: zero results (console.error is OK)

# 6. Find @ts-ignore
grep -rn "@ts-ignore" src/ --include="*.ts" --include="*.tsx"
# Pass criteria: zero results

# 7. Find hardcoded secrets
grep -rn "sk_live\|sk_test\|rk_live\|whsec_\|re_[a-zA-Z0-9]" src/
# Pass criteria: zero results (all secrets must be in env vars)

# 8. Find TODO/FIXME/HACK
grep -rn "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.tsx"
# Pass criteria: zero results (or note and document each one)

# 9. Build check
npm run build
# Pass criteria: build succeeds, no bundle warnings about size

# 10. Unused exports check
npx ts-unused-exports tsconfig.json 2>/dev/null | head -20
# Pass criteria: zero unused exports (or document intentional ones)
```

---

## Security Audit Checklist

Work through each item. Mark ✅ when fixed.

### Critical (P1 — fix before any other work)

- [ ] **SEC-C1** `/api/create-payment-intent` accepts `amount` from client
  - Fix: Remove `amount` from schema. Calculate from Sanity server-side.
  - Test: send request with fake amount → server ignores it, calculates real price

- [ ] **SEC-C2** Stripe webhook processes in fire-and-forget IIFE
  - Fix: Remove IIFE. Process synchronously before returning response.
  - Test: mock DB failure → route returns 500, not 200

- [ ] **SEC-C3** Stripe webhook uses findUnique + conditional skip
  - Fix: Use `updateMany` directly. No pre-check needed.
  - Test: duplicate webhook → idempotent, no duplicate order

- [ ] **SEC-C4** Order numbers use `Date.now()` — collision risk
  - Fix: `SM-${crypto.randomUUID().replace(/-/g,'').slice(0,8).toUpperCase()}`
  - Test: generate 10,000 → zero duplicates

- [ ] **SEC-C5** Stripe SDK errors leaked to client response
  - Fix: catch block → `console.error(err)` + return `{ error: "Payment service unavailable" }`
  - Test: mock Stripe throw → response body has no SDK error message

- [ ] **SEC-C6** Stripe webhook does not null-check `stripe-signature` header
  - Fix: `const sig = req.headers.get("stripe-signature"); if (!sig) return new Response(..., {status:400})`
  - Test: request without header → returns 400

### High (P1 — fix before launch)

- [ ] **SEC-H1** No rate limiting on `/api/orders` and `/api/create-payment-intent`
  - Fix: Apply `rateLimit()` — orders: 5/min, payment: 10/min
  - Test: 6 requests in 1 min → 6th returns 429

- [ ] **SEC-H3** No CSRF protection on any POST route
  - Fix: `verifyCsrf(req)` at top of every POST handler → return 403 if fails
  - Test: request without Origin header → returns 403

- [ ] **SEC-H8** Sanity single client uses write token + CDN
  - Fix: Two separate clients — sanityReadClient (CDN, no token) + sanityWriteClient (no CDN, token)
  - Test: npm run build → SANITY_API_TOKEN not in client bundle

- [ ] **SEC-H9** No `import "server-only"` in lib files
  - Fix: Add as first line to prisma.ts, stripe.ts, redis.ts, algolia.ts, resend.ts, auth.ts
  - Test: import from client component → build error (this is the desired behavior)

### Medium (P2 — fix before launch)

- [ ] **SEC-M3** PII saved to sessionStorage on every keystroke
  - Fix: Save to sessionStorage `onBlur` only, not `onChange`. Clear on order completion.
  - Test: fill form → sessionStorage only updates on field blur

- [ ] **SEC-M6** Order tracking GET vulnerable to enumeration
  - Fix: Add 500ms artificial delay when order not found
  - Test: request with wrong order number → response takes ≥500ms

- [ ] **SEC-M11** Sanity revalidate uses shared secret (not signed)
  - Fix: Use `@sanity/webhook` `isValidSignature()` instead of simple string comparison
  - Test: request with wrong signature → returns 403

---

## Code Quality Checklist

- [ ] **QA-1** Every API route has Zod input validation
- [ ] **QA-2** Every API route has full try/catch wrapping entire handler
- [ ] **QA-3** Every component has `data-testid` on interactive elements
- [ ] **QA-4** Every icon-only button has `aria-label`
- [ ] **QA-5** No dynamic Tailwind class interpolation
- [ ] **QA-6** `useHasMounted()` in all Client Components reading Zustand
- [ ] **QA-7** `React.memo()` on ProductCard and list-rendered components
- [ ] **QA-8** `import "server-only"` in all server-only lib files
- [ ] **QA-9** Non-blocking email sends with `.catch(console.error)`
- [ ] **QA-10** Revalidation via `revalidatePath()` not HTTP self-call
- [ ] **QA-11** Every page has `generateMetadata()` export
- [ ] **QA-12** All external links have `rel="noopener noreferrer"`
- [ ] **QA-13** No `console.log` in production code
- [ ] **QA-14** No hardcoded secrets or API keys
- [ ] **QA-15** Zero TypeScript `any` types

---

## What a Passing Audit Looks Like

```
✅ TypeScript:     0 errors
✅ ESLint:         0 warnings, 0 errors
✅ npm audit:      0 high, 0 critical vulnerabilities
✅ any usage:      0 instances
✅ console.log:    0 instances in src/
✅ @ts-ignore:     0 instances
✅ Hardcoded keys: 0 instances
✅ Build:          succeeded, no oversized bundles
✅ All critical security findings: fixed
✅ All high security findings: fixed
```

---

## Audit Report Format

After running the full audit, write findings to `audit-report.md`:

```markdown
# Audit Report — [datetime]

## Summary
TypeScript: PASS/FAIL (N errors)
ESLint:     PASS/FAIL (N warnings)
npm audit:  PASS/FAIL (N high, N critical)
Build:      PASS/FAIL

## Issues Found
### CRITICAL
- [finding ID]: [description] → [fix applied or status]

### HIGH
- [finding ID]: [description] → [fix applied or status]

### MEDIUM
(etc.)

## Next Steps
[Any remaining issues that need developer attention]
```
