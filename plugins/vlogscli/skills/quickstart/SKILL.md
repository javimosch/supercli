---
name: vlogscli
description: Use this skill when the user wants to query a VictoriaLogs datasource with LogsQL, interactively or by piping one-shot queries for scripts and agents.
---

# vlogscli Plugin

vlogscli is the official query CLI for VictoriaLogs. Pointed at a `-datasource.url`, it runs an interactive pager with LogsQL autocomplete — or reads queries from stdin for non-interactive use, which makes it a natural fit for scripts and AI agents. Uses single-dash Go flags.

## Commands

### Introspection
- `vlogscli self version` — Version (`vlogscli -version`)

### Querying
- `vlogscli query run` — Passthrough: set `-datasource.url` and pipe LogsQL via stdin
- `vlogscli _ _` — Passthrough for any flag

## Usage Examples

- "Query VictoriaLogs for errors in the last hour"
- "Count log entries grouped by level"
- "Tail new entries matching a LogsQL filter"

## Installation

```bash
go install github.com/VictoriaMetrics/VictoriaLogs/app/vlogscli@latest
# or grab vlogscli-linux-amd64 assets from
# github.com/VictoriaMetrics/VictoriaLogs/releases
```

## Examples

```bash
vlogscli -version

# Interactive
vlogscli -datasource.url=http://localhost:9428

# One-shot: pipe LogsQL via stdin
echo '_time:1h error' | vlogscli -datasource.url=http://localhost:9428

# Field filtering + stats
echo '_time:30m | stats by (level) count()' | vlogscli -datasource.url=http://localhost:9428

# Authenticated datasource
vlogscli -datasource.url=https://vlogs.example.com -bearerToken=$TOKEN
```

## Key Features

- Full LogsQL: filters, pipes (extract, stats, sort, union), regex, time ranges
- Non-interactive stdin mode → clean output for agents/scripts
- Interactive mode: pager, syntax highlight, query history, live tail (`| live`)
- Auth flags: `-bearerToken`, `-username`/`-password`, TLS flags
