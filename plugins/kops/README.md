# kops Plugin for SuperCLI

[kOps](https://github.com/kubernetes/kops) (Kubernetes Operations) is the Kubernetes
project's official tool for creating, upgrading, and managing production-grade clusters
on AWS, GCE, Azure, Hetzner, and other clouds. Desired state lives in a remote
state store (`KOPS_STATE_STORE`).

## Installation

```bash
# Install kops binary (pick one)
curl -Lo kops https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-linux-amd64
chmod +x kops && mv kops ~/.local/bin/
# or: brew install kops

# Install supercli plugin
supercli plugins install ./plugins/kops
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli kops self version` | Show kops version |
| `supercli kops cluster list` | List clusters in state store |
| `supercli kops cluster create` | Create cluster config |
| `supercli kops cluster update` | Preview/apply infra changes |
| `supercli kops cluster delete` | Delete a cluster |
| `supercli kops cluster validate` | Validate cluster health |
| `supercli kops cluster rolling-update` | Roll out node changes |
| `supercli kops kubeconfig export` | Export kubeconfig |
| `supercli kops <any>` | Passthrough to kops CLI |

## Usage

```bash
export KOPS_STATE_STORE=s3://my-state
supercli kops cluster create --name=dev.example.com --zones=us-east-1a
supercli kops cluster update --name dev.example.com --yes
supercli kops cluster validate --wait 10m
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
