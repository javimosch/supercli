---
name: serie
description: Use this skill when the user wants to visualize git commit history as a rich graph in the terminal using serie.
---

# serie Plugin

Rich git commit graph in terminal — visualize commit history with branches, tags, and merge points.

## Commands

- `serie graph show <args>` -- Show rich git commit graph in terminal

## Usage Examples

Show graph for current repo:
```
serie graph show
```

Show last 20 commits:
```
serie graph show -n 20
```

Show graph for specific branch:
```
serie graph show main
```

Show graph with date range:
```
serie graph show --since 2024-01-01
```

## Installation

```
cargo install serie
```

## Key Features

- Beautiful terminal-based commit graph visualization
- Shows branches, tags, and merge points
- Configurable output format
- Supports date ranges and commit limits
- Fast and lightweight
