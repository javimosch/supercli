---
name: diffsitter
description: Use this skill when the user wants semantic diffs between source files — AST-aware comparisons that ignore formatting noise and highlight meaningful code changes.
---

# diffsitter Plugin

Structural diff tool powered by tree-sitter parsers. Compares code by syntax tree instead of raw lines, making reviews cleaner for refactors and reformatting.

## Installation

```bash
cargo install diffsitter
# or download from https://github.com/afnanenayet/diffsitter/releases
```

## Basic Usage

```bash
# Diff two files (language inferred from extension)
diffsitter old.rs new.rs

# Explicit language when extension is ambiguous
diffsitter --language python before.py after.py

# Compare against git HEAD
git diffsitter

# Side-by-side terminal output
diffsitter --display side-by-side file1.go file2.go
```

## Common Patterns

```bash
# Only show changed hunks (suppress unchanged context)
diffsitter --context 0 src/main.rs src/main.new.rs

# Use in a git alias for semantic diffs
git config alias.sdiff '!f() { diffsitter "$1" "$2"; }; f'

# Pipe to a pager for large diffs
diffsitter large_old.ts large_new.ts | less -R
```

## Usage Examples

- "Show a semantic diff between these two Python files"
- "Compare this file to the version on main without whitespace noise"
- "Review what actually changed in this refactor"

## SuperCLI

```bash
sc diffsitter _ _ old.rs new.rs
sc diffsitter _ _ --language kotlin Before.kt After.kt
sc plugins learn diffsitter
```
