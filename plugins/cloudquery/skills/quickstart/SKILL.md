---
name: cloudquery
description: Use this skill when the user wants to sync cloud infrastructure configuration (AWS, GCP, Azure, Kubernetes, SaaS) into a database and query it with SQL for security audits, cost analysis, or asset inventory.
---

# cloudquery Plugin

CloudQuery is an open-source cloud asset inventory tool. It extracts configuration data from 70+ sources (AWS, GCP, Azure, Kubernetes, Okta, GitHub, ...) and loads it into destinations like Postgres, SQLite, Snowflake, or BigQuery — turning "what do we run where" into SQL queries.

## Commands

- `cloudquery sync run` — Run a sync from spec file(s) or directory
- `cloudquery login open` — Authenticate with CloudQuery Cloud (browser)
- `cloudquery plugin docs` — Show plugin docs: tables, columns, config
- `cloudquery _ _` — Passthrough to cloudquery CLI

## Usage Examples

- "Sync my AWS account into Postgres so I can query EC2 instances"
- "Inventory all public S3 buckets across our cloud accounts"
- "What tables does the cloudquery AWS plugin produce?"

## Installation

```bash
brew install cloudquery/tap/cloudquery
# or download binary from https://github.com/cloudquery/cloudquery/releases
cloudquery login   # required for most source plugins since v6
```

## Examples

```bash
# Minimal SQLite spec pair — source-aws.yml + destination-sqlite.yml
# kind: source, spec.name: aws, spec.path: cloudquery/aws
# kind: destination, spec.name: sqlite, spec.path: cloudquery/sqlite,
#   spec.connection_string: ./db.sql
cloudquery sync ./specs/

# Inspect a plugin's tables and columns without syncing
cloudquery plugin docs cloudquery/aws

# Sync with verbose logging
cloudquery sync source.yml dest.yml --log-level debug
```

## Key Features

- SQL-first CSPM: joins across clouds in one query
- Incremental syncs, state tracking, deterministic table schemas
- Plugin architecture — sources and destinations are versioned separately
- Free tier covers community plugins; premium sources need `cloudquery login`
- Destinations: postgresql, sqlite, mysql, bigquery, snowflake, s3, kafka, and more
