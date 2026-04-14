# DewDrops Plugin Quickstart

## Overview

DewDrops serializes a Git repository into a single Markdown file for LLM context stuffing. Perfect for feeding codebases to AI assistants.

## Commands

### Full Repository Dump
- `dewdrops dump full` — Serialize entire repo to Markdown

### Repo Map (Lightweight Overview)
- `dewdrops map show` — Structural overview with signatures + token estimates
- Supports extension filtering: `--extensions go,py`

### Scoped Selection
- `dewdrops dump scoped` — Dump only specified files/directories

### Change Review
- `dewdrops review changes` — Generate map + diff + content for recent changes

### Raw Passthrough
- `dewdrops _ _` — Run any dewdrops command directly

## Usage Examples

```bash
# Full repo dump
supercli dewdrops dump full --repo .

# Structural map with signatures
supercli dewdrops map show --repo .

# Map only Go and Python files
supercli dewdrops map show --repo . --extensions go,py

# Dump specific directory
supercli dewdrops dump scoped --paths internal/auth/ --repo .

# Review changes since main branch
supercli dewdrops review changes --ref main --repo .

# Review last 3 commits
supercli dewdrops review changes --ref HEAD~3 --repo .

# Custom output path
supercli dewdrops dump full --repo . --output context.md
```

## Typical Workflow

1. **Get overview**: `dewdrops map show .` → paste to LLM
2. **LLM requests details**: `dewdrops dump scoped --paths src/main.go,lib/utils.go .`
3. **Paste requested files** to LLM

## Key Features

- **Tree-first output** — Directory structure at top
- **Signature extraction** — Functions, types, classes detected
- **Token estimates** — Know context window usage
- **Git-native ignore** — Respects .gitignore
- **Binary safety** — Skips binary files automatically
- **Change review** — `--since` produces map + diff + content combo