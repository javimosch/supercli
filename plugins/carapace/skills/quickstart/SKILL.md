---
name: carapace
description: Use this skill when the user needs to generate shell completions, list available completions, or configure multi-shell autocomplete using carapace.
---

# carapace Plugin

Multi-shell completion generator with 3,000+ completions for CLI commands. Supports bash, zsh, fish, powershell, elvish, nushell, and xonsh.

## Commands

### Completion Management
- `carapace completion list` — List available completions
- `carapace self install` — Install carapace completion for a shell
- `carapace binary complete` — Generate completions for a specific binary

### Utility
- `carapace _ _` — Passthrough to carapace CLI

## Usage Examples
- "List all available completions"
- "Install carapace for zsh"
- "Generate completions for kubectl"
- "List completions matching docker"

## Installation

```bash
brew install carapace
echo 'source <(carapace _carapace)' >> ~/.zshrc
```

Or via Go:
```bash
go install github.com/carapace-sh/carapace@latest
```
