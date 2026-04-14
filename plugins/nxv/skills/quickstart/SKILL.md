---
name: nxv
description: Use this skill when the user wants to find Nix package versions, search nixpkgs history, or locate specific commits for Nix shell commands.
---

# nxv Plugin

Find any version of any Nix package, instantly.

## Commands

### Package Search
- `nxv package search` — Search for Nix packages
- `nxv package info` — Show package details
- `nxv package history` — Show version history

## Usage Examples
- "Find all versions of Python in nixpkgs"
- "Search for nodejs packages"
- "Get info about a specific package"
- "See when a version was available"

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/utensils/nxv/main/install.sh | sh
```

Or:
```bash
cargo install nxv
nix run github:utensils/nxv -- search python
```

## Examples

```bash
# Search for packages
nxv search python
nxv search python 3.11
nxv search "json parser" --desc

# Get package info
nxv info python
nxv info python 3.11.0

# Version history
nxv history python
nxv history python 3.11.0

# Use a found version
nix shell nixpkgs/e4a45f9#python
```

## Key Features
- Fast search with Bloom filter
- Version history for all packages
- Multiple interfaces: CLI, HTTP API, or web UI
- NixOS module for systemd service
- SQLite FTS5 full-text search
