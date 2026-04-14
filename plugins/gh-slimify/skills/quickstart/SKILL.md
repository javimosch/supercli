---
name: gh-slimify
description: Use this skill when the user wants to migrate GitHub Actions workflows to ubuntu-slim runner, reduce CI costs, or analyze workflow eligibility.
---

# gh-slimify Plugin

Automatically detect and migrate GitHub Actions to ubuntu-slim for cost-efficient CI.

## Commands

### Scan
- `gh-slimify workflow scan` — Scan workflows for migration candidates

### Fix
- `gh-slimify workflow fix` — Migrate eligible jobs to ubuntu-slim

## Usage Examples
- "Scan all workflows for ubuntu-slim migration"
- "Fix workflows automatically"
- "Skip duration check for faster scan"

## Installation

```bash
gh extension install fchimpan/gh-slimify
```

## Examples

```bash
# Scan specific workflow
gh slimify .github/workflows/ci.yml

# Scan all workflows
gh slimify --all

# Fix eligible jobs
gh slimify fix .github/workflows/ci.yml

# Fix all with force (include jobs with warnings)
gh slimify fix --all --force

# Skip duration check
gh slimify --all --skip-duration

# JSON output for CI
gh slimify --json --all
```

## Key Features
- Auto-detects migration eligibility
- Skips Docker/service container jobs
- Checks execution time (max 15 min)
- Safe/warning/ineligible classification
- JSON output for automation
- Blocked-pattern enforcement
