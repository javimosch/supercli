# pandoc Quickstart

pandoc is a universal document converter that reads and writes in dozens of formats.

## Commands
- `pandoc <resource> <action>` — Execute pandoc commands
- `pandoc self version` — Print pandoc version
- `pandoc convert markdown-to-html` — Convert Markdown to HTML
- `pandoc convert document` — Convert document between formats
- `pandoc list formats` — List supported input/output formats
- `pandoc _ _` — Passthrough to pandoc CLI

## Installation

```bash
brew install pandoc
```

## Basic Usage

### Convert Markdown to HTML
```bash
pandoc README.md -o README.html
```

### Convert to PDF (requires pdflatex or wkhtmltopdf)
```bash
pandoc document.md -o document.pdf
```

### Convert Word to Markdown
```bash
pandoc document.docx -o document.md
```

### Multiple formats
```bash
pandoc slides.md -t revealjs -o slides.html  # Reveal.js slides
pandoc article.md -t latex -o article.tex     # LaTeX
pandoc notes.md -t epub -o notes.epub         # EPUB
```

## Common Conversions

- Markdown → HTML, PDF, LaTeX, Word, EPUB
- HTML → Markdown, PDF, Word
- LaTeX → HTML, Word, PDF
- Docx → Markdown, HTML, PDF
- Epub → Markdown, HTML

## Key Options

- `-f FORMAT` - Input format (auto-detected from extension)
- `-t FORMAT` - Output format
- `-o FILE` - Output file
- `--template FILE` - Use custom template
- `--css STYLE.css` - Include CSS stylesheet
- `--toc` - Generate table of contents
- `-V VAR=VALUE` - Set template variable
- `--standalone` - Produce standalone document
- `--number-sections` - Number sections

## Real-world Examples

### Batch convert Markdown files
```bash
for f in *.md; do pandoc "$f" -o "${f%.md}.html"; done
```

### Generate PDF with styling
```bash
pandoc document.md --css style.css -V margin=2cm -o document.pdf
```

### Convert with table of contents
```bash
pandoc README.md --toc -o README.html
```

### Markdown slides to Beamer PDF
```bash
pandoc slides.md -t beamer -o slides.pdf
```

## Resources

- [Official Documentation](https://pandoc.org/)
- [GitHub Repository](https://github.com/jgm/pandoc)
