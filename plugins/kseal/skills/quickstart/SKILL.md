---
name: kseal
description: Use this skill when the user wants to view, decode, or inspect Kubernetes secrets.
---

# kseal Plugin

Kubernetes secrets viewer and decoder. View base64-encoded, encrypted, and sealed secrets in a readable format.

## Commands

### Secret Viewing
- `kseal secret view` — View and decode Kubernetes secrets

## Usage Examples
- "Show me the secrets in this Kubernetes cluster"
- "Decode this base64 secret"
- "View sealed secrets"

## Installation

```bash
pip install kseal
```

## Examples

```bash
kseal view secret-name
kseal view secret-name -n namespace
kseal decode "base64encodedstring"
kseal list --namespace kube-system
```

## Key Features
- Base64 secret decoding
- Sealed secrets viewing
- Namespace filtering
- Multiple output formats
- Simple CLI interface
