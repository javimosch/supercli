# smag - Command Line Graphing

## Overview
smag is Show Me A Graph - Command Line Graphing. Create graphs from data directly in the terminal.

## Quick Start

### Create a graph from data
```bash
sc smag graph data <data>
```

### Passthrough to smag CLI
```bash
sc smag _ <smag-args>
```

## Key Features

- **CLI Graphing**: Create graphs from command line
- **Terminal Native**: No external GUI required
- **Multiple Graph Types**: Support for various graph types
- **Data Input**: Accept data from files or stdin
- **ASCII Output**: Graphs rendered in terminal

## Installation

```bash
cargo install smag
```

Also available via:
- Binaries

## Usage Examples

### Graph from file
```bash
smag data.txt
```

### Pipe data
```bash
cat data.txt | smag
```

### Specify graph type
```bash
smag --type line data.txt
```

### Custom labels
```bash
smag --xlabel "Time" --ylabel "Value" data.txt
```

## Notes

- Run `smag --help` to see all available options
