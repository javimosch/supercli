---
name: mq
description: Use this skill when the user wants to query, filter, transform, or extract data from Markdown files using jq-like syntax.
---

# Mq Plugin

A jq-like Markdown query language for command-line processing. Built in Rust.

## Commands

### Query Execution
- `mq query execute` — Execute mq query on Markdown files

### Interactive REPL
- `mq repl start` — Start interactive REPL session

### Formatting
- `mq fmt format` — Format mq query files

### Document Conversion
- `mq conv convert` — Convert documents to Markdown (xlsx, docx, pdf)

## Usage Examples

Extract headings:
```
mq '.h' README.md
mq '.h1 | select(contains("Installation"))' docs.md
```

Extract code blocks:
```
mq '.code' example.md
mq '.code | select(contains("function"))' examples.md
```

Extract links:
```
mq '.link.url' README.md
```

Complex queries:
```
mq -A 'pluck(.code.value)' example.md
mq -A 'section::section("Installation")' README.md
mq '.code | select(.lang != "js")' examples.md
```

Convert documents:
```
mq conv report.xlsx | mq '.h'
mq conv document.docx | mq -A 'section::section("Summary")'
```

Format mq files:
```
mq fmt file.mq
mq fmt --check file.mq
```

## Installation

```bash
curl -sSL https://mqlang.org/install.sh | bash
```

Or via package manager:
```bash
cargo install mq-run
brew install mq
```

## Key Features
- jq-like syntax for Markdown processing
- Extract headings, code blocks, links, tables
- Filter and transform content
- Batch process multiple files
- Document conversion (xlsx, docx, pdf to Markdown)
- Interactive REPL
- IDE support (VSCode, Neovim, Zed)
- Language Server Protocol (LSP)
- Built-in functions for text processing
- External subcommands support