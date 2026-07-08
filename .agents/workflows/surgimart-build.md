# SurgiMart Autonomous Build Loop
# Workflow file for Antigravity — trigger with /surgimart-build
# This runs the complete PLAN→BUILD→TEST→REVIEW→AUDIT loop until done

---

## TRIGGER

Type `/surgimart-build` in Agent Manager to start this workflow.

---

## WHAT THIS DOES

Runs the full autonomous build loop for SurgiMart without asking you any questions.

It will:
1. Read `tasks.md` to find the next TODO task
2. Write an implementation plan (Artifact) before touching code
3. Write the code
4. Run all test and audit checks
5. Fix anything that fails
6. Mark the task DONE and move to the next one
7. Repeat until all 37 tasks are complete
8. Run the full E2E suite
9. Open the browser and take screenshots as Artifacts
10. Write `HANDOFF.md`
11. Notify you that the app is ready to test

You do not need to do anything. Just watch the Agent Manager dashboard.

---

## LOOP INSTRUCTIONS FOR THE AGENT

Read `tasks.md`. Find the first task with `Status: TODO`.

For each TODO task, execute this loop exactly:

### Step 1 — PLAN (write Artifact before any code)

Create an Artifact titled "Plan: [Task ID] [Task Name]" containing:
- What files will be created or modified
- What the implementation approach is
- What the tests will verify
- Estimated risk: LOW / MEDIUM / HIGH

### Step 2 — BUILD

Write the code. Follow all rules in GEMINI.md.
Never create placeholder or stub implementations.
Every function must be complete and working.

### Step 3 — TEST (run all 5, all must pass)

```bash
# Run these in order. Stop and fix if any fails.

npx tsc --noEmit
# Expected: zero errors

npm run lint -- --max-warnings 0
# Expected: zero warnings

npm test -- --watchAll=false --passWithNoTests
# Expected: all tests pass

npm test -- --coverage --watchAll=false --coverageReporters=text-summary
# Expected: lines ≥ 80%, functions ≥ 80%, branches ≥ 70%

npm run build
# Expected: build succeeds, zero errors
```

If any check fails:
1. Read the full error output
2. Fix the root cause
3. Re-run only that check
4. If still failing after 3 attempts: move to AUDIT step anyway, note the failure

### Step 4 — REVIEW (browser check)

```bash
npm run dev &
sleep 5
```

Open http://localhost:3000 in the browser subagent.
Take a screenshot as an Artifact titled "Review: [Task ID]".
Check: does the UI look correct? Is the feature working visually?
Open DevTools → Console → verify zero errors and zero warnings.
Close the dev server after review.

### Step 5 — AUDIT

```bash
npm audit --audit-level=high
# Expected: 0 high or critical vulnerabilities

grep -r "any" src/ --include="*.ts" --include="*.tsx" -n
# Expected: zero results (every 'any' must be replaced with a proper type)

grep -r "console.log" src/ --include="*.ts" --include="*.tsx" -n
# Expected: zero results in production code (console.error is OK)

grep -r "@ts-ignore" src/ --include="*.ts" --include="*.tsx" -n
# Expected: zero results
```

If audit finds issues: fix them now before marking task DONE.

### Step 6 — FIX

If anything failed in steps 3-5:
- Fix the specific issue
- Re-run only the failing check
- Maximum 5 attempts per issue
- After 5 failed attempts: update task status to BLOCKED, write the error in tasks.md, move to next task

### Step 7 — LOG

Mark task as DONE in tasks.md:
```
Status: DONE
Completed: [datetime]
Tests: PASS (X unit, Y component, Z e2e)
Coverage: X% lines
Audit: PASS / ISSUES: [list]
```

Append to agent-log.md:
```
---
[datetime] DONE: T-XX — Task Name
Files changed: list
Test result: PASS/FAIL
Coverage: X%
Audit: PASS/FAIL
Notes: anything important learned
```

### Step 8 — REPEAT

Go back to Step 1 with the next TODO task.

---

## WHEN ALL TASKS ARE DONE

After T-37 is complete:

```bash
# Final full test run
make test-ci

# Start the app
make docker-dev
```

Open http://localhost:3000. Take screenshots of:
- `/` — homepage with products visible
- `/shop` — shop grid with filters
- `/product/[slug]` — product detail page
- `/checkout` — checkout step 1
- `/login` — login page

Save all as Artifacts.

Write `HANDOFF.md` using the template in the surgimart-loop skill.

Post the completion notification to the user (see GEMINI.md for exact format).

**STOP. Do not do anything else. Wait for the user to test manually.**
