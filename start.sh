#!/usr/bin/env bash
set -e

echo "Starting SurgiMart..."
cp -n .env.example .env.local 2>/dev/null || true
docker compose -f docker-compose.dev.yml up -d --build

echo "Waiting for database..."
sleep 8

docker compose -f docker-compose.dev.yml exec app npx prisma migrate deploy
docker compose -f docker-compose.dev.yml exec app npx prisma db seed

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SurgiMart is running"
echo ""
echo "  App:           http://localhost:3001"
echo "  Sanity Studio: http://localhost:3334"
echo "  Health:        http://localhost:3001/api/health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
