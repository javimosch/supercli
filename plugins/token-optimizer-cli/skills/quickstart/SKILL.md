---
name: token-optimizer-cli
description: Use this skill when the user wants to analyze token usage, find context bloat, or optimize their codebase for AI agent context windows.
---

# Token Optimizer CLI

Go CLI for token optimization, bloat detection, and context audit. Helps reduce AI agent costs and improve context quality.

## Commands

### `sc token-optimizer project scan [path]`
Recursively scan files, count tokens per model (GPT-4, GPT-4o, Claude-3), show top consumers.

```
sc token-optimizer project scan .
sc token-optimizer project scan ./src --json
```

### `sc token-optimizer project audit [path]`
Deep scan with bloat detection. Finds large files, long lines, boilerplate, blank line waste.

```
sc token-optimizer project audit .
```

### `sc token-optimizer file check <file>`
Single file analysis with detailed token breakdown and per-line stats.

```
sc token-optimizer file check main.go
sc token-optimizer file check README.md --json
```

### `sc token-optimizer project summary [path]`
Project-level summary with token distribution and cost estimate.

```
sc token-optimizer project summary .
```

## Model Cost Reference

| Model | Rate | $ per 1M input tok |
|-------|------|-------------------|
| GPT-4o | ~4.5 chars/tok | $2.50 |
| GPT-4 | ~4 chars/tok | $10.00 |
| Claude-3 | ~3.5 chars/tok | $3.00 |

Scan output estimates: tokens/file × rate. Use as ballpark.

## Bloat Patterns Detected

- Files >500 tokens → split or trim
- Lines >500 chars → line wrapping needed
- High blank line density (>33%) → compress vertical space
- High comment density (>50%) → trim redundant comments
- Boilerplate/generated code → exclude from context
- Binary/lock/build files → add to .gitignore or exclude

## Tips

1. Run `audit` on `AGENTS.md`, `.claude/`, `.opencode/` dirs — common bloat sources
2. Use `--json` for programmatic consumption
3. Files >1000 tokens flagged as bloat
4. Cost estimate assumes full context reload each turn

## Prompt Templates

- "Scan this project for token bloat"
- "Audit my config files for optimization opportunities"
- "Check this file for token count and issues"
- "Give me a summary of token usage for this codebase"
- "How many tokens does my AGENTS.md use?"
