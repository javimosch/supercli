---
name: bit
description: Use this skill when the user wants to render ASCII/ANSI art text, create terminal logos, or list bitmap fonts from the command line.
---

# bit Plugin

CLI/TUI ANSI logo designer and font library with gradients, shadows, scaling, and 100+ bitmap fonts. Supports both interactive TUI and headless CLI output for quick text rendering.

## Commands

### Rendering
- `bit text render` — Render text as ANSI/ASCII art
- `bit font list` — List all available fonts

### Utility
- `bit self version` — Print bit version
- `bit _ _` — Passthrough to bit CLI

## Usage Examples
- "Render 'Hello World' in ASCII art"
- "Create a terminal logo with gradient colors"
- "List all available fonts"
- "Render text with shadow effect"

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/superstarryeyes/bit/main/install.sh | bash
```

## Examples

```bash
# Basic text rendering
bit text render "Hello World"

# Render with a specific font
bit text render "Welcome" -font ithaca

# Colored text
bit text render "Red Text" -color 31

# Hex color
bit text render "Custom" -color "#FF5733"

# Gradient text
bit text render "Gradient" -font dogica -color 31 -gradient 34 -direction right

# Shadow text
bit text render "Shadow" -font larceny -color 94 -shadow -shadow-h 2 -shadow-v 1

# Scaled text
bit text render "BIG" -font pressstart -color 32 -scale 2

# Aligned text
bit text render "Centered\nText" -font gohufontb -color 93 -align center

# Multi-line with line spacing
bit text render "Line 1\nLine 2" -font dogica -line-spacing 2

# List all fonts
bit font list
```

## Key Features
- 100+ bitmap fonts (lazy loaded for memory efficiency)
- ANSI and hex color support
- Two-color gradients with direction control
- Horizontal and vertical shadows with style options
- 0.5x, 1x, 2x, 4x scaling
- Left, center, right text alignment
- Character, word, and line spacing control
- Interactive TUI for designing (optional)
- Headless CLI for quick rendering

## Notes
- Colors: ANSI codes (0-255) or hex values (e.g. "#FF5733")
- Gradient auto-enables when end color differs from text color
- Shadows are disabled automatically with half-pixel scaled characters
