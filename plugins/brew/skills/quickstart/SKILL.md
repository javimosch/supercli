---
name: brew
description: Homebrew — macOS package manager for open-source software
---
# Brew Plugin

Manage packages with Homebrew.

## Usage

- `brew self version` — Print Homebrew version
- `brew self update` — Update Homebrew and formulae
- `brew self doctor` — Check system for potential problems
- `brew self cleanup [--dry-run]` — Remove stale files
- `brew package install <formula> [--cask]` — Install a formula or cask
- `brew package uninstall <formula>` — Uninstall a formula
- `brew package info <formula> [--json]` — Show formula information
- `brew package upgrade [formula]` — Upgrade packages
- `brew package list [formula] [--cask]` — List installed packages
- `brew package search <query>` — Search available packages
- `brew package outdated` — List outdated packages
- `brew _ _ <args>` — Passthrough any brew command

## Examples

```bash
# Install a formula
brew install jq

# Install a cask (GUI app)
brew install --cask firefox

# Search for packages
brew search python

# List all installed packages
brew list

# Update everything
brew update && brew upgrade

# Check system health
brew doctor

# Cleanup old versions
brew cleanup --dry-run
```
