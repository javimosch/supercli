---
name: pinact
description: Use this skill when the user wants to pin GitHub Actions versions, update workflow files, or verify GitHub Actions annotations.
---

# pinact Plugin

Pinact is a CLI to edit GitHub Workflow and Composite action files and pin versions of Actions and Reusable Workflows. Update and verify version annotations.

## Commands

### Actions Management
- `pinact action update` — Update GitHub Actions versions

### Utility
- `pinact _ _` — Passthrough to pinact CLI

## Usage Examples
- "Pin GitHub Actions versions"
- "Update workflow files"
- "Verify action versions"
- "Pin reusable workflows"

## Installation

```bash
brew install pinact
```

Or via Go:
```bash
go install github.com/suzuki-shunsuke/pinact/cmd/pinact@latest
```

## Examples

```bash
# Update actions
pinact action update .github/workflows

# Check without modifying
pinact action update .github/workflows --check

# Fix issues
pinact action update .github/workflows --fix

# Show diff
pinact action update .github/workflows --diff

# Any pinact command with passthrough
pinact _ _ update .github/workflows
pinact _ _ update .github/workflows --check
```

## Key Features
- **Pin** - Pin action versions
- **Update** - Update action versions
- **Verify** - Verify version annotations
- **Security** - Improves security
- **Workflows** - GitHub Workflows
- **Composite** - Composite actions
- **Reproducible** - Reproducible builds
- **CI/CD** - CI/CD integration
- **Config** - Configurable rules
- **Safe** - Safe version management

## Notes
- Great for GitHub Actions management
- Ensures reproducible workflows
- Improves CI/CD security
- Supports SARIF output
