# SurgiMart — Task List
# Antigravity reads this to know what to build.
# Update status as you work: TODO → IN_PROGRESS → DONE | BLOCKED

---

## HOW TO READ THIS FILE

- Pick the first TODO task by priority (P1 first, then P2, then P3)
- Update status to IN_PROGRESS immediately
- Complete the full PLAN→BUILD→TEST→REVIEW→AUDIT→FIX cycle
- Mark DONE only when all checks pass
- Never skip a task — if truly impossible, mark BLOCKED and explain why

---

# PHASE 1 — FOUNDATION (must complete before anything else)

## [T-01] Fix jest.config.ts typo — test suite broken
Status: DONE
Priority: P1
File: jest.config.ts
Problem: Key is `setupFilesAfterSetup` — correct Jest key is `setupFilesAfterFramework`.
         jest.setup.ts never loads so @testing-library/jest-dom and MSW are never set up.
Fix: Rename the key. Run `npm test` — must show tests found and setup working.
Test: `npm test -- --watchAll=false` runs without "unknown option" error

---

## [T-14] Apply CSRF + rate limits to all API routes
Status: DONE
Priority: P1
Files: all src/app/api/*/route.ts
Apply verifyCsrf + rateLimit to every POST handler:
  orders: 5/min | create-payment-intent: 10/min
  newsletter: 3/hr | stock-notify: 5/hr | quote: 10/hr | wholesale: 5/hr
Test: __tests__/api/security.test.ts — verify 403 on CSRF fail, 429 on rate limit

---

## [T-02] Fix docker-compose files (two bugs)
Status: DONE
Priority: P1
Files: docker-compose.yml, docker-compose.dev.yml
Bug-A: `version: "3.9"` key is deprecated in Docker Compose V2 — remove it from both files
Bug-B: REDIS_URL is `redis://redis:6379` — missing password, Redis will refuse connection.
       Change to: `redis://:${REDIS_PASSWORD}@redis:6379`
Test: `docker compose config` validates without warnings

---

## [T-03] Fix homepage missing products (BUG-1)
Status: DONE
Priority: P1
File: src/app/page.tsx
Problem: page.tsx is not async, never calls getFeaturedProducts().
         Homepage renders with no products — the main selling surface is blank.
Fix: Make async. Import getFeaturedProducts from @/lib/sanity.
     Add Bestsellers section with ProductGrid after PromoBanners.
Test: __tests__/app/page.test.tsx — renders ProductGrid with products

---

## [T-04] Fix Navbar auth-awareness (BUG-2)
Status: DONE
Priority: P1
File: src/components/layout/Navbar.tsx
Problem: "Sign In" always shows regardless of login state.
Fix: useSession() — show avatar + My Account when logged in. Sign In only when not.
Test: __tests__/components/Navbar.test.tsx — correct UI for both states

---

## [T-05] Fix dynamic Tailwind class in ProductGrid (BUG-4)
Status: DONE
Priority: P1
File: src/components/product/ProductGrid.tsx
Problem: Uses `grid-cols-${columns}` — Tailwind purges dynamic strings in production.
         Grid silently breaks on build.
Fix: const COL_MAP = {2:"grid-cols-2", 3:"grid-cols-2 md:grid-cols-3", 4:"grid-cols-2 md:grid-cols-3 lg:grid-cols-4"} as const
Test: __tests__/components/ProductGrid.test.tsx — renders correct grid class

---

## [T-06] Write all TypeScript types (src/types/index.ts)
Status: DONE
Priority: P1
File: src/types/index.ts
Required interfaces:
  Product, ProductSpec, BulkPricingTier, Review, Category
  CartItem, WishlistItem, CompareItem, RecentItem
  Order, OrderItem, OrderStatus, ShippingAddress, ShippingData
  QuoteRequest, WholesaleApplication, StockNotificationRequest
  BlogPost, AlgoliaResult, NewsletterSubscriber
  ApiSuccessResponse<T>, ApiErrorResponse
  NextAuth Session augmentation (user.role)
Test: npx tsc --noEmit — zero errors

---

## [T-07] Write all lib singleton files
Status: DONE
Priority: P1
Files:
  src/lib/prisma.ts   — PrismaClient singleton with globalThis dev fix + import "server-only"
  src/lib/redis.ts    — ioredis singleton, password from REDIS_URL + import "server-only"
  src/lib/stripe.ts   — Stripe(key, {apiVersion}) + createPaymentIntent() + import "server-only"
  src/lib/resend.ts   — Resend(key) + sendEmail() helper + import "server-only"
  src/lib/algolia.ts  — algoliasearch v5 (new client API) + searchProducts() + import "server-only"
  src/lib/sanity.ts   — TWO clients: sanityReadClient (CDN, no token) + sanityWriteClient (no CDN, token)
  src/lib/auth.ts     — NextAuth v5 config: Google + Credentials providers, PrismaAdapter + import "server-only"
  src/lib/utils.ts    — cn(), generateOrderNumber() (SM-[A-F0-9]{8}), formatCurrency(), chunk(), truncate()
  src/lib/env.ts      — Zod validation of ALL env vars at startup (fail fast if missing)
Test: npx tsc --noEmit — zero errors; npm run build does not bundle server-only files in client

---

## [T-08] Write CSRF + rate limiting lib
Status: DONE
Priority: P1
Files: src/lib/csrf.ts, src/lib/rate-limit.ts
csrf.ts: verifyCsrf(req) — compare Origin header to Host header — return false if mismatch
rate-limit.ts: rateLimit({key, identifier, max, windowSeconds}) using ioredis sliding window
               getClientIp(req) — reads X-Forwarded-For or req.ip
Test: __tests__/lib/csrf.test.ts, __tests__/lib/rate-limit.test.ts

---

## [T-09] Write hooks
Status: DONE
Priority: P1
Files: src/hooks/useDebounce.ts, src/hooks/useHasMounted.ts, src/hooks/useScrollPosition.ts
useDebounce(value, delay=250) — returns debounced value
useHasMounted() — returns false on server, true after first client render
useScrollPosition() — returns scrollY as number, updates on scroll
Test: __tests__/hooks/*.test.ts

---

## [T-10] Write all 5 Zustand stores (src/store/index.ts)
Status: DONE
Priority: P1
File: src/store/index.ts
  useCartStore — items:CartItem[], isOpen:boolean, addItem, removeItem, updateQty, clearCart, openCart, closeCart — persist "surgimart-cart"
  useWishlistStore — items:WishlistItem[], addItem, removeItem, toggleItem, isInWishlist — persist "surgimart-wishlist"
  useCurrencyStore — currency, rates, setCurrency, convert — persist "surgimart-currency"
  useCompareStore — items:Product[] max 3, addItem, removeItem, clearAll — NO persist
  useRecentlyViewedStore — items max 8 (slim), addItem — persist "surgimart-recent"
Test: __tests__/store/index.test.ts — all store actions verified

---

# PHASE 2 — SECURITY FIXES (from audit — before any features)

## [T-11] Fix payment intent API (C-1, C-5 audit)
Status: DONE
Priority: P1
File: src/app/api/create-payment-intent/route.ts
Problems: accepts amount from client (C-1), leaks Stripe errors (C-5)
Fix:
  - Accept only: { cartItems: {id,qty}[], idempotencyKey: string }
  - Validate with Zod, return 400 if invalid
  - Fetch prices from Sanity by product IDs
  - Calculate total server-side ONLY
  - Catch Stripe errors — log, return { error: "Payment service unavailable" }
  - Add CSRF check + rate limit (10/min)
Test: __tests__/api/payment-intent.test.ts

---

## [T-12] Fix Stripe webhook (C-2, C-3, C-6 audit)
Status: DONE
Priority: P1
File: src/app/api/stripe/webhook/route.ts
Fixes:
  C-6: const sig = req.headers.get("stripe-signature"); if (!sig) return 400
  C-2: remove fire-and-forget IIFE — process order update synchronously
  C-3: use updateMany instead of findUnique + conditional skip
  Return 500 on DB fail so Stripe retries. Return 200 only on full success.
Test: __tests__/api/webhook.test.ts

---

## [T-13] Fix order number generation (C-4 audit)
Status: DONE
Priority: P1
File: src/lib/utils.ts (generateOrderNumber function)
Fix: crypto.randomUUID().replace(/-/g,'').slice(0,8).toUpperCase() → `SM-${hash}`
Test: __tests__/lib/utils.test.ts — generate 10000 numbers, assert zero duplicates

---

## [T-14] Apply CSRF + rate limits to all API routes
Status: DONE
Priority: P1
Files: all src/app/api/*/route.ts
Apply verifyCsrf + rateLimit to every POST handler:
  orders: 5/min | create-payment-intent: 10/min
  newsletter: 3/hr | stock-notify: 5/hr | quote: 10/hr | wholesale: 5/hr
Test: __tests__/api/security.test.ts — verify 403 on CSRF fail, 429 on rate limit

---

## [T-15] Split Sanity clients (H-8 audit)
Status: DONE
Priority: P1
File: src/lib/sanity.ts
Fix: sanityReadClient = createClient({useCdn:true, NO token}) for all reads
     sanityWriteClient = createClient({useCdn:false, token:SANITY_API_TOKEN}) for mutations
     Update all GROQ query functions to use sanityReadClient
Test: npm run build — confirm SANITY_API_TOKEN not exposed in client bundle

---

# PHASE 3 — COMPONENTS

## [T-16] UI primitives: Skeleton, StarRating, CookieBanner
Status: DONE
Priority: P2
Files: src/components/ui/Skeleton.tsx, src/components/ui/StarRating.tsx,
       src/components/ui/CookieBanner.tsx
Skeleton: pulse animation, ProductCardSkeleton variant
StarRating: 1-5 filled/half/empty stars, rating + count props, size prop
CookieBanner: fixed bottom, Accept/Decline, persists decision to localStorage
Test: __tests__/components/ui/*.test.tsx

---

## [T-17] Layout: AnnouncementBar + Footer
Status: DONE
Priority: P2
Files: src/components/layout/AnnouncementBar.tsx, src/components/layout/Footer.tsx
AnnouncementBar: dismissible top banner, promo text
Footer: all page links, social icons, WhatsApp (+92 308 539 1894),
        ISO certified badge, rel="noopener noreferrer" on all external links
Test: __tests__/components/layout/*.test.tsx

---

## [T-18] ProductCard
Status: DONE
Priority: P2
File: src/components/product/ProductCard.tsx
  - React.memo() wrapped
  - Shows: image (next/image), category badge, name, convertedPrice (prop), rating, badges
  - Actions: Add to Cart (openCart), Add to Wishlist (heart toggle), Add to Compare
  - data-testid on all 3 action buttons
  - aria-label on icon buttons
  - accepts convertedPrice as prop — never subscribes to useCurrencyStore
Test: __tests__/components/product/ProductCard.test.tsx

---

## [T-19] ProductGrid + ZoomModal + QuoteModal + ComparisonBar
Status: DONE
Priority: P2
Files: src/components/product/ProductGrid.tsx (fix + finish),
       src/components/product/ZoomModal.tsx,
       src/components/product/QuoteModal.tsx,
       src/components/product/ComparisonBar.tsx
ProductGrid: useMemo for currency conversion, pass convertedPrice to each card
ZoomModal: lightbox, keyboard ESC, thumbnail strip, framer-motion
QuoteModal: react-hook-form + zod, POST /api/quote, success state shown
ComparisonBar: fixed bottom, 3 slots, useHasMounted() guard, Compare Now → /compare
Test: __tests__/components/product/*.test.tsx

---

## [T-20] CartDrawer
Status: DONE
Priority: P2
File: src/components/cart/CartDrawer.tsx
  - Slide in from right (framer-motion)
  - Line items with +/- qty, remove button
  - Free shipping progress bar (threshold $150 — show how far away)
  - Subtotal, Checkout button → /checkout
  - useHasMounted() guard
  - data-testid: cart-drawer, cart-item-{id}, qty-increment, qty-decrement, remove-item, checkout-btn
Test: __tests__/components/cart/CartDrawer.test.tsx

---

## [T-21] SearchAutocomplete
Status: DONE
Priority: P2
File: src/components/search/SearchAutocomplete.tsx
  - useDebounce 250ms
  - calls searchProducts() from @/lib/algolia
  - dropdown with results, close on outside click / ESC
  - useHasMounted() guard
  - Skeleton loading state
Test: __tests__/components/search/SearchAutocomplete.test.tsx

---

## [T-22] Homepage section components (6 components)
Status: DONE
Priority: P2
Files: src/components/homepage/Hero.tsx, TrustStrip.tsx, CategoriesGrid.tsx,
       PromoBanners.tsx, Testimonials.tsx, NewsletterSection.tsx
Hero: headline (font-lora), subtext, 2 CTA buttons, floating product image (animate-float)
TrustStrip: ISO certified, 200K+ professionals, 60+ countries, 25+ years
CategoriesGrid: 16 surgical categories, icons, links to /shop?category=
PromoBanners: 2 promo cards, brand gradient backgrounds
Testimonials: 3 testimonials, StarRating, surgeon name + hospital
NewsletterSection: email input, POST /api/newsletter, success toast via react-hot-toast
Test: __tests__/components/homepage/*.test.tsx

---

## [T-23] Checkout flow (4 components + page)
Status: DONE
Priority: P2
Files: src/app/checkout/page.tsx,
       src/components/checkout/StepIndicator.tsx,
       src/components/checkout/ShippingStep.tsx,
       src/components/checkout/PaymentStep.tsx,
       src/components/checkout/ConfirmStep.tsx
StepIndicator: visual 1→2→3 progress
ShippingStep: react-hook-form + zod, save to sessionStorage on blur (not every keystroke)
PaymentStep: Stripe Elements, calls /api/create-payment-intent on mount
ConfirmStep: shows SM-XXXXXXXX order number, clears sessionStorage on mount, continue shopping link
Test: __tests__/components/checkout/*.test.tsx, tests/e2e/checkout.spec.ts

---

# PHASE 4 — API ROUTES

## [T-24] Write all API routes
Status: DONE
Priority: P2
Files:
  src/app/api/health/route.ts       — GET → {status:"ok", database:"connected"}
  src/app/api/orders/route.ts       — POST (create order) + GET (track: orderNumber+email, 500ms delay on miss)
  src/app/api/quote/route.ts        — POST, validate, save, non-blocking emails, rate limited
  src/app/api/newsletter/route.ts   — POST, upsert subscriber, rate limited, welcome email
  src/app/api/stock-notify/route.ts — POST, save email+productId, rate limited
  src/app/api/wholesale/route.ts    — POST, validate, check duplicate email, notify sales
  src/app/api/revalidate/route.ts   — POST, @sanity/webhook isValidSignature(), revalidatePath()
Each route: Zod validation + try/catch + CSRF + rate limit + server-only imports
Test: __tests__/api/*.test.ts

---

# PHASE 5 — PAGES

## [T-25] Write all missing pages
Status: DONE
Priority: P2
Files:
  src/app/shop/page.tsx           — product grid, category filter, price filter, Algolia search
  src/app/product/[slug]/page.tsx — product detail, images, specs, bulk pricing, add to cart, quote
  src/app/contact/page.tsx        — contact form + WhatsApp link
  src/app/about/page.tsx          — company story, team, certifications
  src/app/faq/page.tsx            — accordion FAQ
  src/app/blog/page.tsx           — Sanity posts list
  src/app/blog/[slug]/page.tsx    — single post
  src/app/wishlist/page.tsx       — useWishlistStore, Add All to Cart
  src/app/track-order/page.tsx    — form → GET /api/orders, visual status timeline
  src/app/login/page.tsx          — credentials + Google OAuth
  src/app/account/page.tsx        — profile, order history (protected by middleware)
  src/app/wholesale/page.tsx      — multi-field application form
  src/app/compare/page.tsx        — side-by-side product comparison table
Each page: generateMetadata() export + loading.tsx + error.tsx + not-found if dynamic
Test: tests/e2e/navigation.spec.ts — all routes return 200, no console errors

---

## [T-26] App-level error/loading/not-found pages
Status: DONE
Priority: P2
Files: src/app/error.tsx, src/app/global-error.tsx,
       src/app/loading.tsx, src/app/not-found.tsx
error.tsx: 'use client', Try Again button, reset prop, logs to console.error
global-error.tsx: minimal, safe HTML fallback
loading.tsx: centered spinner, brand blue (#2563EB)
not-found.tsx: large 404, message, Back to Home button
Test: __tests__/app/error-states.test.tsx

---

# PHASE 6 — DATABASE & CMS

## [T-27] Write complete Prisma schema
Status: DONE
Priority: P2
File: prisma/schema.prisma
Models: Order, OrderItem, Product, Category, Review,
        QuoteRequest, WholesaleApplication, StockNotification,
        NewsletterSubscriber, User, Account, Session, VerificationToken
Constraints: Order.paymentIntentId @unique, Order.orderNumber @unique,
             User.email @unique, WholesaleApplication.email @unique,
             StockNotification @@unique([email, productId])
Test: npx prisma validate — zero errors; npx prisma generate — succeeds

---

## [T-28] Write database seed file
Status: DONE
Priority: P2
File: prisma/seed.ts
Creates:
  - Admin user: admin@surgimart.com / Admin123! (bcrypt hashed)
  - Test buyer: buyer@test.com / Test123!
  - 3 sample products with real looking data
  - 1 test order: orderNumber=SM-TEST0001, email=buyer@test.com
  (used by E2E tests and manual testing checklist)
Test: make db-seed runs without errors

---

## [T-29] Write Sanity schemas
Status: DONE
Priority: P2
Files: sanity/schemas/product.ts, category.ts, review.ts, post.ts, index.ts
       sanity/sanity.config.ts, sanity/lib/client.ts
product.ts: all fields (name, slug, price, images, specs[], bulkPricing[], category ref, etc.)
category.ts: name, slug, description, icon
review.ts: rating, author, body, product ref, verified
post.ts: title, slug, body (block content), publishedAt, author
Test: npx sanity check — zero errors

---

## [T-30] Write Algolia sync scripts
Status: DONE
Priority: P2
Files: scripts/sync-algolia.ts, scripts/configure-algolia.ts
sync-algolia.ts: fetch all products from Sanity → upsert to Algolia in chunks of 100
configure-algolia.ts: set searchableAttributes, attributesForFaceting, customRanking
Add dry-run mode when ALGOLIA_ADMIN_KEY is missing (logs what would be synced)
Test: ts-node scripts/configure-algolia.ts --dry-run exits 0

---

# PHASE 7 — EMAIL TEMPLATES

## [T-31] Write all React Email templates
Status: DONE
Priority: P2
Files: emails/OrderConfirmation.tsx, emails/ShippingUpdate.tsx,
       emails/QuoteAck.tsx, emails/StockNotification.tsx,
       emails/WholesaleApproved.tsx
All: brand colors (#2563EB header), inline CSS only (no Tailwind)
OrderConfirmation: order number, items table, total, shipping address, Track Order button
StockNotification: product name, price, Buy Now button → product URL
Test: make email-preview — all 5 render without errors in browser

---

# PHASE 8 — FULL TEST SUITE

## [T-32] Write complete E2E test suite
Status: DONE
Priority: P2
Files: tests/e2e/navigation.spec.ts, tests/e2e/homepage.spec.ts,
       tests/e2e/shop.spec.ts, tests/e2e/product.spec.ts,
       tests/e2e/cart.spec.ts, tests/e2e/checkout.spec.ts,
       tests/e2e/auth.spec.ts, tests/e2e/search.spec.ts
Covers:
  - All routes return 200 with no console errors
  - Homepage: products visible, newsletter signup works
  - Shop: filters work, search returns results
  - Product: add to cart, add to wishlist, quote modal
  - Cart: qty change, remove, free shipping bar
  - Checkout: full flow with Stripe test card 4242 4242 4242 4242
  - Auth: login page renders, protected routes redirect
  - Search: autocomplete shows results on typing
Test: npx playwright test — all pass

---

# PHASE 9 — PRODUCTION READINESS

## [T-33] Accessibility audit
Status: DONE
Priority: P3
Files: __tests__/a11y/*.test.tsx (new)
Use jest-axe to audit: Navbar, ProductCard, CartDrawer, Homepage, Checkout
Zero axe violations allowed
All icon buttons must have aria-label
All images must have meaningful alt text
External links: rel="noopener noreferrer"
Test: __tests__/a11y/*.test.tsx — zero violations

---

## [T-34] Performance + SEO pass
Status: DONE
Priority: P3
Files: all page.tsx files, next.config.ts
Every page: generateMetadata() with title, description, openGraph
next.config.ts: verify output:standalone, image domains, experimental.serverComponentsExternalPackages
Test: npm run build succeeds with zero metadata warnings

---

## [T-35] Live currency exchange rates
Status: DONE
Priority: P3
File: src/lib/exchange-rates.ts
Fetch from Open Exchange Rates, cache in Redis for 1hr
Fallback to hardcoded rates if API fails or key missing
Called at app startup to hydrate useCurrencyStore
Test: __tests__/lib/exchange-rates.test.ts — tests both live and fallback path

---

## [T-36] Final Docker validation + make docker-health
Status: DONE
Priority: P3
Verify:
  - docker/Dockerfile multi-stage build works (npm run build succeeds in container)
  - docker/Dockerfile.dev hot-reload works
  - docker/nginx/nginx.conf exists and is valid
  - make docker-health returns all green
  - GET /api/health returns {"status":"ok","database":"connected"}
Test: make docker-health — zero red

---

# PHASE 10 — FINAL VERIFICATION

## [T-37] Full final test run + browser verification
Status: DONE
Priority: P1 (do this last, after all other tasks DONE)
Steps:
  1. make test-ci (all checks green — tsc + lint + unit + coverage + e2e)
  2. make docker-dev
  3. Open browser at http://localhost:3000
  4. Screenshot homepage → save as Artifact
  5. Screenshot /shop → save as Artifact
  6. Screenshot /product/[slug] → save as Artifact
  7. Screenshot /checkout → save as Artifact
  8. Verify: zero console errors in DevTools
  9. Write HANDOFF.md
  10. Notify user
Test: All above + HANDOFF.md written

---

## TASK SUMMARY

Phase 1 — Foundation:    T-01 to T-10   (10 tasks) — fix bugs + write core files
Phase 2 — Security:      T-11 to T-15   (5 tasks)  — audit fixes
Phase 3 — Components:    T-16 to T-23   (8 tasks)  — all UI components
Phase 4 — API Routes:    T-24           (1 task)   — all 7 API routes
Phase 5 — Pages:         T-25 to T-26   (2 tasks)  — all pages + error states
Phase 6 — Database/CMS:  T-27 to T-30   (4 tasks)  — schema, seed, Sanity, Algolia
Phase 7 — Emails:        T-31           (1 task)   — all 5 templates
Phase 8 — E2E Tests:     T-32           (1 task)   — full Playwright suite
Phase 9 — Production:    T-33 to T-36   (4 tasks)  — a11y, SEO, perf, Docker
Phase 10 — Final:        T-37           (1 task)   — verify + notify user

Total: 37 tasks
