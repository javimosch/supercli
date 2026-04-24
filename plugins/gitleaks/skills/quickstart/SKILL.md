---
name: gitleaks
description: Use this skill when the user wants to scan for secrets, credentials, or sensitive information in code, git repositories, or files.
---

# gitleaks Plugin

Find secrets with Gitleaks. Detect secrets, credentials, and sensitive information in git repositories, files, and directories. Supports custom rules, baselines, and CI/CD integration.

## Commands

### Secret Detection
- `gitleaks repo detect` — Detect secrets in git repository
- `gitleaks repo protect` — Protect git repository from secrets
- `gitleaks baseline generate` — Generate baseline for known secrets

### Utility
- `gitleaks _ _` — Passthrough to gitleaks CLI

## Usage Examples
- "Scan this repository for secrets"
- "Protect git commits from leaking secrets"
- "Check for credentials in this directory"
- "Generate a baseline for known secrets"

## Installation

```bash
brew install gitleaks
```

Or via Go:
```bash
go install github.com/gitleaks/gitleaks/v8/cmd/gitleaks@latest
```

## Examples

```bash
# Detect secrets in current repository
gitleaks repo detect --source .

# Detect secrets with custom config
gitleaks repo detect --source . --config gitleaks-config.toml

# Generate JSON report
gitleaks repo detect --source . --report results.json --report-format json

# Generate SARIF report for CI/CD
gitleaks repo detect --source . --report results.sarif --report-format sarif

# Verbose output
gitleaks repo detect --source . --verbose

# Redact secrets from output
gitleaks repo detect --source . --redact

# Scan without git history
gitleaks repo detect --source . --no-git

# Protect staged commits
gitleaks repo protect --staged

# Generate baseline
gitleaks baseline generate --source . --baseline .gitleaks-baseline.json

# Scan with baseline
gitleaks repo detect --source . --baseline .gitleaks-baseline.json

# Any gitleaks command with passthrough
gitleaks _ _ detect --source . --verbose
gitleaks _ _ protect --staged
```

## Key Features
- **Secret detection** — Find API keys, passwords, tokens
- **Git history scanning** — Scan entire git repository history
- **File scanning** — Scan individual files or directories
- **Custom rules** — Define custom secret detection rules
- **Baseline support** — Ignore known/secrets
- **Multiple formats** — JSON, SARIF, CSV output
- **CI/CD integration** — GitHub Actions, pre-commit hooks
- **Redaction** — Redact secrets from output
- **Configurable** — Custom configuration files
- **Fast scanning** — Efficient scanning algorithms

## Notes
- Default scans entire git history
- Use --no-git for directory-only scanning
- Baseline files allow ignoring known secrets
- Can be used as pre-commit hook
- Supports GitHub Actions natively
- Exit codes indicate if secrets were found
