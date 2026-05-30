---
name: gitu
description: Use this skill when the user wants a terminal UI for git operations, an interactive git client in the terminal, or a Magit-like experience outside of Emacs.
---

# gitu Plugin

A terminal user interface for Git inspired by Magit. Stage, commit, branch, rebase, and manage your git repositories from the terminal.

## Commands

### Version
- `gitu self version` — Print gitu version

### Repository
- `gitu repo open` — Open gitu TUI in current directory
- `gitu repo open /path/to/repo` — Open gitu TUI in specified repo

### Utility
- `gitu _ _` — Passthrough to gitu CLI

## Usage Examples
- "Open gitu for this repository"
- "Launch the git TUI"
- "Show me a visual git interface"

## Installation

```bash
cargo install gitu
```

Or via Homebrew:
```bash
brew install gitu
```

## Examples

```bash
# Open gitu in current directory
gitu repo open

# Open gitu in a specific repository
gitu repo open ~/projects/my-repo

# Print version
gitu self version
```

## Key Features
- **Staging/Unstaging** — File, hunk, and line-level staging
- **Committing** — Commit, amend, and fixup creation
- **Branching** — Checkout, create new branches
- **Rebasing** — Interactive rebase, autosquash, continue/abort
- **Fetching/Pulling/Pushing** — Remote operations
- **Resetting** — Soft, mixed, and hard resets
- **Reverting** — Revert commits
- **Stashing** — Save, pop, apply, drop
- **Logging** — View commit logs
- **Vim-like keybinds** — Familiar navigation for Vim users

## Notes
- Press `h` for help menu inside gitu
- Config at `~/.config/gitu/config.toml`
- Uses `$VISUAL`, `$EDITOR`, or `$GIT_EDITOR` (in that order) for editor
