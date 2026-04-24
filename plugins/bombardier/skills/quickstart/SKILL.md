---
name: bombardier
description: Use this skill when the user wants to benchmark HTTP servers, perform load testing, or measure API performance.
---

# bombardier Plugin

Fast cross-platform HTTP benchmarking tool written in Go. Load test HTTP servers with configurable concurrency and request rates.

## Commands

### HTTP Benchmarking
- `bombardier http benchmark` — Run HTTP load test

### Utility
- `bombardier _ _` — Passthrough to bombardier CLI

## Usage Examples
- "Benchmark this HTTP endpoint"
- "Load test the API"
- "Measure server performance"
- "Test API response times"

## Installation

```bash
brew install bombardier
```

Or via Go:
```bash
go install github.com/codesenberg/bombardier/cmd/bombardier@latest
```

## Examples

```bash
# Benchmark with default settings
bombardier http benchmark https://example.com

# Set number of requests
bombardier http benchmark https://example.com -n 1000

# Set concurrency
bombardier http benchmark https://example.com -c 10

# Set duration
bombardier http benchmark https://example.com -d 30s

# Set requests per second
bombardier http benchmark https://example.com -r 100

# Set HTTP method
bombardier http benchmark https://example.com -m POST

# Add custom header
bombardier http benchmark https://example.com -H "Authorization: Bearer token"

# Use fasthttp
bombardier http benchmark https://example.com --fasthttp

# Enable latency stats
bombardier http benchmark https://example.com -l

# Any bombardier command with passthrough
bombardier _ _ https://example.com -c 50 -n 1000
bombardier _ _ https://api.example.com -d 60s -r 200
```

## Key Features
- **Fast** - Written in Go for performance
- **Cross-platform** - Linux, macOS, Windows
- **Configurable** - Concurrency, rate, duration
- **Statistics** - Detailed response time stats
- **Latency** - Latency histograms
- **HTTP/HTTPS** - Supports both protocols
- **Methods** - GET, POST, PUT, DELETE, etc.
- **Headers** - Custom HTTP headers
- **Fasthttp** - Optional fasthttp mode
- **Reports** - JSON and text output formats

## Notes
- Default is GET requests
- Can test HTTP and HTTPS endpoints
- Useful for capacity planning
- Great for performance testing
- Shows percentiles (p50, p95, p99)
