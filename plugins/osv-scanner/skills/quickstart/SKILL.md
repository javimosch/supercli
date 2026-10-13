---
name: osv-scanner
description: Use this skill when the user wants to scan project dependencies, lockfiles, or container images for known vulnerabilities using Google's OSV.dev database.
---

# OSV-Scanner Plugin

OSV-Scanner is Google's official CLI for the OSV.dev vulnerability database. It maps a project's dependencies to known vulnerabilities across 11+ ecosystems (npm, pip, Go modules, cargo, maven, gem, composer, nuget, ...) and scans container images layer-aware. No API key needed.

## Commands

### Scanning
- `osv-scanner scan source` — Scan a source directory (`-r` recursive, `-L <lockfile>` for one file)
- `osv-scanner scan image` — Scan a container image for OS + language package vulns
- `osv-scanner licenses check` — Check dependency licenses against an allowlist
- `osv-scanner fix run` — Guided remediation: suggests version upgrades (experimental, npm/Maven)
- `osv-scanner self version` — Print version
- `osv-scanner _ _` — Passthrough to osv-scanner CLI

## Usage Examples

- "Scan this project for vulnerable dependencies"
- "Check this container image for CVEs"
- "Audit dependency licenses, only allow MIT/Apache-2.0"
- "Give me scan results as JSON/SARIF for CI"
- "Suggest upgrades to fix the vulnerabilities"

## Installation

```bash
curl -sSL https://github.com/google/osv-scanner/releases/latest/download/osv-scanner_linux_amd64 \
  -o ~/.local/bin/osv-scanner && chmod +x ~/.local/bin/osv-scanner
# or: go install github.com/google/osv-scanner/v2/cmd/osv-scanner@latest
```

## Examples

```bash
# Recursive scan, JSON for pipelines
osv-scanner scan source -r . --format json

# Scan a single lockfile
osv-scanner scan source -L package-lock.json

# SARIF output for GitHub code scanning
osv-scanner scan source -r . --format sarif -o results.sarif

# License audit
osv-scanner --licenses=MIT,Apache-2.0 .

# Air-gapped scan
osv-scanner --offline --download-offline-databases -r .
```

## Key Features

- 11+ language ecosystems, 19+ lockfile types, C/C++ vendored-code detection
- Layer-aware container image scanning (Alpine, Debian, Ubuntu + Go/Java/Node/Python artifacts)
- Call analysis reduces false positives (checks if vulnerable function is actually used)
- Output: table, JSON, SARIF, CycloneDX, markdown
- `--offline` mode scans against a local OSV database (no network)
- Queries osv.dev API with no API key required
