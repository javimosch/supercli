# npkill - Node Modules Cleanup Tool

## Overview
npkill is a CLI tool that finds and removes old node_modules directories to free up disk space. It scans your filesystem for node_modules directories and allows you to selectively or automatically delete them.

## Quick Start

### Scan a directory for node_modules
```bash
sc npkill scan directory
```

### Delete all node_modules in a directory
```bash
sc npkill delete all --directory ~/projects
```

### Stream results in real-time as JSON
```bash
sc npkill stream results --directory ~/projects
```

### Passthrough to npkill CLI
```bash
sc npkill _ <npkill-args>
```

## Key Features

- **JSON Output**: Use `--json` to output results as a single JSON object, or `--json-stream` for real-time JSON output
- **Automatic Deletion**: Use `--delete-all` to automatically delete all found node_modules
- **Selective Deletion**: Interactive mode lets you choose which directories to delete
- **Size Analysis**: Shows the size of each node_modules directory
- **Filtering**: Exclude specific directories with `--exclude`

## Installation

```bash
npm install -g npkill
```

## Usage Examples

### Find node_modules larger than 100MB
```bash
npkill --json | jq '.results[] | select(.size > 104857600)'
```

### Automatically delete node_modules in backups
```bash
npkill -d ~/backups/ --delete-all
```

### Stream results for monitoring
```bash
npkill --json-stream 2>/dev/null | jq -s '.' > clean-results.json
```

## Notes

- npkill is non-interactive when using `--delete-all` or JSON output flags
- The tool respects `.npkillrc` configuration files for customization
- Use `--exclude` to skip specific directories from scanning
