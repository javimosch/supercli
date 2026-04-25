---
name: certigo
description: Use this skill when the user wants to inspect SSL/TLS certificates, validate certificates, or convert certificate formats from the command line.
---

# certigo Plugin

A certificate validation and inspection tool. Examine, validate, and convert SSL/TLS certificates and keys from the command line.

## Commands

### Certificate Management
- `certigo cert inspect` — Inspect certificate
- `certigo cert validate` — Validate certificate

### Utility
- `certigo _ _` — Passthrough to certigo CLI

## Usage Examples
- "Inspect SSL certificate"
- "Validate certificate"
- "Check certificate chain"
- "Convert certificate format"

## Installation

```bash
brew install certigo
```

Or via Go:
```bash
go install github.com/square/certigo/cmd/certigo@latest
```

## Examples

```bash
# Inspect certificate
certigo cert server.crt

# Inspect with JSON
certigo cert server.crt --json

# Show certificate chain
certigo cert server.crt --chain

# Validate certificate
certigo cert --validate server.crt

# Inspect key
certigo key server.key

# Any certigo command with passthrough
certigo _ _ cert server.crt
certigo _ _ cert --validate server.crt
certigo _ _ key server.key
```

## Key Features
- **Inspect** - Certificate inspection
- **Validate** - Certificate validation
- **Convert** - Format conversion
- **Chain** - Chain verification
- **SSL** - SSL certificates
- **TLS** - TLS certificates
- **Keys** - Key management
- **Security** - Security analysis
- **PEM** - PEM format
- **DER** - DER format

## Notes
- Supports multiple formats
- Validates certificate chains
- Great for certificate debugging
- Converts between formats
