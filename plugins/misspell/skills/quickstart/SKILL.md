---
name: misspell
description: Use this skill when the user wants to check for spelling mistakes in source files, fix typos, correct misspelled English words in code.
---

# misspell Plugin

Correct commonly misspelled English words in source files.

## Commands

### Check
- `misspell check run` — Check files for misspellings
- `misspell check fix` — Fix misspellings in-place

## Usage Examples
- "Check this directory for spelling mistakes"
- "Fix typos in all my source files"
- "Find spelling errors in the codebase"

## Installation

```bash
go install github.com/client9/misspell/cmd/misspell@latest
```

## Examples

```bash
# Check files
misspell .

# Fix in place
misspell -w .

# Check specific files
misspell src/*.go

# US vs UK spelling
misspell -locale US .
```
