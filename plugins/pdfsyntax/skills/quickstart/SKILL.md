---
name: pdfsyntax
description: Use this skill when the user wants to inspect and modify PDF file internals
---

# Pdfsyntax Plugin

inspect and modify PDF file internals

## Commands
- `pdfsyntax self version` — Print pdfsyntax version
- `pdfsyntax _ _` — Passthrough to pdfsyntax CLI

## Usage Examples
- "Show PDF file structure"
- "Extract PDF metadata"
- "Repair damaged PDF"

## Installation

```bash
pip install pdfsyntax
```

## Examples
```bash
pdfsyntax inspect document.pdf
pdfsyntax metadata document.pdf
pdfsyntax repair damaged.pdf --output fixed.pdf
```

## Key Features
- Low-level PDF inspection
- Structure analysis
- Metadata extraction
- PDF repair capabilities
