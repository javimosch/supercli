---
name: pastel
description: Use this skill when the user wants to generate, analyze, convert, or manipulate colors, create color gradients, or colorize text in the terminal.
---

# pastel Plugin

A command-line tool to generate, analyze, convert and manipulate colors. Supports color spaces, composition, and various color operations.

## Commands

### Color Operations
- `pastel color pick` — Pick a color from the terminal
- `pastel color mix` — Mix colors together
- `pastel color paint` — Paint text with color
- `pastel color gradient` — Generate color gradient
- `pastel color random` — Generate random color
- `pastel color text` — Colorize text

### Utility
- `pastel _ _` — Passthrough to pastel CLI

## Usage Examples
- "Convert this color to hex"
- "Mix these colors together"
- "Generate a color gradient"
- "Colorize this text"
- "Pick a random color"

## Installation

```bash
brew install pastel
```

Or via Cargo:
```bash
cargo install pastel
```

## Examples

```bash
# Pick and display a color
pastel color pick #FF5733

# Mix colors
pastel color mix red blue
pastel color mix #FF0000 #0000FF

# Paint text with color
pastel color paint red "Hello World"
pastel color pick #00FF00 | pastel color paint "Success"

# Generate gradient
pastel color gradient red blue
pastel color gradient #FF0000 #00FF00 #0000FF

# Generate random color
pastel color random

# Colorize text
pastel color text "Error message"
pastel color text --color red "Critical error"

# Convert color formats
pastel color pick rgb(255, 87, 51)
pastel color pick hsl(9, 100%, 60%)

# Any pastel command with passthrough
pastel _ _ mix yellow green
pastel _ _ gradient red orange yellow
```

## Key Features
- **Color conversion** — Convert between hex, RGB, HSL, and other formats
- **Color mixing** — Blend colors together
- **Gradients** — Generate smooth color gradients
- **Text coloring** — Apply colors to terminal text
- **Random colors** — Generate random color values
- **Color analysis** — Analyze and inspect colors
- **Multiple formats** — Support for various color specifications
- **Pipeline support** — Use in Unix pipelines
- **Cross-platform** — Available on all major platforms

## Notes
- Supports hex (#RRGGBB), RGB, HSL, and named colors
- Can be used in shell scripts for terminal coloring
- Useful for theming and design work
- Integrates well with other CLI tools
