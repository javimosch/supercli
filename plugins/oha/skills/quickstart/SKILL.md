---
name: oha
description: Use this skill when the user wants to benchmark HTTP endpoints, run load tests, or measure web server performance.
---

# oha Plugin

HTTP load generator inspired by rakyll/hey.

## Commands

### Load
- `oha load test` — Run HTTP load test against a URL

## Usage Examples
- "Benchmark an HTTP endpoint"
- "Load test my API"
- "Measure server response times"

## Installation

```bash
cargo install oha
```

## Examples

```bash
# Basic load test with 200 concurrent connections
oha -n 10000 -c 200 https://example.com

# With JSON output
oha -n 1000 --json https://api.example.com/health

# With specific HTTP method and headers
oha -n 500 -m POST -H "Content-Type: application/json" -d '{"key":"value"}' https://api.example.com/data
```

## Key Features
- High-performance HTTP benchmarking
- Real-time TUI and JSON output modes
- Support for HTTP/1.1 and HTTP/2
- Custom headers, methods, and body data
- Connection pooling and keep-alive
