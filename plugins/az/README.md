# Azure CLI Plugin Harness

This plugin integrates the Azure CLI (`az`) into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Install Azure CLI with your preferred package manager, then verify it is available:

```bash
az version
```

Authenticate before running account or resource commands:

```bash
az login
```

## Available Commands

### Account Show (Wrapped)

Returns the active Azure subscription via `az account show`.

```bash
dcli az account show --json
```

### Full Passthrough

You can run any Azure CLI command through the `az` namespace.

```bash
# List subscriptions
dcli az account list

# List resource groups
dcli az group list

# Show CLI help
dcli az --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
