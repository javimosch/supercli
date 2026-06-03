---
name: pretext
description: Use this skill when the user wants to measure text dimensions and layout
---

# Pretext Plugin

measure text dimensions and layout

## Commands
- `pretext self version` — Print pretext version
- `pretext _ _` — Passthrough to pretext CLI

## Usage Examples
- "Measure text width in pixels"
- "Calculate text layout"
- "Get font metrics"

## Installation

```bash
npm install pretext
```

## Examples
```bash
pretext measure --text "Hello World" --font Arial
pretext layout --width 800 --text "Long paragraph..."
```

## Key Features
- Fast text measurement
- Font metric computation
- Layout calculation
- Multiple font support
