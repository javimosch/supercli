---
name: mmdr
description: Use this skill when the user wants to render Mermaid diagrams to SVG or PNG, generate flowcharts, sequence diagrams, or other diagram types from the command line.
---

# mmdr Plugin

Fast native Rust Mermaid diagram renderer — 500-1000x faster than mermaid-cli.

## Commands

### Render
- `mmdr render svg` — Render Mermaid diagram to SVG
- `mmdr render png` — Render Mermaid diagram to PNG

## Usage Examples
- "Render a flowchart to SVG"
- "Convert mermaid diagram to PNG"
- "Pipe diagram through stdin"

## Installation

```bash
cargo install mermaid-rs-renderer
# or
brew install mmdr
```

## Examples

```bash
# Pipe to stdout (SVG)
echo 'flowchart LR; A-->B-->C' | mmdr -e svg

# File to file
mmdr -i diagram.mmd -o output.svg -e svg
mmdr -i diagram.mmd -o output.png -e png

# Render from Markdown
mmdr -i README.md -o ./diagrams/ -e svg
```

## Supported Diagram Types

- **Core:** Flowchart, Sequence, Class, State
- **Data:** ER Diagram, Pie Chart, XY Chart, Quadrant Chart, Sankey
- **Planning:** Gantt, Timeline, Journey, Kanban
- **Architecture:** C4, Block, Architecture, Requirement
- **Other:** Mindmap, Git Graph, Packet, Radar, Treemap

## Key Features
- 100-1400x faster than mermaid-cli
- No browser/Node.js required
- Zero dependencies
- 23 Mermaid diagram types
- SVG and PNG output
- Font caching for speed