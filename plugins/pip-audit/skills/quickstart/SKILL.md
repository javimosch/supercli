---
name: pip-audit
description: Use this skill when the user wants to audit Python dependencies for known vulnerabilities, check requirements files for CVEs, or scan Python environments for security issues.
---

# pip-audit Plugin

Audit Python environments for known vulnerabilities.

## Commands

### Audit
- `pip-audit audit run` — Audit Python dependencies for vulnerabilities
- `pip-audit audit json` — Audit and output JSON

## Usage Examples
- "Audit my Python dependencies for vulnerabilities"
- "Check requirements.txt for known CVEs"
- "Scan the current environment for security issues"

## Installation

```bash
pip install pip-audit
```

## Examples

```bash
# Audit current environment
pip-audit

# Audit requirements file
pip-audit -r requirements.txt

# JSON output
pip-audit --format json

# Audit with fix suggestions
pip-audit --fix
```
