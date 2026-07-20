---
name: resvg
description: Use this skill when the user wants to render, convert, or optimize SVG files — export SVG to PNG/PDF, batch-convert icons, or preview vector graphics from the command line.
---

# resvg Plugin

High-quality SVG rendering engine with a CLI for converting SVG to PNG, PDF, or optimized SVG. Supports SVG 1.1 and most SVG 2.0 features.

## Installation

```bash
brew install resvg
# or
cargo install resvg
```

Download binaries from [GitHub Releases](https://github.com/linebender/resvg/releases).

## Basic Usage

```bash
# Convert SVG to PNG (default output: input.png)
resvg icon.svg

# Specify output path and size
resvg logo.svg output.png --width 512 --height 512

# Export to PDF
resvg diagram.svg diagram.pdf

# Render with a background color
resvg badge.svg badge.png --background white
```

## Common Patterns

```bash
# Batch convert all SVGs in a directory
for f in icons/*.svg; do resvg "$f" "png/$(basename "$f" .svg).png"; done

# Scale to fit a max dimension
resvg chart.svg chart.png --zoom 2.0

# Use a custom font directory for text rendering
resvg label.svg label.png --use-fonts-dir ./fonts
```

## Usage Examples

- "Convert this SVG icon to a 256×256 PNG"
- "Render an SVG diagram to PDF for printing"
- "Batch-export all SVG assets to PNG"

## SuperCLI

```bash
sc resvg _ _ icon.svg output.png
sc plugins learn resvg
```
