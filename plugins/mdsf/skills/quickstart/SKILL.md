---
name: mdsf
description: Use this skill when the user wants to format code blocks inside markdown files, lint markdown code examples, or verify formatting in documentation.
---

# mdsf Plugin

Format markdown code blocks using your favorite tools.

## Commands

### File
- `mdsf file format` — Format markdown code blocks in files
- `mdsf file verify` — Verify formatting without modifying files

### Cache
- `mdsf cache prune` — Remove old formatting caches

## Usage Examples
- "Format all markdown files in docs/"
- "Verify code block formatting"
- "Format a single markdown file"

## Installation

```bash
cargo install mdsf
```

## Examples

```bash
# Format a single file
mdsf format README.md

# Format all markdown in a directory
mdsf format docs/

# Verify without modifying
mdsf verify README.md

# With caching
mdsf format --cache docs/

# Prune old caches
mdsf cache-prune
```

## Key Features
- 50+ language support
- Multiple formatter backends
- Caching for performance
- Verification mode (CI-friendly)
- Custom tool configuration
- pre-commit integration
