#!/bin/bash
# test-e2e-debug.sh
export PORT=3001
export BASE_URL=http://localhost:3001
export E2E_MOCK=true
export NODE_ENV=test
export NEXTAUTH_URL=http://localhost:3001
export NEXTAUTH_SECRET=secret

killall -9 node || true
rm -rf .next
npm run build
npm start &
SERVER_PID=$!

echo "Waiting for server..."
sleep 20

# Run specific problematic tests
npx playwright test -g "Homepage|Navbar|Shop page|Product page" --project=chromium --reporter=list

kill $SERVER_PID
