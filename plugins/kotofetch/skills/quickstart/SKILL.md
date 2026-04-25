# kotofetch - Japanese Quotes

## Overview
kotofetch displays Japanese quotes in the terminal. A small, configurable CLI for Japanese quotes.

## Quick Start

### Display Japanese quote
```bash
sc kotofetch fetch quote
```

### Passthrough to kotofetch CLI
```bash
sc kotofetch _ <kotofetch-args>
```

## Key Features

- **Japanese Quotes**: Display Japanese quotes in terminal
- **Configurable**: Custom configuration options
- **Translation Modes**: Support for translation modes
- **Small**: Lightweight CLI tool
- **Custom Quotes**: Support for custom quotes
- **Linux**: Optimized for Linux

## Installation

```bash
cargo install kotofetch
```

Also available via:
- Arch Linux / AUR
- Nix / NixOS
- Prebuilt binaries

## Usage Examples

### Display quote
```bash
kotofetch
```

### With translation
```bash
kotofetch --translate
```

### Custom config
```bash
kotofetch --config ~/.config/kotofetch.toml
```

### Custom quotes file
```bash
kotofetch --quotes ~/.config/quotes.txt
```

## Notes

- Run `kotofetch --help` to see all available options
