#!/bin/bash
fuser -k 3001/tcp || true
npm run build
PORT=3001 E2E_MOCK=true NEXT_PUBLIC_E2E_MOCK=true NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_mock NEXTAUTH_URL=http://localhost:3001 NEXTAUTH_SECRET=secret npm start &
PID=$!
echo "Waiting for server to start on port 3001 (60s warmup)..."
sleep 60
npx playwright test --workers=1 --project=chromium --timeout 60000
EXIT_CODE=$?
kill $PID
# Port cleanup
fuser -k 3001/tcp || true
exit $EXIT_CODE
