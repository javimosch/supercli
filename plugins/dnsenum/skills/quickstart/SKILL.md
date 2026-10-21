---
name: dnsenum
description: Use this skill when the user wants to enumerate DNS information about a domain for security testing or reconnaissance.
---

# dnsenum Plugin

dnsenum performs DNS enumeration for security testing.

## Commands
- `dnsenum <resource> <action>` — Execute dnsenum commands
- `dnsenum self version` — Print dnsenum version
- `dnsenum _ _` — Passthrough to dnsenum CLI

## Usage Examples

- "enumerate DNS records for a domain"
- "brute-force subdomains with wordlist"
- "perform reverse DNS lookup on IP range"

## Installation

```bash
brew install dnsenum
```

## Key Features
- DNS zone transfer attempts
- Subdomain brute-forcing
- Reverse DNS lookup
- SRV/NS/MX record enumeration
- Google scraping for subdomain discovery
- Comprehensive DNS information gathering
