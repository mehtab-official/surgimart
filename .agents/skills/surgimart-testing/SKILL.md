# SKILL.md — SurgiMart Testing

## Description
Load this skill when writing or running tests for SurgiMart.
Contains test patterns, commands, MSW setup, and coverage rules.

---

## Test Stack

| Tool | Version | Purpose |
|------|---------|---------|
| jest | 30.3.0 | Unit + component test runner |
| @testing-library/react | 16.3.2 | Component rendering |
| @testing-library/user-event | 14.6.1 | User interaction simulation |
| @testing-library/jest-dom | 6.9.1 | Custom matchers (toBeInDocument, etc.) |
| msw | 2.12.10 | API mocking (replaces real HTTP calls) |
| @playwright/test | 1.58.2 | E2E browser tests |
| jest-axe | (install if needed) | Accessibility testing |

---

## Commands

```bash
# Unit + component tests (fast, no browser)
npm test -- --watchAll=false

# With coverage report
npm test -- --coverage --watchAll=false

# Single file
npm test -- --watchAll=false --testPathPattern="CartDrawer"

# E2E tests (requires running app)
npm run dev &
npx playwright test

# E2E with UI
npx playwright test --ui

# Accessibility tests
npm test -- --watchAll=false --testPathPattern="a11y"
```

---

## Coverage Requirements

From jest.config.ts (fixed typo — key is setupFilesAfterFramework):
- Lines: ≥ 80%
- Functions: ≥ 80%
- Branches: ≥ 70%

Every new file must have a test file. No exceptions.

---

## Test File Location Rules

| Source file | Test file |
|-------------|-----------|
| `src/app/page.tsx` | `__tests__/app/page.test.tsx` |
| `src/components/cart/CartDrawer.tsx` | `__tests__/components/cart/CartDrawer.test.tsx` |
| `src/lib/utils.ts` | `__tests__/lib/utils.test.ts` |
| `src/hooks/useDebounce.ts` | `__tests__/hooks/useDebounce.test.ts` |
| `src/store/index.ts` | `__tests__/store/index.test.ts` |
| `src/app/api/orders/route.ts` | `__tests__/api/orders.test.ts` |
| `tests/e2e/checkout.spec.ts` | Playwright E2E |

---

## MSW Setup

The mock server lives at `__tests__/__mocks__/mswServer.ts`.
jest.setup.ts (loaded by jest.config.ts setupFilesAfterFramework) starts and closes it.

Pattern for adding MSW handlers:
```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/orders', () => {
    return HttpResponse.json({
      orderNumber: 'SM-ABCD1234',
      message: 'Order created'
    }, { status: 201 })
  }),
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok', database: 'connected' })
  }),
]
```

---

## Unit Test Patterns

### Testing utility functions
```typescript
import { generateOrderNumber, cn, formatCurrency } from '@/lib/utils'

describe('generateOrderNumber', () => {
  it('returns SM-XXXXXXXX format', () => {
    const num = generateOrderNumber()
    expect(num).toMatch(/^SM-[A-F0-9]{8}$/)
  })

  it('generates unique numbers (10000 iterations)', () => {
    const nums = new Set(Array.from({ length: 10000 }, generateOrderNumber))
    expect(nums.size).toBe(10000) // zero duplicates
  })
})
```

### Testing Zustand stores
```typescript
import { useCartStore } from '@/store'

beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false })
})

it('addItem puts item in cart', () => {
  useCartStore.getState().addItem({ id: '1', name: 'Scalpel', price: 29.99, qty: 1 })
  expect(useCartStore.getState().items).toHaveLength(1)
})
```

### Testing API routes
```typescript
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/newsletter/route'

it('returns 400 on missing email', async () => {
  const req = new NextRequest('http://localhost/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({}),
    headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:3000', 'Host': 'localhost:3000' }
  })
  const res = await POST(req)
  expect(res.status).toBe(400)
})
```

---

## Component Test Patterns

### Basic render test
```typescript
import { render, screen } from '@testing-library/react'
import { CartDrawer } from '@/components/cart/CartDrawer'

it('renders cart drawer', () => {
  useCartStore.setState({ isOpen: true, items: [] })
  render(<CartDrawer />)
  expect(screen.getByTestId('cart-drawer')).toBeInTheDocument()
})
```

### User interaction test
```typescript
import userEvent from '@testing-library/user-event'

it('closes when X is clicked', async () => {
  const user = userEvent.setup()
  useCartStore.setState({ isOpen: true, items: [] })
  render(<CartDrawer />)
  await user.click(screen.getByTestId('cart-close-btn'))
  expect(useCartStore.getState().isOpen).toBe(false)
})
```

### Form validation test
```typescript
it('shows error on empty email submit', async () => {
  const user = userEvent.setup()
  render(<NewsletterSection />)
  await user.click(screen.getByTestId('newsletter-submit'))
  expect(screen.getByText(/email is required/i)).toBeInTheDocument()
})
```

---

## E2E Test Patterns (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test('full checkout flow', async ({ page }) => {
  // Navigate to shop
  await page.goto('/shop')
  await expect(page).toHaveTitle(/SurgiMart/)

  // Add product to cart
  await page.getByTestId('add-to-cart-btn').first().click()
  await expect(page.getByTestId('cart-drawer')).toBeVisible()

  // Go to checkout
  await page.getByTestId('checkout-btn').click()
  await expect(page).toHaveURL('/checkout')

  // Fill shipping
  await page.fill('[data-testid="shipping-name"]', 'Dr. Ahmad Khan')
  await page.fill('[data-testid="shipping-email"]', 'ahmad@hospital.pk')
  await page.fill('[data-testid="shipping-address"]', '123 Medical St')
  await page.fill('[data-testid="shipping-city"]', 'Lahore')
  await page.fill('[data-testid="shipping-country"]', 'Pakistan')
  await page.getByTestId('continue-to-payment').click()

  // Fill Stripe test card (inside iframe)
  const stripeFrame = page.frameLocator('iframe[title*="card"]').first()
  await stripeFrame.getByPlaceholder('Card number').fill('4242424242424242')
  await stripeFrame.getByPlaceholder('MM / YY').fill('12/29')
  await stripeFrame.getByPlaceholder('CVC').fill('123')

  // Pay
  await page.getByTestId('pay-btn').click()
  await expect(page.getByTestId('order-number')).toBeVisible({ timeout: 15000 })
  await expect(page.getByTestId('order-number')).toHaveText(/SM-[A-F0-9]{8}/)
})
```

---

## Accessibility Test Pattern (jest-axe)

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

it('Navbar has no accessibility violations', async () => {
  const { container } = render(<Navbar />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## What "All Tests Passing" Means

Before marking any task DONE, all of these must be true:
1. `npx tsc --noEmit` — zero TypeScript errors
2. `npm run lint -- --max-warnings 0` — zero ESLint warnings or errors
3. `npm test -- --watchAll=false` — zero failing tests
4. `npm test -- --coverage` — lines ≥ 80%, functions ≥ 80%, branches ≥ 70%
5. `npm run build` — Next.js build succeeds
6. `npm audit --audit-level=high` — zero high/critical vulnerabilities
7. `npx playwright test` (for E2E tasks) — all scenarios pass
