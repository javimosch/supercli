---
name: xq
description: Use this skill when the user wants to extract data from XML/HTML, beautify XML/HTML files, or use XPath queries on structured data.
---

# xq Plugin

Command-line XML and HTML beautifier and content extractor. Extract and format XML/HTML data with XPath queries.

## Commands

### XML/HTML Processing
- `xq xml extract` — Extract XML/HTML content

### Utility
- `xq _ _` — Passthrough to xq CLI

## Usage Examples
- "Extract XML content"
- "Beautify HTML file"
- "XPath query on XML"
- "Parse structured data"

## Installation

```bash
brew install xq
```

Or via Go:
```bash
go install github.com/sibprogrammer/xq@latest
```

## Examples

```bash
# Extract content
xq xml extract data.xml

# Use XPath query
xq xml extract data.xml --xpath "//book/title"

# Pretty print
xq xml extract data.xml --pretty

# Colorize output
xq xml extract data.xml --color

# Any xq command with passthrough
xq _ _ data.xml
xq _ _ data.xml --xpath "//item"
```

## Key Features
- **XPath** - XPath query support
- **Beautify** - Format XML/HTML
- **Extract** - Extract specific content
- **Colorize** - Syntax highlighting
- **HTML** - HTML processing
- **XML** - XML processing
- **Fast** - Quick extraction
- **Easy** - Simple interface
- **Flexible** - Multiple output formats
- **Parsing** - Structured data parsing

## Notes
- Great for web scraping
- XPath query support
- Perfect for data extraction
- Handles both XML and HTML
