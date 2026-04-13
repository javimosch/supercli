---
name: act.quickstart
description: Agent workflow for running, listing, validating, and testing GitHub Actions workflows locally via act CLI.
tags: act,github-actions,ci-cd,testing,automation,docker,workflows
---

# act Quickstart

Use this when AI agents need to run GitHub Actions workflows locally before pushing to GitHub.

## 1) Install plugin and dependency

```bash
supercli plugins learn act
# Install act
curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sh
# or: brew install act
act --version
# Install plugin
supercli plugins install ./plugins/act --on-conflict replace --json
```

## 2) Validate CLI wiring

```bash
act --version
docker --version
supercli plugins doctor act --json
```

## 3) Prerequisites

Workflow files must exist in `.github/workflows/` directory.

```bash
# Verify workflows exist
ls -la .github/workflows/
# Or create one
mkdir -p .github/workflows
```

## 4) Core command patterns

### List workflows
```bash
supercli act workflow list
```

### Run workflows
```bash
# Run push event (default)
supercli act workflow run

# Run pull_request event
supercli act workflow run --event pull_request

# Run specific job
supercli act workflow run --job test

# With secrets
supercli act workflow run --secrets '["GITHUB_TOKEN=xxx","API_KEY=yyy"]'
```

### Validate workflows
```bash
# Validate without running
supercli act workflow validate

# Dry run mode
supercli act workflow dryrun
```

### Watch mode (auto-reload)
```bash
supercli act workflow watch
```

### Job-specific run
```bash
supercli act job run --job build
```

### Secrets management
```bash
# List configured secrets
supercli act secret list

# Add a secret
supercli act secret add --name GITHUB_TOKEN --value xxx
```

## 5) Docker Requirements

act runs workflows in Docker containers:

- **Docker must be running**
- Default images: `catthehacker/ubuntu:act-latest`
- Custom images: `act -P ubuntu-latest=my-custom-image`
- No Docker: `act -P ubuntu-latest=-self-hosted`

## 6) Agent workflow: Test before push

```bash
# 1. List available workflows
supercli act workflow list

# 2. Dry run to validate
supercli act workflow run --dryrun true

# 3. Run specific job
supercli act workflow run --job test

# 4. Run full workflow
supercli act workflow run
```

## 7) Safety levels

| Command | Level | Description |
|---------|-------|-------------|
| `workflow list`, `validate`, `dryrun`, `secret list` | safe | Read-only or validate |
| `workflow run`, `job run`, `secret add` | guarded | Runs containers |
| `workflow watch` | guarded | Continuous execution |

Guard commands may require Docker resources. Use `--dryrun true` to validate first.