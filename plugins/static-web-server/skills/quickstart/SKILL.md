---
name: static-web-server
description: static-web-server — fast asynchronous static file server (Rust)
---
# static-web-server Plugin

static-web-server is a high-performance, asynchronous web server for serving static files, written in Rust.

## Usage

Start a server serving files from the `./public` directory on port `8080`:

```bash
supercli static-web-server --port 8080 --root ./public
```

### Common Flags

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--host` | `-a` | Host address to bind | `::` (all interfaces) |
| `--port` | `-p` | Port to listen on | `80` |
| `--root` | `-d` | Root directory for static files | `./public` |
| `--log-level` | `-g` | Log level (error, warn, info, debug, trace) | `error` |
| `--grace-period` | `-q` | Grace period in seconds before shutdown | `0` |
| `--compression` | `-x` | Enable compression (gzip/deflate/brotli/zstd) | `true` |
| `--directory-listing` | `-z` | Enable directory listing | `false` |
| `--cors-allow-origins` | `-j` | CORS allowed origins (comma-separated) | (none) |
| `--basic-auth` | | Basic auth credentials (user:password, bcrypt) | (none) |
| `--version` | `-V` | Print version and exit | |

### Examples

Serve files from current directory on port 3000:

```bash
supercli static-web-server --port 3000 --root .
```

Enable verbose logging and directory listing:

```bash
supercli static-web-server --port 8080 --root ./public --log-level info --directory-listing
```

## Install

### From source (Cargo)

```bash
cargo install static-web-server
```

### Binary download

Download the latest release for your platform from:
https://github.com/static-web-server/static-web-server/releases
