---
name: dig
description: dig — DNS lookup utility. Query DNS name servers for record types A, AAAA, MX, NS, TXT, CNAME, and more.
---

# dig Plugin

dig — DNS lookup utility. Query DNS name servers for record types A, AAAA, MX, NS, TXT, CNAME, and more.

## Installation

```bash
brew install bind
Verify: dig --version
```

Also available via apt install dnsutils.

## Commands

### `sc dig self version`

Print dig version

### `sc dig dns resolve <domain> [--record_type <value>]`

Resolve DNS records for a domain

- `domain` (string, required) — Domain to query (e.g., example.com)
- `record_type` (string, optional) — Record type: A, AAAA, MX, NS, TXT, CNAME, SOA (default: A)

## Passthrough

```bash
sc dig _ _ <args...>
```

## SuperCLI

```bash
sc dig _ _ --help
sc plugins learn dig
```
