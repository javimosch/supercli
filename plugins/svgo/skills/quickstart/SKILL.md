---
name: svgo
description: Use this skill when the user wants to optimize SVG files, reduce SVG file size, clean up SVG code, or process SVG images.
---

# svgo Plugin

Node.js tool for optimizing SVG files. Remove redundant information, optimize paths, and reduce file size.

## Commands

### SVG Optimization
- `svgo optimize svg` — Optimize SVG files

### Utility
- `svgo _ _` — Passthrough to svgo CLI

## Usage Examples
- "Optimize this SVG"
- "Reduce SVG file size"
- "Clean up SVG code"
- "Optimize all SVGs in a folder"

## Installation

```bash
npm install -g svgo
```

Or via yarn:
```bash
yarn global add svgo
```

Or via pnpm:
```bash
pnpm add -g svgo
```

## Examples

```bash
# Optimize single file
svgo optimize svg input.svg -o output.svg

# Optimize in place
svgo optimize svg input.svg

# Optimize directory recursively
svgo optimize svg -rf path/to/svgs -o path/to/output

# Set precision
svgo optimize svg input.svg -p 2

# Multiple passes for better optimization
svgo optimize svg input.svg --multipass

# Use custom config
svgo optimize svg input.svg --config svgo.config.mjs

# Process multiple files
svgo optimize svg one.svg two.svg -o one.min.svg two.min.svg

# Any svgo command with passthrough
svgo _ _ input.svg --precision 3
svgo _ _ -rf ./svgs -o ./optimized
```

## Key Features
- **Size reduction** - Remove redundant metadata and comments
- **Path optimization** - Simplify and optimize SVG paths
- **Precision control** - Adjust numeric precision
- **Plugin architecture** - Extensible with custom plugins
- **Recursive processing** - Process entire directories
- **Config support** - JSON/MJS configuration files
- **Multipass mode** - Multiple optimization passes
- **Batch processing** - Handle multiple files at once

## Notes
- Default precision is 3 decimal places
- Preserves rendering while reducing size
- Can remove editor metadata and hidden elements
- Supports custom plugin configurations
- Great for web optimization
- Safe for production use
