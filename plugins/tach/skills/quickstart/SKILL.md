---
name: tach
description: Use this skill when the user wants to enforce modular design boundaries, check Python dependencies between packages, or visualize module dependency graphs.
---

# tach Plugin

A Python tool to enforce modular design boundaries and manage dependencies between packages in a codebase. Define and visualize dependencies between modules.

## Commands

### Dependency Checking
- `tach deps check` — Check dependency boundaries
- `tach deps show` — Show dependency graph

### Utility
- `tach _ _` — Passthrough to tach CLI

## Usage Examples
- "Check dependency boundaries"
- "Show dependency graph"
- "Enforce modularity"
- "Check Python architecture"

## Installation

```bash
pip install tach
```

Or via pipx:
```bash
pipx install tach
```

## Examples

```bash
# Check dependencies
tach deps check ./my-project

# Strict mode
tach deps check ./my-project --strict

# Show dependency graph
tach deps show ./my-project

# With format
tach deps show ./my-project --format json

# Any tach command with passthrough
tach _ _ check
tach _ _ show
tach _ _ check --strict
```

## Key Features
- **Boundaries** - Enforce module boundaries
- **Dependencies** - Manage dependencies
- **Graph** - Visualize graph
- **Modular** - Encourage modularity
- **Python** - Python projects
- **Check** - Automated checks
- **Config** - Configurable rules
- **CI/CD** - Pipeline integration
- **Fast** - Quick analysis
- **Architecture** - Architectural guardrails

## Notes
- Great for large Python projects
- Prevents circular dependencies
- Supports CI/CD integration
- Configurable via tach.toml
