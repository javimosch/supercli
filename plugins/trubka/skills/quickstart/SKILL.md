---
name: trubka
description: Use this skill when the user wants to cli tool for interacting with apache kafka.
---

# Trubka Plugin

CLI tool for interacting with Apache Kafka.

## Commands

### Operations
- `trubka topic list` — list topic via trubka
- `trubka topic create` — create topic via trubka
- `trubka topic delete` — delete topic via trubka
- `trubka topic describe` — describe topic via trubka
- `trubka produce send` — send produce via trubka
- `trubka consume receive` — receive consume via trubka
- `trubka group list` — list group via trubka
- `trubka brokers list` — list brokers via trubka
- `trubka schema list` — list schema via trubka

## Usage Examples
- "trubka --help"
- "trubka <args>"

## Installation

```bash
go install github.com/xitonix/trubka@latest
```

## Examples

```bash
trubka --version
trubka --help
```

## Key Features
- kafka\n- messaging\n- streaming
