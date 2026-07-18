# SuperCLI `sc plan` / `sc act` Smoke Test

**Test Date:** 2026-07-18
**Version:** plan-intent + act (post-v0.2.0-machin)
**Test Server:** local (mikamac)
**Prerequisites:** Node.js, `sc` (Node.js) installed
**LLM:** Mock LLM server (Python http.server) for Category 2 — tests the code path (parsing, validation, topological sort, output) without needing a real LLM API
**Live commands:** Bundled `system.test.foo`, `monitor.disk.space`, `monitor.memory.usage` (all safe, read-only)

## Pre-Test Setup

- [x] `cd ~/ai/supercli`
- [x] `git pull` (latest master)
- [x] `node cli/supercli.js --json` lists both `plan` and `act` capabilities
- [x] Create test plan files (see categories below)

## Category 1: Bootstrap & Discovery

- [x] `sc --json` lists `plan` capability with `workflow_or_preview` type
- [x] `sc --json` lists `act` capability with `execution` type
- [x] `sc plan` (no args) shows dual-mode usage: `plan "<intent>"` OR `plan <ns> <res> <act>`
- [x] `sc act` (no args) shows usage with 3 input methods

## Category 2: `sc plan` — Intent-Level (mock LLM)

> Used a mock LLM server returning a fixed plan JSON. This tests the actual code path — parsing, validation, topological sort, output formatting.

- [x] `sc plan "check disk and health" --json` returns `mode: plan_intent`
- [x] Output has `steps` array with `id`, `command`, `depends_on`, `on_failure`
- [x] Steps are topologically sorted (deps before dependents — `disk` and `health` before `report`)
- [x] `--human` mode shows numbered steps with `[after: ...]` annotations
- [x] Circular dependency plan → `plan_validation_error` (mock LLM returning cycle)
- [x] No LLM configured → code 105 with suggestions (actual type: `auth_error` due to leftover `.env` OPENAI_BASE_URL — same code 105)

## Category 3: `sc plan` — Single-Command Preview (backward compat)

- [x] `sc plan system test foo --json` (3+ positionals) still routes to existing preview handler (returns `plan_id`, `steps`, `risk_level`, `status: planned`)
- [x] `sc plan nonexistent x y` → `resource_not_found` error

## Category 4: `sc act` — Dry Run (safe, no execution)

- [x] `sc act --file /tmp/test-plan.json --dry-run --json` → `mode: act`, `dry_run: 4`
- [x] `sc act --file /tmp/test-plan.json --dry-run --human` → shows `[dry-run]` lines
- [x] `echo '<plan json>' | sc act --dry-run --json` → works (fast pipe)
- [x] `sc act "$(cat /tmp/test-plan.json)" --dry-run --json` → works (positional)
- [x] `sc act --dry-run --json` (no input) → error code 85
- [x] `echo 'not json' | sc act --dry-run --json` → error code 85 (invalid_argument)

## Category 5: `sc act` — Live Execution (real bundled commands)

> Used safe bundled commands: `system.test.foo` (health check), `monitor.disk.space`, `monitor.memory.usage`.

- [x] 1-step plan with `system.test.foo` → `status: completed`, `succeeded: 1/1`
- [x] `--human` mode shows `✓ health` for success
- [x] Plan with failing step (`nonexistent.fake.command`) + `on_failure: abort` → `status: aborted`
- [x] Plan with failing step + `on_failure: continue` → `status: completed_with_errors`
- [x] Plan with rollback → `rollbacks_executed: 1` in summary

## Category 6: Parallel Execution

- [x] Plan with 2 no-dep steps (`monitor.disk.space` + `monitor.memory.usage`) → both succeed (`succeeded: 2`)
- [x] Plan with step A (`system.test.foo`, no deps) + step B (`monitor.disk.space`, depends on A) → A runs first, B second (verified by results array order)

## Category 7: Edge Cases

- [x] Empty steps array → error "Plan has no steps to execute"
- [x] Step with missing `command` field → step result `status: error` (fixed: was crashing with `undefined.split(".")`, added guard)
- [x] Step referencing unknown command → `status: error`, `exit_code: 92`
- [x] Verify command that fails (nonexistent) → step `status: verify_failed` (fixed: was returning "skipped" for not-found verify commands, changed to "failed")

## Category 8: `sc review` — Audit & Failure Analysis

> Uses results from `sc act` execution (mixed plan: 1 success, 1 failure, 1 rollback).

- [x] `sc --json` lists `review` capability with `audit` type
- [x] `sc review --file results.json --json` → `mode: review`
- [x] Health assessment: `degraded` for completed_with_errors, `healthy` for all-success
- [x] Success rate calculated: 67% for 2/3 succeeded
- [x] Failure groups categorized: `command_not_found` with suggested fix
- [x] Audit trail has all steps with ✓/✗/⚠/⊘ icons
- [x] Rollback audit shows rollback status
- [x] `--save` writes review to file
- [x] No input → error code 85
- [x] Positional JSON works (`sc review "$RESULTS" --json`)
- [x] `--human` mode shows icons (✓/✗)
- [x] `--llm-analyze` with mock LLM returns fix suggestions
- [x] Healthy plan (all success) → `health: healthy`, `success_rate: 100`

## Test Results Summary

**Total Tests:** 41
**Passed:** 41
**Failed:** 0
**Skipped:** 0

### Results by category
- Category 1 (Bootstrap): 4/4 passed
- Category 2 (Plan intent-level): 6/6 passed (mock LLM)
- Category 3 (Backward compat): 2/2 passed
- Category 4 (Dry Run): 6/6 passed
- Category 5 (Live execution): 5/5 passed
- Category 6 (Parallel execution): 2/2 passed
- Category 7 (Edge cases): 4/4 passed (2 bugs found and fixed)
- Category 8 (Review): 13/13 passed

## Issues Found

### Bug 1: Missing `command` field crashes `sc act` (FIXED)
- **Impact:** Plan with a step missing the `command` field caused `TypeError: Cannot read properties of undefined (reading 'split')` instead of a graceful error
- **Fix:** Added guard in `executeStep()` — returns `{status: "error", error: "Step missing 'command' field", exit_code: 85}` before attempting `split(".")`
- **File:** `cli/act.js`

### Bug 2: Verify command not found returned "skipped" instead of "failed" (FIXED)
- **Impact:** When a verify command was specified but not found in config, `executeVerify()` returned `{status: "skipped"}` — the step was marked as successful even though verification couldn't run
- **Fix:** Changed to return `{status: "failed", error: "verify command not found"}` — if you specify a verify command, it must exist; if it doesn't, that's a verification failure
- **File:** `cli/act.js`

### Note: `sc plan | sc act` pipeline limitation
- **Impact:** Piping `sc plan` output directly to `sc act` doesn't work for slow producers (LLM-powered `sc plan`) because the main CLI's `readStdin` has a 50ms timeout
- **Workaround:** Use `--file`: `sc plan "..." --json > plan.json && sc act --file plan.json`
- **Status:** Documented in usage error, not a bug — the 50ms timeout is intentional for the main CLI's flag-merge feature
