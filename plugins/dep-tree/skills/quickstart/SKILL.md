---
name: dep-tree
description: Use this skill when the user wants to visualize project dependencies, check for dependency cycles, or analyze module relationships in a codebase.
---

# dep-tree Plugin

Render your project's dependency tree in ASCII, track cycles and exports. Visualize and analyze module dependencies across your codebase.

## Commands

### Dependency Visualization
- `dep-tree deps show` — Show dependency tree

### Cycle Detection
- `dep-tree deps check` — Check for dependency cycles

### Utility
- `dep-tree _ _` — Passthrough to dep-tree CLI

## Usage Examples
- "Show dependency tree"
- "Check for cycles"
- "Visualize module dependencies"
- "Analyze project imports"

## Installation

```bash
brew install dep-tree
```

Or via Go:
```bash
go install github.com/gabotechs/dep-tree@latest
```

## Examples

```bash
# Show dependency tree for current project
dep-tree deps show .

# Show for specific file
dep-tree deps show ./src/index.ts

# Check for cycles
dep-tree deps check .

# With config file
dep-tree deps show . --config dep-tree.yml

# Any dep-tree command with passthrough
dep-tree _ _ render .
dep-tree _ _ check .
```

## Key Features
- **ASCII** - ASCII tree rendering
- **Cycles** - Cycle detection
- **Multi-lang** - JS, TS, Python, Go
- **Exports** - Export analysis
- **Graph** - Dependency graph
- **Interactive** - Interactive mode
- **Cycles** - Prevent circular deps
- **Structure** - Understand structure
- **Analysis** - Codebase analysis
- **CI/CD** - Pipeline integration

## Notes
- Supports multiple languages
- Great for codebase understanding
- Helps prevent circular dependencies
- Perfect for architectural reviews
