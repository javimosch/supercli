---
name: hashsum-file-checker
description: Use this skill when the user wants to calculate file hash checksums.
---

# Hashsum-File-Checker Plugin

Calculate file hash checksums.

## Commands

### File Hashing
- `hashsum-file-checker file hash` — Calculate file hash checksum

## Usage Examples
- "hashsum-file-checker file hash --file data.txt"
- "hashsum-file-checker file hash --file data.txt --algorithm sha256"

## Installation

```bash
npm install -g nodejs-hashsum-file-checker
```

## Examples

```bash
# Calculate MD5 hash
hashsum-file-checker file.txt md5

# Calculate SHA1 hash
hashsum-file-checker file.txt sha1

# Calculate SHA256 hash
hashsum-file-checker file.txt sha256

# Calculate SHA512 hash
hashsum-file-checker file.txt sha512

# Default algorithm (MD5)
hashsum-file-checker file.txt
```

## Key Features
- MD5 hashing
- SHA1 hashing
- SHA256 hashing
- SHA384 hashing
- SHA512 hashing
- File integrity verification
