---
name: ralph-cli
description: ralph-cli — autonomous PRD-driven agent loop for AI-powered story-by-story implementation
---

# Ralph — Autonomous PRD-Driven Agent Loop

Ralph is a file-based agent loop that breaks work into **stories** defined in a `prd.json` file and executes them one at a time using AI coding agents (OpenCode, Claude Code, Codex, etc.).

## Installation

```bash
npm install -g superacli
sc plugins install ralph-cli
```

## Core Concepts

### PRD (Product Requirements Document)

A JSON file containing a project name, description, and an ordered list of user stories:

```json
{
  "name": "My Feature",
  "branchName": "ralph/my-feature",
  "description": "What this PRD is about",
  "userStories": [
    {
      "id": "US-001",
      "title": "Add database schema",
      "description": "As a developer, I need...",
      "acceptanceCriteria": ["Column x exists", "Migration runs"],
      "priority": 1,
      "passes": false,
      "dependsOn": []
    }
  ]
}
```

### Stories

Each story must be **completable in one agent iteration**. Stories have:
- **ID**: Sequential (US-001, US-002, etc.)
- **Priority**: Lower number = higher priority
- **dependsOn**: Story IDs that must complete first
- **acceptanceCriteria**: Verifiable checks the agent must satisfy
- **passes**: `false` until completed, then `true`

### Dependencies

Stories execute in dependency order:
- Schema/database -> Backend logic -> UI components -> Integration
- A story is "blocked" until all its `dependsOn` stories pass
- Ralph always selects the highest-priority unblocked story

## Agent Workflow

### 1. Create a PRD

```bash
sc ralph-cli init run "Feature Name" --prd ./tasks/prd.json
```

### 2. Check Status

```bash
sc ralph-cli status run --prd ./tasks/prd.json
```

### 3. Run the Agent Loop

```bash
# Default timeout: 30 minutes
sc ralph-cli run run --prd ./tasks/prd.json

# Custom timeout (e.g., 10 minutes for quick tasks, 60 min for complex)
sc ralph-cli run run --prd ./tasks/prd.json --timeout 600
sc ralph-cli run run --prd ./tasks/prd.json --timeout 3600
```

### 4. Preview Prompts (Dry Run)

```bash
sc ralph-cli run run --prd ./tasks/prd.json --dry-run
sc ralph-cli prompt run --prd ./tasks/prd.json --story US-001
```

### 5. Story Lifecycle

1. Ralph selects the next available story
2. Generates a prompt with story details + acceptance criteria + prerequisites
3. Spawns the agent CLI (openmode, claude, codex, etc.) with the prompt
4. Agent implements the story
5. Ralph marks `passes: true` in prd.json
6. Ralph commits changes via git
7. Repeat until all stories pass

## PRD Best Practices

- **One story = one agent iteration**: If a story is too big, split it
- **Acceptance criteria must be verifiable**: Not vague like "works well"
- **Order by dependencies**: Lower-priority stories that depend on earlier ones
- **Include quality gates**: Typecheck, lint, test commands in acceptance criteria
- **Use `ralph/` branch prefix**: E.g., `ralph/kotlin-migration`

## Agent Guidance

### No-Timeout Mode

For long-running or complex agent tasks (e.g., large refactors, migrations), pass `--no-timeout` to disable the per-story timeout entirely. The agent runs until it finishes or is manually interrupted.

```bash
sc ralph-cli run run --prd ./prd.json --no-timeout
```

Note: `--no-timeout` overrides any `--timeout` value. Use with caution — an unresponsive agent may run indefinitely.

### Timeout Management

Ralph defaults to a **30-minute timeout** per story (`--timeout 1800`). Adjust based on story complexity:

- **Quick fixes / simple edits**: `--timeout 120` (2 min)
- **Single-file changes**: `--timeout 300` (5 min)
- **Multi-file features (default)**: `--timeout 1800` (30 min)
- **Complex refactors / migrations**: `--timeout 3600` (60 min)
- **Indeterminate tasks**: `--no-timeout` (disable timeout)

When invoking ralph-cli via supercli from another agent, always pass an appropriate `--timeout` to prevent premature termination:

```bash
sc ralph-cli run run --prd ./prd.json --timeout 1800
```

If a story times out, split it into smaller stories or increase the timeout. If the agent needs indeterminate time (e.g., a complex refactor), use `--no-timeout` to disable the timeout entirely. Ralph retries timed-out stories the next time you run the loop.

## Commands via supercli

| Command | Description |
|---------|-------------|
| `sc ralph-cli run run --prd <file>` | Execute the agent loop (default timeout: 30 min) |
| `sc ralph-cli run run --prd <file> --timeout <sec>` | Run with custom agent timeout |
| `sc ralph-cli run run --prd <file> --no-timeout` | Run with no timeout (agent runs until done) |
| `sc ralph-cli status run --prd <file>` | Show progress |
| `sc ralph-cli story next --prd <file>` | Show next available story |
| `sc ralph-cli prompt run --prd <file>` | Print agent prompt for next story |
| `sc ralph-cli init run <name> --prd <file>` | Scaffold a new PRD |
| `sc ralph-cli --help` | Passthrough to ralph-cli CLI |
