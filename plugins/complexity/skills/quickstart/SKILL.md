# complexity - Code Complexity Analyzer

## Overview
complexity is a command line tool to identify complex code. Analyze code complexity and identify areas that need refactoring.

## Quick Start

### Analyze code complexity
```bash
sc complexity analyze code <path>
```

### Passthrough to complexity CLI
```bash
sc complexity _ <complexity-args>
```

## Key Features

- **Code Analysis**: Identify complex code patterns
- **Refactoring Guide**: Highlight areas needing refactoring
- **CLI Tool**: Command-line interface for analysis
- **Configurable**: Customizable analysis rules
- **Multiple Languages**: Support for various programming languages

## Installation

```bash
cargo install complexity
```

Also available via:
- Homebrew

## Usage Examples

### Analyze a file
```bash
complexity src/main.rs
```

### Analyze a directory
```bash
complexity src/
```

### With specific threshold
```bash
complexity --threshold 10 src/
```

### Output JSON
```bash
complexity --format json src/
```

## Notes

- Run `complexity --help` to see all available options
- Helps maintain code quality by identifying complexity
