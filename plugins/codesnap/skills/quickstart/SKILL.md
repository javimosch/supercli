# codesnap - Code Snapshot Generator

## Overview
codesnap is a pure Rust tool to generate beautiful code snapshots from the CLI. It creates aesthetically pleasing screenshots of code snippets with customizable themes and styling.

## Quick Start

### Generate snapshot from file
```bash
sc codesnap capture file ./code_snippet.hs
```

### Generate snapshot with output file
```bash
sc codesnap capture file ./code_snippet.hs --output ./output.png
```

### Passthrough to codesnap CLI
```bash
sc codesnap _ <codesnap-args>
```

## Key Features

- **Pure Rust**: Fast and efficient code snapshot generation
- **Multiple Themes**: Support for various color themes
- **Customizable Output**: PNG and other image formats
- **CLI & Library**: Can be used as CLI tool or Rust library
- **Cross-Platform**: Works on Linux, macOS, and Windows

## Installation

```bash
cargo install codesnap-cli
```

Or via package managers:
- Arch Linux: `pacman -S codesnap`
- Nix: `nix-env -i codesnap`
- Homebrew: `brew install codesnap`

## Usage Examples

### Basic snapshot
```bash
codesnap -f ./code_snippet.hs -o "./output.png"
```

### Custom theme
```bash
codesnap -f ./code.py --theme github-dark -o output.png
```

### With language detection
```bash
codesnap -f ./script.js --language javascript -o snapshot.png
```

## Notes

- Run `codesnap --help` to see all available options
- Supports many programming languages with syntax highlighting
- Output quality and styling can be customized via flags
