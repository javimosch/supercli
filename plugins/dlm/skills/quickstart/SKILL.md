---
name: dlm
description: Use this skill when the user wants to download files from URLs, batch download from a list, or resume interrupted downloads.
---

# dlm Plugin

Minimal HTTP download manager with concurrent downloads and resume support.

## Commands

### Download
- `dlm download url` — Download a file from URL
- `dlm download batch` — Download multiple files from a list

## Usage Examples
- "Download a file from a URL"
- "Download multiple files from a list"
- "Resume an interrupted download"

## Installation

```bash
cargo install dlm
```

## Examples

```bash
# Download single file
dlm https://example.com/file.zip

# Download from list
dlm --input-file links.txt

# With output directory
dlm --input-file links.txt --output-dir ~/downloads

# Limit concurrent downloads
dlm --input-file links.txt --max-concurrent 4
```

## Key Features
- Concurrent downloads with configurable limit
- Resume interrupted downloads (HTTP range)
- Automatic retry on timeout
- Progress bars
- Proxy and redirect support
- Random user-agent option
