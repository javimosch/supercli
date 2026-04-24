---
name: stegify
description: Use this skill when the user wants to hide files inside images, extract hidden data from images, or perform steganography operations.
---

# stegify Plugin

Steganography tool for images. Hide any file inside an image using Least Significant Bit (LSB) encoding with minimal visual impact.

## Commands

### Steganography Operations
- `stegify image hide` — Hide a file inside an image
- `stegify image extract` — Extract hidden file from image

### Utility
- `stegify _ _` — Passthrough to stegify CLI

## Usage Examples
- "Hide file in image"
- "Extract hidden data"
- "Steganography tool"
- "Encode data in image"

## Installation

```bash
brew install stegify
```

Or via Go:
```bash
go install github.com/DimitarPetrov/stegify@latest
```

## Examples

```bash
# Hide a file inside an image
stegify image hide carrier.png secret.zip --result hidden.png

# Extract hidden file
stegify image extract hidden.png --result extracted.zip

# Any stegify command with passthrough
stegify _ _ encode carrier.png data.txt --result out.png
stegify _ _ decode carrier.png --result out.txt
```

## Key Features
- **LSB** - LSB encoding
- **Hide** - Hide files
- **Extract** - Extract files
- **Images** - Image carriers
- **PNG** - PNG support
- **JPEG** - JPEG support
- **BMP** - BMP support
- **Minimal** - Minimal visual impact
- **Security** - Data hiding
- **Simple** - Simple CLI

## Notes
- Works with PNG, JPEG, BMP
- Minimal visual distortion
- Great for data concealment
- Educational and practical use
