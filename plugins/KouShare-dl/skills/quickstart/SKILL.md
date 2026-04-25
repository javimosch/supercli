---
name: KouShare-dl
description: Use this skill when the user wants to download files from KouShare platform or manage KouShare downloads from the command line.
---

# KouShare-dl Plugin

A command-line downloader for KouShare. Download files and resources from KouShare platform directly from the terminal.

## Commands

### File Download
- `KouShare-dl file download` — Download file from KouShare

### Utility
- `KouShare-dl _ _` — Passthrough to KouShare-dl CLI

## Usage Examples
- "Download from KouShare"
- "KouShare downloader"
- "Download KouShare file"
- "KouShare CLI"

## Installation

```bash
brew install koushare-dl
```

Or via Go:
```bash
go install github.com/yliu7949/KouShare-dl/cmd/koushare-dl@latest
```

## Examples

```bash
# Download file
koushare-dl download https://koushare.com/file/xxx

# Download with output directory
koushare-dl download https://koushare.com/file/xxx --output ./downloads

# Any koushare-dl command with passthrough
koushare-dl _ _ download https://koushare.com/file/xxx
koushare-dl _ _ download url --output ./dir
```

## Key Features
- **Download** - File downloads
- **KouShare** - KouShare platform
- **CLI** - Command line native
- **Fast** - Fast downloads
- **Simple** - Simple interface
- **Batch** - Batch downloads
- **Files** - File management
- **Go** - Go language
- **Tool** - Download tool
- **Terminal** - Terminal native

## Notes
- Works with KouShare platform
- Great for batch downloads
- Simple command line interface
- Supports multiple file types
