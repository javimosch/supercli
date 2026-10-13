---
name: promtail
description: Use this skill when the user wants to validate a promtail config, dry-run a Loki log-shipping agent, or forward local logs to Grafana Loki.
---

# Promtail Plugin

Promtail is the log shipping agent for Grafana Loki. It discovers targets (files, systemd journal, syslog, docker), applies relabeling and pipeline stages, and pushes entries to Loki. Uses single-dash Go-style flags (`-config.file`, not `--config.file`).

## Commands

### Introspection
- `promtail self version` — Version (runs `promtail -version`)
- `promtail config print` — Resolved config to stderr (`-print-config-stderr`)
- `promtail config dryrun` — `-dry-run`: parse config, list matched files/targets, exit

### Agent
- `promtail agent run` — Run the agent; pass `-config.file <path>` via passthrough
- `promtail _ _` — Passthrough for any flag

## Usage Examples

- "Dry-run my promtail config and show which log files it picks up"
- "Print the effective promtail config"
- "Start promtail with config.yaml and the journal target"

## Installation

```bash
curl -O -L https://github.com/grafana/loki/releases/latest/download/promtail-linux-amd64.zip
unzip promtail-linux-amd64.zip
chmod +x promtail-linux-amd64 && mv promtail-linux-amd64 ~/.local/bin/promtail
```

## Examples

```bash
promtail -version
promtail -config.file promtail.yaml -dry-run -inspect
promtail -config.file promtail.yaml -log.level debug
promtail -config.file promtail.yaml -server.http.listen-port 9080 &
```

## Key Features

- `-dry-run` + `-inspect` shows discovered targets and sample parsed entries — validate before shipping
- Pipeline stages: regex, json, logfmt, multiline, labels, metrics
- Targets: static files, journald, syslog, kubernetes, docker, GCP/AWS
- Positions file tracks read offsets so restarts resume without reshipping
