---
name: difftastic
description: Use this skill when the user wants to compare files or directories with a syntax-aware diff tool.
---

# difftastic Plugin

Structural diff tool that understands syntax across 30+ languages.

## Commands

### Files
- `difftastic files diff` — Compare two files with structural diff

### Directories
- `difftastic dirs diff` — Compare two directories recursively

## Usage Examples
- "Compare two files with syntax-aware diff"
- "Show differences between directories"
- "Diff two source code files"

## Installation

```bash
cargo install difftastic
```

## Examples

```bash
# Compare two files
difft old.rs new.rs

# Side-by-side display
difft --display side-by-side old.py new.py

# Compare directories
difft dir1/ dir2/

# Show in inline format
difft --display inline file1.js file2.js

# Ignore whitespace changes
difft --ignore-comments old.java new.java
```

## Key Features
- Syntax-aware diff for 30+ languages
- AST-based comparison (not just text)
- Side-by-side and inline display modes
- Better diffs for code refactors
- Works with git for improved diffs
