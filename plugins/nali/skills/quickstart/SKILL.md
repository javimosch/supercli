---
name: nali
description: Use this skill when the user wants to lookup IP geographic information, query CDN providers, or get IP geolocation data.
---

# nali Plugin

Offline tool for querying IP geographic information and CDN provider. Query IP geolocation and CDN service provider information without internet.

## Commands

### IP Lookup
- `nali ip lookup` — Lookup IP geographic information

### Utility
- `nali _ _` — Passthrough to nali CLI

## Usage Examples
- "Lookup IP location"
- "Query CDN provider"
- "Get IP geolocation"
- "Check IP information"

## Installation

```bash
brew install nali
```

Or via Go:
```bash
go install github.com/zu1k/nali/cmd/nali@latest
```

## Examples

```bash
# Lookup IP geolocation
nali ip lookup 8.8.8.8

# Query CDN provider
nali ip lookup 8.8.8.8 --cdn

# Update database
nali ip lookup --update

# Set language
nali ip lookup 8.8.8.8 --lang en

# Multiple IPs
nali ip lookup 8.8.8.8 1.1.1.1

# Any nali command with passthrough
nali _ _ 8.8.8.8 --cdn
nali _ _ update
```

## Key Features
- **Offline** - Works without internet
- **IP geolocation** - Query IP location data
- **CDN detection** - Identify CDN providers
- **IPv4/IPv6** - Supports both IP versions
- **Multiple databases** - Various geoip databases
- **Integration** - Works with dig, nslookup
- **Multi-language** - English and Chinese support
- **Fast** - Local database lookup
- **Cross-platform** - Linux, macOS, Windows
- **Updatable** - Database can be updated

## Notes
- Uses offline database for queries
- Supports multiple geoip databases
- Can identify CDN providers
- Works with standard DNS tools
