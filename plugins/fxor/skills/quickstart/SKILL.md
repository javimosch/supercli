---
name: fxor
description: Use this skill when the user wants to encrypt or decrypt files using XOR cipher.
---

# fxor Plugin

File encryption CLI using XOR cipher for simple symmetric encryption/decryption.

## Commands

### File Encryption
- `fxor file encrypt` — Encrypt files using XOR cipher with a key

## Usage Examples
- "Encrypt this file with XOR"
- "XOR encrypt this data"
- "Decrypt this XOR-encrypted file"

## Installation

```bash
cargo install fxor
```

## Examples

```bash
fxor encrypt -k mykey -i secret.txt -o secret.enc
fxor decrypt -k mykey -i secret.enc -o secret.txt
fxor encrypt -k mykey secret.txt
```

## Key Features
- XOR cipher encryption/decryption
- Key-based operation
- Stream processing
- Fast Rust implementation
- Simple and lightweight
