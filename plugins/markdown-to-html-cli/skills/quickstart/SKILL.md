---
name: markdown-to-html-cli
description: Use this skill when the user wants to convert markdown to HTML, generate documentation, or render markdown files.
---

# markdown-to-html-cli Plugin

Command line tool that converts markdown to HTML. Supports GFM footnotes, task lists, and custom CSS.

## Commands

### Markdown Conversion
- `markdown-to-html convert file` — Convert markdown to HTML

### Utility
- `markdown-to-html _ _` — Passthrough to markdown-to-html CLI

## Usage Examples
- "Convert this markdown to HTML"
- "Render README as HTML"
- "Generate HTML documentation"
- "Convert markdown files"

## Installation

```bash
npm install -g markdown-to-html-cli
```

## Examples

```bash
# Convert single file
markdown-to-html convert file README.md -o README.html

# Convert with output
markdown-to-html convert file docs.md -o docs.html

# Any markdown-to-html command with passthrough
markdown-to-html _ _ README.md -o output.html
markdown-to-html _ _ --output coverage/index.html
```

## Key Features
- **GFM support** - GitHub Flavored Markdown
- **Footnotes** - GitHub-style footnotes
- **Task lists** - [ ] and [x] checkboxes
- **Tables** - Markdown tables
- **Custom CSS** - Styling support
- **Fast** - Efficient conversion
- **CLI and API** - Use from command line or code
- **GitHub Actions** - Ready for CI/CD

## Supported Features
- Standard Markdown syntax
- GitHub Flavored Markdown extensions
- Code blocks with syntax highlighting
- Tables
- Task lists
- Footnotes
- Strikethrough
- Autolinks
- Custom CSS styling

## Notes
- Output includes default styling
- Can customize CSS
- Great for documentation sites
- Works with existing markdown files
- Can be automated in build processes
