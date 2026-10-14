# talosctl Plugin for SuperCLI

[talosctl](https://github.com/siderolabs/talos) is the CLI for Talos Linux —
an immutable, minimal OS purpose-built for Kubernetes. No SSH, no shell, no
package manager on the nodes: everything goes through a mutual-TLS gRPC API.

## Installation

```bash
brew install siderolabs/tap/talosctl
# or download talosctl-linux-amd64 from GitHub releases

# Install supercli plugin
supercli plugins install ./plugins/talosctl
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli talosctl self version` | Client/node versions |
| `supercli talosctl cluster health` | Wait for cluster health |
| `supercli talosctl cluster create` | Disposable local cluster |
| `supercli talosctl cluster kubeconfig` | Fetch admin kubeconfig |
| `supercli talosctl machine get` | OS-level resources |
| `supercli talosctl machine logs` | Service logs |
| `supercli talosctl machine apply-config` | Push machine config |
| `supercli talosctl <any>` | Passthrough to talosctl |

## Usage

```bash
# Disposable cluster in Docker
supercli talosctl cluster create --name test --workers 2
supercli talosctl cluster kubeconfig
supercli talosctl cluster health
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
