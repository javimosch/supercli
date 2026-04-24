---
name: ggc
description: Use this skill when the user wants to run simplified Git commands like status, add, commit, or log. Alternative to raw git for streamlined CLI workflows.
---

# ggc Plugin

Modern Git CLI tool with simplified traditional commands and an interactive fuzzy-picker UI. Streamlines common git operations with intuitive syntax.

## Commands

### Repository Operations
- `ggc repo status` — Show git status in simplified format
- `ggc repo add` — Stage files for commit
- `ggc repo commit` — Commit staged changes
- `ggc repo log` — Show simplified git log

### Utility
- `ggc self version` — Print ggc version
- `ggc _ _` — Passthrough to ggc CLI

## Usage Examples
- "Show git status"
- "Stage all changes"
- "Commit with message 'Fix bug'"
- "Show git log"

## Installation

```bash
curl -sSL https://raw.githubusercontent.com/bmf-san/ggc/main/install.sh | bash
```

## Examples

```bash
# Show repository status
ggc repo status

# Stage all files
ggc repo add .

# Stage specific files
ggc repo add src/main.go

# Commit with a message
ggc repo commit "Fix authentication bug"

# Show simplified log
ggc repo log

# Show log with simple format
ggc repo log simple

# Passthrough: open interactive fuzzy picker (TUI)
ggc _ _

# Passthrough: run any ggc subcommand directly
ggc _ _ diff
```

## Key Features
- Simplified git commands with intuitive syntax
- Interactive fuzzy-picker UI when run without arguments
- Traditional CLI subcommands for headless use
- Works alongside standard git
- Supports all platforms (macOS, Linux, Windows)

## Notes
- Running `ggc` without arguments opens an interactive fuzzy picker TUI; use subcommands for headless scripting
- `ggc` wraps standard git commands with simplified syntax
- Supports all standard git repositories
- Full documentation at https://bmf-san.github.io/ggc/
