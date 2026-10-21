---
name: czg
description: Interactive Git commit message generator
---
# czg Plugin

Interactive commit message generator following Conventional Commits format.

## Commands
- `czg <resource> <action>` — Execute czg commands
- `czg commit create` — Create an interactive commit with Conventional Commits format
- `czg self version` — Print czg version
- `czg _ _` — Passthrough to czg CLI

## Basic Usage

```bash
# Start interactive commit prompt
sc czg commit create

# Show version
sc czg self version

# Run as commit hook
sc czg commit create -- --hook

# Passthrough
sc czg _ _ -- --mode classic
```

## Configuration

Create a `.czrc` in your project root or `~/.czrc`:

```json
{
  "types": ["feat", "fix", "docs", "style", "refactor", "test", "chore"]
}
```
