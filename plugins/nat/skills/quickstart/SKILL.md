---
name: nat
description: Use this skill when the user wants a beautiful file listing, list directory contents with icons and colors, or replace ls with a more visually appealing tool.
---

# nat Plugin

nat - the 'ls' replacement you never knew you needed. A beautifully formatted file and directory listing tool with icons, colors, and git integration.

## Commands

### Directory Listing
- `nat dir list` — List directory contents beautifully

### Utility
- `nat _ _` — Passthrough to nat CLI

## Usage Examples
- "List files beautifully"
- "Pretty directory listing"
- "List with file icons"
- "Beautiful ls replacement"

## Installation

```bash
brew install nat
```

Or via Cargo:
```bash
cargo install natls
```

## Examples

```bash
# List current directory
nat dir list

# List specific directory
nat dir list ./my-project/

# Show hidden files
nat dir list --all

# Long format with icons
nat dir list --long --icons

# Any nat command with passthrough
nat _ _ .
nat _ _ --all --long
nat _ _ ~/Downloads --icons
```

## Key Features
- **Icons** - File type icons
- **Colors** - Syntax highlighting
- **Git** - Git integration
- **Pretty** - Beautiful output
- **Fast** - Fast performance
- **Permissions** - Permission colors
- **Sizes** - Human-readable sizes
- **Dates** - Relative dates
- **Symlinks** - Symlink display
- **Hidden** - Hidden file support

## Notes
- Drop-in ls replacement
- Requires Nerd Font for icons
- Great for terminal productivity
- Configurable display options
