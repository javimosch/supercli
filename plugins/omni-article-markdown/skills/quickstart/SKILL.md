---
name: omni-article-markdown
description: Use this skill when the user wants to turn any web article into clean markdown via cli tool.
---

# Omni-article-markdown Plugin

Turn any web article into clean Markdown via CLI tool. The installed binary is `mdcli`.

## Commands

### Operations
- `omni-article-markdown article parse` — Parse a web article or local file into clean Markdown
- `omni-article-markdown article read` — Read and format raw article HTML
- `omni-article-markdown self version` — Print mdcli version
- `omni-article-markdown help show` — Show mdcli help
- `omni-article-markdown _ _` — Passthrough to mdcli CLI

## Usage Examples
- "omni-article-markdown article parse --url https://example.com/post"
- "omni-article-markdown article parse --url https://example.com/post --save ./out"
- "omni-article-markdown article read --url https://example.com/post --prettify"

## Installation

```bash
pip install omni-article-markdown
```

## Examples

```bash
mdcli --version
mdcli --help
mdcli parse https://example.com/post -s ./out
```

## Key Features
- markdown
- web
- scraping
