---
name: lazyjj
description: Use this skill when the user wants a TUI for jujutsu (jj) — browsing the revset log, describing changes, managing bookmarks, or inspecting the operation log.
---

# lazyjj Plugin

lazyjj is a ratatui TUI for the jujutsu (jj) version control system — lazygit-style navigation over revsets, diffs, bookmarks, and jj's undoable operation log.

## Commands

- `lazyjj tui open` — Launch the TUI in the current repository
- `lazyjj self version` — Show version
- `lazyjj _ _` — Passthrough

## Usage Examples

- "Open a lazygit-style UI for this jj repo"
- "Browse my jj log visually"
- "Manage bookmarks in a TUI"

## Installation

```bash
cargo install lazyjj
# requires: jj (cargo install --locked jj-cli), jujutsu 0.22+
```

## Examples

```bash
# Must run inside a jj repository (or pass -p <path>)
supercli lazyjj tui open

# Specific repo path
supercli lazyjj tui open -p ~/repos/myproject
```

## Key Features

- Log tab: navigate revsets, preview diffs per change, `Enter`/`j`/`k` to move
- Files tab: per-file diff of the selected change
- `n` new change, `d` describe, `e` edit, `S` squash-into, `r` revset filter
- Bookmarks tab: create/move/delete/git-push bookmarks
- `o` opens jj's operation log — select any op and undo to it
- `h` shows the full keybinding help inside the TUI
