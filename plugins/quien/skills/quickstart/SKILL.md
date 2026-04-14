---
name: quien
description: Use this skill when the user wants to perform WHOIS lookups, DNS queries, mail configuration audits, SSL/TLS certificate checks, IP address lookups with ASN information, SEO analysis, or tech stack detection for domains.
---

# quien Plugin

A better WHOIS lookup tool with JSON output and scripting subcommands.

## Commands

### Domain Lookup
- `quien example.com` — Domain WHOIS lookup (interactive TUI)
- `quien --json example.com` — JSON output for scripting

### IP Lookup
- `quien 8.8.8.8` — IP address lookup with reverse DNS, ASN, and abuse contacts

### DNS Query
- `quien dns example.com` — DNS lookup with JSON output

### Mail Audit
- `quien mail example.com` — Mail configuration audit (MX, SPF, DMARC, DKIM, BIMI with VMC chain validation)

### TLS Query
- `quien tls example.com` — SSL/TLS certificate information

### HTTP Query
- `quien http example.com` — HTTP headers and tech stack detection

### SEO Analysis
- `quien seo example.com` — SEO analysis with Core Web Vitals (requires QUIEN_CRUX_API_KEY for field data)

### Tech Stack
- `quien stack example.com` — Tech stack detection including WordPress plugins, JS/CSS frameworks

### ASN Lookup
- `quien ip <asn>` — ASN lookup with PeeringDB enrichment

## Usage Examples

- "Check WHOIS info for a domain"
- "Audit mail configuration for SPF, DKIM, DMARC"
- "Get SSL certificate details"
- "Find ASN and network info for an IP"
- "Analyze SEO and Core Web Vitals"

## Installation

```bash
brew tap retlehs/tap
brew install retlehs/tap/quien
```

## Key Features

- RDAP-first lookups with WHOIS fallback for broad TLD coverage
- IANA referral for automatic WHOIS server discovery
- Mail configuration audit — MX, SPF, DMARC, DKIM, and BIMI with VMC chain validation
- SEO analysis — indexability, on-page, structured data, Core Web Vitals
- Tech stack detection including WordPress plugins and JS/CSS frameworks
- IP lookups with reverse DNS, network info, abuse contacts, and ASN discovery via RDAP
- BGP fallback for origin ASN/prefix when RDAP does not include ASN data
- PeeringDB enrichment for ASN context
- JSON subcommands for scripting: dns, mail, tls, http, seo, stack, all
