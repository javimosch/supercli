---
name: difft
description: difft — structural syntax-aware diff tool comparing code by AST
---
# difft Plugin

Difftastic is a syntax-aware diff tool that compares code by AST rather than line-by-line, producing clearer diffs across 30+ languages.

## Quickstart

```bash
# Compare two files
difft old.js new.js

# Side-by-side display
difft --display side-by-side old.py new.py

# Compare entire directories
difft dir1/ dir2/

# Inline display mode
difft --display inline old.rs new.rs

# Ignore comments when diffing
difft --ignore-comments old.java new.java
```
