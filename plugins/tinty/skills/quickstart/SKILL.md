# tinty - Color Scheme Manager

## Overview
tinty is a base16 and base24 color scheme manager. Apply color schemes to your terminal and applications.

## Quick Start

### Apply a color scheme
```bash
sc tinty apply scheme <scheme-name>
```

### Passthrough to tinty CLI
```bash
sc tinty _ <tinty-args>
```

## Key Features

- **Base16 Support**: Full base16 color scheme support
- **Base24 Support**: Extended base24 color schemes
- **CLI Tool**: Command-line interface for scheme management
- **Flexible**: Designed for flexibility and customization
- **Configuration**: Configurable via config.toml
- **Multiple Install Methods**: Cargo, Homebrew, Arch Linux, Nix, Binaries

## Installation

```bash
cargo install tinty
```

Also available via:
- Homebrew
- Arch Linux
- Nix
- Binaries

## Usage Examples

### Apply scheme
```bash
tinty apply gruvbox-dark-hard
```

### List available schemes
```bash
tinty list
```

### Interactive selection with fzf
```bash
tinty apply -i
```

### Apply to specific app
```bash
tinty apply --app vim gruvbox-dark-hard
```

## Notes

- Run `tinty --help` to see all available options
- Supports migration from Flavours
