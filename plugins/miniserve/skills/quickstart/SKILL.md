---
name: miniserve
description: Use this skill when the user wants to serve files over HTTP, create a quick file server, or share files locally.
---

# miniserve Plugin

For when you really just want to serve some files over HTTP right now! A CLI tool to serve files and directories over HTTP with upload support and authentication.

## Commands

### File Serving
- `miniserve files serve` — Serve files over HTTP

### Utility
- `miniserve _ _` — Passthrough to miniserve CLI

## Usage Examples
- "Serve this directory"
- "Start a file server"
- "Share files over HTTP"
- "Serve files with upload support"

## Installation

```bash
brew install miniserve
```

Or via Cargo:
```bash
cargo install miniserve
```

## Examples

```bash
# Serve current directory
miniserve files serve .

# Serve specific directory
miniserve files serve /path/to/files

# Serve single file
miniserve files serve document.pdf

# Set custom port
miniserve files serve . --port 8080

# Bind to specific host
miniserve files serve . --host 0.0.0.0

# Enable file upload
miniserve files serve . --upload

# Set authentication
miniserve files serve . --auth username:password

# Generate random URL path
miniserve files serve . --random-route

# Enable HTTPS
miniserve files serve . --tls

# Any miniserve command with passthrough
miniserve _ _ . --port 8080 --upload
miniserve _ _ /path/to/files --auth user:pass
```

## Key Features
- **Quick start** - Serve files instantly
- **Directory listing** - Browse files in browser
- **File upload** - Upload files from browser
- **Authentication** - Username/password protection
- **HTTPS/TLS** - Secure file serving
- **Random URLs** - Generate random URL paths
- **Single files** - Serve individual files
- **Cross-platform** - Linux, macOS, Windows
- **No dependencies** - Single binary
- **Fast** - Written in Rust

## Notes
- Default port is 8080
- Press Ctrl+C to stop server
- Upload requires --upload flag
- Perfect for quick file sharing
- Works on local network
- Supports SPA serving
