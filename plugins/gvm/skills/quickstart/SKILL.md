---
name: gvm
description: Use this skill when the user wants to install, manage, list, or switch programming language versions.
---

# gvm Plugin

Global programming language version manager. Install, manage, and switch versions of multiple languages from a single CLI.

## Commands

### Version Management
- `gvm version list-remote` — List available remote versions for a language
- `gvm version list` — List installed versions for a language
- `gvm version install` — Install a specific language version
- `gvm version uninstall` — Uninstall a specific language version
- `gvm version current` — Show the currently active version for a language

### Utility
- `gvm self version` — Print gvm version
- `gvm _ _` — Passthrough to gvm CLI

## Usage Examples
- "List available Node.js versions"
- "List installed Python versions"
- "Install Go version 1.21.0"
- "Uninstall Rust version 1.70.0"
- "Show the current Node.js version"

## Installation

Download the appropriate binary for your platform from the [GitHub Releases page](https://github.com/toodofun/gvm/releases) and place it in your PATH.

## Examples

```bash
# List available Node.js versions
gvm version list-remote node

# List installed Python versions
gvm version list python

# Install a specific Node.js version
gvm version install node 18.0.0

# Install a specific Python version
gvm version install python 3.11.0

# Install a specific Go version
gvm version install go 1.21.0

# Show current Node.js version
gvm version current node

# Uninstall a version
gvm version uninstall node 18.0.0

# Passthrough: switch active version (may require shell integration)
gvm _ _ use node 18.0.0
```

## Supported Languages

GVM supports multiple programming languages. Common examples include:

- **node** — Node.js
- **python** — Python
- **go** — Go
- **rust** — Rust
- **ruby** — Ruby
- **java** — Java

## Key Features

- Single CLI for multiple programming languages
- Install specific versions from remote repositories
- List installed and available versions
- Switch between installed versions
- Uninstall unused versions
- Show currently active version per language

## Notes

- The `gvm use` command may require shell integration (eval $(gvm use ...)) and is best run directly in a terminal rather than through supercli
- Download binaries from the releases page for the fastest setup
- Building from source requires Go installed: `git clone https://github.com/toodofun/gvm.git && cd gvm && make build`
