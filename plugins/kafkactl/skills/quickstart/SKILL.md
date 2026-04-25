---
name: kafkactl
description: Use this skill when the user wants to manage Kafka clusters, topics, consumers, or produce/consume messages from the command line.
---

# kafkactl Plugin

A command-line interface for Apache Kafka. Manage Kafka clusters, topics, consumers, and messages from the command line.

## Commands

### Topic Management
- `kafkactl topic list` — List Kafka topics
- `kafkactl topic describe` — Describe Kafka topic

### Consumer Management
- `kafkactl consumer list` — List consumer groups

### Utility
- `kafkactl _ _` — Passthrough to kafkactl CLI

## Usage Examples
- "List Kafka topics"
- "Describe Kafka topic"
- "List consumer groups"
- "Manage Kafka from CLI"

## Installation

```bash
brew install kafkactl
```

Or via Go:
```bash
go install github.com/deviceinsight/kafkactl/cmd/kafkactl@latest
```

## Examples

```bash
# List topics
kafkactl get topics

# Describe topic
kafkactl describe topic my-topic

# List consumer groups
kafkactl get consumer-groups

# Produce message
kafkactl produce my-topic --value "hello"

# Consume messages
kafkactl consume my-topic

# Any kafkactl command with passthrough
kafkactl _ _ get topics
kafkactl _ _ describe topic test
kafkactl _ _ get consumer-groups
```

## Key Features
- **Topics** - Topic management
- **Consumers** - Consumer groups
- **Produce** - Message production
- **Consume** - Message consumption
- **Clusters** - Cluster management
- **Kafka** - Apache Kafka
- **CLI** - Command line native
- **Config** - Configuration support
- **Avro** - Avro support
- **DevOps** - DevOps workflows

## Notes
- Requires Kafka cluster
- Supports multiple clusters
- Great for Kafka operations
- Supports Avro schemas
