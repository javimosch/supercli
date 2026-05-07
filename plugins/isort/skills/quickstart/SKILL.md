---
name: isort
description: Use this skill when the user wants to sort Python imports, organize imports alphabetically, fix import order, or clean up Python imports.
---

# isort Plugin

Python import sorter.

## Commands

### Sort
- `isort sort check` — Check import sorting (dry run)
- `isort sort write` — Sort imports in-place

## Usage Examples
- "Sort imports in this Python file"
- "Check if imports are sorted correctly"
- "Organize imports in the whole project"
- "Fix import ordering"

## Installation

```bash
pip install isort
```

## Examples

```bash
# Sort imports in-place
isort .

# Check only
isort --check-only .

# Show diff
isort --check-only --diff .

# Profile for black compatibility
isort --profile black .

# Force single line
isort --force-single-line-imports .
```
