---
name: bandit
description: Use this skill when the user wants to find security issues in Python code, scan for vulnerabilities, check for unsafe imports, or audit Python security.
---

# bandit Plugin

Security linter for Python code.

## Commands

### Scan
- `bandit scan run` — Scan Python files for security issues
- `bandit scan json` — Scan and output JSON

## Usage Examples
- "Scan this Python project for security issues"
- "Find security vulnerabilities in my code"
- "Check for unsafe imports"
- "Audit Python code for common security problems"

## Installation

```bash
pip install bandit
```

## Examples

```bash
# Scan directory recursively
bandit -r .

# JSON output
bandit -r --format json .

# Severity threshold
bandit -r --severity high .

# Skip certain tests
bandit -r --skip B101,B102 .

# Only certain tests
bandit -r --tests B101 .

# With config
bandit -r --ini .bandit .
```
