# fuc - Fast Unix Commands

## Overview
fuc provides modern, performance focused unix commands - faster alternatives to coreutils. Optimized for speed and efficiency on modern Linux installations.

## Quick Start

### Run a fuc command
```bash
sc fuc run command <command>
```

### Passthrough to fuc CLI
```bash
sc fuc _ <fuc-args>
```

## Key Features

- **Performance**: Optimized for speed when reasonable improvements can be made
- **Efficiency**: Minimizes wasted compute when performance gains are negligible
- **Usability**: Improved UX over existing commands where applicable
- **Modern**: Targeted at modern Linux installations
- **Rust**: Written in Rust for safety and performance

## Installation

```bash
cargo install fuc
```

## Usage Examples

### Use fuc as drop-in replacement
```bash
fuc ls -la
fuc cat file.txt
fuc grep pattern file
```

### Check available commands
```bash
fuc --help
```

## Notes

- fuc is primarily targeted at modern Linux installations
- Support for other platforms is provided on a best-efforts basis
- Not aiming for full coreutils compatibility - focuses on performance improvements
- Use `--help` to see available commands and options
