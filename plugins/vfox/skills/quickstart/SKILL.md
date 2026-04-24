---
name: vfox
description: Use this skill when the user wants to manage runtime versions, install different versions of Java/Node/Python, or switch between runtime versions.
---

# vfox Plugin

Cross-platform and extendable version manager with support for Java, Node.js, Golang, Python, Flutter, .NET and more. Manage multiple runtime versions easily.

## Commands

### Version Management
- `vfox version install` — Install runtime version

### Utility
- `vfox _ _` — Passthrough to vfox CLI

## Usage Examples
- "Install Node.js version"
- "Switch Java version"
- "Install Python version"
- "Manage runtime versions"

## Installation

```bash
brew install vfox
```

Or via Go:
```bash
go install github.com/version-fox/vfox/cmd/vfox@latest
```

## Examples

```bash
# Install Node.js version
vfox version install node 18.0.0

# Install Java version globally
vfox version install java 17 --global

# Install Python version
vfox version install python 3.11

# Install Golang version
vfox version install golang 1.20

# Any vfox command with passthrough
vfox _ _ install node 18.0.0
vfox _ _ use java 17
vfox _ _ list
```

## Key Features
- **Multi-runtime** - Java, Node.js, Python, Go, Flutter, .NET
- **Cross-platform** - Linux, macOS, Windows
- **Plugin-based** - Extensible with plugins
- **Fast** - Quick installation and switching
- **Shell integration** - Works with bash, zsh, fish, PowerShell
- **Global/Local** - Global and project-specific versions
- **Version list** - List available versions
- **Auto-detect** - Auto-detect project runtime
- **Easy switching** - Switch between versions easily
- **Lightweight** - Minimal resource usage

## Notes
- Supports many programming languages
- Plugin-based for extensibility
- Can set global or local versions
- Shell integration required for full functionality
