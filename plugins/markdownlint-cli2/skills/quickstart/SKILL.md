---
name: markdownlint-cli2
description: Use this skill when the user wants to lint Markdown files, fix Markdown formatting, check MD syntax, or enforce Markdown style rules.
---

# markdownlint-cli2 Plugin

Markdown linter with rule configuration and fix support.

## Commands

### Lint
- `markdownlint-cli2 lint run` — Lint Markdown files
- `markdownlint-cli2 lint fix` — Lint and auto-fix Markdown files

## Usage Examples
- "Check all Markdown files for issues"
- "Fix formatting in my README.md"
- "Lint the docs directory"
- "Auto-fix markdown issues"

## Installation

```bash
npm install -g markdownlint-cli2
```

## Examples

```bash
# Lint all markdown files
markdownlint-cli2 "*.md"

# Lint with fix
markdownlint-cli2 --fix "*.md"

# Lint specific directory
markdownlint-cli2 "docs/**/*.md"

# With config
markdownlint-cli2 --config .markdownlint-cli2.jsonc "*.md"
```
