---
name: komiser
description: Use this skill when the user wants cloud cost visibility and resource inventory across AWS, GCP, Azure, or OCI — dashboards, spend tracking, and optimization insights.
---

# komiser Plugin

Open-source cloud cost management tool. Scans cloud accounts, builds a resource inventory, and surfaces cost dashboards with anomaly detection. Supports AWS, GCP, Azure, and Oracle Cloud.

## Installation

```bash
brew install komiser
# or download from https://github.com/tailwarden/komiser/releases
```

## Basic Usage

```bash
# Start the Komiser server (web UI on port 3000 by default)
komiser start

# Check version
komiser version
```

## Configuration

Set cloud provider credentials via environment variables or a config file before starting:

- **AWS**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
- **GCP**: service account JSON via `GOOGLE_APPLICATION_CREDENTIALS`
- **Azure**: `AZURE_SUBSCRIPTION_ID`, tenant/client credentials

See [Komiser docs](https://docs.komiser.io/) for multi-account setup.

## Usage Examples

- "Show me AWS spend across all accounts"
- "Inventory unused cloud resources"
- "Start Komiser to audit GCP costs"

## SuperCLI

```bash
sc komiser _ _
sc plugins learn komiser
```
