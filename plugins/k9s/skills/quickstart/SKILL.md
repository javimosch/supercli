# k9s Quickstart

k9s is a terminal-based UI for interacting with Kubernetes clusters.

## Prerequisites

- Kubernetes cluster access (configured in `~/.kube/config`)
- kubectl configured and working

## Basic Usage

```bash
# Start k9s (opens default view)
k9s

# Start with specific namespace
k9s -n kube-system

# Start in read-only mode
k9s --readonly
```

## Navigation

| Key | Action |
|-----|--------|
| `:` | Command mode (type resource name) |
| `/` | Filter resources |
| `d` | Describe resource |
| `l` | View logs |
| `e` | Edit resource |
| `s` | Shell into pod |
| `Ctrl-d` | Delete resource |
| `q` | Quit |

## Common Views

```bash
# View pods
k9s -c pod

# View deployments
k9s -c deployment

# View services
k9s -c service

# View nodes
k9s -c node
```

## Tips

- Press `?` for help within k9s
- Use `:q` to quit
- Resources are color-coded by status
- Real-time updates as cluster changes
