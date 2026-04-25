---
name: node-minify
description: Use this skill when the user wants to compress JavaScript or CSS files.
---

# Node-Minify Plugin

CLI tool for compressing JavaScript and CSS files.

## Commands

### File Compression
- `node-minify file compress` — Compress JavaScript or CSS file

## Usage Examples
- "node-minify file compress --input script.js --output script.min.js"
- "node-minify file compress --input style.css --output style.min.css"

## Installation

```bash
npm install -g @node-minify/cli @node-minify/uglify-js @node-minify/clean-css
```

## Examples

```bash
# Compress JavaScript
node-minify --compressor uglify-js input.js output.js

# Compress CSS
node-minify --compressor clean-css input.css output.css

# Compress with babel-minify
npm install -g @node-minify/babel-minify
node-minify --compressor babel-minify input.js output.js

# Compress with gcc (Google Closure Compiler)
npm install -g @node-minify/gcc
node-minify --compressor gcc input.js output.js
```

## Key Features
- JavaScript minification
- CSS minification
- Multiple compressor options
- uglify-js support
- clean-css support
- babel-minify support
- gcc (Closure Compiler) support
