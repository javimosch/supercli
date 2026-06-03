---
name: secretkeeper
description: Use this skill when the user wants to protect, encrypt, or manage secrets within text content.
---

# secretkeeper Plugin

Text protection tool for hiding, encrypting, and managing secrets within text content.

## Commands

### Secret Protection
- `secretkeeper secret protect` — Protect and manage secrets in text

## Usage Examples
- "Protect secrets in this text file"
- "Hide sensitive data in this document"
- "Manage embedded secrets"

## Installation

```bash
cargo install secretkeeper
```

## Examples

```bash
secretkeeper protect document.md
secretkeeper reveal document.md
secretkeeper list document.md
secretkeeper add document.md --secret "API_KEY=abc123"
```

## Key Features
- Text-based secret protection
- Embed and reveal secrets
- List protected secrets
- Password-based protection
- Fast Rust implementation
