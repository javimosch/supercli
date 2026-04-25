---
name: gowall
description: Use this skill when the user wants to process images with color themes, compression, OCR, or palette extraction.
---

# Gowall Plugin

Image processing tool with color theme conversion, compression, OCR, AI upscaling, and palette extraction.

## Commands

### Image Processing
- `gowall image theme` — Convert image to color theme
- `gowall image compress` — Compress image
- `gowall image ocr` — Extract text from image using OCR
- `gowall palette extract` — Extract color palette from image

## Usage Examples
- "gowall image theme --input wallpaper.png --theme catppuccin"
- "gowall image compress --input photo.jpg"
- "gowall image ocr --input document.png"
- "gowall palette extract --input image.png"

## Installation

```bash
brew install gowall
# or download from https://github.com/Achno/gowall/releases
```

## Examples

```bash
# Convert image to Catppuccin theme
gowall theme wallpaper.png catppuccin

# Compress image
gowall compress photo.jpg

# Extract text from image using OCR
gowall ocr document.png

# Extract color palette
gowall palette image.png

# Convert icon theme
gowall icon icon.svg dracula

# Upscale image with AI
gowall upscale small.png

# Remove background
gowall remove-bg photo.png

# Convert image format
gowall convert image.webp output.png

# Stack images
gowall stack img1.png img2.png

# Create GIF from images
gowall gif frame1.png frame2.png frame3.png

# Use with pipes (read from stdin, write to stdout)
cat image.png | gowall theme catppuccin > output.png
```

## Key Features
- Color theme conversion (Catppuccin, Dracula, Nord, etc.)
- Image compression
- OCR with multiple providers (Traditional, VLM, Hybrid)
- AI image upscaling
- Color palette extraction
- Icon theme conversion
- Image to pixel art
- Background removal
- Format conversion
- Stack multiple images
- Create GIFs
- Unix pipes/redirection support
