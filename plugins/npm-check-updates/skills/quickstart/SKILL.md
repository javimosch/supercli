---
name: npm-check-updates
description: Use this skill when the user wants to check for or upgrade npm dependencies.
---

# NPM-Check-Updates Plugin

Find newer versions of dependencies than what package.json allows.

## Commands

### Dependency Management
- `npm-check-updates dependencies check` — Check for newer dependency versions
- `npm-check-updates dependencies upgrade` — Upgrade package.json with latest versions

## Usage Examples
- "npm-check-updates dependencies check --json"
- "npm-check-updates dependencies upgrade --target latest"

## Installation

```bash
npm install -g npm-check-updates
```

## Examples

```bash
# Check for updates
ncu

# Check with JSON output
ncu --json

# Upgrade package.json
ncu -u

# Target specific version type
ncu --target minor
ncu --target patch

# Filter specific packages
ncu --filter "express*"

# Check specific package file
ncu --packageFile package.json

# Check only production dependencies
ncu --prod

# Check only dev dependencies
ncu --dev
```

## Key Features
- Check for newer dependency versions
- Upgrade package.json automatically
- JSON output for automation
- Filter by package name
- Target specific version types (latest, minor, patch)
- Compatible with npm, yarn, pnpm, deno, bun
