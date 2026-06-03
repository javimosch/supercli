---
name: lego
description: Use this skill when the user wants to obtain, renew, or manage TLS/SSL certificates from Let's Encrypt or any ACME CA.
---

# lego Plugin

Let's Encrypt/ACME client for obtaining and renewing TLS certificates from any ACME CA. Supports HTTP-01, DNS-01, and TLS-ALPN-01 challenges with 200+ DNS providers.

## Commands

### Certificate Management
- `lego cert obtain` — Obtain a new TLS certificate
- `lego cert renew` — Renew an existing certificate
- `lego cert revoke` — Revoke a certificate
- `lego cert list` — List known certificates

### DNS Operations
- `lego dns providers` — List available DNS providers

### Utility
- `lego _ _` — Passthrough to lego CLI

## Usage Examples
- "Obtain a certificate for example.com"
- "Renew my TLS certificate"
- "List all my certificates"
- "Show available DNS providers"

## Installation

```bash
brew install lego
```

Or download from GitHub releases:
```bash
curl -sSfL https://github.com/go-acme/lego/releases/latest/download/lego_linux_amd64.tar.gz | tar xz -C /usr/local/bin lego
```

Or install with Go:
```bash
go install github.com/go-acme/lego/v4/cmd/lego@latest
```

## Examples

```bash
# Obtain a certificate (HTTP-01 challenge)
lego cert obtain --domains example.com --email admin@example.com --http --accept-tos

# Obtain a certificate with DNS-01 challenge (Cloudflare)
lego cert obtain --domains example.com --email admin@example.com --dns cloudflare --accept-tos

# Renew a certificate
lego cert renew --domains example.com --days 30

# Revoke a certificate
lego cert revoke --domains example.com

# List certificates
lego cert list

# List DNS providers
lego dns providers

# Use a staging server for testing
lego cert obtain --domains example.com --email admin@example.com --http --accept-tos --server https://acme-staging-v02.api.letsencrypt.org/directory

# Custom key type
lego cert obtain --domains example.com --email admin@example.com --http --accept-tos --key-type ecdsa256

# Passthrough any lego command
lego _ _ --version
lego _ _ --help
```

## Key Features
- **ACME v2** — Full RFC 8555 compliance
- **200+ DNS providers** — Cloudflare, Route53, GCP, Azure, and more
- **Three challenge types** — HTTP-01, DNS-01, TLS-ALPN-01
- **SAN support** — Multiple domains per certificate
- **CNAME support** — Automatic CNAME resolution for DNS challenges
- **Renewal information** — ARI (RFC 9773) support
- **Profiles** — ACME profiles extension (draft-ietf-acme-profiles)
- **Independent** — Not tied to any specific CA
