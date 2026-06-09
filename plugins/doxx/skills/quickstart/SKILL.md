---
name: doxx
description: Use this skill when the user wants to view, search, or export .docx Word files from the terminal without Microsoft Office.
---

# doxx Plugin

Terminal-native .docx document viewer — view, search, and export Word files without leaving your command line. Fast, safe, and smart.

## Commands

### View
- `doxx view run --file <path>` — View a .docx file in the terminal with formatting

### Export
- `doxx export markdown --file <path>` — Export .docx to Markdown
- `doxx export csv --file <path>` — Extract tables as CSV
- `doxx export json --file <path>` — Export document metadata as JSON
- `doxx export text --file <path>` — Export as plain text

### Utility
- `doxx self version` — Print doxx version

## Usage Examples
- "Show me this Word document in the terminal"
- "Convert this .docx to Markdown"
- "Extract tables from this Word file as CSV"
- "Search for a term in this .docx file"
- "Export this document as plain text"

## Installation

```bash
brew install doxx
```

Or via Cargo:
```bash
cargo install doxx
```

## Key Features
- Beautiful terminal rendering with formatting, tables, and lists
- Equation support with LaTeX rendering
- Fast search with highlighting
- Export to Markdown, CSV, JSON, plain text, ANSI-colored output
- Terminal images for Kitty, iTerm2, WezTerm
