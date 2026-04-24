---
name: httpx
description: Use this skill when the user wants to probe HTTP endpoints, discover web technologies, analyze HTTP responses, or perform HTTP reconnaissance.
---

# httpx Plugin

A fast and multi-purpose HTTP toolkit. Run multiple probes using the retryablehttp library. Discover subdomains, detect technologies, and analyze HTTP responses.

## Commands

### HTTP Probing
- `httpx probe run` — Run HTTP probes on targets

### Utility
- `httpx _ _` — Passthrough to httpx CLI

## Usage Examples
- "Probe these HTTP endpoints"
- "Detect technologies on this site"
- "Check HTTP status codes"
- "Analyze HTTP responses"

## Installation

```bash
brew install httpx
```

Or via Go:
```bash
go install github.com/projectdiscovery/httpx/cmd/httpx@latest
```

## Examples

```bash
# Probe single URL
httpx probe run -u https://example.com

# Probe multiple URLs
httpx probe run -u https://example.com -u https://test.com

# Probe from file
httpx probe run -l targets.txt

# Show status codes
httpx probe run -u https://example.com --status-code

# Show page titles
httpx probe run -u https://example.com --title

# Detect technologies
httpx probe run -u https://example.com --tech-detect

# JSON output
httpx probe run -u https://example.com --json

# Silent mode
httpx probe run -u https://example.com --silent

# Set timeout
httpx probe run -u https://example.com --timeout 10

# Set threads
httpx probe run -u https://example.com --threads 50

# Any httpx command with passthrough
httpx _ _ -u https://example.com --status-code --json
httpx _ _ -l targets.txt --tech-detect --threads 100
```

## Key Features
- **Fast probing** - Multi-threaded HTTP requests
- **Technology detection** - Identify web technologies
- **Status codes** - HTTP status code analysis
- **SSL info** - SSL certificate details
- **Server headers** - HTTP server headers
- **Multiple inputs** - URLs, files, stdin
- **JSON output** - Structured output format
- **Configurable** - Threads, timeout, retries
- **Retryable** - Automatic retry logic
- **Cross-platform** - Linux, macOS, Windows

## Notes
- Supports HTTP and HTTPS
- Can handle large target lists efficiently
- Useful for reconnaissance and security testing
- Detects common web technologies
- Can be used in CI/CD pipelines
