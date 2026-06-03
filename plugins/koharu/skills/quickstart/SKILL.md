---
name: koharu
description: Use this skill when the user wants to translate manga and comics using machine learning
---

# Koharu Plugin

translate manga and comics using machine learning

## Commands
- `koharu self version` — Print koharu version
- `koharu _ _` — Passthrough to koharu CLI

## Usage Examples
- "Translate this manga page"
- "OCR and translate this comic panel"
- "Batch translate manga chapters"

## Installation

```bash
cargo install koharu
```

## Examples
```bash
koharu translate page.png
koharu batch ./chapters/ --output ./translated/
```

## Key Features
- ML-powered text detection
- Automatic OCR on manga text
- Multi-language translation
- Batch processing support
