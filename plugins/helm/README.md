# Helm Plugin Harness

This plugin integrates the Helm CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Install Helm with your preferred package manager, then verify it is available:

```bash
helm version --short
```

If you plan to run cluster-backed commands, ensure your Kubernetes context is configured first.

## Available Commands

### CLI Version (Wrapped)

Returns Helm CLI version information via `helm version --short`.

```bash
dcli helm cli version --json
```

### Full Passthrough

You can run any Helm command through the `helm` namespace.

```bash
# List releases as JSON
dcli helm list --output json

# List configured repos as JSON
dcli helm repo list --output json

# Show CLI help
dcli helm --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
