---
name: ocr-cli
description: Extract text from images using OCR (Optical Character Recognition)
---
# ocr-cli Plugin

Extract text from images using OCR (Optical Character Recognition). Powered by rapidocr-onnxruntime for accurate, local text extraction without API keys.

**Repository:** https://github.com/javimosch/ocr-cli

## Installation

For detailed installation guidance, see the [ocr-cli repository](https://github.com/javimosch/ocr-cli).

**Quick install:**
```bash
# Plugin is already available in supercli
sc plugins install ocr-cli
```

**Requirements:**
- Python 3.10+
- uv package manager  
- xclip for clipboard support: `sudo apt install xclip`

## Features
- Extract text from clipboard images (Linux/X11)
- Extract text from image files (PNG, JPG, etc.)
- Local processing - no API keys required
- High accuracy using rapidocr-onnxruntime

## Usage

### Extract text from clipboard
```bash
ocr clipboard extract
```

### Extract text from file (direct CLI)
```bash
~/ai/supercli-clis/ocr-cli/bin/ocr-cli --file /path/to/image.png
```

## Notes
- First run may take a few seconds to download OCR models (~100MB)
- Works best with clear, high-contrast images
- Supports common image formats (PNG, JPG, etc.)
