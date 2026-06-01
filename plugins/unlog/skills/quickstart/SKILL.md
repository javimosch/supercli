# Unlog Plugin Quickstart

## Overview

Unlog is a fast CLI tool for log analysis that supports 11 different log formats, noise removal, fuzzy deduplication, and optional LLM-powered root cause analysis. The supercli unlog plugin provides convenient commands for log analysis with structured JSON output, making it ideal for automation and incident investigation.

## Installation

The unlog binary must be installed on your system:

```bash
# Via Go
go install github.com/oxforge/unlog@latest

# Or download from releases
# https://github.com/oxforge/unlog/releases
```

## Available Commands

### Analyze Log Directory

```bash
sc unlog analyze /var/log/app
```

Analyzes a log directory and returns results in JSON format.

### Analyze Single Log File

```bash
sc unlog analyze-file /var/log/app/error.log
```

Analyzes a single log file and returns results in JSON format.

### Analyze from Stdin

```bash
tail -f /var/log/app.log | sc unlog analyze-stdin
```

Analyzes logs piped from stdin and returns results in JSON format.

### Analyze with Log Level Filter

```bash
sc unlog analyze-level --level error /var/log/app
```

Analyzes logs with minimum log level filter (trace, debug, info, warn, error, fatal).

### Analyze with Time Range

```bash
sc unlog analyze-time-range --since "2h ago" --until "now" /var/log/app
```

Analyzes logs within a specific time range (supports ISO 8601 or relative times like "2h", "30m").

### Analyze with AI

```bash
sc unlog analyze-ai --provider openai /var/log/app
```

Analyzes logs with AI-powered root cause analysis (supports: openai, anthropic, gemini, ollama).

### Analyze with Verbose Output

```bash
sc unlog analyze-verbose /var/log/app
```

Analyzes logs with detailed output including per-filter drop counts.

### Generate Markdown Report

```bash
sc unlog analyze-markdown /var/log/app
```

Analyzes logs and outputs a Markdown report.

## Supported Log Formats

Unlog automatically detects and parses 11 different log formats:

- **JSON**: `{"level":"error","msg":"timeout","ts":"2024-01-15T10:00:00Z"}`
- **logfmt**: `ts=2024-01-15T10:00:00Z level=error msg="timeout"`
- **CSV**: `2024-01-15T10:00:00Z,ERROR,timeout,api`
- **Syslog RFC 3164**: `<131>Jan 15 10:00:00 app-1 myapp[1234]: ERROR timeout`
- **Syslog RFC 5424**: `<165>1 2024-01-15T10:00:00Z host app 1234 - - timeout`
- **Apache CLF**: `10.0.0.1 - - [15/Jan/2024:10:00:00 -0700] "GET /api HTTP/1.1" 500 789`
- **Docker JSON**: `{"log":"timeout\n","stream":"stderr","time":"2024-01-15T..."}`
- **Kubernetes**: `2024-01-15T10:00:00.000Z stderr F timeout`
- **CloudWatch**: `{"@timestamp":"2024-01-15T10:00:00Z","@message":"timeout"}`
- **Generic**: `2024-01-15 10:00:00 ERROR timeout`

## Output Format

JSON commands return structured output:

```json
{
  "summary": {
    "total_lines": 1000,
    "filtered_lines": 150,
    "error_count": 25
  },
  "patterns": [
    {
      "pattern": "timeout",
      "count": 15,
      "first_seen": "2024-01-15T10:00:00Z",
      "last_seen": "2024-01-15T10:05:00Z"
    }
  ],
  "errors": [
    {
      "timestamp": "2024-01-15T10:00:00Z",
      "level": "error",
      "message": "Connection timeout"
    }
  ]
}
```

## Use Cases

- **Incident investigation**: Quickly analyze logs during incidents
- **Monitoring scripts**: Integrate log analysis into monitoring systems
- **Automation**: Process logs in CI/CD pipelines
- **Root cause analysis**: Use AI-powered analysis to identify root causes
- **Log cleanup**: Identify noise and redundant log entries

## Caveats & Pitfalls

- **Log format detection**: Unlog auto-detects format, but mixed formats may require manual specification
- **AI provider requirements**: AI analysis requires API keys for the chosen provider
- **Large log files**: Processing very large log files may be memory-intensive
- **Time parsing**: Ensure timestamps are in recognized formats
- **Noise patterns**: Custom noise patterns may be needed for application-specific logs

## Examples

### Analyze application logs

```bash
sc unlog analyze /var/log/myapp
```

### Filter by error level

```bash
sc unlog analyze-level --level error /var/log/myapp
```

### Analyze recent logs

```bash
sc unlog analyze-time-range --since "1h ago" /var/log/myapp
```

### AI-powered analysis

```bash
sc unlog analyze-ai --provider openai /var/log/myapp
```

### Analyze Docker logs

```bash
docker logs myapp 2>&1 | sc unlog analyze-stdin
```

### Generate incident report

```bash
sc unlog analyze-markdown --since "2h ago" /var/log/myapp > incident-report.md
```

### Analyze with custom noise file

```bash
sc unlog analyze --noise-file /etc/unlog/noise-patterns.txt /var/log/myapp
```