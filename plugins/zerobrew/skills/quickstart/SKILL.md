---
name: zerobrew
description: Use this skill when the user wants to install packages faster than Homebrew.
---

# zerobrew Plugin

5-20x faster Homebrew alternative with uv-style architecture. Drop-in replacement for common brew commands.

## Commands

### Package Management
- `zerobrew package install` — Install a package
- `zerobrew package uninstall` — Uninstall a package

### Bundle Management
- `zerobrew bundle install` — Install packages from a Brewfile
- `zerobrew bundle dump` — Export installed packages to a Brewfile

## Usage Examples
- "Install jq faster than brew"
- "Install packages from my Brewfile"
- "Export my brew packages to a Brewfile"

## Installation

```bash
curl -fsSL https://zerobrew.rs/install | bash
```

## Examples

```bash
zb install jq
zb install wget git curl
zb uninstall jq
zb bundle install
zb bundle dump -f Brewfile
```

## Key Features
- 5-20x faster than Homebrew
- Drop-in Brewfile compatibility
- Works on macOS and Linux
- uv-style architecture for speed
- Simple curl installer
