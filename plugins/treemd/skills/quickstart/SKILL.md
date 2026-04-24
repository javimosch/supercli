---
name: treemd
description: Use this skill when the user wants to navigate, query, or extract content from markdown files from the command line.
---

# treemd Plugin

Markdown navigator with tree-based structural navigation. Supports both interactive TUI and non-interactive CLI modes for listing headings, extracting sections, querying markdown elements with a jq-like language, and outputting JSON.

## Commands

### Headings
- `treemd headings list` — List all headings in a markdown file
- `treemd headings tree` — Show heading tree structure

### Sections
- `treemd section extract` — Extract a section by heading name

### Analysis
- `treemd doc count` — Count headings by level
- `treemd doc query` — Query markdown elements using jq-like syntax

### Utility
- `treemd self version` — Print treemd version
- `treemd self query-help` — Show query language documentation
- `treemd _ _` — Passthrough to treemd CLI

## Usage Examples
- "List all headings in README.md"
- "Show the heading tree of docs/guide.md"
- "Extract the Installation section from README.md"
- "Query all code blocks in a markdown file"
- "Find all h2 headings matching Features"
- "Count headings by level in a document"

## Installation

```bash
cargo install treemd
```

## Examples

```bash
# List all headings
treemd headings list README.md
treemd headings list README.md -o json

# List only level-2 headings
treemd headings list README.md -L 2

# Filter headings by text
treemd headings list README.md --filter "usage"

# Show heading tree
treemd headings tree README.md

# Extract a section
treemd section extract "Installation" README.md

# Count headings by level
treemd doc count README.md

# Query all h2 headings
treemd doc query '.h2' README.md

# Query code blocks
treemd doc query '.code' README.md

# Query links and extract URLs
treemd doc query '.link | url' README.md

# Query with JSON output
treemd doc query '.h2' README.md --query-output json

# Fuzzy match heading
treemd doc query '.h2[Features]' README.md

# Direct children
treemd doc query '.h1 > .h2' README.md

# All descendants
treemd doc query '.h1 >> .code' README.md

# Document statistics
treemd doc query '. | stats' README.md

# Pipe from stdin
cat README.md | treemd headings list
curl -s https://raw.githubusercontent.com/user/repo/main/README.md | treemd doc query '.h'
```

## Query Language Quick Reference

- `.h` — All headings
- `.h2` — Level 2 headings
- `.code` — Code blocks
- `.code[rust]` — Code blocks in Rust
- `.link` — Links
- `.img` — Images
- `.table` — Tables
- `.h2[Features]` — Fuzzy match
- `.h2["Installation"]` — Exact match
- `.h2[0]` — First h2
- `.h2[1:3]` — Slice
- `.h2 | text` — Strip markdown
- `.h2 | text | slugify` — URL slug
- `[.h] | count` — Count elements
- `[.h] | limit(5)` — First 5
- `.h | select(contains("API"))` — Filter
- `.h1 > .h2` — Direct children
- `.h1 >> .code` — All descendants
- `. | stats` — Document statistics
- `. | levels` — Heading counts by level
- `. | langs` — Code blocks by language

## Key Features
- List headings with level and text filters
- Extract sections by heading name
- Heading tree visualization
- Count headings by level
- jq-like query language for markdown
- JSON, pretty JSON, and JSON Lines output
- Stdin support for piping
- Both interactive TUI and non-interactive CLI modes
