# rusync - Minimalist rsync

## Overview
rusync is a minimalist rsync implementation in Rust. Fast file synchronization with rsync-like functionality.

## Quick Start

### Passthrough to rusync CLI
```bash
sc rusync _ <rusync-args>
```

## Key Features

- **Minimalist**: Lightweight rsync implementation
- **Fast**: Written in Rust for performance
- **Rsync-like**: Compatible with rsync functionality
- **Cross-platform**: Works on Linux, macOS, Windows
- **Efficient**: Efficient file synchronization

## Installation

```bash
cargo install rusync
```

## Usage Examples

### Sync directories
```bash
rusync /source /destination
```

### With verbose output
```bash
rusync -v /source /destination
```

### Dry run
```bash
rusync --dry-run /source /destination
```

### Delete files in destination
```bash
rusync --delete /source /destination
```

## Notes

- Run `rusync --help` to see all available options
- Minimalist implementation focused on core rsync features
