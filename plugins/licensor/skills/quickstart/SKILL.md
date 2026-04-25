# licensor - License Generator

## Overview
licensor writes licenses to stdout. Generate and display license text for various open source licenses.

## Quick Start

### Generate a license
```bash
sc licensor generate license <license-name>
```

### Passthrough to licensor CLI
```bash
sc licensor _ <licensor-args>
```

## Key Features

- **License Generation**: Generate license text for various licenses
- **SPDX Support**: Supports SPDX license identifiers
- **Multiple Licenses**: Support for many open source licenses
- **Simple Output**: Writes license text to stdout
- **CLI Tool**: Easy to use command-line interface

## Installation

```bash
cargo install licensor
```

Also available via:
- Homebrew
- Crates.io

## Usage Examples

### Generate MIT license
```bash
licensor MIT
```

### Generate Apache-2.0 license
```bash
licensor Apache-2.0
```

### Generate GPL-3.0 license
```bash
licensor GPL-3.0
```

### List available licenses
```bash
licensor --list
```

## Notes

- Run `licensor --help` to see all available options
- Supports many common open source licenses
