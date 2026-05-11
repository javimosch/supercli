# Quarto Quickstart

Quarto is an open-source scientific and technical publishing system built on Pandoc.

## Installation

### Linux (Debian/Ubuntu)
```bash
# Download latest release
wget https://github.com/quarto-dev/quarto-cli/releases/latest/download/quarto-linux-amd64.deb
sudo dpkg -i quarto-linux-amd64.deb
```

### macOS
```bash
brew install quarto
```

### Verify installation
```bash
quarto --version
quarto check
```

## Basic Usage

### Create a document
```bash
# Create a new document
quarto create document

# Or create directly
echo "---
title: My Document
---

# Hello World

This is my first Quarto document.
" > hello.qmd
```

### Render a document
```bash
# Render to default format (HTML)
quarto render hello.qmd

# Render to specific format
quarto render hello.qmd --to pdf
quarto render hello.qmd --to docx
```

### Preview with live reload
```bash
quarto preview hello.qmd
```

### Convert formats
```bash
# Convert between .qmd and Jupyter notebook
quarto convert hello.qmd --to notebook
quarto convert hello.ipynb --to markdown
```

## Project workflows

### Create a project
```bash
quarto create project website mysite
cd mysite
quarto render
```

### Project types
- `website` - Multi-page website
- `book` - Online book
- `manuscript` - Scientific manuscript
- `default` - Simple project

## Key Features

- **Code embedding**: Python, R, Julia, JavaScript via Jupyter/Knitr/Observable
- **Cross-references**: Figures, tables, equations
- **Citations**: BibTeX, Zotero integration
- **Multiple outputs**: HTML, PDF, Word, ePub, Reveal.js slides
- **Extensions**: Custom templates and shortcodes

## Resources

- Documentation: https://quarto.org/docs/
- Gallery: https://quarto.org/docs/gallery/
- Extensions: https://quarto.org/docs/extensions/
