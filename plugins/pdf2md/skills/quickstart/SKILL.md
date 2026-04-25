---
name: pdf2md
description: Use this skill when the user wants to convert PDF files to Markdown.
---

# PDF2md Plugin

PDF to Markdown converter. Parse PDF files and convert them into Markdown format.

## Commands

### File Conversion
- `pdf2md file convert` — Convert PDF to Markdown

## Usage Examples
- "pdf2md file convert --input_folder ./pdfs --output_folder ./md"
- "pdf2md file convert --input_folder ./pdfs --output_folder ./md --recursive"

## Installation

```bash
npm install -g @opendocsg/pdf2md
```

## Examples

```bash
# Convert PDFs in a folder
npx @opendocsg/pdf2md --inputFolderPath=./pdfs --outputFolderPath=./md

# Convert recursively (subfolders included)
npx @opendocsg/pdf2md --inputFolderPath=./pdfs --outputFolderPath=./md --recursive

# For large recursive conversions with memory issues
node lib/pdf2md-cli.js --max-old-space-size=4096 --inputFolderPath=./pdfs --outputFolderPath=./md --recursive
```

## Key Features
- PDF to Markdown conversion
- Batch folder conversion
- Recursive folder processing
- Preserves document structure
- Extracts text content
- Cross-platform support
