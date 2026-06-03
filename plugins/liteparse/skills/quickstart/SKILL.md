---
name: liteparse
description: Use this skill when the user wants to parse PDFs or documents into structured text with bounding boxes and OCR.
---

# LiteParse Plugin

Fast, standalone PDF/document parser focused on spatial text extraction with bounding boxes. Runs locally without cloud dependencies.

## Commands

### Document Parsing
- `liteparse doc parse` — Parse a PDF/document to structured text with bounding boxes

## Usage Examples
- "Parse this PDF to text"
- "Extract text from this document with positions"
- "Convert this PDF to JSON"

## Installation

```bash
cargo install liteparse
```

## Examples

```bash
lit parse document.pdf
lit parse document.pdf --format json
```

## Key Features
- Fast text parsing via PDFium
- Built-in Tesseract OCR
- JSON and Text output formats
- Bounding box coordinates
- Multi-format support (PDF, DOCX, XLSX, PPTX, images)
- Runs fully locally, no cloud dependencies
