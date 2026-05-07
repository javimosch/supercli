---
name: codespell
description: Use this skill when the user wants to check for common spelling mistakes in source code, fix typos in code comments, or find spelling errors across a project.
---

# codespell Plugin

Check source code for common misspellings.

## Commands

### Check
- `codespell check run` — Check files for common misspellings
- `codespell check interactive` — Check and interactively fix misspellings

## Usage Examples
- "Check for spelling mistakes in the codebase"
- "Find and fix typos in source files"
- "Check spelling in comments across the project"

## Installation

```bash
pip install codespell
```

## Examples

```bash
# Check directory
codespell .

# Check specific files
codespell src/*.py docs/*.md

# Skip files
codespell --skip "*.svg,*.png"

# Ignore words
codespell --ignore-words-list "hist"

# Quiet mode
codespell -q 2 .
```
