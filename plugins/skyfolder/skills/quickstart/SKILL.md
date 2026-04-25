# skyfolder - Network File Sharing

## Overview
skyfolder shares folders on the network. Turn any device into a file-server accessible on the web.

## Quick Start

### Share a folder
```bash
sc skyfolder share folder <path>
```

### Passthrough to skyfolder CLI
```bash
sc skyfolder _ <skyfolder-args>
```

## Key Features

- **Network Sharing**: Share folders over network
- **File Server**: Turn device into file server
- **Web Access**: Access files via web
- **Cross-platform**: Works on Windows, macOS, Linux
- **BitTorrent**: Uses BitTorrent protocol
- **Command Line**: CLI interface for sharing

## Installation

```bash
cargo install skyfolder
```

## Usage Examples

### Share a folder
```bash
skyfolder /path/to/folder
```

### With custom port
```bash
skyfolder --port 8080 /path/to/folder
```

### With authentication
```bash
skyfolder --user admin --pass secret /path/to/folder
```

### Read-only mode
```bash
skyfolder --read-only /path/to/folder
```

## Notes

- Run `skyfolder --help` to see all available options
