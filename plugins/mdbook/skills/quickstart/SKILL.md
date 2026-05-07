---
name: mdbook
description: Use this skill when the user wants to create documentation books, build docs from markdown, serve documentation locally, or generate static sites from markdown files.
---

# mdBook Plugin

Create modern online books from Markdown files.

## Commands

### Build
- `mdbook build run` — Build a book from markdown files
- `mdbook serve run` — Serve book with live reload
- `mdbook init run` — Initialize a new book

### Maintenance
- `mdbook clean run` — Delete built book
- `mdbook test run` — Test Rust code examples in book

## Usage Examples
- "Build my documentation book"
- "Initialize a new book project"
- "Serve the book locally"
- "Clean the build output"

## Installation

```bash
cargo install mdbook
```

## Examples

```bash
# Create a new book
mdbook init my-book

# Build the book
mdbook build

# Serve with live reload
mdbook serve --open

# Clean
mdbook clean
```

## Key Features
- Markdown-based documentation
- Live reload dev server
- Math equations (KaTeX)
- Code block theming
- Search functionality
- Multi-language support
