---
name: zlsgo
description: Use this skill when the user wants to perform HTTP load testing, benchmark web applications, or test API performance from the command line.
---

# zlsgo Plugin

A fast, simple, and powerful HTTP load testing tool. Perform load testing and benchmarking for web applications from the command line.

## Commands

### Load Testing
- `zlsgo test run` — Run load test

### Utility
- `zlsgo _ _` — Passthrough to zlsgo CLI

## Usage Examples
- "Run load test"
- "Benchmark API"
- "Test HTTP performance"
- "Load test website"

## Installation

```bash
brew install zlsgo
```

Or via Go:
```bash
go install github.com/sohaha/zlsgo/cmd/zls@latest
```

## Examples

```bash
# Run load test
zls run --url https://example.com

# With concurrency
zls run --url https://example.com --c 10

# With number of requests
zls run --url https://example.com --n 1000

# With duration
zls run --url https://example.com --duration 30s

# Any zls command with passthrough
zls _ _ run --url https://api.example.com
zls _ _ run --url https://example.com --c 50 --n 10000
zls _ _ run --url https://example.com --duration 60s
```

## Key Features
- **Fast** - High performance
- **Simple** - Simple interface
- **Load** - Load testing
- **Benchmark** - Benchmarking
- **HTTP** - HTTP testing
- **API** - API testing
- **Stats** - Statistics
- **Charts** - Result visualization
- **CLI** - Command line native
- **Testing** - Performance testing

## Notes
- Fast and efficient
- Real-time statistics
- Great for API testing
- Supports various HTTP methods
