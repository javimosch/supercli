---
name: ward
description: Use this skill when the user wants to scan a Laravel project for security vulnerabilities, misconfigurations, exposed secrets, or perform security audits.
---

# ward Plugin

Security scanner for Laravel projects. Detects misconfigurations, vulnerabilities, and exposed secrets with headless JSON/SARIF output, CI integration, and baseline suppression.

## Commands

### Scanning
- `ward project scan` — Scan a Laravel project for security issues

### Configuration
- `ward config init` — Initialize ward configuration with default security rules

### Utility
- `ward self version` — Print ward version
- `ward _ _` — Passthrough to ward CLI

## Usage Examples
- "Scan my Laravel project for security issues"
- "Run a security audit on the current directory"
- "Scan a remote Laravel repository"
- "Generate a security baseline for this project"
- "Scan and fail if any high-severity issues are found"

## Installation

```bash
go install github.com/eljakani/ward@latest
```

## Examples

```bash
# Initialize ward config (creates ~/.ward/ with 40 default rules)
ward config init

# Scan the current Laravel project
ward project scan .

# Scan with JSON output
ward project scan . --output json

# Scan and fail on high or critical severity
ward project scan . --output json --fail-on high

# Scan and generate a SARIF report
ward project scan . --output sarif

# Scan a remote repository
ward project scan https://github.com/user/laravel-project.git

# Scan with a baseline to suppress known findings
ward project scan . --output json --baseline .ward-baseline.json

# Scan and update the baseline
ward project scan . --output json --update-baseline .ward-baseline.json

# Combined CI-friendly scan
ward project scan . --output json --baseline .ward-baseline.json --fail-on high
```

## Key Features
- 40 built-in security rule packs (secrets, injection, XSS, debug, crypto, auth, config)
- Headless JSON and SARIF output for CI pipelines
- Baseline suppression for known/accepted findings
- Remote repository scanning via git clone
- Non-zero exit codes for severity thresholds (--fail-on)
- Live CVE database for dependency scanning
- Environment scanner (8 checks)
- Configuration scanner (13 checks)
- Built for Laravel but useful for any PHP project

## Rule Categories
- **Secrets**: Hardcoded passwords, API keys, AWS creds, JWT, tokens
- **Injection**: SQL injection, command injection, eval, unserialize
- **XSS**: Unescaped Blade output, JS injection
- **Debug**: dd(), dump(), phpinfo(), debug bars
- **Crypto**: md5, sha1, rand(), mcrypt, base64-as-encryption
- **Config**: CORS, SSL verify, CSRF, mass assignment, uploads
- **Auth**: Missing middleware, rate limiting, loginUsingId

## Output Formats
- **text** — Human-readable output (default)
- **json** — Structured JSON for scripts and CI
- **sarif** — SARIF format for GitHub/CodeQL integration

## Exit Codes
- 0: No issues found (or below fail threshold)
- 1: Issues found at or above the --fail-on severity

## Notes
- Run `ward config init` before first use to generate default rules
- The `~/.ward/` directory contains your configuration and custom rules
- Baseline files (.ward-baseline.json) should be committed to your repo
- Severity threshold is inclusive (--fail-on medium fails on Medium, High, Critical)
- Remote scanning clones the repo to a temporary directory
