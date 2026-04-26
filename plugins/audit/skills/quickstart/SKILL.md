---
name: audit
description: Use this skill when the user wants to audit collaborators hooks and deploy keys on github repositories.
---

# Audit Plugin

Audit collaborators hooks and deploy keys on GitHub repositories.

## Commands

### Operations
- `audit repo audit` — audit repo via audit
- `audit user audit` — audit user via audit
- `audit org audit` — audit org via audit
- `audit hooks list` — list hooks via audit
- `audit keys list` — list keys via audit

## Usage Examples
- "audit --help"
- "audit <args>"

## Installation

```bash
go install github.com/genuinetools/audit@latest
```

## Examples

```bash
audit --version
audit --help
```

## Key Features
- github\n- security\n- auditing
