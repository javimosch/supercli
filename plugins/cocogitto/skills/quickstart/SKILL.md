---
name: cocogitto
description: Use this skill when the user wants to manage conventional commits, bump semantic versions, generate changelogs, or automate release workflows.
---

# cocogitto Plugin

A set of tools for the Conventional Commits specification. Manage semantic versioning, changelogs, and git workflows.

## Commands

### Commit Management
- `cocogitto commit check` — Check conventional commit format

### Version Management
- `cocogitto version bump` — Bump semantic version

### Changelog
- `cocogitto changelog generate` — Generate changelog

### Utility
- `cocogitto _ _` — Passthrough to cocogitto CLI

## Usage Examples
- "Check conventional commit format"
- "Bump semantic version"
- "Generate changelog"
- "Automate release workflow"

## Installation

```bash
brew install cocogitto
```

Or via Cargo:
```bash
cargo install cocogitto
```

## Examples

```bash
# Check commit format
cog check --message "feat: add new feature"

# Bump version automatically
cog bump --auto

# Bump specific version
cog bump --minor
cog bump --patch

# Generate changelog
cog changelog

# Any cog command with passthrough
cog _ _ check
cog _ _ bump --auto
cog _ _ changelog --from v1.0.0
```

## Key Features
- **Conventional** - Conventional commits
- **Semver** - Semantic versioning
- **Changelog** - Changelog generation
- **Bump** - Version bumping
- **Git** - Git integration
- **Release** - Release automation
- **CLI** - Command line native
- **Automation** - Workflow automation
- **Format** - Commit format checking
- **History** - Git history analysis

## Notes
- Enforces conventional commits
- Automatic version calculation
- Generates beautiful changelogs
- Great for release workflows
