---
name: treepp
description: Use this skill when the user wants a better directory tree listing with Unicode box-drawing and filtering.
---

# treepp Plugin

Enhanced tree command with Unicode box-drawing characters, pattern filtering, and improved formatting.

## Commands

### Directory Listing
- `treepp dir list` — List directory tree with improved formatting

## Usage Examples
- "Show me a tree of this project"
- "List all files in the directory tree"
- "Tree with file type filtering"

## Installation

```bash
cargo install treepp
```

## Examples

```bash
treepp
treepp src/
treepp --ext rs,toml
treepp --ignore target
```

## Key Features
- Unicode box-drawing characters
- File extension filtering
- Ignore patterns
- Human-readable file sizes
- Color output
- Fast Rust implementation
