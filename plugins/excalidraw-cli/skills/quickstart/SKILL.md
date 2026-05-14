---
name: excalidraw-cli
description: Use this skill when the user wants to create Excalidraw diagrams, flowcharts, or visualizations from text descriptions or DSL syntax.
---

# Excalidraw CLI Plugin

CLI tool for creating Excalidraw hand-drawn-style flowcharts and diagrams programmatically from a text-based DSL or JSON input. Supports auto-layout, node styling, multiple flow directions, and export to PNG/SVG.

## Commands

### Diagram Creation
- `excalidraw-cli diagram create <input>` — Create flowchart from DSL or JSON file
- `excalidraw-cli diagram create --inline <dsl>` — Create from inline DSL string
- `excalidraw-cli diagram create --stdin` — Create from stdin pipe

### Conversion & Export
- `excalidraw-cli diagram convert <file>` — Convert .excalidraw to PNG/SVG
- `excalidraw-cli diagram parse <file>` — Validate DSL/JSON without generating output

### Info
- `excalidraw-cli self version` — Print version

## Usage Examples
- "Create a flowchart from this DSL: (Start) -> [Process] -> (End)"
- "Generate an architecture diagram for our microservices system"
- "Convert my diagram.excalidraw file to a PNG image"

## Installation

```bash
npm install -g @swiftlysingh/excalidraw-cli
```

## Examples

### Create from inline DSL
```bash
excalidraw-cli diagram create --inline "(Start) -> [Process] -> {Decision?}" -o flow.excalidraw
```

### Create from file
```bash
excalidraw-cli diagram create flowchart.dsl -o diagram.excalidraw
```

### Pipe from stdin
```bash
echo "[A] -> [B] -> [C]" | excalidraw-cli diagram create --stdin -o diagram.excalidraw
```

### Export to PNG with dark mode
```bash
excalidraw-cli diagram convert diagram.excalidraw --format png --scale 2 --dark
```

### Export to SVG
```bash
excalidraw-cli diagram convert diagram.excalidraw --format svg
```

### Parse and validate DSL
```bash
excalidraw-cli diagram parse flowchart.dsl
```

## Key Features
- Text-based DSL for quick flowchart creation
- JSON API for programmatic use
- Auto-layout using ELK.js (Eclipse Layout Kernel)
- Multiple flow directions: TB, BT, LR, RL
- Node styling: fillStyle, backgroundColor, strokeColor, etc.
- Export to PNG & SVG with dark mode, custom backgrounds, scale, and padding
- Generated .excalidraw files open in excalidraw.com, Obsidian, or any Excalidraw-compatible tool

## DSL Syntax Reference

| Syntax | Element | Description |
|--------|---------|-------------|
| `[Label]` | Rectangle | Process steps, actions |
| `{Label}` | Diamond | Decisions, conditionals |
| `(Label)` | Ellipse | Start/End points |
| `[[Label]]` | Database | Data storage |
| `->` | Arrow | Forward connection |
| `<->` | Bidirectional | Both directions |
| `-->` | Dashed Arrow | Dashed connection |
| `-> "text" ->` | Labeled Arrow | Connection with label |
