---
name: pixterm
description: Use this skill when the user wants to display images in the terminal, preview images over SSH, or view graphics from the command line.
---

# pixterm Plugin

A terminal image viewer. Display images directly in the terminal using ANSI escape codes and TrueColor support.

## Commands

### Image Display
- `pixterm image display` — Display image in terminal

### Utility
- `pixterm _ _` — Passthrough to pixterm CLI

## Usage Examples
- "Display image in terminal"
- "Preview image over SSH"
- "Show image in terminal"
- "Terminal image viewer"

## Installation

```bash
brew install pixterm
```

Or via Go:
```bash
go install github.com/eliukblau/pixterm/cmd/pixterm@latest
```

## Examples

```bash
# Display image
pixterm image.png

# Scale image
pixterm --scale 0.5 image.png

# True color mode
pixterm --true-color image.jpg

# Any pixterm command with passthrough
pixterm _ _ photo.jpg
pixterm _ _ --scale 0.3 image.png
pixterm _ _ --true-color screenshot.png
```

## Key Features
- **Display** - Image display
- **Terminal** - Terminal output
- **ANSI** - ANSI escape codes
- **TrueColor** - TrueColor support
- **Images** - Multiple formats
- **SSH** - SSH friendly
- **Scale** - Image scaling
- **Preview** - Image preview
- **CLI** - Command line native
- **Graphics** - Terminal graphics

## Notes
- Works in most terminals
- TrueColor required for best results
- Great for SSH sessions
- Supports PNG, JPG, and more
