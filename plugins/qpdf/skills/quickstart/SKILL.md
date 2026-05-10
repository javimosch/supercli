---
name: qpdf
description: Use this skill when the user wants to manipulate PDF files — split, merge, encrypt, decrypt, linearize, check structure, or get metadata as JSON.
---

# qpdf Plugin

Content-preserving PDF transformation tool. Split, merge, encrypt, decrypt, linearize, and inspect PDFs.

## Commands

### Inspect
- `qpdf info check document.pdf` — Validate PDF structure and integrity
- `qpdf info json document.pdf` — Get full PDF metadata as JSON (pages, objects)

### Split
- `qpdf split pages input.pdf 1-10 output.pdf` — Extract pages 1-10
- `qpdf split pages input.pdf 1,3,7- output.pdf` — Extract specific pages

### Merge
- `qpdf merge files file1.pdf file2.pdf -- output.pdf` — Merge multiple PDFs

### Encrypt & Decrypt
- `qpdf encrypt set --encrypt 'userpw ownerpw' --password-mode 256 input.pdf output.pdf` — Encrypt with passwords
- `qpdf decrypt set encrypted.pdf --password mypass decrypted.pdf` — Decrypt a PDF

### Optimize
- `qpdf optimize linearize input.pdf output.pdf` — Linearize for fast web viewing

### Full Access
- `qpdf _ _` — Passthrough for any qpdf command (compress, show-object, etc.)

## Usage Examples
- "Extract pages 3-7 from report.pdf"
- "Merge three PDFs into one document"
- "Encrypt this PDF with password protection"
- "Decrypt a protected PDF"
- "Check if this PDF is valid and not corrupted"
- "Get PDF metadata as JSON"
- "Optimize this PDF for web delivery"

## Installation

```bash
brew install qpdf
```

## Key Features
- **JSON output**: `--json` flag for machine-readable PDF metadata
- **Split & merge**: Extract or combine pages from multiple PDFs
- **Encryption**: 256-bit AES encryption with user/owner passwords
- **Validation**: Check PDF structure and integrity
- **Linearization**: Optimize PDFs for fast web viewing
- **Non-interactive**: All operations are one-shot CLI commands
