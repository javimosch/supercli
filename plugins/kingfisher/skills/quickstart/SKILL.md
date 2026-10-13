---
name: kingfisher
description: Use this skill when the user wants to find and validate leaked secrets or credentials in code, git history, or cloud/developer platforms with kingfisher.
---

# kingfisher Plugin

kingfisher is MongoDB's open-source secret detection engine (Rust). It scans files, directories, git history, GitHub/GitLab orgs, and S3 for exposed credentials, then live-validates findings against provider APIs so you can tell dead keys from live ones.

## Commands

### Scanning
- `kingfisher scan run <path>` — Scan a path for secrets (`--only-valid` filters to live secrets, `--format json` for machine output, `--no-update-check` for CI)
- `kingfisher scan github-org <org>` — Scan a GitHub org (needs `KF_GITHUB_TOKEN`)
- `kingfisher rules list` — Browse the built-in rule catalog (Betterleaks + Veles)
- `kingfisher _ _` — Passthrough (scan gitlab, scan s3, rules test)

## Usage Examples

- "Scan this repo for leaked credentials"
- "Find live secrets in my codebase"
- "Check our GitHub org for exposed tokens"
- "Scan git history for committed secrets"

## Installation

```bash
curl -sSL https://raw.githubusercontent.com/mongodb/kingfisher/main/scripts/install-kingfisher.sh | bash
# or: brew install kingfisher
# or: mise use --global github:mongodb/kingfisher
# or: uv tool install kingfisher-bin
```

## Examples

```bash
kingfisher scan .                          # scan current directory
kingfisher scan . --only-valid             # only secrets that still work
kingfisher scan . --format json            # JSON output for pipelines
kingfisher scan github --organization myorg  # requires KF_GITHUB_TOKEN
```

## Key Features

- Live credential validation against provider APIs (`--only-valid` kills false positives)
- Scans files, git history, GitHub/GitLab orgs, Slack, S3, Jira, and more
- Built-in Betterleaks + Veles rule catalogs (800+ detectors)
- Can revoke supported leaked secrets automatically
