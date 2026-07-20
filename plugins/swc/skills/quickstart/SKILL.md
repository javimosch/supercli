---
name: swc
description: Use this skill when the user wants to transpile or minify JavaScript/TypeScript fast — a Rust-based drop-in Babel replacement with bundling and source maps.
---

# swc Plugin

SWC is a fast Rust-based compiler for JavaScript and TypeScript. Transpile modern syntax, minify bundles, and resolve modules — typically 10–20× faster than Babel.

## Installation

```bash
npm install -g @swc/cli @swc/core
```

## Basic Usage

```bash
# Transpile a file
swc src/index.js -o dist/index.js

# Transpile a directory
swc src -d dist

# Minify output
swc src/index.js -o dist/index.min.js --minify
```

## Common Patterns

```bash
# Use a config file (.swcrc)
swc src -d dist --config-file .swcrc

# Watch mode during development
swc src -d dist --watch

# Source maps for debugging
swc src -d dist --source-maps
```

## Usage Examples

- "Transpile TypeScript to ES2015 with swc"
- "Minify this JS bundle using swc"
- "Set up swc watch mode for src/"

## SuperCLI

```bash
sc swc self version
sc swc _ _ src -d dist
sc plugins learn swc
```
