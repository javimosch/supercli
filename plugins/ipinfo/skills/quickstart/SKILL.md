---
name: ipinfo
description: Use this skill when the user wants to look up IP address information, get geolocation data, check ASN details, or analyze IP ranges.
---

# ipinfo Plugin

Official CLI for the IPinfo API. Get IP geolocation, ASN details, IP ranges, and hosted domains from the command line.

## Commands

### IP Lookup
- `ipinfo ip lookup` — Look up IP address information

### Range Lookup
- `ipinfo range lookup` — Look up IP range information

### Utility
- `ipinfo _ _` — Passthrough to ipinfo CLI

## Usage Examples
- "Look up IP address"
- "Get IP geolocation"
- "Check ASN details"
- "Analyze IP range"

## Installation

```bash
brew install ipinfo-cli
```

## Examples

```bash
# Look up own IP
ipinfo ip lookup

# Look up specific IP
ipinfo ip lookup 8.8.8.8

# Get specific field
ipinfo ip lookup 8.8.8.8 --field city

# Look up range
ipinfo range lookup 8.8.8.0/24

# Any ipinfo command with passthrough
ipinfo _ _ 8.8.8.8
ipinfo _ _ range 8.8.8.0/24
```

## Key Features
- **Geolocation** - IP geolocation
- **ASN** - ASN details
- **Ranges** - IP range lookup
- **Domains** - Hosted domains
- **Fast** - Quick lookups
- **Batch** - Batch processing
- **JSON** - JSON output
- **API** - IPinfo API
- **Network** - Network analysis
- **Security** - Security research

## Notes
- Some features may need API token
- Great for network analysis
- Supports batch lookups
- Perfect for security research
