---
name: tint
description: Use this skill when the user wants to recolor an image using a terminal color theme palette (Catppuccin, Gruvbox, Everforest, Tokyonight, etc.).
---

# tint Plugin

Palette-based image recoloring CLI. Recolor images using popular terminal color themes like Catppuccin, Gruvbox, Everforest, and Tokyonight.

## Commands

### Image Processing
- `tint image recolor` — Recolor an image using a terminal color theme

### Theme Management
- `tint theme list` — List all available themes and their flavors

### Utility
- `tint self version` — Print tint version
- `tint _ _` — Passthrough to tint CLI

## Usage Examples
- "Recolor my wallpaper with the Catppuccin theme"
- "Apply the Gruvbox palette to this image"
- "List all available color themes"
- "Recolor an image with a darker luminosity"

## Installation

```bash
go install github.com/ashish0kumar/tint@latest
```

## Examples

```bash
# Recolor using Catppuccin (default flavor)
tint image recolor -i input.jpg -t catppuccin

# Recolor with a specific flavor
tint image recolor -i image.png -t catppuccin-latte

# Recolor and save to a specific path
tint image recolor -i wallpaper.jpg -t gruvbox -o gruvbox-wallpaper.jpg

# Make the image slightly brighter
tint image recolor -i photo.jpeg -t gruvbox --luminosity 1.2

# Use Everforest theme with smoother gradients
tint image recolor -i bg.png -t everforest --nearest 50

# Tokyonight with stronger interpolation
tint image recolor -i wallpaper.png -t tokyonight --power 3.5

# List all themes and flavors
tint theme list
```

## Key Features
- Palette-based image recoloring using terminal themes
- Support for popular themes: Catppuccin, Gruvbox, Everforest, Tokyonight
- Theme flavors (e.g. catppuccin-latte, catppuccin-mocha)
- Luminosity adjustment (darker or brighter)
- Interpolation control via nearest colors count
- Shepard's Method power adjustment for gradient smoothing
- JPEG and PNG input support
- JPEG and PNG output support
- Automatic output filename generation

## Notes
- Processing large images (e.g. 50MP, ~7071x7071) can use significant RAM (over 500 MiB)
- Ensure your system has enough free memory before processing large images
- Use `--not-open` to prevent the default viewer from opening the result
- The `-i` and `-t` flags are required for recoloring
- Output path defaults to `<input_filename>_themed_<theme-flavor>.<input_format>`
