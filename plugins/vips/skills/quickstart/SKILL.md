---
name: vips
description: Use this skill when the user wants to resize, thumbnail, convert, or batch-process images fast with low memory usage.
---

# vips Plugin

vips exposes libvips' 300+ operations as CLI subcommands. It streams images rather than loading them, so it handles huge files with a fraction of ImageMagick's memory and time.

## Commands

- `vips self version` — Print vips version
- `vips ops list` — List all available vips operations (vips -l)
- `vips image resize` — Resize an image by scale factor (vips resize in.jpg out.jpg 0.5)
- `vips image thumbnail` — Create a thumbnail of a given width in px (vips thumbnail in.jpg out.jpg 200)
- `vips _ _` — Passthrough to vips CLI

## Usage Examples

- "Shrink this 80MB TIFF to a web-sized JPEG"
- "Make a 200px thumbnail of every product photo"
- "Convert a PNG to WebP"

## Installation

```bash
brew install vips
# or: apt install libvips-tools
# or: dnf install vips-tools
```

## Examples

```bash
vips -l                          # list all operations
vips copy in.png out.webp        # format conversion
vips resize in.jpg out.jpg 0.5   # half size
vips thumbnail in.jpg out.jpg 200
vips extract_area in.jpg out.jpg 100 100 800 600  # crop x y w h
```

## Key Features

- Demand-driven streaming pipeline — processes images bigger than RAM
- 300+ operations: colour spaces, filters, compositing, deep-zoom pyramids
- Dramatically faster and lighter than ImageMagick for bulk jobs
