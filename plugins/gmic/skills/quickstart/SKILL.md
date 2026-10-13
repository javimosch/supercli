---
name: gmic
description: Use this skill when the user wants to apply filters, convert, denoise, resize, or batch-process images with the G'MIC engine.
---

# gmic Plugin

G'MIC is a full-featured image processing framework. The gmic CLI exposes 1000+ filters to convert formats, apply artistic effects, denoise, resize, normalize, and chain pipelines.

## Commands

### Processing
- `gmic image apply` — Run a filter pipeline: sc gmic image apply input.png -resize 50% -o out.png
- `gmic docs lookup` — Show help for a filter: sc gmic docs lookup blur

### General
- `gmic self version` — Print gmic version
- `gmic _ _` — Passthrough to gmic CLI

## Usage Examples
- "Convert a photo to black and white"
- "Apply a sharpen filter to this image"
- "Batch resize a folder of images"

## Installation

```bash
sudo apt-get install -y gmic
```

## Examples

```bash
gmic in.png -resize 800,800 -o out.png
gmic in.jpg -smooth 2 -sharpen 100 -o out.jpg
gmic -h blur
```

## Key Features
- 1000+ built-in filters
- Format conversion
- Scriptable pipelines
- No daemon or config needed
