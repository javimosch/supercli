---
name: gifgrep
description: Use this skill when the user wants to search for GIFs by keyword, download them, or extract still frames from GIFs.
---

# gifgrep — Grep the GIF

Search GIF providers (Tenor, Giphy) with scriptable CLI output or interactive TUI with inline previews.

## Commands

- `gifgrep search find` — Search for GIFs by keyword
- `gifgrep _ _` — Passthrough to gifgrep CLI

## Installation

```bash
brew install steipete/tap/gifgrep
# or go install github.com/steipete/gifgrep/cmd/gifgrep@latest
```

## Usage Examples

- "Find me a GIF of cats"
- "Search for office handshake GIF"
- "Download a GIF of celebration"
- "Extract still frame from a GIF"

## Key Commands

```bash
# Search GIFs
gifgrep cats --max 5
gifgrep cats --json | jq '.[0].url'

# Download
gifgrep cats --download --max 1

# Extract still from a GIF
gifgrep still ./clip.gif --at 1.5s -o still.png

# Interactive TUI
gifgrep tui "office handshake"
```

## Key Features
- **Multi-Provider** - Tenor & Giphy
- **JSON Output** - Structured data
- **Download** - Save GIFs directly
- **Still/Sheet** - Extract frames
- **TUI Mode** - Interactive browsing
