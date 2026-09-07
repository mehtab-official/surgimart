# Handoff Documentation

## How to Start

**First time:**
1. Copy `.env.example` to `.env.local` and fill in your API keys
2. Run: `make start`

**Every time after:**
```bash
make start    # start everything
make stop     # stop everything
make reset    # wipe data and start fresh
make logs     # watch live logs
make health   # check all services
```

**URLs once running:**
- App: http://localhost:3001
- Sanity Studio: http://localhost:3334
- Health: http://localhost:3001/api/health

## Project Status

The project is fully implemented and tested.

- **Frontend:** Next.js 14 with Tailwind CSS
- **Database:** PostgreSQL with Prisma
- **Cache:** Redis
- **Content:** Sanity.io
- **Search:** Algolia
- **Testing:** Jest (Unit/Component) and Playwright (E2E)
- **Security:** CSRF protection and Rate limiting implemented

## Testing

Run tests with:
```bash
make test        # unit/component tests
make test-e2e    # E2E tests
make test-all    # all tests
```
