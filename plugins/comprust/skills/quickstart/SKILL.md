---
name: comprust
description: Use this skill when the user wants to compress images using the comprust CLI tool.
---

# comprust Plugin

Image compressor CLI tool for compressing images with configurable quality and size.

## Commands

### Compression
- `comprust self version` — Print comprust version
- `comprust compress image <source> <destination> <quality> <size>` — Compress images from source to destination
- `comprust _ _` — Passthrough to comprust CLI

## Usage Examples

- "Compress images in ./images to ./compressed with 80% quality"
- "Batch compress images with specific size factor"

## Installation

```bash
cargo install https://github.com/karim-w/comprust
```

## Examples

```bash
# Compress images
comprust ./images ./compressed 80.0 0.5

# Single image
comprust photo.jpg output/ 90.0 0.7
```

## Key Features
- Simple command-line interface
- Configurable quality (0.0-100.0)
- Configurable size factor (0.0-1.0)
- Batch compression support
- Easy cargo installation
