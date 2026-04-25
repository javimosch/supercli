---
name: single-file-cli
description: Use this skill when the user wants to save a web page as a single HTML file, archive a webpage, or save a complete page with all resources.
---

# single-file-cli Plugin

CLI tool for saving a faithful copy of a complete web page in a single HTML file. Saves all resources inline.

## Commands

### Web Page Saving
- `single-file save page` — Save web page as single HTML file

### Utility
- `single-file _ _` — Passthrough to single-file CLI

## Usage Examples
- "Save this webpage as HTML"
- "Archive this page"
- "Save complete page with all resources"
- "Download page as single file"

## Installation

Download from GitHub releases:
```bash
# Download for your platform from:
# https://github.com/gildas-lormeau/single-file-cli/releases

# Make executable
chmod +x single-file

# Move to PATH
sudo mv single-file /usr/local/bin/
```

## Examples

```bash
# Save a page
single-file save page https://example.com -o example.html

# Save with custom browser path
single-file save page https://example.com --browser-executable-path /path/to/chrome

# Save to current directory
single-file save page https://example.com

# Any single-file command with passthrough
single-file _ _ https://example.com -o output.html
single-file _ _ --browser-executable-path /usr/bin/chromium-browser https://example.com
```

## Key Features
- **Single file** - All resources embedded in one HTML
- **Faithful copy** - Preserves page appearance
- **CSS inline** - Styles embedded in HTML
- **Images inline** - Images converted to base64
- **JavaScript preserved** - Scripts included
- **Headless browser** - Uses Chrome/Chromium
- **No dependencies** - Standalone executable
- **Cross-platform** - Works on Linux, macOS, Windows

## Notes
- Requires Chrome or Chromium browser
- Default browser path detected automatically
- Use --browser-executable-path if needed
- Great for archiving and offline viewing
- Large files for image-heavy pages
- Maintains page structure and layout
