---
name: marp-cli
description: Use this skill when the user wants to create presentations from Markdown
---

# Marp-cli Plugin

create presentations from Markdown

## Commands
- `marp-cli self version` — Print marp-cli version
- `marp-cli _ _` — Passthrough to marp CLI

## Usage Examples
- "Convert this Markdown to slides"
- "Create a presentation from README"
- "Export slides to PDF"

## Installation

```bash
npm install -g @marp-team/marp-cli
```

## Examples
```bash
marp slides.md --pdf
marp slides.md --pptx
marp --server slides.md
```

## Key Features
- Markdown to presentation conversion
- Multiple export formats (PPTX, PDF, HTML)
- Theme support
- Custom directives
