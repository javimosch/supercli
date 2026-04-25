---
name: zdns
description: Use this skill when the user wants to perform DNS lookups, check DNS records, query nameservers, or investigate DNS infrastructure.
---

# zdns Plugin

Fast DNS lookup library and CLI tool. Perform DNS lookups with high performance and multiple output formats.

## Commands

### DNS Lookup
- `zdns lookup dns` — Perform DNS lookup

### Utility
- `zdns _ _` — Passthrough to zdns CLI

## Usage Examples
- "Lookup DNS for this domain"
- "Check MX records"
- "Query nameserver"
- "Perform DNS reconnaissance"

## Installation

```bash
brew install zdns
```

## Examples

```bash
# Basic A record lookup
zdns lookup dns example.com

# Lookup specific record type
zdns lookup dns example.com -t MX

# Use custom nameserver
zdns lookup dns example.com -n 8.8.8.8

# Lookup AAAA records
zdns lookup dns example.com -t AAAA

# Lookup TXT records
zdns lookup dns example.com -t TXT

# NS records
zdns lookup dns example.com -t NS

# Any zdns command with passthrough
zdns _ _ example.com A
zdns _ _ -t MX -n 1.1.1.1 example.com
```

## Key Features
- **Fast** - High-performance DNS lookups
- **Multiple record types** - A, AAAA, MX, NS, TXT, CNAME, etc.
- **Custom nameservers** - Query specific DNS servers
- **Batch processing** - Process multiple domains
- **Multiple formats** - JSON, text, dig-style input
- **Module system** - Extensible lookup modules
- **IPv6 support** - Full IPv6 DNS support
- **Recursive mode** - Local recursion option

## Supported Record Types
- **A** - IPv4 addresses
- **AAAA** - IPv6 addresses
- **MX** - Mail exchange
- **NS** - Nameserver
- **TXT** - Text records
- **CNAME** - Canonical name
- **SOA** - Start of authority
- **PTR** - Pointer records
- And more

## Notes
- Default nameservers from system
- Can specify custom nameservers
- Great for DNS reconnaissance
- Used by security researchers
