---
name: imagemagick
description: Use this skill when the user wants to process images — convert formats, resize, compress, get metadata, create thumbnails, batch edit, or compare images from the command line.
---

# ImageMagick Plugin

Suite of powerful CLI tools for image processing. Convert, resize, compress, identify, and batch-edit images.

## Commands

### Image Info
- `magick image identify-brief photo.jpg` — Quick dimensions and format
- `magick image identify photo.jpg` — Detailed metadata (verbose)

### Resize & Thumbnails
- `magick image resize input.jpg -resize 800x600 output.jpg` — Resize to exact dimensions
- `magick image resize input.jpg -resize 50% output.jpg` — Resize by percentage
- `magick image thumbnail input.jpg -thumbnail 200x200 thumb.jpg` — Create thumbnail

### Format Conversion
- `magick image convert-format image.jpg image.png` — JPEG to PNG
- `magick image convert-format logo.svg logo.png` — SVG to PNG

### Compression
- `magick image compress photo.jpg -quality 80 compressed.jpg` — Compress JPEG (quality 80)
- `magick image compress image.png -quality 50 compressed.png` — Compress PNG

### Batch
- `magick batch mogrify -resize 800x600 -format png *.jpg` — Batch resize all JPEGs to PNG

### Full Access
- `magick _ _` — Passthrough for any convert command (montage, compare, composite, effects, etc.)

## Usage Examples
- "What are the dimensions of this image?"
- "Resize image.jpg to 1024x768"
- "Convert all SVG files to PNG in this directory"
- "Compress this photo to 70% quality for the web"
- "Create a 150x150 thumbnail of logo.png"
- "Get detailed metadata about photo.tiff"

## Installation

```bash
brew install imagemagick
```

## Key Features
- **Format conversion**: Supports 200+ formats (JPEG, PNG, GIF, WebP, SVG, TIFF, HEIC, PDF, and more)
- **Resize & scale**: Absolute dimensions, percentages, fit within bounds
- **Compression**: Quality adjustment for JPEG/PNG/WebP
- **Metadata**: EXIF, dimensions, colorspace, depth, file size
- **Batch processing**: Process multiple files at once with mogrify
- **Effects**: Blur, sharpen, rotate, crop, color adjustments, and more
- **Non-interactive**: All commands are one-shot, scriptable CLI calls
