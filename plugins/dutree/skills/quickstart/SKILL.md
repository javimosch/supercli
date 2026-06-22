---
name: dutree
description: a tool to analyze disk usage as a colored tree
---
# dutree Plugin

dutree is a fast, Rust-based command-line tool that displays disk usage as a colored tree, combining the functionality of `du` and `tree`.

## Usage

Analyze current directory:
```bash
dutree
```

Show deeper tree (default depth is 1):
```bash
dutree -d 2 /path/to/dir
```

Aggregate small files (hide files smaller than given size):
```bash
dutree -a 10M
```

Show summary equivalent to `-d1 -a1M`:
```bash
dutree -s
```

Report real disk usage instead of file size:
```bash
dutree -u
```

Skip directories for a fast local overview:
```bash
dutree -f
```

Exclude directories by name:
```bash
dutree -x target
```

Compare multiple directories:
```bash
dutree /path/to/dir1 /path/to/dir2
```

## Options

| Flag | Description |
|------|-------------|
| `-d, --depth [DEPTH]` | Show directories up to depth N (default 1) |
| `-a, --aggr [N[KMG]]` | Aggregate smaller than N B/KiB/MiB/GiB (default 1M) |
| `-s, --summary` | Equivalent to `-da`, or `-d1 -a1M` |
| `-u, --usage` | Report real disk usage instead of file size |
| `-b, --bytes` | Print sizes in bytes |
| `-f, --files-only` | Skip directories for a fast local overview |
| `-x, --exclude NAME` | Exclude matching files or directories |
| `-H, --no-hidden` | Exclude hidden files |
| `-A, --ascii` | ASCII characters only, no colors |
| `-h, --help` | Show help |
| `-v, --version` | Print version number |

## Installation

```bash
cargo install dutree
```

Or download a prebuilt binary from the [releases page](https://github.com/nachoparker/dutree/releases).
