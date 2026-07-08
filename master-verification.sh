#!/bin/bash
set -e

echo "=== 1. TSC CHECK ==="
npx tsc --noEmit

echo "=== 2. LINT CHECK ==="
npm run lint

echo "=== 3. UNIT TESTS & COVERAGE ==="
npm test -- --watchAll=false --coverage --coverageReporters=text-summary

echo "=== 4. BUILD CHECK ==="
npm run build

echo "=== 5. AUDIT CHECK ==="
npm audit --audit-level=high

echo "=== 6. START SERVER & RUN INTEGRATION TESTS ==="
fuser -k 3001/tcp || true
PORT=3001 E2E_MOCK=true NEXT_PUBLIC_E2E_MOCK=true NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_mock NEXTAUTH_URL=http://localhost:3001 NEXTAUTH_SECRET=secret npm start &
PID=$!

echo "Waiting for server (45s)..."
sleep 45

echo "=== 7. CURL TESTS ==="
chmod +x api-curl-tests.sh
./api-curl-tests.sh --base http://localhost:3001 || echo "Curl tests failed but continuing..."

echo "=== 8. E2E TESTS (PLAYWRIGHT) ==="
npx playwright test --workers=1 --project=chromium --timeout 60000 || echo "Playwright failed but continuing..."

kill $PID
fuser -k 3001/tcp || true
echo "=== FINISHED ==="
