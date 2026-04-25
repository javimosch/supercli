---
name: image-optimize
description: Use this skill when the user wants to optimize images for smaller file sizes.
---

# Image-Optimize Plugin

CLI tool for optimizing images.

## Commands

### Image Optimization
- `image-optimize file optimize` — Optimize image files

## Usage Examples
- "image-optimize file optimize --path image.png"
- "image-optimize file optimize --path ./images/ --type png"

## Installation

```bash
npm install -g image-optimize
```

## Examples

```bash
# Optimize single image
image-optimize image.png

# Optimize directory
image-optimize ./images/

# Optimize specific type
image-optimize ./images/ -t png

# Force overwrite
image-optimize image.png -f

# Optimize all images in directory
image-optimize ./images/ -f
```

## Key Features
- Image compression
- PNG optimization
- JPG optimization
- Batch processing
- Directory support
- Force overwrite option
