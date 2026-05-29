---
name: d2
description: Use this skill when the user wants to create diagrams from text — architecture diagrams, flowcharts, sequence diagrams, network topologies, or any technical diagram. Compile .d2 files to SVG, PNG, or PDF.
---

# d2 Plugin

Declarative diagram scripting language. Write diagrams as simple text and render to SVG, PNG, or PDF.

## Commands

### Compile
- `d2 compile svg input.d2 output.svg` — Compile to SVG
- `d2 compile svg input.d2 output.svg --theme 1 --layout elk` — With theme and layout
- `d2 compile png input.d2 output.png --scale 2` — Compile to PNG at 2x resolution
- `d2 compile pdf input.d2 output.pdf` — Compile to PDF

### Watch
- `d2 watch start input.d2` — Watch file and recompile on changes

### Options
- `--theme 0-6` — Theme selection (0: Default, 1: Dark, 3: Terminal, etc.)
- `--layout dagre|elk|tala` — Layout engine
- `--pad 100` — Padding in pixels
- `--scale 1` — Canvas scale factor
- `--bundle` — Embed dependency icons as base64 URIs

### Full Access
- `d2 _ _` — Passthrough for advanced options

## Usage Examples
- "Turn this architecture description into a diagram"
- "Generate a flowchart from my d2 file"
- "Create a network topology diagram as PNG"
- "Watch a d2 file and auto-recompile when I edit it"
- "Render this sequence diagram with dark theme"

## Installation

```bash
curl -fsSL https://d2lang.com/install.sh | sh -s --
```

## Key Features
- **Text-based**: Diagrams are plain text, version-controllable
- **Multiple outputs**: SVG, PNG, PDF
- **Themes**: Built-in themes including dark mode
- **Layout engines**: dagre (default), elk, tala
- **Watch mode**: Hot reload on file changes
- **Custom fonts**: Embed TTF fonts
- **Non-interactive**: All operations are one-shot CLI commands

## Example .d2 File

```d2
backend -> database: queries
backend -> cache: reads
client -> backend: HTTP
```
