---
name: pepe
description: Use this skill when the user wants to run HTTP load tests, benchmark endpoints, or generate traffic against a URL with configurable concurrency and request counts.
---

# pepe Plugin

HTTP load generator written in Rust. Send simple or advanced HTTP requests with configurable concurrency, timeouts, headers, and curl command parsing support.

## Commands

### Load Testing
- `pepe load test` — Run HTTP load test against a target URL

### Utility
- `pepe self version` — Print pepe version
- `pepe _ _` — Passthrough to pepe CLI

## Usage Examples
- "Load test https://example.com with 1000 requests"
- "Benchmark my API with 50 concurrent connections"
- "Run a POST load test with custom headers"
- "Convert a curl command into a load test"
- "Test my server with a 10-second timeout"

## Installation

```bash
curl --proto '=https' --tlsv1.2 -sSf https://pepe.mhaimdat.com/install.sh | bash
```

## Examples

```bash
# Simple GET load test (default: 200 requests, 50 concurrent, 2s timeout)
pepe load test https://example.com

# Send 1000 requests with 20 concurrent connections
pepe load test https://example.com -n 1000 -c 20

# Set a 10-second timeout
pepe load test https://example.com -n 500 -c 10 -t 10

# POST request with custom headers
pepe load test https://api.example.com/data -n 100 -c 5 -m POST -H "Content-Type: application/json" -H "Authorization: Bearer token"

# Custom User-Agent
pepe load test https://example.com -n 200 -u "Mozilla/5.0"

# Parse a curl command and run it as a load test
pepe load test -n 1000 -c 10 --curl -- curl -X POST 'https://httpbin.org/post' -H 'Content-Type: application/json' -d '{"key": "value"}'
```

## Key Features
- **Simple syntax**: `pepe <url>` for quick tests
- **Concurrent connections**: `-c` flag for parallelism
- **Request count**: `-n` flag for total requests
- **Timeout control**: `-t` flag for per-request timeout
- **Custom headers**: `-H` flag (repeatable)
- **HTTP methods**: `-m` flag for GET, POST, PUT, DELETE, etc.
- **User-Agent**: `-u` flag for custom user agents
- **Curl parsing**: `--curl` flag to parse and convert curl commands
- **Rust-powered**: Fast and efficient HTTP benchmarking

## Notes
- Default settings: 200 requests, 50 concurrent connections, 2-second timeout
- The `--curl` flag requires `--` before the actual curl command
- Does not require curl to be installed when using the `--curl` feature
- Results include latency percentiles and throughput metrics
