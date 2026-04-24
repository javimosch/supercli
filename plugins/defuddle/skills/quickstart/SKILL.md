---
name: defuddle
description: Use this skill when the user wants to extract the main content from a web page or HTML file and convert it to clean Markdown or structured JSON with metadata.
---

# defuddle Plugin

Extract the main content of any web page as clean Markdown. CLI tool for parsing URLs and HTML files with structured metadata extraction.

## Commands

### Web Content Extraction
- `defuddle web parse` — Parse a URL or HTML file and extract the main content

### Utility
- `defuddle self version` — Print defuddle version
- `defuddle _ _` — Passthrough to defuddle CLI

## Usage Examples
- "Extract the article content from this URL"
- "Convert this HTML file to Markdown"
- "Get the title and author from a web page"
- "Save the extracted content to a file"

## Installation

```bash
npm install -g defuddle
```

Or use without installing:
```bash
npx defuddle parse https://example.com
```

## Examples

```bash
# Parse a URL and output as Markdown
defuddle web parse https://example.com/article --markdown

# Parse a local HTML file
defuddle web parse page.html

# Output as JSON with metadata (title, author, content, etc.)
defuddle web parse https://example.com --json

# Extract only the title
defuddle web parse https://example.com --property title

# Extract only the author
defuddle web parse https://example.com -p author

# Save output to a file
defuddle web parse https://example.com --output article.md --markdown

# Enable debug mode
defuddle web parse https://example.com --debug

# Specify language for content processing
defuddle web parse https://example.com --lang fr

# Parse with Markdown output and save to file
defuddle web parse https://example.com -m -o result.md
```

## Key Features
- **Main content extraction** — Removes ads, navigation, sidebars, and extracts only the article/content
- **Markdown output** — Converts HTML content to clean Markdown with `--markdown`
- **JSON metadata** — Returns structured JSON with title, author, content, etc. via `--json`
- **Property extraction** — Extract specific fields like `title`, `author`, `content`
- **Local file support** — Parse local HTML files as well as URLs
- **Debug mode** — `--debug` for troubleshooting extraction issues
- **Language support** — `--lang` to specify content language code
- **File output** — `--output` to save results directly to a file
- **HTML standardization** — Normalizes headings, code blocks, footnotes, math, callouts

## Notes
- Works with any web page URL or local `.html` file
- Use `--markdown` for clean Markdown output suitable for note-taking apps
- Use `--json` when you need structured data with metadata
- Use `--property` to extract only a specific field (e.g. `title`, `author`, `content`)
- Debug mode shows detailed extraction information for troubleshooting
- The tool intelligently filters out non-content elements like ads, nav bars, and footers
