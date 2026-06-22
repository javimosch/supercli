---
name: recon
description: Use this skill when the user wants to perform network reconnaissance, HTTP requests, TLS/DNS inspection, WHOIS lookups, or run Rhai protocol scripts.
---

# recon Plugin

A versatile network reconnaissance CLI written in Rust. Covers HTTP(S), TLS certificate inspection, DNS, WHOIS, ping, traceroute, multi-protocol probes, file conversion, compression, hashing, encoding, and a Rhai script engine.

## Commands

### HTTP requests
- `recon http request <url>` — Make a curl-style HTTP(S) request
- `recon http request https://api.example.com/items -X POST -H 'Content-Type: application/json' -d '{"name":"thing"}'`

### TLS inspection
- `recon cert inspect <host>` — Inspect TLS certificate chain
- `recon cert inspect https://example.com`

### DNS queries
- `recon dns query <host>` — Query DNS records
- `recon dns query example.com --dns A,AAAA,MX,TXT`

### Email protection
- `recon email check <domain>` — Run SPF, DMARC, DKIM, MTA-STS, TLS-RPT, BIMI sweep
- `recon email check example.com`

### Scripting
- `recon script run <script.rhai>` — Run a Rhai script with protocol probe bindings
- `recon script run script/dns.rhai example.com A,MX`

### Utilities
- `recon self version` — Print recon version
- `recon _ _` — Passthrough to recon CLI with full argument access

## Usage Examples
- "recon http request https://api.example.com/v1/items -i"
- "recon cert inspect https://example.com"
- "recon dns query example.com --dns A,MX,TXT"
- "recon email check example.com"
- "recon --examples"
- "recon --help tls"

## Installation

```bash
cargo install recon-cli
```

Or with Homebrew:

```bash
brew tap codedeviate/cli
brew install recon
```

## Examples

### Make a verbose HTTP request
```bash
recon http request https://api.example.com/v1/items -i
```

### Inspect TLS certificate
```bash
recon cert inspect https://example.com
```

### DNS lookup
```bash
recon dns query example.com --dns A,AAAA,MX,TXT
```

## Key Features
- CLI-only, no auth required
- 40+ URL schemes (HTTP, FTP, SSH, IMAP, SMTP, MQTT, Redis, etc.)
- TLS certificate inspection with CRL checking
- DNS, WHOIS, ping, traceroute
- Multi-protocol probes
- Hash, encode/decode, compress, archive tools
- Markdown/HTML/PDF conversion
- Rhai script engine for automation
- Curl-compatible flags
