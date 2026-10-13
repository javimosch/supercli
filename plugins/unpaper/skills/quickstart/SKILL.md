---
name: unpaper
description: Use this skill when the user wants to clean scanned pages - deskew, remove borders/noise, or split two-page scans - typically before OCR or PDF archiving.
---

# unpaper Plugin

unpaper post-processes scanned sheets: automatic deskew, black-border/mask detection, noise filtering, blank detection, and two-page splitting. It reads and writes PNM images (pbm/pgm/ppm/pam).

## Commands

### Cleaning
- `unpaper scan clean` — Clean a scan: sc unpaper scan clean in.pbm out.pbm

### General
- `unpaper self version` — Print unpaper version
- `unpaper _ _` — Passthrough to unpaper CLI

## Usage Examples
- "Deskew and clean this scanned page"
- "Split a double-page book scan into two pages"
- "Prepare these scans for OCR"

## Installation

```bash
sudo apt-get install -y unpaper
```

## Examples

```bash
unpaper scan.pbm clean.pbm
unpaper --layout double --output-pages 2 double.pbm left%d.pbm right%d.pbm
unpaper -v --black-threshold 0.35 in.pbm out.pbm
```

## Key Features
- Auto-deskew
- Border and mask detection
- Two-page (double layout) splitting
- Blank/noise filtering
