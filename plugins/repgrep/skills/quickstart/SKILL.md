---
name: repgrep
description: repgrep — interactive terminal UI for ripgrep search and replace
---
# repgrep Plugin

repgrep (`rgr`) is an interactive terminal companion to ripgrep. It runs a ripgrep search, lets you review matches in a TUI, deselect any you want to skip, and then applies a replacement across all selected matches.

## Quickstart

```bash
# Search for a pattern, then interactively replace
rgr 'foo'

# Restrict the search to a file type
rgr --type rust 'old_name'

# Case-insensitive search
rgr -i 'todo'

# Search including hidden files
rgr --hidden 'secret'
```

In the TUI: navigate matches, press `Space` to toggle a match, enter your replacement text, and confirm to write the changes to disk. Requires ripgrep (`rg`) on PATH.
