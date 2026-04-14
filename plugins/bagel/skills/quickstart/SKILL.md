---
name: bagel
description: Use this skill when the user wants to scan their workstation for security risks, find leaked credentials, or scrub sensitive data from CLI session logs.
---

# bagel Plugin

Inventory security-relevant metadata on developer workstations — no payloads, ever.

## Commands

### Scan
- `bagel scan run` — Scan workstation for security findings

### Scrub
- `bagel scrub run` — Remove credentials from AI CLI session logs

## Usage Examples
- "Scan workstation for security issues"
- "Scrub credentials from shell history"
- "Check for risky Git configurations"

## Installation

```bash
brew install boostsecurityio/tap/bagel
```

Linux:
```bash
curl -sL https://github.com/boostsecurityio/bagel/releases/latest/download/bagel_Linux_x86_64.tar.gz | tar xz
sudo mv bagel /usr/local/bin/
```

## Examples

```bash
# Scan workstation
bagel scan

# Table output
bagel scan -f table

# Save to file
bagel scan -o report.json

# CI gate - fail if findings exist
bagel scan --strict

# Scrub credentials
bagel scrub --yes

# Dry run scrub
bagel scrub --dry-run
```

## Key Features
- No payloads - metadata only
- 9 security probes (Git, SSH, npm, env, cloud, etc.)
- 8 secret detectors
- Read-only operations
- JSON or table output
- Scrub command for session logs
