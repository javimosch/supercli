---
name: mat2
description: Use this skill when the user wants to remove metadata from files for privacy — strip EXIF from images, geolocation, timestamps, and hidden data from various document formats.
---

# mat2 Plugin

mat2 removes metadata from files to protect privacy. Supports images, videos, PDFs, LibreOffice, OpenOffice, and Microsoft Office documents.

## Commands

- `mat2 _ _ <args>` — Passthrough

## Usage Examples

- "strip metadata from photo.jpg"
- "remove EXIF data from all images in a folder"
- "clean a PDF of hidden metadata"
- "check what metadata a file has without removing it"

## Installation

```bash
pip install mat2
```

## Key Features
- Strip EXIF/IPTC/XMP metadata from images (JPEG, PNG, TIFF, WebP)
- Remove metadata from videos (MP4, AVI, MKV, WebM)
- Clean PDF metadata and hidden content
- Strip metadata from Office documents (DOCX, XLSX, PPTX, ODF)
- Batch processing with glob patterns
- In-place file cleaning
- Dry-run mode to inspect metadata before removal
