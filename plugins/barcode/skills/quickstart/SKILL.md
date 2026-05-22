---
name: barcode
description: Use this skill when the user wants to generate barcodes for labels, inventory, or product identification — supports Code 39, Code 128, EAN, UPC, and more.
---

# barcode Plugin

barcode generates barcode images in PostScript/EPS format. Supports common barcode symbologies for labels and inventory.

## Commands

- `barcode _ _ <args>` — Passthrough

## Usage Examples

- "generate a Code 39 barcode for product 12345"
- "create an EAN-13 barcode for inventory"
- "generate multiple barcodes from a file"
- "output barcode as EPS for printing"

## Installation

```bash
brew install barcode
```

## Key Features
- Multiple barcode symbologies: Code 39, Code 128, EAN, UPC, I2of5
- PostScript and EPS output formats
- Barcode dimension and margin control
- Human-readable text under barcode
- Batch generation from file input
- Print-ready output for label sheets
