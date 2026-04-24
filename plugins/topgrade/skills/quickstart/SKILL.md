---
name: topgrade
description: Use this skill when the user wants to upgrade system packages, update all installed software, or perform system maintenance.
---

# topgrade Plugin

Upgrade all the things. Upgrade all installed packages and system components on Linux, macOS, and Windows with a single command.

## Commands

### System Upgrade
- `topgrade system upgrade` — Upgrade all system packages

### Utility
- `topgrade _ _` — Passthrough to topgrade CLI

## Usage Examples
- "Upgrade all packages"
- "Update system packages"
- "Upgrade Homebrew packages"
- "Run system update"

## Installation

```bash
brew install topgrade
```

Or via Cargo:
```bash
cargo install topgrade
```

## Examples

```bash
# Upgrade all packages
topgrade system upgrade

# Dry run without changes
topgrade system upgrade --dry-run

# Only upgrade specific step
topgrade system upgrade --only brew

# Skip specific step
topgrade system upgrade --skip npm

# Auto-confirm all prompts
topgrade system upgrade --yes

# Any topgrade command with passthrough
topgrade _ _ --dry-run
topgrade _ _ --only brew
```

## Key Features
- **All-in-one** - Upgrades everything at once
- **Cross-platform** - Linux, macOS, Windows
- **Package managers** - Homebrew, npm, cargo, pip, apt, etc.
- **Customizable** - Configure specific steps
- **Dry run** - Preview changes
- **Selective** - Skip or include specific steps
- **Fast** - Parallel upgrades where possible
- **Safe** - Checks before upgrading
- **Configurable** - Custom configuration file
- **Remote** - Can upgrade remote systems

## Notes
- Supports many package managers
- Can be configured for custom workflows
- Great for system maintenance
- Can run on remote systems
