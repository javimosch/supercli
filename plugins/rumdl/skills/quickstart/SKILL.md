---
name: rumdl
description: Use this skill when the user wants to lint, format, or check Markdown files for style violations.
---

# rumdl Plugin

Fast Markdown linter and formatter written in Rust. rumdl checks Markdown files against 50+ style rules, supports auto-fixing, and outputs in multiple formats for CI/CD integration.

## Commands

### Lint & Format
- `rumdl markdown check` — Lint Markdown files for style violations
- `rumdl markdown format` — Format Markdown files in-place
- `rumdl config init` — Create a default configuration file
- `rumdl rule show` — Show information about linting rules
- `rumdl config show` — Show loaded configuration
- `rumdl self version` — Print rumdl version
- `rumdl _ _` — Passthrough to rumdl CLI

## Usage Examples
- "Lint all Markdown files in the current directory"
- "Format README.md"
- "Check docs/ for markdown style issues"
- "Show me rule MD013 details"
- "Auto-fix markdown violations in the docs folder"

## Installation

```bash
cargo install rumdl
```

## Examples

```bash
# Lint all Markdown files
rumdl markdown check .

# Lint with JSON output for CI integration
rumdl markdown check --output-format json .

# Format a specific file
rumdl markdown format README.md

# Auto-fix violations in the docs directory
rumdl markdown check --fix docs/

# Preview fixes without modifying files
rumdl markdown check --diff README.md

# Disable specific rules
rumdl markdown check --disable MD013,MD033 README.md

# Create a default config file
rumdl config init

# Show all available rules
rumdl rule show

# Show details for a specific rule
rumdl rule show MD013

# Show configuration as JSON
rumdl config show --output json
```

## Key Features
- High-performance Rust implementation
- 50+ built-in linting rules
- Auto-fix support for many violations
- JSON and JSON-lines output for CI/CD
- markdownlint compatibility with import command
- stdin/stdout support for piping
- pyproject.toml integration
- Pre-commit hook support
