---
name: qrencode
description: Use this skill when the user wants to generate QR codes from text, URLs, or file contents — for links, WiFi configs, contact info, or any encoded data.
---

# qrencode Plugin

Encode data into QR code images from the command line. Output as PNG or EPS.

## Commands

### Encode
- `qrencode encode text 'Hello World' -o hello.png` — Encode text as QR code
- `qrencode encode url 'https://example.com' -o site.png -s 5` — Encode URL with larger modules
- `qrencode encode from-file -r data.txt -o output.png` — Encode content from a file
- `qrencode encode stdout 'data' > qr.png` — Output raw PNG data to stdout

### Options
- `-s 5` — Module size in pixels (default: 3)
- `-l H` — Error correction: L (7%), M (15%), Q (25%), H (30%)
- `-m 2` — Margin width in modules (default: 4)

### Full Access
- `qrencode _ _` — Passthrough for advanced options

## Usage Examples
- "Generate a QR code for https://mywebsite.com"
- "Create a QR code that says 'Hello World'"
- "Encode the contents of config.txt as a QR code"
- "Generate a high-error-correction QR code for a URL"
- "Pipe a QR code PNG directly to another command"

## Installation

```bash
brew install qrencode
```

## Key Features
- **Simple encoding**: `qrencode -o out.png 'text'`
- **Error correction**: Choose L/M/Q/H for durability
- **Configurable size**: Adjust module size and margins
- **File input**: Read data from files
- **Stdout output**: Pipe QR data to other commands
- **Non-interactive**: All operations are one-shot CLI commands
