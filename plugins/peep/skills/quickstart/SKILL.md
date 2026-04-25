# peep - Terminal Text Viewer

## Overview
peep is a CLI text viewer tool that works like less command on small pane within the terminal window. View files in a split-pane terminal.

## Quick Start

### View a file
```bash
sc peep view file <filename>
```

### Passthrough to peep CLI
```bash
sc peep _ <peep-args>
```

## Key Features

- **Split Pane**: View files in a small pane within terminal
- **Less-like**: Works similar to the less command
- **Follow Mode**: Auto-scroll with file changes
- **Highlighting**: Syntax highlighting in follow mode
- **Multiple Platforms**: Support for various platforms

## Installation

```bash
cargo install peep
```

## Usage Examples

### View a file
```bash
peep file.txt
```

### Follow mode
```bash
peep --follow file.log
```

### Highlighting
```bash
peep --highlight file.txt
```

### Custom pane size
```bash
peep --rows 20 file.txt
```

## Notes

- Run `peep --help` to see all available options
- Works like less but in a small pane
