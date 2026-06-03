---
name: hstr
description: Use this skill when the user wants to search, browse, or manage their bash/zsh command history interactively or via CLI.
---

# hstr Plugin

Shell history suggest box for bash and zsh — easily view, navigate, search, and manage your command history with an interactive TUI.

## Commands

### History
- `hstr history search` — Open interactive history search TUI
- `hstr config bash` — Show bash configuration snippet
- `hstr config zsh` — Show zsh configuration snippet

### Utility
- `hstr _ _` — Passthrough to hstr CLI

## Usage Examples
- "Search my command history for docker commands"
- "Show me my bash history interactively"
- "Configure hstr for zsh"

## Installation

```bash
brew install hstr
```

Or via apt:
```bash
sudo apt install hstr
```

## Configuration

Add hstr to your shell (bash):
```bash
hstr --show-bash-configuration >> ~/.bashrc
```

Or for zsh:
```bash
hstr --show-zsh-configuration >> ~/.zshrc
```

Then reload your shell:
```bash
exec $SHELL
```

## Examples

```bash
# Open interactive history search
hstr history search

# Search history non-interactively for docker commands
hstr history search --non-interactive --keywords docker

# Get bash configuration
hstr config bash

# Get zsh configuration
hstr config zsh

# Passthrough: show version
hstr _ _ --version

# Passthrough: show help
hstr _ _ --help
```

## Key Features
- **Interactive TUI** — Fuzzy search through command history with arrow keys
- **Non-interactive mode** — Filter history programmatically with keywords
- **Shell integration** — Replace Ctrl-r with a full-screen history browser
- **Bookmark support** — Favorite frequently used commands
- **History management** — Remove obsolete or sensitive commands from history
