---
name: ppty-master
description: Use this skill when the user wants to generate PowerPoint presentations from documents, Markdown, or data.
---

# ppty-master Plugin

CLI tool for generating PowerPoint (PPTX) presentations from Markdown documents, text, and structured data.

## Commands

### File Generation
- `ppty-master file generate` — Generate PowerPoint from documents

## Usage Examples
- "Create a PowerPoint from this Markdown file"
- "Generate a slide deck from this document"
- "Convert my notes to a presentation"

## Installation

```bash
pip install ppt-master
```

## Examples

```bash
ppt-master generate slides.md -o presentation.pptx
ppt-master generate report.md --template corporate
ppt-master generate data.json --format slides
```

## Key Features
- Markdown to PPTX conversion
- Template support
- Custom themes and layouts
- Automatic slide sizing
- Image embedding
- Python-based with wide compatibility
