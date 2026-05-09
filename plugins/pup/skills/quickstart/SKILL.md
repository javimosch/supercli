---
name: pup
description: Use this skill when the user wants to interact with Datadog — check monitors, search logs, query metrics, list incidents, manage dashboards, or access Datadog observability data.
---

# Datadog Pup Plugin

AI-agent-native CLI for Datadog observability. 200+ commands across 33+ Datadog products. Built by Datadog for agents.

## Prerequisites

Authentication is required. Two methods:
- **OAuth2**: `pup auth login` (opens browser, tokens stored in keychain)
- **API Keys**: Set `DD_API_KEY` and `DD_APP_KEY` environment variables

## Commands

### Auth
- `pup auth status` — Check authentication status

### Monitors
- `pup monitors list` — List monitors (optional: `--tags "env:prod"`)

### Logs
- `pup logs search --query "status:error"` — Search logs with query
- `pup logs search --query "service:api" --from "1h"` — Search logs with time range

### Metrics
- `pup metrics query --query "avg:system.cpu.user{*}"` — Query metrics

### Incidents
- `pup incidents list` — List Datadog incidents

### Dashboards
- `pup dashboards list` — List Datadog dashboards

### SLOs
- `pup slos list` — List Datadog SLOs

### Schema
- `pup schema get` — Get full machine-readable command schema

### Full Access
- `pup _ _` — Passthrough for any pup command

## Usage Examples
- "Check all Datadog monitors for production"
- "Search error logs from the last hour"
- "Query CPU metrics across all hosts"
- "List active incidents"
- "Show Datadog dashboard list"

## Installation

```bash
brew tap datadog-labs/pack
brew install datadog-labs/pack/pup
```

Then authenticate:
```bash
pup auth login
# or
export DD_API_KEY="..."
export DD_APP_KEY="..."
```

## Key Features
- **Built for AI agents**: Auto-detects agent mode, returns structured JSON
- **Self-discoverable**: Run `pup agent schema` for full command list
- **Wide coverage**: Monitors, logs, metrics, incidents, dashboards, SLOs, traces, security, RUM, APM, synthetics, and more
- **Structured output**: Default JSON, supports YAML and table formats
- **OAuth2 auth**: Secure browser-based login with auto-refresh
- **Embedded skills**: Ships AI agent skills for Claude Code, Cursor, OpenCode — `pup skills install`
