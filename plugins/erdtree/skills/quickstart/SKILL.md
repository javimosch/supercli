---
name: erdtree
description: Use this skill when the user wants to visualize file trees, analyze disk usage, or explore directory structures with a modern tree command.
---

# erdtree Plugin

A modern, multi-threaded file tree visualizer and disk usage analyzer. A prettier and faster tree command with icons, colors, and disk usage information.

## Commands

### Tree Display
- `erdtree tree show` — Display file tree with disk usage

### Utility
- `erdtree _ _` — Passthrough to erdtree CLI

## Usage Examples
- "Show file tree"
- "Analyze disk usage"
- "Explore directory structure"
- "Visualize file sizes"

## Installation

```bash
brew install erdtree
```

Or via Cargo:
```bash
cargo install erdtree
```

## Examples

```bash
# Show current directory tree
erdtree tree show

# Show specific path
erdtree tree show ./my-project

# Limit depth
erdtree tree show --level 3

# With icons
erdtree tree show --icons

# Human readable sizes
erdtree tree show --human-readable

# Any erdtree command with passthrough
erdtree _ _ ./my-project --level 2
erdtree _ _ --icons --human-readable
```

## Key Features
- **Multi-threaded** - Fast scanning
- **Disk usage** - Size information
- **Icons** - File type icons
- **Colors** - Colorized output
- **Depth** - Configurable depth
- **Prune** - Prune empty dirs
- **Pretty** - Beautiful output
- **Fast** - Parallel processing
- **Cross-platform** - Linux, macOS, Windows
- **Modern** - Modern tree command

## Notes
- Great for exploring projects
- Shows disk usage inline
- Faster than traditional tree
- Perfect for documentation
