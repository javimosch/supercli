---
name: asdf
description: Use this skill when the user wants to manage runtime versions, install multiple versions of tools, or switch between tool versions.
---

# asdf Plugin

Manage multiple runtime versions with a single CLI tool. Extendable version manager for Node.js, Ruby, Python, Elixir, and hundreds more.

## Commands

### Tool Management
- `asdf tool install` — Install a tool version
- `asdf tool list` — List installed tool versions

### Utility
- `asdf _ _` — Passthrough to asdf CLI

## Usage Examples
- "Install Node.js version"
- "List installed Python versions"
- "Manage runtime versions"
- "Switch tool versions"

## Installation

```bash
brew install asdf
```

## Examples

```bash
# Install a tool version
asdf tool install nodejs 20.10.0

# List installed versions
asdf tool list nodejs

# Any asdf command with passthrough
asdf _ _ install nodejs 20.10.0
asdf _ _ list
asdf _ _ current
```

## Key Features
- **Multi-runtime** - Node.js, Ruby, Python, Go, and more
- **Plugins** - Extensible via plugins
- **Version files** - `.tool-versions` support
- **Global/Local** - Global and local versions
- **Easy** - Simple commands
- **Popular** - Widely adopted
- **Cross-platform** - Linux, macOS
- **Lightweight** - Minimal overhead
- **Community** - Large plugin ecosystem
- **Reliable** - Battle-tested

## Notes
- Great for polyglot projects
- Uses `.tool-versions` files
- Supports global and local versions
- Perfect for development teams
