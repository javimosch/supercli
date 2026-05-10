---
name: svgbob
description: Use this skill when the user wants to create diagrams, architecture illustrations, flowcharts, or technical drawings from ASCII art — convert text diagrams into SVG images.
---

# SvgBob Plugin

Convert ASCII art diagrams into SVG graphics. Sketch architecture, flowcharts, and boxes in text, render as images.

## Commands

### Self
- `svgbob self version` — Print version

### Convert
- `svgbob convert file` — Convert ASCII diagram file to SVG
- `svgbob convert string` — Convert inline ASCII string to SVG

### Passthrough
- `svgbob _ _` — Passthrough for any svgbob command

## Usage Examples
- "Convert this ASCII architecture diagram to SVG"
- "Turn this text-based flowchart into an image"
- "Render this ASCII art network diagram"

## Installation

```bash
cargo install svgbob_cli
```

## Examples

```bash
# Convert a diagram file to SVG
svgbob_cli diagram.txt > output.svg

# Inline string conversion
svgbob_cli -s "
+------+     +------+
| API  |---->| DB   |
+------+     +------+
   |
   v
+------+
| Cache|
+------+
" > architecture.svg

# Custom colors
svgbob_cli diagram.txt --background "#f0f0f0" --fill-color "#333"

# Read from stdin
cat diagram.txt | svgbob_cli > output.svg

# With custom font
svgbob_cli diagram.txt --font-family "monospace"
```

## Key Features
- ASCII art to SVG conversion
- Supports boxes, arrows, circles, diamonds, lines
- Pipe-friendly (stdin/stdout)
- Custom colors and fonts
- Pure Rust, no dependencies
- Suitable for architecture diagrams, flowcharts, network topologies
