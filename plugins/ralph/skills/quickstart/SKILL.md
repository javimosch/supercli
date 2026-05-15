---
name: ralph
description: ralph-cli — autonomous PRD-driven agent loop for AI-powered story-by-story implementation
---

# Ralph — Autonomous PRD-Driven Agent Loop

Ralph is a file-based agent loop that breaks work into **stories** defined in a `prd.json` file and executes them one at a time using AI coding agents (OpenCode, Claude Code, Codex, etc.).

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
- Schema/database → Backend logic → UI components → Integration
- A story is "blocked" until all its `dependsOn` stories pass
- Ralph always selects the highest-priority unblocked story

## Agent Workflow

When an agent learns this skill, it operates in **ralph mode**:

### 1. Create a PRD

Use `ralph init` or create a `prd.json` manually:

```bash
ralph init "Feature Name" --prd ./tasks/prd.json
```

### 2. Check Status

See progress at any time:

```bash
ralph status --prd ./tasks/prd.json
```

### 3. Run the Agent Loop

Execute stories one at a time:

```bash
ralph run --prd ./tasks/prd.json
```

Or use supercli:

```bash
sc ralph run run --prd ./tasks/prd.json
```

### 4. Preview Prompts (Dry Run)

See what the agent will receive without executing:

```bash
ralph run --prd ./tasks/prd.json --dry-run
ralph story prompt --prd ./tasks/prd.json --story US-001
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

## Commands Reference

| Command | Description |
|---------|-------------|
| `ralph run --prd <file>` | Execute the agent loop |
| `ralph status --prd <file>` | Show progress |
| `ralph story next --prd <file>` | Show next available story |
| `ralph story prompt --prd <file>` | Print agent prompt for next story |
| `ralph init <name> --prd <file>` | Scaffold a new PRD |

## supercli Usage

```bash
sc ralph init run "Feature name"         # Create PRD
sc ralph run run --prd ./prd.json        # Run the loop
sc ralph status run --prd ./prd.json     # Check progress
sc ralph story next --prd ./prd.json     # Next story
sc ralph prompt run --prd ./prd.json     # Agent prompt
```
