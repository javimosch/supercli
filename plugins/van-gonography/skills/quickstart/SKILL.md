# van-gonography - Steganography Tool

## Overview
van-gonography hides files of any type inside an image using steganography. Supports encryption, decryption, stealth mode, and CLI operation.

## Quick Start

### Encode file into image
```bash
sc van-gonography encode file <cover-image> <file-to-hide> --output <output-dir>
```

### Decode file from image
```bash
sc van-gonography decode file <cover-image> --output <output-dir>
```

### Passthrough to van-gonography CLI
```bash
sc van-gonography _ <vangonography-args>
```

## Key Features

- **CLI Mode**: Full CLI operation without menus
- **Steganography**: Hide any file type inside images
- **Encryption**: Encrypt data before hiding
- **Decryption**: Decrypt data after revealing
- **Stealth Mode**: Hide files in stealth mode
- **Logging**: Optional logging for debugging

## Installation

```bash
pip install van-gonography
```

## Usage Examples

### Encode file
```bash
vangonography -cli -e -c image.png -f secret.txt -o Output
```

### Decode file
```bash
vangonography -cli -d -c Cover_txt.png -o Output
```

### With encryption
```bash
vangonography -cli -e --encrypt --key mykey -c image.png -f secret.txt
```

### With stealth mode
```bash
vangonography -cli -e --stealth -c image.png -f secret.txt
```

### With logging
```bash
vangonography -cli -d -c Cover_txt.png -o Output -l
```

## Notes

- Run `vangonography --help` to see all available options
- Use `-cli` flag for CLI mode (no menus)
- Supports JSON file for arguments
- Can show difference between images
