---
name: detect-secrets
description: Use this skill when the user wants to scan code for secrets, API keys, tokens, passwords, or private keys — or integrate secret detection into CI/CD pipelines.
---

# detect-secrets Plugin

detect-secrets scans codebases for secrets, API keys, tokens, and credentials. Supports baseline files for tracking known secrets and pre-commit hooks.

## Commands

- `detect-secrets _ _ <args>` — Passthrough

## Usage Examples

- "scan the current directory for secrets"
- "generate a baseline of known secrets"
- "audit potential secrets from a baseline scan"
- "scan only staged files before commit"

## Installation

```bash
pip install detect-secrets
```

## Key Features
- Detects API keys, tokens, private keys, passwords, and credentials
- Baseline file support for tracking known/approved secrets
- Pre-commit hook integration
- JSON output for CI/CD pipeline integration
- Plugable plugin system for custom secret types
- Audit mode for reviewing potential secrets
- Multiple file format support
