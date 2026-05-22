---
name: cssnano
description: Use this skill when the user wants to optimize and minify CSS for production — reduce file size, merge rules, drop duplicates, and compress colors via PostCSS.
---

# cssnano Plugin

cssnano minifies and optimizes CSS using PostCSS plugins. Reduces file size by removing whitespace, merging rules, and normalizing values.

## Commands

- `cssnano _ _ <args>` — Passthrough

## Usage Examples

- "minify styles.css to styles.min.css"
- "optimize all CSS files in a directory"
- "preview optimization results without writing"
- "merge multiple CSS files and optimize"

## Installation

```bash
npm install -g cssnano
```

## Key Features
- Whitespace and comment removal
- Rule merging and consolidation
- Duplicate selector elimination
- Color compression and normalization
- Value optimization (z-index, calc, etc.)
- Font-face and keyframe deduplication
- PostCSS plugin ecosystem support
- Configurable optimization presets
