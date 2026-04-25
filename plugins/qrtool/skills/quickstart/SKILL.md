# qrtool - QR Code Utility

## Overview
qrtool is a command-line utility for encoding and decoding QR codes. Supports multiple output formats and colored terminal output.

## Quick Start

### Decode QR code from image
```bash
sc qrtool decode qr <image-file>
```

### Encode text into QR code
```bash
sc qrtool encode qr <text>
```

### Passthrough to qrtool CLI
```bash
sc qrtool _ <qrtool-args>
```

## Key Features

- **Encoding**: Encode text into QR codes
- **Decoding**: Decode QR codes from images
- **Multiple Formats**: Support for various QR code types
- **Colored Output**: Colored terminal output
- **Image Formats**: Support for multiple input image formats
- **Shell Completion**: Generate shell completion scripts

## Installation

```bash
cargo install qrtool
```

Or via package managers:
- From source
- Via package manager
- From binaries

## Usage Examples

### Basic decode
```bash
qrtool decode image.png
```

### Basic encode
```bash
qrtool encode "Hello, World!"
```

### Output to file
```bash
qrtool encode "Hello" --output qr.png
```

### Specific QR code type
```bash
qrtool encode "Hello" --type micro
```

### Colored output
```bash
qrtool decode image.png --color
```

## Notes

- Run `qrtool --help` to see all available options
- Supports various QR code types
- Can be integrated with other programs
