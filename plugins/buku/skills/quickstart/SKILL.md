---
name: buku
description: Use this skill when the user wants to manage bookmarks from the command line.
---

# Buku Plugin

Powerful bookmark manager and personal textual mini-web with auto-fetched metadata.

## Commands

### Bookmark Management
- `buku bookmark add` — Add a bookmark
- `buku bookmark search` — Search bookmarks
- `buku bookmark list` — List all bookmarks
- `buku bookmark open` — Open bookmark in browser

## Usage Examples
- "buku bookmark add --url https://example.com --tags dev,tools"
- "buku bookmark search --query python"
- "buku bookmark list"
- "buku bookmark open --id 1"

## Installation

```bash
pip install buku
# or
brew install buku
```

## Examples

```bash
# Add a bookmark with tags
buku --add https://example.com --tags dev,tools

# Add bookmark with custom title
buku --add https://example.com --title "My Site" --tag personal

# Search bookmarks by tag
buku --sdb tag:dev

# Search bookmarks by regex
buku --sdb python

# List all bookmarks
buku --print

# Print specific bookmark
buku --print 1

# Open bookmark in browser
buku --open 1

# Import bookmarks from browser
buku --import browser=firefox

# Export bookmarks to Markdown
buku --export bookmarks.md
```

## Key Features
- Auto-fetch titles, tags, and descriptions from URLs
- Powerful search with regex and deep scan mode
- Import/export from HTML, XBEL, Markdown, RSS/Atom
- Portable SQLite database
- Tag management with smart redirection
- Privacy-aware (no user data collection)
- Can be used as Python library
- Browser integration
