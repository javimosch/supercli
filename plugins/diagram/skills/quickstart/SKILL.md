# diagram - ASCII to Hand-Drawn Diagrams

## Overview
diagram is a CLI app to convert ASCII arts into hand drawn diagrams. Transform your ASCII diagrams into beautiful hand-drawn style images.

## Quick Start

### Convert ASCII art to diagram
```bash
sc diagram convert ascii <input-file>
```

### Passthrough to diagram CLI
```bash
sc diagram _ <diagram-args>
```

## Key Features

- **ASCII to Hand-Drawn**: Convert ASCII diagrams to hand-drawn style
- **Command Line**: Full CLI support
- **Customizable**: Various styling options
- **Output Formats**: Support for multiple output formats
- **Terminal Native**: Works in terminal without GUI

## Installation

```bash
go install github.com/esimov/diagram/cmd/diagram@latest
```

## Usage Examples

### Basic conversion
```bash
diagram diagram.txt
```

### Specify output file
```bash
diagram diagram.txt --output diagram.png
```

### Custom styling
```bash
diagram diagram.txt --style rough
```

### Specify colors
```bash
diagram diagram.txt --color #000000
```

### Line width
```bash
diagram diagram.txt --width 2
```

## Notes

- Run `diagram --help` to see all available options
- Supports various output formats (PNG, SVG, etc.)
- Can be used in scripts and automation
