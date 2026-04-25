# lutgen-rs - LUT Generator and Applicator

## Overview
lutgen-rs is a blazingly fast interpolated LUT (Look-Up Table) generator and applicator for arbitrary and popular color palettes. Generate and apply color grading LUTs to images.

## Quick Start

### Generate LUT from image
```bash
sc lutgen generate lut <image> --output <lut-file>
```

### Apply LUT to image
```bash
sc lutgen apply lut <lut-file> <image>
```

### Passthrough to lutgen CLI
```bash
sc lutgen _ <lutgen-args>
```

## Key Features

- **Fast Performance**: Blazingly fast LUT generation and application
- **Interpolation**: Supports interpolated LUT generation from color palettes
- **Popular Palettes**: Built-in support for popular color palettes
- **Custom Palettes**: Support for arbitrary color palettes
- **CLI & Library**: Can be used as CLI tool or Rust library

## Installation

```bash
cargo install lutgen-cli
```

Or install from source:
```bash
git clone https://github.com/ozwaldorf/lutgen-rs
cd lutgen-rs
cargo install --path crates/cli
```

## Usage Examples

### Generate LUT
```bash
lutgen palette.jpg --output palette.cube
```

### Apply LUT to image
```bash
lutgen apply palette.cube photo.jpg --output graded.jpg
```

### Use popular palette
```bash
lutgen --palette kodak --output kodak.cube
```

## Notes

- Supports various LUT formats including .cube
- Can generate LUTs from any image containing color gradients
- Use `--help` to see all available options
