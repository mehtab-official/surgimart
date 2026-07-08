# SKILL.md — SurgiMart Loop

## Description
Use this skill when working on SurgiMart. It contains the HANDOFF.md template,
the complete testing checklist, and the manual setup items the developer must add.

---

## HANDOFF.md Template

When all tasks are done, write this file at the project root:

```markdown
# SurgiMart — Ready for Manual Testing

**Build completed:** [datetime]
**Tasks done:** [N] / 37
**Unit tests:** [N] passing
**E2E tests:** [N] passing
**Coverage:** [X]% lines / [X]% functions
**Audit:** 0 high vulnerabilities
**Build:** ✅ next build succeeded

---

## How to Start the App

```bash
make docker-dev
# Wait ~30 seconds for all services
# App: http://localhost:3000
# Sanity Studio: http://localhost:3333
```

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@surgimart.com | Admin123! |
| Buyer | buyer@test.com | Test123! |

**Stripe test card:** 4242 4242 4242 4242 | Any future date | Any CVC
**Test order to track:** SM-TEST0001 with email buyer@test.com

---

## Manual Testing Checklist

### Homepage
- [ ] Page loads in < 3 seconds
- [ ] Fonts load (Plus Jakarta Sans body, Lora serif for headings)
- [ ] Hero section renders correctly
- [ ] Bestsellers grid shows products (minimum 3)
- [ ] Categories grid shows all categories with icons
- [ ] Newsletter signup: enter email → success message appears
- [ ] Floating product image has animation
- [ ] No console errors in DevTools

### Shop Page — /shop
- [ ] Product grid loads
- [ ] Category filter works (click a category, grid updates)
- [ ] Price filter works
- [ ] Search bar: type "surgical" → autocomplete dropdown appears
- [ ] Pagination or load more works

### Product Page — /product/[any-slug]
- [ ] Product images load
- [ ] Click image → zoom modal opens
- [ ] Click thumbnail → main image changes
- [ ] Add to Cart button → cart drawer slides open
- [ ] Cart badge in navbar shows count
- [ ] Add to Wishlist (heart) → turns filled
- [ ] Bulk pricing table visible
- [ ] Get Quote button → quote modal opens
- [ ] Quote form: fill and submit → success message

### Cart Drawer
- [ ] Opens from cart icon in navbar
- [ ] Shows correct items
- [ ] + button increases quantity
- [ ] - button decreases quantity
- [ ] × removes item
- [ ] Free shipping progress bar moves when item added
- [ ] Checkout button → navigates to /checkout
- [ ] Currency switcher in navbar → prices update in cart

### Checkout — /checkout
- [ ] Step 1 (Shipping): form shows, validation works (try submitting empty)
- [ ] Fill shipping form correctly → Continue button activates
- [ ] Step 2 (Payment): Stripe card element loads
- [ ] Enter test card: 4242 4242 4242 4242, 12/29, 123
- [ ] Step 3 (Confirm): order number SM-XXXXXXXX shown
- [ ] Confirmation email arrives (check Resend logs if not in inbox)

### Authentication — /login
- [ ] Login page renders
- [ ] Enter buyer@test.com / Test123! → redirects to homepage, avatar shows in navbar
- [ ] Navbar: "Sign In" gone, avatar/My Account visible
- [ ] Navigate to /account → accessible (not redirected)
- [ ] Log out → /account redirects to /login

### Order Tracking — /track-order
- [ ] Enter SM-TEST0001 + buyer@test.com → order details show
- [ ] Status timeline renders
- [ ] Enter wrong order → "Order not found" message (after ~500ms)

### Other Pages
- [ ] /contact — form submits, WhatsApp link opens correctly
- [ ] /wishlist — saved products visible, Add All to Cart works
- [ ] /wholesale — form submits successfully
- [ ] /blog — posts list loads
- [ ] /compare — comparison table works after adding items from shop
- [ ] /faq — accordions open and close

### Admin
- [ ] /admin — redirects to / when logged in as buyer
- [ ] Log in as admin@surgimart.com → /admin is accessible

### Error States
- [ ] /any-nonexistent-page → custom 404 page (not Next.js default)
- [ ] No console errors on any page

---

## What Was Completed by the Agent

[List of all 37 completed tasks with brief description]

---

## Items That Need Manual Setup (API Keys)

See MISSING.md for the complete list of what you need to configure.
```

---

## MISSING.md Template

Write this file too — it tells the developer what they must add manually:

```markdown
# MISSING.md — Items Requiring Manual Setup

The agent built everything that can be built without external accounts.
The following require your API keys and manual configuration.
The app will work in demo mode without them, but these enable full functionality.

---

## 🔴 Required Before Launch (app broken without these)

### 1. Stripe Account
**What:** Payment processing
**Get it:** https://dashboard.stripe.com/register
**You need:**
  - STRIPE_SECRET_KEY (sk_live_... or sk_test_... for dev)
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_live_... or pk_test_...)
  - STRIPE_WEBHOOK_SECRET — run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
**Add to:** .env.local

### 2. Sanity.io Project
**What:** Product catalog CMS (where you add products)
**Get it:** https://sanity.io → New Project → name it "SurgiMart"
**You need:**
  - NEXT_PUBLIC_SANITY_PROJECT_ID — shown after project creation
  - NEXT_PUBLIC_SANITY_DATASET — use "production"
  - SANITY_API_TOKEN — Settings → API → Tokens → Add API Token (Editor role)
  - SANITY_WEBHOOK_SECRET — Settings → API → Webhooks → create one pointing to /api/revalidate
**Add to:** .env.local
**Then:** Run `make algolia-sync` to push products to search

### 3. Google OAuth
**What:** "Continue with Google" login button
**Get it:** https://console.cloud.google.com → Credentials → OAuth 2.0
**You need:**
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET
  - Authorized redirect URI: http://localhost:3000/api/auth/callback/google
**Add to:** .env.local

### 4. NextAuth Secret
**What:** Session encryption key
**Generate:** `openssl rand -base64 32`
**Add to:** .env.local as NEXTAUTH_SECRET

### 5. Database Password
**What:** PostgreSQL password for Docker
**Generate:** anything strong e.g. `openssl rand -base64 24`
**Add to:** .env.local as DB_PASSWORD and REDIS_PASSWORD

---

## 🟡 Required for Full Features (app works but degraded without)

### 6. Resend (email sending)
**What:** Order confirmation, quote acknowledgement, notification emails
**Get it:** https://resend.com → API Keys
**You need:**
  - RESEND_API_KEY (re_...)
  - RESEND_FROM — must be a verified domain email e.g. orders@surgimart.com
  - Verify your domain at: https://resend.com/domains
**Add to:** .env.local

### 7. Algolia (product search)
**What:** Autocomplete search, search results page
**Get it:** https://algolia.com → Create Application
**You need:**
  - NEXT_PUBLIC_ALGOLIA_APP_ID
  - NEXT_PUBLIC_ALGOLIA_SEARCH_KEY (search-only — safe to expose)
  - ALGOLIA_ADMIN_KEY (server-only — never prefix with NEXT_PUBLIC_)
**Add to:** .env.local
**Then:** Run `make algolia-sync` to index all products

### 8. Open Exchange Rates (currency conversion)
**What:** Live currency conversion (USD → PKR, AED, QAR, EUR, etc.)
**Get it:** https://openexchangerates.org → Free plan (1000 req/month)
**You need:**
  - EXCHANGE_RATES_APP_ID
**Add to:** .env.local
**Note:** Falls back to hardcoded rates if not configured

---

## 🔵 Admin Setup (after keys are added)

### Step 1 — Copy env template
```bash
cp .env.example .env.local
# Fill in all the values from above
```

### Step 2 — Start everything
```bash
make setup       # install deps + run migrations + seed DB
make docker-dev  # start all services
```

### Step 3 — Add products to Sanity
1. Open http://localhost:3333 (Sanity Studio)
2. Sign in with your Sanity account
3. Click Products → New Product
4. Add at least 5 products before testing the shop

### Step 4 — Sync products to Algolia
```bash
make algolia-sync
```

### Step 5 — Set up Stripe webhook (for local dev)
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the webhook secret (whsec_...) to STRIPE_WEBHOOK_SECRET in .env.local
```

---

## What Works WITHOUT Any Keys (Demo Mode)

✅ All pages render correctly
✅ Navbar, cart drawer, wishlist all work
✅ Product pages (with seeded products from prisma/seed.ts)
✅ Order tracking (test order SM-TEST0001)
✅ All form UIs render and validate
✅ Currency switcher (with hardcoded fallback rates)
✅ All animations and interactions
✅ Admin/account route protection

❌ Payments (need Stripe)
❌ Sanity CMS products (need Sanity project ID)
❌ Google login (need OAuth credentials)
❌ Confirmation emails (need Resend)
❌ Search autocomplete (need Algolia)
❌ Live exchange rates (need Open Exchange Rates)
```
