# gocloc - Count Lines of Code

## Overview
gocloc is a little fast cloc (Count Lines Of Code) written in Go. Count lines of code in files and directories with support for multiple languages.

## Quick Start

### Count lines of code in directory
```bash
sc gocloc count lines ./src
```

### Count lines in specific files
```bash
sc gocloc count lines file1.go file2.py
```

### Passthrough to gocloc CLI
```bash
sc gocloc _ <gocloc-args>
```

## Key Features

- **Fast**: Written in Go for performance
- **Multi-language**: Support for many programming languages
- **JSON Output**: JSON output format for programmatic use
- **Detailed**: Count code, comments, and blanks separately
- **Docker Support**: Available via Docker
- **CI Integration**: Easy integration with Jenkins CI

## Installation

```bash
go install github.com/hhatto/gocloc/cmd/gocloc@latest
```

## Usage Examples

### Basic count
```bash
gocloc ./src
```

### JSON output
```bash
gocloc --output json ./src
```

### Exclude files
```bash
gocloc --exclude-dir vendor ./src
```

### Count specific languages
```bash
gocloc --languages Go,Python ./src
```

## Notes

- Run `gocloc --help` to see all available options
- Supports many programming languages
- Can be used in CI/CD pipelines
