---
name: git-cliff
description: Use this skill when the user wants to generate a changelog from Git history, manage releases, or create release notes with conventional commits.
---

# git-cliff Plugin

Generate changelogs from Git history with conventional commits support.

## Commands

### Changelog Generation
- `git-cliff changelog generate` — Generate full changelog
- `git-cliff changelog unreleased` — Generate only unreleased changes
- `git-cliff changelog latest` — Generate for latest tag only
- `git-cliff changelog current` — Generate for current tag

### Setup
- `git-cliff init run` — Initialize cliff.toml config

## Usage Examples
- "Generate a changelog for the latest release"
- "Show only unreleased commits"
- "Initialize git-cliff in this project"
- "Generate changelog and write to CHANGELOG.md"

## Installation

```bash
cargo install git-cliff
```

## Common Examples

```bash
# Generate changelog to file
git-cliff -o CHANGELOG.md

# Generate only unreleased changes
git-cliff --unreleased

# Generate for latest tag
git-cliff --latest

# Print to stdout
git-cliff

# Initialize config
git-cliff --init

# With custom config
git-cliff -c cliff.toml -o CHANGELOG.md
```

## Key Features
- Conventional commits parsing
- Highly configurable templates (TOML)
- JSON output for CI (`-x` flag)
- Flexible commit filtering
- Tag and path filtering
- Topological ordering