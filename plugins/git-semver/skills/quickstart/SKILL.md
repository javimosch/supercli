---
name: git-semver
description: Use this skill when the user wants to use git-semver — Git semantic versioning CLI — calculate next version from git tags and commits.
---

# git-semver Plugin

Git semantic versioning CLI — calculate next version from git tags and commits

## Commands
- `git-semver self version` — Print git-semver version
- `git-semver _ _` — Passthrough to git-semver CLI

## Usage Examples
- `git-semver self version` — Check installed version
- `git-semver _ _ --help` — Show git-semver help
- `git-semver _ _ --json` — JSON output mode

## Installation
```bash
go install github.com/git-semver/git-semver@latest
```

## Key Features
- git, semver, golang, versioning
- Non-interactive CLI with JSON output support
- Pipeline-ready for automation
