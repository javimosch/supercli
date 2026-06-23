---
name: gitui
description: gitui — blazing fast terminal UI for git
---
# gitui Plugin

GitUI is a fast, keyboard-driven terminal interface for git, letting you stage hunks, commit, browse logs, manage branches, and resolve conflicts without leaving the terminal.

## Quickstart

```bash
# Launch gitui in the current repository
gitui

# Open gitui for a specific repo path
gitui -d /path/to/repo

# Use a specific theme file
gitui -t my-theme.ron

# Show key bindings reference
gitui --help
```

Inside the TUI: press `1`-`5` to switch tabs (Status, Log, Files, Stashing, Branches), `Space` to stage, `c` to commit, and `?` for the help overlay.
