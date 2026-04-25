# fundoc - Documentation Generator

## Overview
fundoc is a language agnostic documentation generator. Generate documentation from code comments and structure.

## Quick Start

### Generate documentation
```bash
sc fundoc generate docs <path>
```

### Passthrough to fundoc CLI
```bash
sc fundoc _ <fundoc-args>
```

## Key Features

- **Language Agnostic**: Works with multiple programming languages
- **Code Comments**: Extract documentation from code comments
- **Structure Analysis**: Analyze code structure for docs
- **Plugins**: Extensible via plugins
- **GitHub Action**: Available as GitHub Action
- **Literate Programming**: Supports literate programming style

## Installation

```bash
cargo install fundoc
```

## Usage Examples

### Generate docs from current directory
```bash
fundoc
```

### Generate docs from specific path
```bash
fundoc src/
```

### Specify output format
```bash
fundoc --format markdown src/
```

### Use specific plugin
```bash
fundoc --plugin rust src/
```

## Notes

- Run `fundoc --help` to see all available options
