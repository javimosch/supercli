---
name: upx
description: Use this skill when the user wants to compress executables — shrink ELF, PE, or Mach-O binaries by 50–70% with no runtime decompression penalty.
---

# upx Plugin

Ultimate Packer for eXecutables. Compresses binaries in place (or to a new file) using fast in-memory decompression at startup — common for shipping smaller CLI tools, firmware images, and release artifacts.

## Installation

```bash
apt install upx
# or: brew install upx, pacman -S upx
```

## Basic Usage

```bash
# Compress an executable in place
upx mybinary

# Compress to a new file (keep original)
upx -o mybinary.compressed mybinary

# Decompress back to original
upx -d mybinary

# Show compression info without modifying
upx -l mybinary
```

## Common Patterns

```bash
# Best compression (slower, smaller)
upx --best mybinary

# Compress all executables in a directory
upx ./dist/*

# Test compressed binary integrity
upx -t mybinary

# List supported formats
upx --help
```

## Usage Examples

- "Shrink this Go binary before release"
- "Compress all binaries in ./dist"
- "Decompress this UPX-packed executable"

## SuperCLI

```bash
sc upx _ _ --best mybinary
sc upx _ _ -l mybinary
sc plugins learn upx
```
