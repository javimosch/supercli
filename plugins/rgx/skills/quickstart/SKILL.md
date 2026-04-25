# rgx - Regex101 for Terminal

## Overview
rgx is regex101 for the terminal. Real-time matching, 3 engines, capture groups, replace mode, syntax highlighting, plain-English explanations, undo/redo, mouse support.

## Quick Start

### Passthrough to rgx CLI
```bash
sc rgx _ <rgx-args>
```

## Key Features

- **Real-time Matching**: See matches as you type
- **3 Engines**: Support for multiple regex engines
- **Capture Groups**: Visualize capture groups
- **Replace Mode**: Test regex replacements
- **Syntax Highlighting**: Color-coded regex patterns
- **Plain-English Explanations**: Understand your regex
- **Undo/Redo**: Navigate your regex history
- **Mouse Support**: Interactive terminal UI

## Installation

```bash
cargo install rgx
```

## Usage Examples

### Start rgx
```bash
rgx
```

### With initial pattern
```bash
rgx --pattern "test"
```

### With initial test string
```bash
rgx --string "hello world"
```

### Specific engine
```bash
rgx --engine rust
```

## Notes

- Run `rgx --help` to see all available options
- Supports Rust, PCRE2, and RE2 engines
