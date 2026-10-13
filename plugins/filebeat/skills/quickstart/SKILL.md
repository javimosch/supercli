---
name: filebeat
description: Use this skill when the user wants to test, configure, or run the Filebeat log shipper, or manage its modules for parsing service logs to Elasticsearch/Logstash.
---

# Filebeat Plugin

Filebeat is the Elastic Beat for log shipping: it tails files and other inputs, enriches events with pluggable modules (nginx, system, kubernetes, mysql, 50+ more), and forwards to Elasticsearch, Logstash, Kafka, or Redis.

## Commands

### Validation
- `filebeat self version` — Version
- `filebeat test config` — Validate filebeat.yml syntax
- `filebeat test output` — Probe the configured output endpoint

### Modules & setup
- `filebeat modules list` — Modules and enabled state (`modules enable/disable <m>`)
- `filebeat export config` — Resolved config template
- `filebeat setup run` — Load dashboards, index templates, ILM into Kibana/ES
- `filebeat _ _` — Passthrough (`filebeat -e` runs in foreground with console logging)

## Usage Examples

- "Validate my filebeat.yml and test the Elasticsearch output"
- "Enable the nginx module and list enabled modules"
- "Run filebeat in the foreground to debug shipping"

## Installation

```bash
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.17.0-linux-x86_64.tar.gz
tar xzf filebeat-8.17.0-linux-x86_64.tar.gz
ln -sf $(pwd)/filebeat-8.17.0-linux-x86_64/filebeat ~/.local/bin/filebeat
# or via the Elastic apt/yum repository: apt install filebeat
```

## Examples

```bash
filebeat test config -c filebeat.yml -e
filebeat test output -c filebeat.yml
filebeat modules enable nginx system
filebeat setup --dashboards
filebeat -e -c filebeat.yml -d "publish"
```

## Key Features

- `test config`/`test output` give fast offline validation loops
- `-e` logs to stderr, `-d "<selectors>"` enables debug (e.g. `-d "harvester"`)
- Modules ship ingest pipelines + Kibana dashboards per service
- Inputs beyond files: journald, containerd, tcp/udp syslog, httpjson
