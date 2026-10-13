---
name: vtracer
description: Use this skill when the user wants to vectorize a raster image, convert PNG/JPG to SVG, or trace bitmap artwork to vector paths.
---

# vtracer Plugin

vtracer converts raster images (PNG, JPG) into SVG vector graphics. Written in Rust, it preserves color, supports curve/polygon/spline fit modes, and runs ~100x faster than Potrace.

## Commands

### Vectorizing
- `vtracer vectorize convert` — Convert raster to SVG: sc vtracer vectorize convert --input logo.png --output logo.svg

### General
- `vtracer self version` — Print vtracer version
- `vtracer _ _` — Passthrough to vtracer CLI

## Usage Examples
- "Vectorize this logo PNG to SVG"
- "Convert a scanned drawing to a vector file"
- "Trace a pixel-art sprite with polygon mode"

## Installation

```bash
cargo install vtracer
```

## Examples

```bash
vtracer --input logo.png --output logo.svg
vtracer --input photo.jpg --output photo.svg --colormode color --mode polygon
vtracer --help
```

## Key Features
- Color-aware tracing
- curve/polygon/spline modes
- Pixel-art friendly
- Rust single binary
