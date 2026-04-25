---
name: doggo
description: Use this skill when the user wants to lookup DNS records, query DNS servers, use DNS over HTTPS, or perform DNS queries.
---

# doggo Plugin

Command-line DNS client for humans. Modern DNS lookup tool with support for DoH and DoT.

## Commands

### DNS Lookup
- `doggo lookup dns` — Perform DNS lookup

### Utility
- `doggo _ _` — Passthrough to doggo CLI

## Usage Examples
- "Lookup DNS for this domain"
- "Query MX records"
- "Use DNS over HTTPS"
- "Check DNS with specific nameserver"

## Installation

```bash
brew install doggo
```

Or via Go:
```bash
go install github.com/mr-karan/doggo/cmd/doggo@latest
```

## Examples

```bash
# Simple lookup
doggo lookup dns example.com

# Lookup specific record type
doggo lookup dns MX github.com

# Use specific nameserver
doggo lookup dns example.com @9.9.9.9

# DNS over HTTPS
doggo lookup dns example.com @https://cloudflare-dns.com/dns-query

# DNS over TLS
doggo lookup dns example.com @tls://1.1.1.1

# Multiple record types
doggo lookup dns example.com A AAAA

# JSON output
doggo lookup dns example.com -J

# Reverse lookup
doggo lookup dns 1.1.1.1 PTR

# Any doggo command with passthrough
doggo _ _ example.com A
doggo _ _ @https://dns.google/dns-query example.com TXT
```

## Key Features
- **Human-friendly** - Easy to use CLI
- **DoH support** - DNS over HTTPS
- **DoT support** - DNS over TLS
- **Multiple record types** - A, AAAA, MX, NS, TXT, etc.
- **Custom nameservers** - Query specific servers
- **JSON output** - Machine-readable format
- **Colorized output** - Easy to read
- **Reverse DNS** - PTR lookups

## Supported Protocols
- **UDP/TCP** - Standard DNS
- **DoH** - DNS over HTTPS
- **DoT** - DNS over TLS

## Notes
- Default uses system DNS
- Supports EDNS0
- Can display response time
- Great for DNS troubleshooting
- Modern alternative to dig
