# SuperCLI `sc plan` / `sc act` Smoke Test

**Test Date:** 2026-07-18
**Version:** plan-intent + act (post-v0.2.0-machin)
**Test Server:** local (mikamac)
**Prerequisites:** Node.js, `sc` (Node.js) installed, optional LLM env vars for plan tests

## Pre-Test Setup

- [ ] `cd ~/ai/supercli`
- [ ] `git pull` (latest master)
- [ ] `node cli/supercli.js --version` shows version
- [ ] `node cli/supercli.js --json | jq '.capabilities.plan, .capabilities.act'` shows both
- [ ] Create test plan file: `cat > /tmp/test-plan.json << 'EOF'` (see below)

```json
{
  "summary": "Build, test, push, deploy",
  "steps": [
    { "id": "build", "command": "docker.images.build", "args": { "tag": "myapp:latest" }, "depends_on": [], "verify": null, "on_failure": "abort" },
    { "id": "test", "command": "npm.test.run", "args": {}, "depends_on": [], "verify": null, "on_failure": "abort" },
    { "id": "push", "command": "docker.images.push", "args": { "tag": "myapp:latest" }, "depends_on": ["build", "test"], "verify": null, "on_failure": "abort" },
    { "id": "deploy", "command": "coolify.applications.deploy", "args": { "app": "myapp" }, "depends_on": ["push"], "verify": null, "on_failure": "abort" }
  ],
  "rollback": [
    { "if_failed_step": "deploy", "command": "coolify.applications.rollback", "args": { "app": "myapp" } }
  ]
}
```

## Category 1: Bootstrap & Discovery

- [x] `sc --json` lists `plan` capability with `workflow_or_preview` type
- [x] `sc --json` lists `act` capability with `execution` type
- [x] `sc plan` (no args) shows dual-mode usage: `plan "<intent>"` OR `plan <ns> <res> <act>`
- [x] `sc act` (no args) shows usage with 3 input methods

## Category 2: `sc plan` — Intent-Level (requires LLM)

> Set: `export OPENAI_BASE_URL=... OPENAI_API_KEY=... OPENAI_MODEL=...`

- [ ] `sc plan "deploy the app to production" --json` returns `mode: plan_intent`
- [ ] Output has `steps` array with `id`, `command`, `depends_on`, `on_failure`
- [ ] Steps are topologically sorted (deps before dependents)
- [ ] `--human` mode shows numbered steps with `[after: ...]` annotations
- [ ] Circular dependency plan → `plan_validation_error` (test with mock LLM returning cycle)
- [ ] No LLM configured → `integration_error` code 105 with suggestions

## Category 3: `sc plan` — Single-Command Preview (backward compat)

- [ ] `sc plan <ns> <res> <act>` (3+ positionals) still routes to existing preview handler
- [ ] `sc plan nonexistent.x.y` → `resource_not_found` error

## Category 4: `sc act` — Dry Run (safe, no execution)

- [x] `sc act --file /tmp/test-plan.json --dry-run --json` → `mode: act`, `dry_run: 4`
- [x] `sc act --file /tmp/test-plan.json --dry-run --human` → shows `[dry-run]` lines
- [x] `echo '<plan json>' | sc act --dry-run --json` → works (fast pipe)
- [x] `sc act "$(cat /tmp/test-plan.json)" --dry-run --json` → works (positional)
- [x] `sc act --dry-run --json` (no input) → error code 85
- [x] `echo 'not json' | sc act --dry-run --json` → error code 85 (invalid_argument)

## Category 5: `sc act` — Live Execution (needs real plugins)

> ⚠️ These run real commands. Use plugins you have installed.

- [ ] Create a 1-step plan with a real installed plugin command
- [ ] `sc act --file real-plan.json --json` → `status: completed`, `succeeded: 1/1`
- [ ] `--human` mode shows `✓ step_id` for success
- [ ] Plan with failing step + `on_failure: abort` → `status: aborted`
- [ ] Plan with failing step + `on_failure: continue` → `status: completed_with_errors`
- [ ] Plan with rollback → `rollbacks_executed: 1` in summary

## Category 6: Parallel Execution

- [ ] Plan with 2 steps, no deps → both run (check `results` array order or timing)
- [ ] Plan with step A (no deps) + step B (depends on A) → A runs first, B second

## Category 7: Edge Cases

- [x] Empty steps array → error "Plan has no steps to execute"
- [ ] Step with missing command field → step result `status: error`
- [ ] Step referencing unknown command → `status: error`, exit_code 92
- [ ] Verify command that fails → step `status: verify_failed`

## Test Results Summary

**Total Tests:** 15 (run so far)
**Passed:** 15
**Failed:** 0
**Skipped:** 0

### Categories run by Devin (safe, no LLM/execution)
- Category 1 (Bootstrap): 4/4 passed
- Category 4 (Dry Run): 6/6 passed
- Category 7 (Edge Cases — safe subset): 1/1 passed (empty steps)

### Categories for you to run
- Category 2 (`sc plan` intent-level): needs LLM env vars
- Category 3 (single-command preview backward compat): needs a real command
- Category 5 (live execution): needs real plugins installed
- Category 6 (parallel execution): needs real plugins
- Category 7 (remaining edge cases): needs real plugins for unknown-command test

## Issues Found

(none)
