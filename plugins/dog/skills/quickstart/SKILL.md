---
name: dog
description: Use this skill when the user wants to query DNS records, perform DNS lookups, or diagnose DNS issues from the command line with readable output.
---

# dog Plugin

A command-line DNS client. Query DNS servers with a colorful, human-readable output and support for all major record types.

## Commands

### DNS Queries
- `dog dns query` — Query DNS records

### Utility
- `dog _ _` — Passthrough to dog CLI

## Usage Examples
- "Query DNS records"
- "DNS lookup for domain"
- "Check MX records"
- "Diagnose DNS"

## Installation

```bash
brew install dog
```

Or via Cargo:
```bash
cargo install dog
```

## Examples

```bash
# Query A records
dog dns query example.com

# Query MX records
dog dns query example.com --type MX

# Query with custom DNS server
dog dns query example.com --nameserver 1.1.1.1

# Query all record types
dog dns query example.com --type ALL

# Output as JSON
dog dns query example.com --json

# Any dog command with passthrough
dog _ _ example.com
dog _ _ example.com --type AAAA
dog _ _ example.com --type TXT --json
```

## Key Features
- **Colorful** - Human-readable output
- **Records** - All major types
- **A/AAAA** - IPv4/IPv6 lookups
- **MX** - Mail records
- **TXT** - Text records
- **NS** - Name servers
- **CNAME** - Aliases
- **DoT** - DNS-over-TLS
- **DoH** - DNS-over-HTTPS
- **JSON** - JSON output

## Notes
- Supports DNS-over-TLS
- Supports DNS-over-HTTPS
- Great for DNS debugging
- Colorful terminal output
