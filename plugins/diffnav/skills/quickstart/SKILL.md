---
name: diffnav
description: Use this skill when the user wants to navigate and review git diffs with a file tree view using diffnav.
---

# diffnav Plugin

Git diff pager with file tree navigation — browse diffs interactively with a side-by-side file tree.

## Commands

- `diffnav diff show <args>` -- Show git diff with file tree navigation

## Usage Examples

Navigate diffs in current repo:
```
diffnav diff show
```

Navigate diffs for a specific commit:
```
diffnav diff show HEAD~1
```

Navigate staged changes:
```
diffnav diff show --staged
```

Navigate diffs between branches:
```
diffnav diff show main..feature
```

## Installation

```
go install github.com/wallyqs/diffnav@latest
```

## Key Features

- Interactive file tree navigation
- Side-by-side diff view
- Keyboard shortcuts for navigation
- Supports staged and unstaged changes
- Works with any git repository
