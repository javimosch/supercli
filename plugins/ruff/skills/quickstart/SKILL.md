---
name: ruff
description: Use this skill when the user wants to lint Python code, format Python files, auto-fix Python issues, or check Python code quality at high speed.
---

# ruff Plugin

Extremely fast Python linter and formatter, written in Rust.

## Commands

### Check
- `ruff check run` — Lint Python files
- `ruff check fix` — Lint and auto-fix Python files

### Format
- `ruff format run` — Format Python files
- `ruff format check` — Check formatting without applying

## Usage Examples
- "Lint this Python file"
- "Auto-fix all Python issues"
- "Format Python files"
- "Check formatting without changing files"

## Installation

```bash
pip install ruff
```

## Examples

```bash
# Lint
ruff check .

# Lint with auto-fix
ruff check --fix .

# Format
ruff format .

# Check formatting
ruff format --check .

# With config (pyproject.toml)
ruff check --config pyproject.toml .

# Specific rules
ruff check --select I .
```
