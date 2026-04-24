---
name: dust
description: Use this skill when the user wants to analyze disk usage, find which directories are taking up space, or get a visual tree view of storage consumption.
---

# dust Plugin

A more intuitive version of du in rust. Display disk usage with a tree view, showing which directories are taking up space.

## Commands

### Disk Analysis
- `dust disk analyze` — Analyze disk usage with tree view

### Utility
- `dust _ _` — Passthrough to dust CLI

## Usage Examples
- "Analyze disk usage"
- "Find large directories"
- "Visual disk usage tree"
- "du alternative with bars"

## Installation

```bash
brew install dust
```

Or via Cargo:
```bash
cargo install du-dust
```

## Examples

```bash
# Analyze current directory
dust disk analyze

# Analyze specific directory
dust disk analyze /var/log

# Limit depth
dust disk analyze ~ --depth 2

# Without percentage bars
dust disk analyze --no-percent-bars

# Reverse sort
dust disk analyze --reverse

# Any dust command with passthrough
dust _ _ ~/Downloads
dust _ _ --depth 3 /tmp
dust _ _ --no-percent-bars --reverse
```

## Key Features
- **Tree** - Visual tree view
- **Bars** - Percentage bars
- **Colors** - Color-coded sizes
- **Depth** - Configurable depth
- **Sort** - Size sorting
- **Reverse** - Reverse sort
- **Multi-path** - Multiple paths
- **Ignore** - Ignore patterns
- **Fast** - Rust performance
- **Intuitive** - Easy to read

## Notes
- Color-coded by size
- Visual percentage bars
- Great for disk cleanup
- Faster than du for many cases
