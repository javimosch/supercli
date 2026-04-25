---
name: marked
description: Use this skill when the user wants to convert markdown to HTML.
---

# Marked Plugin

Markdown parser and compiler.

## Commands

### Markdown Parsing
- `marked file parse` — Parse markdown to HTML

## Usage Examples
- "marked file parse --input README.md"
- "marked file parse --input README.md --output README.html"

## Installation

```bash
npm install -g marked
```

## Examples

```bash
# Parse markdown file to HTML
marked README.md -o README.html

# Parse from stdin
echo "# Hello" | marked

# Parse with GitHub Flavored Markdown
marked -g README.md

# Parse to stdout
marked README.md

# Parse with smartypants
marked -s README.md

# Parse with sanitize (DOMPurify required)
marked --sanitize README.md
```

## Key Features
- Markdown to HTML conversion
- CommonMark support
- GitHub Flavored Markdown support
- Fast parsing
- Stdin/stdout support
- File input/output
