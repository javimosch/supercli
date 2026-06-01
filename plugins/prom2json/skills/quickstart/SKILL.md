# Prom2json Plugin Quickstart

## Overview

Prom2json is a Prometheus tool that scrapes metrics endpoints and converts them from text or protocol buffer format to JSON. The supercli prom2json plugin provides convenient commands for converting Prometheus metrics to structured JSON, making it ideal for parsing and processing in scripts.

## Installation

The prom2json binary must be installed on your system:

```bash
# Via Go
go install github.com/prometheus/prom2json/cmd/prom2json@latest

# Or download from releases
# https://github.com/prometheus/prom2json/releases
```

## Available Commands

### Convert Metrics URL to JSON

```bash
sc prom2json convert http://localhost:9090/metrics
```

Scrapes a Prometheus metrics endpoint and converts to JSON format.

### Convert Metrics File to JSON

```bash
sc prom2json convert-file /path/to/metrics.prom
```

Converts a Prometheus metrics file to JSON format.

### Convert from Stdin

```bash
curl http://localhost:9090/metrics | sc prom2json convert-stdin
```

Converts Prometheus metrics piped from stdin to JSON format.

### Convert with TLS Client Authentication

```bash
sc prom2json convert-tls --cert /path/to/cert.pem --key /path/to/key.pem https://metrics.example.com/metrics
```

Converts HTTPS metrics endpoint using TLS client authentication.

### Convert without TLS Validation (Testing Only)

```bash
sc prom2json convert-insecure https://metrics.example.com/metrics
```

Converts HTTPS metrics endpoint without TLS validation (for testing only).

### Convert with UTF-8 Escaping

```bash
sc prom2json convert-utf8 http://localhost:9090/metrics
```

Converts metrics with UTF-8 character escaping scheme.

## Output Format

All commands return structured JSON output:

```json
[
  {
    "name": "http_requests_total",
    "help": "Total number of HTTP requests",
    "type": "counter",
    "metrics": [
      {
        "labels": {
          "method": "GET",
          "status": "200"
        },
        "value": "1024"
      }
    ]
  }
]
```

## Use Cases

- **Metrics parsing**: Convert Prometheus metrics to JSON for easier processing
- **Monitoring scripts**: Integrate metrics collection into monitoring systems
- **Data analysis**: Parse and analyze Prometheus metrics data
- **Automation**: Process metrics in CI/CD pipelines
- **API integration**: Convert metrics for consumption by other tools

## Caveats & Pitfalls

- **Network connectivity**: Requires network access to metrics endpoints
- **TLS security**: Avoid using `--accept-invalid-cert` in production
- **Large metrics sets**: Large metrics endpoints may produce significant JSON output
- **Metrics format**: Input must be valid Prometheus metrics format
- **Rate limiting**: Some metrics endpoints may rate limit frequent requests

## Examples

### Scrape local Prometheus metrics

```bash
sc prom2json convert http://localhost:9090/metrics
```

### Convert metrics file

```bash
sc prom2json convert-file /var/lib/prometheus/metrics.prom
```

### Pipe from curl

```bash
curl http://localhost:9090/metrics | sc prom2json convert-stdin
```

### Convert HTTPS metrics with authentication

```bash
sc prom2json convert-tls --cert /etc/ssl/certs/client.pem --key /etc/ssl/private/client.key https://secure-metrics.example.com/metrics
```

### Process metrics with jq

```bash
sc prom2json convert http://localhost:9090/metrics | jq '.[] | select(.name == "http_requests_total")'
```

### Filter specific metric

```bash
sc prom2json convert http://localhost:9090/metrics | jq '.[] | select(.name | contains("cpu"))'
```