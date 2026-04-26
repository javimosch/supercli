---
name: yatas
description: Use this skill when the user wants to audit aws and gcp infrastructure for misconfiguration and security issues.
---

# Yatas Plugin

Audit AWS and GCP infrastructure for misconfiguration and security issues.

## Commands

### Operations
- `yatas aws audit` — audit aws via yatas
- `yatas gcp audit` — audit gcp via yatas
- `yatas report generate` — generate report via yatas
- `yatas config show` — show config via yatas
- `yatas rules list` — list rules via yatas

## Usage Examples
- "yatas --help"
- "yatas <args>"

## Installation

```bash
go install github.com/padok-team/yatas@latest
```

## Examples

```bash
yatas --version
yatas --help
```

## Key Features
- aws\n- gcp\n- security-audit
