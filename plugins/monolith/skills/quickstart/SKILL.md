---
name: monolith
description: Use this skill when the user wants to save a complete web page as a single HTML file, archive web pages for offline reading, or download websites with all assets embedded.
---

# monolith Plugin

Save complete web pages as a single HTML file with all CSS, images, and JavaScript embedded.

## Commands

### Save Web Pages
- `monolith save url` — Save web page from URL to file
- `monolith save stdin` — Save from stdin input

## Usage Examples
- "Save a web page to an HTML file"
- "Archive a page for offline reading"
- "Download a page with all assets embedded"

## Installation

```bash
cargo install monolith
# or
brew install monolith
```

## Examples

```bash
# Save a web page
monolith https://example.com -o example.html

# Save from stdin
cat page.html | monolith - -b https://example.com > page-with-assets.html

# Save with custom base URL
monolith https://example.com -b https://example.com -o output.html
```

## Common Options
- `-o` — Output file (use "-" for stdout)
- `-b` — Custom base URL
- `-a` — Exclude audio
- `-c` — Exclude CSS
- `-i` — Remove images
- `-j` — Exclude JavaScript
- `-I` — Isolate document
- `-m` — Output in MHTML format
- `-q` — Quiet mode
- `-t` — Network timeout