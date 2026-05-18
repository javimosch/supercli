# Stride Plugin Quickstart

## Overview

Stride is a high-performance filesystem traversal and search tool written in Go that extends the standard `filepath.Walk` with enhanced concurrency, filtering, and monitoring capabilities. The supercli stride plugin provides convenient commands for filesystem operations with structured JSON output, making it ideal for automation and scripting.

## Installation

The stride binary must be installed on your system:

```bash
# Via Go
go install github.com/TFMV/stride@latest

# Or download from releases
# https://github.com/TFMV/stride/releases
```

## Available Commands

### Basic Directory Traversal

```bash
sc stride walk /path/to/directory
```

Traverses a directory and returns results in JSON format.

### Traversal with Custom Workers

```bash
sc stride walk-workers /path/to/directory --workers 8
```

Traverses a directory using specified number of concurrent workers.

### Find Files by Name Pattern

```bash
sc stride find-name /src --pattern "*.go"
```

Finds files matching a name pattern (supports wildcards).

### Find Files by Regex Pattern

```bash
sc stride find-regex /src --pattern ".*_test\\.go$"
```

Finds files matching a regular expression pattern.

### Find Large Files

```bash
sc stride find-large /home --size "100MB"
```

Finds files larger than specified size (supports KB, MB, GB).

### Find Small Files

```bash
sc stride find-small /home --size "10KB"
```

Finds files smaller than specified size.

### Find Recent Files

```bash
sc stride find-recent ~/projects --time "24h"
```

Finds files modified recently (supports h, d, w, m for hours, days, weeks, months).

### Find Old Files

```bash
sc stride find-old /logs --time "7d"
```

Finds files older than specified time.

### Find with Depth Limit

```bash
sc stride find-depth /src --depth 3
```

Finds files with maximum directory depth limit.

### Find by Permissions

```bash
sc stride find-permissions /etc --perms "0644"
```

Finds files with exact octal permissions.

### Watch Directory for Changes

```bash
sc stride watch /path/to/watch
```

Monitors directory for filesystem changes and outputs JSON events.

### Watch Specific Patterns

```bash
sc stride watch-pattern ~/Downloads --pattern "*.go"
```

Watches for changes to files matching specific patterns.

### Watch Specific Events

```bash
sc stride watch-events /src --events "create,modify,delete"
```

Watches for specific event types (create, modify, delete, rename, chmod).

### Analyze Directory Structure

```bash
sc stride analyze /path/to/analyze
```

Analyzes directory structure and returns statistics in JSON format.

### Find Duplicate Files

```bash
sc stride analyze-duplicates /data --duplicates
```

Finds exact and near-duplicate files.

### Analyze Code Statistics

```bash
sc stride analyze-code /src --langs "go,js,python"
```

Analyzes code statistics for specified programming languages.

## Output Format

All commands return structured JSON output, making it easy to parse and process in scripts:

```json
{
  "path": "/path/to/search",
  "files": [
    {
      "path": "/path/to/file.go",
      "name": "file.go",
      "size": 1024,
      "mode": "0644",
      "mod_time": "2024-01-15T10:00:00Z",
      "is_dir": false,
      "is_symlink": false
    }
  ],
  "stats": {
    "total_files": 150,
    "total_dirs": 25,
    "total_size": 52428800,
    "duration_ms": 125
  }
}
```

## Use Cases

- **File system audits**: Quickly find large, old, or permission-sensitive files
- **Code base analysis**: Analyze project structure and code statistics
- **Backup verification**: Find recently modified files for incremental backups
- **Storage management**: Identify large files for cleanup or archival
- **Security scanning**: Find files with suspicious permissions or locations
- **Automation scripts**: Integrate file system operations into CI/CD pipelines
- **Monitoring**: Watch directories for changes in real-time

## Caveats & Pitfalls

### ⚠️ CRITICAL: Go Version Requirement

**Stride requires Go 1.24.0 or later**. This is a hard requirement and cannot be bypassed.

```bash
# Check your Go version
go version
# Must be: go version go1.24.x or higher

# If you have Go 1.23 or earlier, installation will fail:
# go install github.com/TFMV/stride@latest
# Error: go: github.com/TFMV/stride@v0.2.0 requires go >= 1.24.0
```

**Solution**: Upgrade Go to 1.24+ before installing stride:
```bash
# Download and install Go 1.24+ from https://go.dev/dl
# Or use a Go version manager like gvm or goup
```

### Other Caveats

- **Permission issues**: Some system directories may require elevated permissions
- **Symlink handling**: Be cautious with `--follow-symlinks` to avoid infinite loops
- **Large directories**: Traversing very large directory trees may be memory-intensive
- **Pattern matching**: Wildcard patterns use shell-style glob syntax, not regex
- **Time formats**: Use consistent time format (e.g., "24h", "7d", "1w")
- **Worker count**: Too many workers may degrade performance on I/O-bound operations
- **Path exclusion**: Default excludes common system directories (.Trash, .Spotlight-V100, etc.)

## Examples

### Find all Go files in project

```bash
sc stride find-name /src --pattern "*.go"
```

### Find files larger than 100MB

```bash
sc stride find-large /home --size "100MB"
```

### Find files modified in the last 24 hours

```bash
sc stride find-recent ~/projects --time "24h"
```

### Find files with specific permissions

```bash
sc stride find-permissions /etc --perms "0644"
```

### Analyze code statistics

```bash
sc stride analyze-code /src --langs "go,js,typescript"
```

### Watch for new Go files

```bash
sc stride watch-pattern ~/projects --pattern "*.go"
```

### Find with multiple filters

```bash
sc stride find-name /logs --pattern "*.log" | jq '.files[] | select(.size > 1000000)'
```

### Find and process files

```bash
sc stride find-name /src --pattern "*.go" --format=json | jq -r '.files[].path' | xargs -I {} gofmt -w {}
```

### Analyze directory structure

```bash
sc stride analyze /data
```

### Find duplicate files

```bash
sc stride analyze-duplicates /data --duplicates
```