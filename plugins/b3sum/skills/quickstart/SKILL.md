---
name: b3sum
description: Use this skill when the user wants to compute BLAKE3 hashes of files, verify file integrity, or generate checksums. Fast, multi-threaded cryptographic hashing from the command line.
---

# b3sum Plugin

Compute BLAKE3 cryptographic hashes for files and streams. The fastest standardized hash function.

## Commands

### Hash
- `b3sum hash file document.pdf` — Compute hash of a file
- `b3sum hash file file1.txt file2.txt` — Hash multiple files
- `b3sum hash stdin` — Hash data piped to stdin
- `b3sum hash file large.iso --num-threads 8` — Multi-threaded hashing

### Check
- `b3sum hash check checksums.txt` — Verify hashes against a list

### Options
- `--raw` — Output raw bytes instead of hex
- `--num-threads N` — Use N threads (default: all CPUs)
- `--no-mmap` — Disable memory mapping

### Full Access
- `b3sum _ _` — Passthrough for advanced options

## Usage Examples
- "Get the BLAKE3 hash of this ISO file"
- "Verify the integrity of downloaded files using checksums.txt"
- "Pipe a file through b3sum and get the hash"
- "Hash multiple files at once with multi-threading"

## Installation

```bash
cargo install b3sum
```

## Key Features
- **Blazing fast**: BLAKE3 is the fastest standardized hash
- **Multi-threaded**: Automatically uses all CPU cores
- **Streaming**: Can hash data piped from stdin
- **Check mode**: Verify file integrity from hash lists
- **Raw output**: Output raw bytes for further processing
- **Non-interactive**: All operations are one-shot CLI commands

## Comparing Hashes

```bash
# Generate hash
b3sum myfile.bin

# Check against stored hash
echo "abc123...  myfile.bin" > myhash
b3sum --check myhash
```
