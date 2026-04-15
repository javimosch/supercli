---
name: sem
description: Use this skill when the user wants semantic version control operations - entity-level diff, blame, or impact analysis.
---

# sem Plugin

Semantic version control built on Git. Entity-level diff, blame, graph, and impact analysis for code.

## Commands

### Diff
- `sem diff run` — Entity-level diff with rename detection
- `sem diff run --format json` — JSON output for CI/AI

### Analysis
- `sem impact analyze` — Cross-file dependency graph
- `sem blame run` — Entity-level blame
- `sem log show` — Track entity through history

### Context
- `sem entities list` — List all entities in a file
- `sem context generate` — Token-budgeted LLM context

## Usage Examples

```bash
# Semantic diff of working changes
sem diff

# JSON output for AI agents
sem diff --format json

# Impact analysis - what breaks if this changes
sem impact authenticateUser

# Entity blame
sem blame src/auth.ts --json

# Track entity evolution
sem log validateToken -v

# LLM context within token budget
sem context authenticateUser --budget 4000
```

## Installation

```bash
brew install sem-cli
```

## Key Features
- Entity-level diff (functions, classes, methods) instead of lines
- 23 languages via tree-sitter
- Rename and move detection
- Cross-file dependency analysis
- Token-budgeted LLM context generation
- Can replace `git diff` with `sem setup`
