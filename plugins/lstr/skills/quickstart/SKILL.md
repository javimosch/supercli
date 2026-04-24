---
name: lstr
description: Use this skill when the user wants to list files in a directory tree with git status, permissions, sizes, icons, or LS_COLORS theming.
---

# lstr Plugin

Fast, minimalist directory tree viewer with theme-aware coloring, git integration, file permissions, sizes, and .gitignore support. Classic mode for headless output and optional interactive TUI.

## Commands

### Directory Tree
- `lstr dir tree` — Generate a directory tree listing

### Utility
- `lstr self version` — Print lstr version
- `lstr _ _` — Passthrough to lstr CLI

## Usage Examples
- "Show the directory tree for the current folder"
- "List files with git status indicators"
- "Show file sizes and permissions in a tree"
- "Generate a tree respecting .gitignore"
- "Show only directories"

## Installation

```bash
brew install lstr
```

## Examples

```bash
# Basic tree for current directory
lstr dir tree

# Tree for a specific directory
lstr dir tree /path/to/dir

# Show file sizes
lstr dir tree -s

# Show file permissions
lstr dir tree -p

# Show git status (Modified, New, Untracked)
lstr dir tree -G

# Combine options: sizes, permissions, and git status
lstr dir tree -s -p -G

# Show icons (requires Nerd Font)
lstr dir tree --icons

# Respect .gitignore
lstr dir tree -g

# Limit depth to 3 levels
lstr dir tree -L 3

# Show only directories
lstr dir tree -d

# Combine: gitignore + depth 2 + git status
lstr dir tree -g -L 2 -G
```

## Key Features
- **Classic and interactive modes**: `lstr` for headless output, `lstr interactive` for TUI
- **Theme-aware coloring**: Respects `LS_COLORS` environment variable
- **Git integration**: Show file statuses (`-G`) like Modified, New, Untracked
- **File permissions**: `-p` shows permission bits
- **File sizes**: `-s` shows human-readable sizes
- **Icons**: `--icons` displays file-specific icons (requires Nerd Font)
- **.gitignore support**: `-g` automatically filters ignored files
- **Depth control**: `-L` limits recursion depth
- **Directories only**: `-d` shows only directories
- **Piping support**: Output can be piped to `fzf`, `less`, `bat`, etc.

## Notes
- Running `lstr` without arguments generates a tree for the current directory
- Use `lstr interactive` directly for the keyboard-driven TUI mode (not via supercli)
- Theme colors are fully customizable via the `LS_COLORS` environment variable
- Works great in pipelines: `lstr | fzf`, `lstr | less`, `lstr | bat`
