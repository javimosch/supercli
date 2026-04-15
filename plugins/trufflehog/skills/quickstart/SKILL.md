---
name: trufflehog
description: Use this skill when the user wants to scan for leaked credentials, API keys, secrets in git repos, files, or CI/CD pipelines.
---

# TruffleHog Plugin

Find and verify leaked credentials in git repositories, filesystems, Docker images, S3, GCS, and more.

## Commands

### Scanning
- `trufflehog git scan <repo-url>` — Scan a git repository
- `trufflehog filesystem scan <path>` — Scan files/directories
- `trufflehog docker scan <image>` — Scan a Docker image

### Output
- `trufflehog git <repo> --json` — JSON output for CI/CD
- `trufflehog filesystem <path> --json` — JSON output for automation

## Usage Examples

- Scan current directory: `trufflehog filesystem .`
- Scan git repo: `trufflehog git https://github.com/user/repo --json`
- Only verified: `trufflehog git <repo> --results verified`

## Installation

```bash
curl -sSfL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh | sh
```

## Examples

```bash
# Scan a repo for secrets
trufflehog git https://github.com/user/repo

# JSON output for CI/CD
trufflehog filesystem . --json --fail

# Scan Docker image
trufflehog docker --image nginx:latest

# Scan S3 bucket
trufflehog s3 --bucket my-bucket
```

## Key Features
- Detects 800+ secret types
- Active verification against APIs
- JSON output for CI/CD integration
- Scans git history (including deleted commits)
- Docker, S3, GCS, filesystem support
