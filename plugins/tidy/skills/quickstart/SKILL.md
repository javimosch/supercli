---
name: tidy
description: Use this skill when the user wants to check, clean, repair, or convert HTML/XML documents, fix markup errors, or enforce consistent HTML style.
---

# HTML Tidy Plugin

Corrects and cleans up HTML and XML documents. Fixes markup errors, improves layout, enforces consistent style, and converts between HTML versions.

## Commands

### Checking
- `tidy check lint` — Check HTML file for errors and warnings (no modifications)
- `tidy check errors` — Show only errors (no warnings)

### Fixing
- `tidy fix run` — Clean and repair HTML file (output to stdout)
- `tidy fix inplace` — Clean and repair HTML file in-place (modifies the file)

### Conversion
- `tidy convert to-xhtml` — Convert HTML to XHTML
- `tidy convert to-html5` — Convert HTML to HTML5

### Configuration
- `tidy config show` — Show current tidy configuration
- `tidy help options` — Show all available tidy options

### Utility
- `tidy self version` — Print tidy version

### Passthrough
- `tidy _ _` — Passthrough to tidy CLI

## Usage Examples
- "Check my HTML file for errors"
- "Clean up and fix this HTML file"
- "Convert HTML to XHTML"
- "Show only errors, no warnings"
- "Format HTML with consistent indentation"

## Installation

```bash
brew install tidy-html5
```

Or via apt:
```bash
sudo apt-get install tidy
```

## Examples

```bash
# Check HTML for errors (no modifications)
sc tidy check lint --file index.html

# Show only errors (no warnings)
sc tidy check errors --file index.html

# Clean and repair HTML (output to stdout)
sc tidy fix run --file messy.html

# Clean and repair HTML in-place (modifies file)
sc tidy fix inplace --file index.html

# Convert HTML to XHTML
sc tidy convert to-xhtml --file index.html

# Convert HTML to HTML5
sc tidy convert to-html5 --file legacy.html

# Show current configuration
sc tidy config show

# Passthrough: check with custom indent
sc tidy _ _ -indent --wrap 120 index.html

# Passthrough: clean presentational clutter
sc tidy _ _ --clean --indent index.html
```

## Key Features
- **Error checking** — Detects and reports HTML markup errors
- **Cleaning** — Fixes common HTML issues automatically
- **Indentation** — Consistent indentation and formatting
- **HTML version conversion** — Convert between HTML4, XHTML, HTML5
- **Configurable** — Hundreds of configuration options
- **XML support** — Can process XML documents too
- **Non-destructive lint** — Check without modifying files
- **In-place fix** — Modify files directly with -m flag
