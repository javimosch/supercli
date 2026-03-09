# kubectl Plugin Harness

This plugin integrates the Kubernetes `kubectl` CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Install `kubectl` using your platform package manager, then verify it is available:

```bash
kubectl version --client
```

Ensure your kubeconfig is already configured for a cluster context:

```bash
kubectl config current-context
```

## Available Commands

### Current Context (Wrapped)

Returns the active Kubernetes context via `kubectl config current-context`.

```bash
dcli kubectl config current-context --json
```

### Full Passthrough

You can run any `kubectl` command through the `kubectl` namespace.

```bash
# List pods in the current namespace as JSON
dcli kubectl get pods -o json

# List namespaces as JSON
dcli kubectl get namespaces -o json

# Show CLI help
dcli kubectl --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
