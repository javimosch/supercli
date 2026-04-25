---
name: md-to-pdf
description: Use this skill when the user wants to convert Markdown files to PDF.
---

# MD-to-PDF Plugin

Hackable CLI tool for converting Markdown files to PDF using Node.js and headless Chrome.

## Commands

### File Conversion
- `md-to-pdf file convert` — Convert Markdown to PDF

## Usage Examples
- "md-to-pdf file convert --input document.md"
- "md-to-pdf file convert --input document.md --output doc.pdf"

## Installation

```bash
npm install -g md-to-pdf
```

## Examples

```bash
# Convert markdown to PDF
md-to-pdf document.md

# Specify output file
md-to-pdf document.md --output doc.pdf

# Use custom stylesheet
md-to-pdf document.md --stylesheet styles.css

# Add inline CSS
md-to-pdf document.md --css 'body { font-size: 12pt; }'

# Set PDF options
md-to-pdf document.md --pdf-options '{"format": "A4", "margin": {"top": "1cm"}}'

# Convert multiple files with glob
md-to-pdf ./**/*.md

# Pipe markdown from stdin
cat document.md | md-to-pdf > output.pdf

# Watch mode for live updates
md-to-pdf document.md --watch

# Output as HTML instead
md-to-pdf document.md --as-html
```

## Key Features
- Markdown to PDF conversion
- Custom stylesheets
- Inline CSS support
- Code highlighting (highlight.js)
- Custom PDF options
- Watch mode
- Glob pattern support
- HTML output option
- Stdin/stdout support
