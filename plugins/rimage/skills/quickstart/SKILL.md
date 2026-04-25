---
name: rimage
description: Use this skill when the user wants to encode images into different formats (AVIF, JPEG, PNG, WebP, etc.) using the rimage CLI tool.
---

# rimage Plugin

Image encoder CLI tool inspired by squoosh with multiple format support.

## Commands

### Encoding
- `rimage self version` — Print rimage version
- `rimage encode avif` — Encode images into AVIF format
- `rimage encode jpeg` — Encode images into JPEG format
- `rimage encode mozjpeg` — Encode images into JPEG format using MozJpeg codec
- `rimage encode png` — Encode images into PNG format
- `rimage encode webp` — Encode images into WebP format
- `rimage _ _` — Passthrough to rimage CLI

## Usage Examples

- "Convert images to AVIF format"
- "Optimize images with MozJPEG"
- "Encode to WebP for web use"

## Installation

```bash
cargo install rimage
```

## Examples

```bash
# Encode to AVIF
rimage avif input.jpg

# Encode to JPEG with MozJPEG
rimage mozjpeg photo.png

# Encode to WebP
rimage webp image.png

# Encode to PNG with OxiPNG
rimage oxipng photo.jpg
```

## Key Features
- Multiple format support (AVIF, JPEG, PNG, WebP, JPEG XL, QOI, etc.)
- Various codecs (MozJPEG, OxiPNG)
- Command-line interface
- Batch encoding support
- Web optimization
