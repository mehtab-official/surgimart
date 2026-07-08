# ══════════════════════════════════════════════════════════════════════════════
#  SurgiMart — Makefile
#  Usage: make <target>
#  Run `make help` to see all available commands
# ══════════════════════════════════════════════════════════════════════════════

.PHONY: help dev build start lint type-check \
        test test-all test-e2e \
        db-migrate db-push db-seed db-studio db-reset \
        docker-dev docker-prod docker-down docker-logs docker-clean \
        algolia-sync algolia-config \
        audit audit-fix security-check \
        email-preview setup clean

# ── Colours ───────────────────────────────────────────────────────────────────
CYAN  := \033[36m
GREEN := \033[32m
RED   := \033[31m
YELLOW:= \033[33m
RESET := \033[0m
BOLD  := \033[1m

# ── Help ──────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "$(BOLD)$(CYAN)SurgiMart — Available Commands$(RESET)"
	@echo "══════════════════════════════════════════"
	@echo ""
	@echo "$(BOLD)🚀 Development$(RESET)"
	@echo "  $(CYAN)make dev$(RESET)              Start Next.js dev server (localhost:3000)"
	@echo "  $(CYAN)make build$(RESET)            Production build"
	@echo "  $(CYAN)make start$(RESET)            Start production server"
	@echo "  $(CYAN)make setup$(RESET)            First-time setup (install + migrate + seed)"
	@echo ""
	@echo "$(BOLD)🧪 Testing$(RESET)"
	@echo "  $(CYAN)make test$(RESET)             Run all unit + component tests"
	@echo "  $(CYAN)make test-watch$(RESET)       Run tests in watch mode"
	@echo "  $(CYAN)make test-coverage$(RESET)    Run tests with coverage report"
	@echo "  $(CYAN)make test-e2e$(RESET)         Run Playwright E2E tests"
	@echo "  $(CYAN)make test-ci$(RESET)          Full CI test suite (unit + e2e + coverage)"
	@echo "  $(CYAN)make audit$(RESET)            Run security + lint audit"
	@echo ""
	@echo "$(BOLD)🗄️  Database$(RESET)"
	@echo "  $(CYAN)make db-migrate$(RESET)       Run pending Prisma migrations"
	@echo "  $(CYAN)make db-push$(RESET)          Push schema changes without migration"
	@echo "  $(CYAN)make db-seed$(RESET)          Seed database with dev data"
	@echo "  $(CYAN)make db-studio$(RESET)        Open Prisma Studio GUI"
	@echo "  $(CYAN)make db-reset$(RESET)         ⚠️  Drop + recreate + seed (dev only)"
	@echo ""
	@echo "$(BOLD)🐳 Docker$(RESET)"
	@echo "  $(CYAN)make docker-dev$(RESET)       Start all services in dev mode (hot-reload)"
	@echo "  $(CYAN)make docker-prod$(RESET)      Start all services in production mode"
	@echo "  $(CYAN)make docker-down$(RESET)      Stop all containers"
	@echo "  $(CYAN)make docker-logs$(RESET)      Stream app container logs"
	@echo "  $(CYAN)make docker-clean$(RESET)     ⚠️  Remove containers + volumes"
	@echo ""
	@echo "$(BOLD)🔍 Search$(RESET)"
	@echo "  $(CYAN)make algolia-sync$(RESET)     Sync Sanity products to Algolia"
	@echo "  $(CYAN)make algolia-config$(RESET)   Configure Algolia index settings"
	@echo ""
	@echo "$(BOLD)📧 Email$(RESET)"
	@echo "  $(CYAN)make email-preview$(RESET)    Preview email templates in browser"
	@echo ""
	@echo "$(BOLD)🔐 Security$(RESET)"
	@echo "  $(CYAN)make security-check$(RESET)   Run npm audit + check for secrets in code"
	@echo "  $(CYAN)make audit-fix$(RESET)        Auto-fix npm audit vulnerabilities"
	@echo ""
	@echo "$(BOLD)🧹 Cleanup$(RESET)"
	@echo "  $(CYAN)make clean$(RESET)            Remove .next, node_modules, coverage"
	@echo ""

# ══════════════════════════════════════════════════════════════════════════════
#  FIRST-TIME SETUP
# ══════════════════════════════════════════════════════════════════════════════

## Complete first-time setup
setup:
	@echo "$(GREEN)► Installing dependencies...$(RESET)"
	npm install
	@echo "$(GREEN)► Checking .env.local...$(RESET)"
	@if [ ! -f .env.local ]; then \
		cp .env.example .env.local; \
		echo "$(YELLOW)⚠  Created .env.local from .env.example — fill in your API keys!$(RESET)"; \
	else \
		echo "$(GREEN)✓ .env.local already exists$(RESET)"; \
	fi
	@echo "$(GREEN)► Generating Prisma client...$(RESET)"
	npx prisma generate
	@echo "$(GREEN)► Running database migrations...$(RESET)"
	npx prisma migrate dev --name init
	@echo "$(GREEN)► Seeding database...$(RESET)"
	npx ts-node prisma/seed.ts
	@echo ""
	@echo "$(GREEN)$(BOLD)✅ Setup complete! Run: make dev$(RESET)"

# ══════════════════════════════════════════════════════════════════════════════
#  DEVELOPMENT
# ══════════════════════════════════════════════════════════════════════════════

dev:
	@echo "$(GREEN)► Starting dev server...$(RESET)"
	npm run dev

build:
	@echo "$(GREEN)► Building for production...$(RESET)"
	npm run build

# ── Start everything ─────────────────────────────────────────
start:
	@echo "Starting SurgiMart..."
	@cp -n .env.example .env.local 2>/dev/null || true
	@docker compose -f docker-compose.dev.yml up -d --build
	@echo "Waiting for services..."
	@sleep 8
	@$(MAKE) db-migrate
	@$(MAKE) db-seed
	@$(MAKE) health
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  App:          http://localhost:3001"
	@echo "  Sanity Studio: http://localhost:3334"
	@echo "  Health:       http://localhost:3001/api/health"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Stop everything ──────────────────────────────────────────
stop:
	docker compose -f docker-compose.dev.yml down

# ── Stop and wipe all data ───────────────────────────────────
reset:
	docker compose -f docker-compose.dev.yml down -v
	@echo "All data wiped. Run: make start"

# ── Health check all services ────────────────────────────────
health:
	@echo "Checking services..."
	@curl -sf http://localhost:3001/api/health && echo "  App: OK" || echo "  App: NOT READY"
	@docker compose -f docker-compose.dev.yml ps --format "table {{.Name}}\t{{.Status}}" 2>/dev/null | tail -n +2 | while read line; do echo "  $$line"; done

lint:
	@echo "$(GREEN)► Running ESLint...$(RESET)"
	npm run lint

type-check:
	@echo "$(GREEN)► Running TypeScript type check...$(RESET)"
	npx tsc --noEmit

# ── Testing ──────────────────────────────────────────────────

# ══════════════════════════════════════════════════════════════════════════════
#  DATABASE
# ══════════════════════════════════════════════════════════════════════════════

db-migrate:
	docker compose -f docker-compose.dev.yml exec app npx prisma db push

db-migrate-prod:
	@echo "$(GREEN)► Deploying migrations to production...$(RESET)"
	npx prisma migrate deploy

db-push:
	@echo "$(YELLOW)⚠  Pushing schema (no migration file created)...$(RESET)"
	npx prisma db push

db-seed:
	docker compose -f docker-compose.dev.yml exec app npx prisma db seed

db-studio:
	@echo "$(GREEN)► Opening Prisma Studio at http://localhost:5555...$(RESET)"
	npx prisma studio

db-reset:
	@echo "$(RED)⚠  This will DROP ALL DATA. Are you sure? [y/N]$(RESET)"
	@read confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		echo "$(RED)► Resetting database...$(RESET)"; \
		npx prisma migrate reset --force; \
		npx ts-node prisma/seed.ts; \
		echo "$(GREEN)✅ Database reset and reseeded$(RESET)"; \
	else \
		echo "Cancelled."; \
	fi

db-generate:
	@echo "$(GREEN)► Regenerating Prisma client...$(RESET)"
	npx prisma generate

# ══════════════════════════════════════════════════════════════════════════════
#  DOCKER
# ══════════════════════════════════════════════════════════════════════════════

docker-dev:
	@echo "$(GREEN)► Starting Docker services in development mode...$(RESET)"
	@echo "$(CYAN)  App:      http://localhost:3000$(RESET)"
	@echo "$(CYAN)  Postgres: localhost:5432$(RESET)"
	@echo "$(CYAN)  Redis:    localhost:6379$(RESET)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

docker-dev-bg:
	@echo "$(GREEN)► Starting Docker services in background...$(RESET)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

docker-prod:
	@echo "$(GREEN)► Starting Docker services in production mode...$(RESET)"
	docker-compose up -d
	@echo "$(GREEN)✅ Services started. Check: make docker-logs$(RESET)"

docker-down:
	@echo "$(GREEN)► Stopping all Docker services...$(RESET)"
	docker-compose down

docker-logs:
	@echo "$(GREEN)► Streaming app logs (Ctrl+C to stop)...$(RESET)"
	docker-compose logs -f app

docker-logs-all:
	docker-compose logs -f

docker-clean:
	@echo "$(RED)⚠  This will remove ALL containers and volumes. Data will be lost!$(RESET)"
	@read confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		docker-compose down -v --remove-orphans; \
		echo "$(GREEN)✅ Docker environment cleaned$(RESET)"; \
	else \
		echo "Cancelled."; \
	fi

docker-rebuild:
	@echo "$(GREEN)► Rebuilding Docker images from scratch...$(RESET)"
	docker-compose build --no-cache

docker-migrate:
	@echo "$(GREEN)► Running migrations inside Docker container...$(RESET)"
	docker-compose exec app npx prisma migrate deploy

docker-seed:
	@echo "$(GREEN)► Seeding database inside Docker container...$(RESET)"
	docker-compose exec app npx ts-node prisma/seed.ts

docker-shell:
	@echo "$(GREEN)► Opening shell in app container...$(RESET)"
	docker-compose exec app sh

docker-psql:
	@echo "$(GREEN)► Opening PostgreSQL shell...$(RESET)"
	docker-compose exec postgres psql -U surgi -d surgimart

docker-redis:
	@echo "$(GREEN)► Opening Redis CLI...$(RESET)"
	docker-compose exec redis redis-cli -a $${REDIS_PASSWORD}

docker-health:
	@echo "$(GREEN)► Checking service health...$(RESET)"
	@curl -sf http://localhost:3000/api/health | python3 -m json.tool || echo "$(RED)✗ App not healthy$(RESET)"
	@docker-compose ps

docker-stats:
	docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# ══════════════════════════════════════════════════════════════════════════════
#  ALGOLIA SEARCH
# ══════════════════════════════════════════════════════════════════════════════

algolia-sync:
	@echo "$(GREEN)► Syncing Sanity products to Algolia...$(RESET)"
	npx ts-node scripts/sync-algolia.ts
	@echo "$(GREEN)✅ Algolia sync complete$(RESET)"

algolia-config:
	@echo "$(GREEN)► Configuring Algolia index settings...$(RESET)"
	npx ts-node scripts/configure-algolia.ts
	@echo "$(GREEN)✅ Algolia index configured$(RESET)"

# ══════════════════════════════════════════════════════════════════════════════
#  EMAIL
# ══════════════════════════════════════════════════════════════════════════════

email-preview:
	@echo "$(GREEN)► Starting React Email preview server at http://localhost:3001...$(RESET)"
	npx email dev --dir emails --port 3001

# ══════════════════════════════════════════════════════════════════════════════
#  SECURITY & AUDIT
# ══════════════════════════════════════════════════════════════════════════════

security-check:
	@echo "$(GREEN)► Running npm security audit...$(RESET)"
	npm audit
	@echo ""
	@echo "$(GREEN)► Checking for hardcoded secrets...$(RESET)"
	@grep -rn "sk_live_\|pk_live_\|AKIA\|password.*=.*['\"][^'\"]\{8\}" src/ --include="*.ts" --include="*.tsx" | \
		grep -v ".env" | grep -v "node_modules" || echo "$(GREEN)✓ No obvious secrets found$(RESET)"
	@echo ""
	@echo "$(GREEN)► Checking for console.log in production code...$(RESET)"
	@grep -rn "console\.log" src/ --include="*.ts" --include="*.tsx" | wc -l | xargs -I{} echo "  {} console.log statements found"

audit-fix:
	@echo "$(GREEN)► Auto-fixing npm vulnerabilities...$(RESET)"
	npm audit fix

audit:
	@echo "$(BOLD)$(CYAN)═══ SurgiMart Code Audit ═══$(RESET)"
	@echo ""
	@echo "$(GREEN)1. TypeScript check$(RESET)"
	@npx tsc --noEmit && echo "$(GREEN)  ✓ No type errors$(RESET)" || echo "$(RED)  ✗ Type errors found$(RESET)"
	@echo ""
	@echo "$(GREEN)2. ESLint$(RESET)"
	@npm run lint && echo "$(GREEN)  ✓ No lint errors$(RESET)" || echo "$(RED)  ✗ Lint errors found$(RESET)"
	@echo ""
	@echo "$(GREEN)3. Security$(RESET)"
	@npm audit --audit-level=high && echo "$(GREEN)  ✓ No high vulnerabilities$(RESET)" || echo "$(RED)  ✗ Vulnerabilities found$(RESET)"
	@echo ""
	@echo "$(GREEN)4. Tests$(RESET)"
	@npm test -- --watchAll=false --passWithNoTests && echo "$(GREEN)  ✓ All tests pass$(RESET)" || echo "$(RED)  ✗ Tests failing$(RESET)"
	@echo ""
	@echo "$(GREEN)5. Environment variables$(RESET)"
	@node -e "\
		const required = ['DATABASE_URL','NEXTAUTH_SECRET','STRIPE_SECRET_KEY',\
			'NEXT_PUBLIC_SANITY_PROJECT_ID','RESEND_API_KEY',\
			'NEXT_PUBLIC_ALGOLIA_APP_ID','NEXT_PUBLIC_ALGOLIA_SEARCH_KEY'];\
		const missing = required.filter(k => !process.env[k]);\
		if (missing.length) { console.log('  Missing: ' + missing.join(', ')); process.exit(1); }\
		else console.log('  ✓ All required env vars set');\
	" || true
	@echo ""
logs:
	docker compose -f docker-compose.dev.yml logs -f

logs-app:
	docker compose -f docker-compose.dev.yml logs -f app

# ── Tests ────────────────────────────────────────────────────
test:
	npm test -- --watchAll=false

test-e2e:
	npx playwright test

test-all:
	bash run-all-tests.sh

# ══════════════════════════════════════════════════════════════════════════════
#  CLEANUP
# ══════════════════════════════════════════════════════════════════════════════

clean:
	@echo "$(GREEN)► Cleaning build artifacts...$(RESET)"
	rm -rf .next coverage playwright-report test-results
	@echo "$(GREEN)✅ Clean complete$(RESET)"

clean-all: clean
	@echo "$(GREEN)► Removing node_modules...$(RESET)"
	rm -rf node_modules
	@echo "$(GREEN)✅ Full clean complete$(RESET)"

# ══════════════════════════════════════════════════════════════════════════════
#  PRODUCTION DEPLOYMENT (VPS / self-hosted)
# ══════════════════════════════════════════════════════════════════════════════

deploy-prod:
	@echo "$(GREEN)► Deploying to production...$(RESET)"
	git pull origin main
	npm ci
	npx prisma migrate deploy
	npm run build
	docker-compose up -d --build
	@echo "$(GREEN)✅ Deployed!$(RESET)"
	make docker-health
