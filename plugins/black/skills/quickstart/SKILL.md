---
name: black
description: Use this skill when the user wants to format Python code, auto-format Python files, enforce consistent Python style, or fix code formatting.
---

# black Plugin

Uncompromising Python code formatter.

## Commands

### Format
- `black format run` — Format Python files (dry run with diff)
- `black format write` — Format Python files in-place

## Usage Examples
- "Format this Python file"
- "Check if my Python code is formatted correctly"
- "Auto-format all Python files in the project"
- "Show what would change without applying"

## Installation

```bash
pip install black
```

## Examples

```bash
# Format files in-place
black .

# Check formatting
black --check .

# Show diff
black --diff .

# Specific line length
black --line-length 100 .

# Fast mode (skip regex)
black --fast .
```
