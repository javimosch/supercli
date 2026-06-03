---
name: PyPDFForm
description: Use this skill when the user wants to fill and generate PDF forms
---

# PyPDFForm Plugin

fill and generate PDF forms

## Commands
- `PyPDFForm self version` — Print PyPDFForm version
- `PyPDFForm _ _` — Passthrough to pypdfform CLI

## Usage Examples
- "Fill this PDF form with data"
- "Generate a PDF form from template"
- "Extract form fields from PDF"

## Installation

```bash
pip install PyPDFForm
```

## Examples
```bash
pypdfform fill template.pdf --data fields.json --output filled.pdf
pypdfform extract template.pdf
pypdfform create --fields "name,email,phone" --output form.pdf
```

## Key Features
- PDF form filling
- Form generation from templates
- Field extraction
- Watermark and image support
