---
name: renovate
description: Use this skill when the user wants automated dependency updates — scan package.json, Dockerfiles, GitHub Actions, and 60+ other managers to open update PRs.
---

# renovate Plugin

Renovate automatically detects outdated dependencies across your repo and opens pull requests with updates, changelogs, and compatibility notes. Supports npm, Docker, Terraform, Helm, and many more.

## Installation

```bash
npm install -g renovate
# or run via npx without global install
npx renovate --version
```

## Basic Usage

```bash
# Dry-run locally (no PRs created)
renovate --platform=local

# Run against a GitHub repo (requires token)
RENOVATE_TOKEN=ghp_xxx renovate myorg/myrepo

# Print config validation
renovate-config-validator
```

## Common Patterns

```bash
# Limit to specific base branches
renovate --base-branches=main myorg/myrepo

# On-demand local scan
renovate --platform=local --repository-cache=reset

# Configure via renovate.json in repo root
# { "extends": ["config:recommended"], "schedule": ["before 4am on monday"] }
```

## Usage Examples

- "Run renovate dry-run on this repo locally"
- "Configure renovate to group devDependencies updates"
- "Validate my renovate.json config"

## SuperCLI

```bash
sc renovate self version
sc renovate _ _ --platform=local
sc plugins learn renovate
```
