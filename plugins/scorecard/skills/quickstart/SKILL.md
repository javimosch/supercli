---
name: scorecard
description: Use this skill when the user wants to audit a repository or dependency's security posture with OpenSSF Scorecard.
---

# scorecard Plugin

scorecard is OpenSSF's automated security health-check tool. It runs ~20 checks (branch protection, code review, signed releases, dependency pinning, fuzzing, dangerous workflows) against a repo and produces a 0–10 aggregate score.

## Commands

### Auditing
- `scorecard repo audit <repo_url>` — Audit a remote repository
- `scorecard local audit <dir>` — Audit a local directory (subset of checks)
- `scorecard _ _` — Passthrough (--npm/--pypi/--nuget package audits, --probe, --policy)

## Usage Examples

- "Audit the security posture of github.com/org/repo"
- "Score this dependency before I add it"
- "Show which scorecard checks are failing and why"

## Installation

```bash
go install github.com/ossf/scorecard/v5/cmd/scorecard@latest
# or: brew install scorecard
# or: download scorecard_*_linux_amd64.tar.gz from GitHub releases
```

## Examples

```bash
scorecard --repo=github.com/ossf/scorecard
scorecard --repo=github.com/org/repo --format json
scorecard --repo=github.com/org/repo --show-details --checks=Token-Permissions,Branch-Protection
scorecard --npm=lodash --format json
export GITHUB_TOKEN=...   # raises API rate limit for remote audits
```

## Key Features

- ~20 checks covering CI/CD risk, authorship, maintenance, and source-risk signals
- Works on GitHub, GitLab, npm, PyPI, NuGet packages and local directories
- `--format json` / `--format sarif` / `--format probe` for automation
- OpenSSF best-practice badges integrate with the same checks
