# Kreuzberg Quickstart

Extract text and metadata from documents in 97+ formats.

## Installation

```bash
cargo install kreuzberg-cli
```

## Basic Usage

```bash
# Extract text from a PDF
kreuzberg extract document.pdf

# Extract metadata
kreuzberg metadata document.docx

# Process entire directory
kreuzberg batch ./documents/
```

## Supported Formats

- PDF (with OCR for scanned documents)
- Microsoft Office (DOCX, XLSX, PPTX)
- OpenDocument (ODT, ODS, ODP)
- Images (PNG, JPG, TIFF with OCR)
- Archives (ZIP, TAR)
- Email formats (EML, MSG)
- And 90+ more formats

## Options

```bash
# Output as JSON
kreuzberg extract file.pdf --format json

# Specify output file
kreuzberg extract file.pdf -o output.txt

# Extract with OCR
kreuzberg extract scanned.pdf --ocr
```
