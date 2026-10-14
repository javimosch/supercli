---
name: rpk
description: Use this skill when the user wants to administer or interact with a Kafka-compatible cluster — create/list topics, produce/consume records, check consumer groups and cluster health using the Redpanda CLI.
---

# rpk Plugin

`rpk` is Redpanda's all-in-one CLI. It speaks the Kafka protocol, so it works against Redpanda, Apache Kafka, and Redpanda Cloud: topic and ACL management, consumer group inspection, record produce/consume, schema registry, and even bootstrapping a local broker.

## Commands

- `rpk cluster info` — Brokers, controller, versions
- `rpk cluster health` — Under-replicated/offline partitions
- `rpk topic create` — Create topic (`-p` partitions, `-r` replicas)
- `rpk topic list` — List topics
- `rpk topic produce` — Produce records (args or stdin)
- `rpk topic consume` — Consume records (`-o` offset, `-g` group, `-n` count)
- `rpk _ _` — Passthrough to rpk CLI (group, acl, registry, profile, ...)

## Usage Examples

- "Create a topic events with 6 partitions on my cluster"
- "Consume the last 10 messages from the orders topic"
- "Check consumer group lag for my pipeline"

## Installation

```bash
brew install redpanda-data/tap/redpanda
# or download rpk-*-linux-amd64.zip from GitHub releases
rpk version
```

## Examples

```bash
# Local playground broker (dev mode, no zookeeper/kraft config)
rpk redpanda start --dev-mode

# Target a remote cluster
rpk -X brokers=kafka.example.com:9092 cluster info

# Produce and consume
rpk topic produce events -k user42 -v '{"action":"login"}'
rpk topic consume events -o start -n 10

# Consumer group lag
rpk group describe my-consumer-group
```

## Key Features

- One binary replaces kafka-topics.sh, kafka-console-producer.sh, etc.
- `-X` flags or `rpk profile` for brokers/TLS/SASL config
- `rpk transform` deploys WASM data transforms in-cluster
- `rpk registry` manages Schema Registry subjects and compatibility
- `--format json` on most commands for agent pipelines
