---
name: notation
description: Use this skill when the user wants to sign and verify container images
---

# Notation Plugin

sign and verify container images

## Commands
- `notation self version` — Print notation version
- `notation _ _` — Passthrough to notation CLI

## Usage Examples
- "Sign this container image"
- "Verify image signature"
- "List trusted signatures"

## Installation

```bash
go install github.com/notaryproject/notation/cmd/notation@latest
```

## Examples
```bash
notation sign registry.example.com/myimage:latest
notation verify registry.example.com/myimage:latest
notation ls registry.example.com/myimage:latest
```

## Key Features
- Notary project standard
- Container image signing
- Signature verification
- OCI registry support
