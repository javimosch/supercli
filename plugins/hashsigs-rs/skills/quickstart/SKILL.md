---
name: hashsigs-rs
description: Use this skill when the user wants to create or verify post-quantum hash-based signatures
---

# Hashsigs-rs Plugin

create or verify post-quantum hash-based signatures

## Commands
- `hashsigs-rs self version` — Print hashsigs-rs version
- `hashsigs-rs _ _` — Passthrough to hashsigs-rs CLI

## Usage Examples
- "Sign this file with post-quantum crypto"
- "Verify this signature"
- "Generate hash-based key pair"

## Installation

```bash
cargo install hashsigs-rs
```

## Examples
```bash
hashsigs-rs sign --key private.key message.bin
hashsigs-rs verify --key public.key message.bin signature.bin
```

## Key Features
- Post-quantum secure signature scheme
- Hash-based cryptography
- Future-proof against quantum attacks
- Fast Rust implementation
