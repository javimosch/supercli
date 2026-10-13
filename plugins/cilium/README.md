# cilium Plugin for SuperCLI

[Cilium CLI](https://github.com/cilium/cilium-cli) installs, manages, and troubleshoots
[Cilium](https://cilium.io) — the eBPF-based CNI for Kubernetes providing networking,
observability (Hubble), and service mesh. The CLI works against your current kubeconfig
context.

## Installation

```bash
# Install cilium CLI (pick one)
CILIUM_CLI_VERSION=$(curl -s https://raw.githubusercontent.com/cilium/cilium-cli/main/stable.txt)
curl -L --remote-name-all https://github.com/cilium/cilium-cli/releases/download/${CILIUM_CLI_VERSION}/cilium-linux-amd64.tar.gz
tar xzvf cilium-linux-amd64.tar.gz && mv cilium ~/.local/bin/
# or: brew install cilium-cli

# Install supercli plugin
supercli plugins install ./plugins/cilium
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli cilium self version` | Show cilium CLI version |
| `supercli cilium cluster install` | Install Cilium on the current cluster |
| `supercli cilium status get` | Show deployment/agent status |
| `supercli cilium hubble enable` | Enable Hubble observability |
| `supercli cilium connectivity test` | Run connectivity test suite |
| `supercli cilium clustermesh status` | ClusterMesh status |
| `supercli cilium <any>` | Passthrough to cilium CLI |

## Usage

```bash
supercli cilium cluster install --version 1.16.5
supercli cilium status get --wait
supercli cilium connectivity test
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
