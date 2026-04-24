---
name: carapace-bin
description: Use this skill when the user wants to generate shell completions, set up tab completion for CLI tools, or configure multi-shell completions.
---

# carapace-bin Plugin

Multi-shell completion generator. Generate shell completions for Bash, Zsh, Fish, PowerShell, and more with a single command.

## Commands

### Completion Generation
- `carapace-bin completion generate` — Generate shell completions

### Utility
- `carapace-bin _ _` — Passthrough to carapace CLI

## Usage Examples
- "Generate shell completions"
- "Setup tab completion"
- "Bash completions"
- "Zsh completions"

## Installation

```bash
brew install carapace
```

## Examples

```bash
# Generate completion for kubectl in bash
carapace-bin completion generate kubectl bash

# Generate completion for git in zsh
carapace-bin completion generate git zsh

# Generate completion for docker in fish
carapace-bin completion generate docker fish

# Any carapace command with passthrough
carapace-bin _ _ kubectl bash
carapace-bin _ _ --list
```

## Key Features
- **Multi-shell** - Bash, Zsh, Fish, Pwsh
- **Many tools** - Supports many CLIs
- **Single command** - Easy generation
- **Out of box** - Pre-configured
- **Fast** - Quick generation
- **Native** - Native completions
- **Custom** - Custom tools
- **Bridge** - Completion bridge
- **Portable** - Cross-platform
- **Productivity** - Boost productivity

## Notes
- Supports many CLI tools
- Native shell completions
- Great for terminal productivity
- Easy one-command setup
