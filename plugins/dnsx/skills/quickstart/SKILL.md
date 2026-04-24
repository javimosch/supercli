---
name: dnsx
description: Use this skill when the user wants to resolve DNS records, perform DNS queries, or use DNS tools for reconnaissance.
---

# dnsx Plugin

A fast and multi-purpose DNS toolkit that allows you to run multiple DNS queries of your choice with a list of user-supplied resolvers. DNS resolution, bruteforce, and wildcard filtering.

## Commands

### DNS Resolution
- `dnsx dns resolve` — Resolve DNS records

### Utility
- `dnsx _ _` — Passthrough to dnsx CLI

## Usage Examples
- "Resolve DNS records"
- "DNS lookup"
- "Query DNS server"
- "DNS bruteforce"

## Installation

```bash
brew install dnsx
```

Or via Go:
```bash
go install github.com/projectdiscovery/dnsx/cmd/dnsx@latest
```

## Examples

```bash
# Resolve DNS records
dnsx dns resolve example.com

# Specify record type
dnsx dns resolve example.com --type A

# JSON output
dnsx dns resolve example.com --json

# Use custom resolver
dnsx dns resolve example.com --resolver 8.8.8.8

# Any dnsx command with passthrough
dnsx _ _ example.com
dnsx _ _ example.com --type AAAA --json
```

## Key Features
- **Fast** - High-performance DNS queries
- **Multi-type** - A, AAAA, CNAME, MX, TXT, etc.
- **Bruteforce** - DNS subdomain bruteforce
- **Wildcard** - Wildcard filtering
- **Resolvers** - Custom resolver support
- **JSON** - Structured output
- **Recon** - Security reconnaissance
- **Batch** - Process multiple domains
- **Cross-platform** - Linux, macOS, Windows
- **Powerful** - Advanced DNS toolkit

## Notes
- Great for DNS reconnaissance
- Supports many record types
- Can use custom resolvers
- Perfect for security testing
