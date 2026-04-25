# jsonwatch - JSON Change Tracker

## Overview
jsonwatch tracks changes in JSON data from the command line. Like watch -d, but for JSON files and URLs.

## Quick Start

### Watch JSON file for changes
```bash
sc jsonwatch watch json <file>
```

### Passthrough to jsonwatch CLI
```bash
sc jsonwatch _ <jsonwatch-args>
```

## Key Features

- **JSON Tracking**: Monitor JSON files and URLs for changes
- **Watch-like**: Similar to watch -d but for JSON
- **Command Monitoring**: Track command output
- **URL Support**: Watch JSON from URLs
- **Diff Highlighting**: Highlight changes between updates

## Installation

```bash
cargo install jsonwatch
```

## Usage Examples

### Watch a JSON file
```bash
jsonwatch data.json
```

### Watch a URL
```bash
jsonwatch url https://api.example.com/data
```

### Watch a command
```bash
jsonwatch cmd curl https://api.example.com/data
```

### With custom interval
```bash
jsonwatch --interval 5 data.json
```

## Notes

- Run `jsonwatch --help` to see all available options
