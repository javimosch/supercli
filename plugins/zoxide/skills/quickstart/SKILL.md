---
name: zoxide
description: Use this skill when the user wants to navigate directories quickly, jump to recently visited folders, or use a smarter cd command with directory tracking.
---

# zoxide Plugin

A smarter cd command that keeps track of directories you visit and allows you to jump to them quickly. Supports all major shells and integrates with fzf for fuzzy matching.

## Commands

### Directory Management
- `zoxide directory add` — Add directory to database
- `zoxide directory query` — Query directory database
- `zoxide directory remove` — Remove directory from database

### Utility
- `zoxide _ _` — Passthrough to zoxide CLI

## Usage Examples
- "Add this directory to zoxide"
- "Jump to my project folder"
- "Search for directories with these keywords"
- "Remove directory from database"

## Installation

```bash
brew install zoxide
```

Add to your shell config (bash/zsh/fish):
```bash
eval "$(zoxide init bash)"
eval "$(zoxide init zsh)"
eval "$(zoxide init fish)"
```

Or via Cargo:
```bash
cargo install zoxide
```

## Examples

```bash
# Add directory to database
zoxide directory add ~/projects
zoxide directory add /var/www

# Query for directories
zoxide directory query project
zoxide directory query --list
zoxide directory query --score

# Remove directory from database
zoxide directory remove ~/projects

# Any zoxide command with passthrough
zoxide _ _ add ~/work
zoxide _ _ query --list --score
zoxide _ _ remove /tmp
```

## Key Features
- **Smart directory tracking** — Tracks directories based on frequency and recency
- **Quick navigation** — Jump to directories with partial matches
- **Shell integration** — Works with bash, zsh, fish, and more
- **Fuzzy matching** — Integrates with fzf for fuzzy selection
- **Score-based ranking** — Ranks directories by visit patterns
- **Cross-platform** — Works on Linux, macOS, and Windows
- **Lightweight** — Fast and efficient database
- **Alias support** — Can alias to 'z' for quick access

## Notes
- Requires shell integration to replace cd command
- Common alias: `alias z='zoxide'`
- Database stored in ~/.local/share/zoxide
- Learns from your navigation patterns over time
- Can be used with fzf for interactive selection
