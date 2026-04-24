---
name: uncover
description: Use this skill when the user wants to discover exposed hosts, perform security reconnaissance, or find assets on the internet.
---

# uncover Plugin

Quickly discover exposed hosts on the internet using multiple search engines. Security reconnaissance tool for finding exposed assets.

## Commands

### Host Discovery
- `uncover host discover` — Discover exposed hosts

### Utility
- `uncover _ _` — Passthrough to uncover CLI

## Usage Examples
- "Discover exposed hosts"
- "Search for assets"
- "Security reconnaissance"
- "Find exposed services"

## Installation

```bash
brew install uncover
```

Or via Go:
```bash
go install github.com/projectdiscovery/uncover/cmd/uncover@latest
```

## Examples

```bash
# Discover hosts
uncover host discover example.com

# Use specific engine
uncover host discover example.com --engine shodan

# JSON output
uncover host discover example.com --json

# Limit results
uncover host discover example.com --limit 100

# Any uncover command with passthrough
uncover _ _ example.com
uncover _ _ example.com --json
```

## Key Features
- **Multi-engine** - Shodan, Censys, and more
- **Fast** - Quick discovery
- **Recon** - Security reconnaissance
- **OSINT** - Open source intelligence
- **Bug bounty** - Great for bug bounty hunting
- **Exposed assets** - Find exposed hosts
- **JSON output** - Structured results
- **Configurable** - Custom search engines
- **Cross-platform** - Linux, macOS, Windows
- **Powerful** - Advanced filtering

## Notes
- Great for security research
- Multiple search engine support
- Perfect for bug bounty hunters
- Can find exposed services
