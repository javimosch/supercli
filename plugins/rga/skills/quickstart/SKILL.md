---
name: rga
description: Use this skill when the user wants to search inside PDFs, DOCX files, E-Books, or other binary documents using ripgrep-all without extra configuration.
---

# rga (ripgrep-all) Plugin

ripgrep wrapper that transparently searches PDFs, DOCX, ODT, EPUB, MOBI, and other binary file formats.

## Commands

### Searching
- `rga files search` — Search files including PDFs, DOCX, and other documents
- `rga adapters list` — List available adapters and supported file types

### Utility
- `rga _ _` — Passthrough to rga CLI

## Usage Examples
- "Search for 'budget' in PDF files"
- "Find 'confidential' across all documents in this directory"
- "Search case-insensitively for 'invoice' in DOCX files"
- "List available adapters"
- "Search for 'RFC' in all PDFs with context lines"

## Installation

```bash
brew install ripgrep-all
```

Or via Cargo:
```bash
cargo install ripgrep_all
```
