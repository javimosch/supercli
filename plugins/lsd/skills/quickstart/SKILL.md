---
name: lsd
description: Use this skill when the user wants a modern ls replacement with icons, colors, tree view, or git-integrated directory listings.
---

# lsd Plugin

The next gen ls command. Modern ls with colors, icons, tree view, and git integration for a more visually appealing directory listing.

## Commands

### Directory Listing
- `lsd dir list` — List directory with icons and colors

### Utility
- `lsd _ _` — Passthrough to lsd CLI

## Usage Examples
- "List files with icons"
- "Modern ls with colors"
- "Tree view listing"
- "Git-aware directory list"

## Installation

```bash
brew install lsd
```

Or via Cargo:
```bash
cargo install lsd
```

Requires Nerd Font for icons.

## Examples

```bash
# List current directory
lsd dir list

# List with icons
lsd dir list --icons

# Long format
lsd dir list --long

# Tree view
lsd dir list --tree

# Show hidden files
lsd dir list --all

# Any lsd command with passthrough
lsd _ _ ~/Downloads --long --icons
lsd _ _ --tree --depth 3
lsd _ _ --all --long --git
```

## Key Features
- **Icons** - File type icons
- **Colors** - Syntax highlighting
- **Tree** - Tree view
- **Git** - Git integration
- **Permissions** - Permission colors
- **Sizes** - Human-readable sizes
- **Dates** - Relative dates
- **Symlinks** - Symlink display
- **Hidden** - Hidden file support
- **Themes** - Theme support

## Notes
- Requires Nerd Font for icons
- Drop-in ls replacement
- Great for terminal productivity
- Configurable display options
