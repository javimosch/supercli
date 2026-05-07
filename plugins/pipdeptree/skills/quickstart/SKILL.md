---
name: pipdeptree
description: Use this skill when the user wants to see Python package dependencies, view dependency tree, find conflicting packages, or understand Python package relationships.
---

# pipdeptree Plugin

Display Python package dependency tree.

## Commands

### Tree
- `pipdeptree tree show` — Show package dependency tree
- `pipdeptree tree json` — Show package dependency tree as JSON
- `pipdeptree tree warn` — Show conflicting/warning packages

## Usage Examples
- "Show the dependency tree for installed packages"
- "Which packages depend on requests?"
- "Find conflicting dependencies"
- "Show dependency tree as JSON"

## Installation

```bash
pip install pipdeptree
```

## Examples

```bash
# Show full tree
pipdeptree

# JSON output
pipdeptree --json

# Show package only
pipdeptree -p flask

# Show warnings
pipdeptree --warn

# Reverse tree (show what depends on what)
pipdeptree --reverse
```
