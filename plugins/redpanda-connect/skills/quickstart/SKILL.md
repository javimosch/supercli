---
name: redpanda-connect
description: Use this skill when the user wants to build, lint, or run YAML-defined ETL/streaming data pipelines (formerly Benthos) with Redpanda Connect.
---

# redpanda-connect Plugin

Redpanda Connect (formerly Benthos) runs declarative YAML pipelines: an `input`, a `pipeline` of `processors` (Bloblang mappings, filters, enrichments), and an `output`. 200+ connectors — Kafka, Redpanda, S3, Postgres, HTTP, websocket, file, stdin/stdout.

## Commands

- `redpanda-connect pipeline run <cfg>` — Run a pipeline (or read config from stdin)
- `redpanda-connect config lint <cfg>` — Validate config before running
- `redpanda-connect config create` — Print a template config to bootstrap
- `redpanda-connect components list [type]` — List inputs/outputs/processors/caches
- `redpanda-connect streams run` — Streams mode (dir of pipelines + REST admin API)
- `redpanda-connect _ _` — Passthrough (echo, blobl, test, template, etc.)

## Usage Examples

- "Lint this pipeline config"
- "List which inputs redpanda-connect supports"
- "Run this ETL config that copies Kafka to S3"
- "Give me a starter pipeline config"

## Installation

```bash
brew install redpanda-data/tap/redpanda-connect
# or: go install github.com/redpanda-data/connect/v4/cmd/redpanda-connect@latest
```

## Examples

```bash
# Minimal pipeline: stdin -> uppercase -> stdout
echo 'input: {stdin: {}}
pipeline:
  processors:
    - mapping: root = content().uppercase()
output: {stdout: {}}' | redpanda-connect run

# Lint before deploying
redpanda-connect lint ./pipeline.yaml

# Discover available connectors
redpanda-connect list inputs
redpanda-connect list processors

# Unit-test a config (test blocks embedded in the YAML)
redpanda-connect test ./pipeline.yaml
```

## Key Features

- One YAML file = input -> processors -> output; no code needed for most ETL
- Bloblang: powerful built-in mapping/query language for transforms
- `redpanda-connect test` runs embedded unit tests on configs
- Streams mode: hot-reload a directory of pipelines with a REST admin API
