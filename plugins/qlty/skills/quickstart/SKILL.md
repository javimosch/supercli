---
name: qlty
description: Use this skill when the user wants to run linting, auto-formatting, security scanning, or code quality metrics analysis across multiple languages in a unified way.
---

# qlty Plugin

Universal code quality CLI for linting, auto-formatting, security scanning, and maintainability.

## Commands

### Setup
- `qlty init run` — Initialize qlty in a Git repository

### Quality Checks
- `qlty check run` — Run lint checks
- `qlty fmt run` — Auto-format code
- `qlty smells run` — Scan for code smells (duplication, complexity)

### Metrics
- `qlty metrics run` — Review code quality metrics

## Usage Examples
- "Initialize qlty in this project"
- "Run lint checks"
- "Auto-format all code"
- "Scan for code smells"
- "Review code quality metrics"

## Installation

```bash
curl https://qlty.sh | bash
```

## Examples

```bash
# Initialize in a repo
qlty init

# Run lint checks
qlty check

# Sample of 5 issues
qlty check --sample=5

# Auto-format all files
qlty fmt --all

# Scan for smells
qlty smells --all

# Review metrics
qlty metrics --sort complexity --max-depth=2
```

## Supported Languages
- 40+ languages via 70+ tools
- ESLint, Prettier, Ruff, golangci-lint, etc.
- Security: Semgrep, TruffleHog, Trivy, Gitleaks
- Coverage for Go, Java, Python, Ruby, Rust, TypeScript, and more