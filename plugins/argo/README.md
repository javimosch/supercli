# argo Plugin for SuperCLI

The [Argo CLI](https://github.com/argoproj/argo-workflows) submits, watches, and manages
container-native workflows on Kubernetes via Argo Workflows: Workflows, WorkflowTemplates,
CronWorkflows, and ClusterWorkflowTemplates, all from the terminal using your kubeconfig.

## Installation

```bash
# Install argo binary (pick one)
curl -sLO https://github.com/argoproj/argo-workflows/releases/latest/download/argo-linux-amd64.gz
gunzip argo-linux-amd64.gz && chmod +x argo-linux-amd64 && mv argo-linux-amd64 ~/.local/bin/argo
# or: brew install argo

# Install supercli plugin
supercli plugins install ./plugins/argo
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli argo self version` | Show argo version |
| `supercli argo workflow submit` | Submit a workflow YAML |
| `supercli argo workflow list` | List workflows |
| `supercli argo workflow get` | Show workflow status |
| `supercli argo workflow logs` | Stream workflow logs |
| `supercli argo workflow watch` | Watch until completion |
| `supercli argo workflow retry` | Retry a failed workflow |
| `supercli argo workflow delete` | Delete workflows |
| `supercli argo template list` | List WorkflowTemplates |
| `supercli argo cron list` | List CronWorkflows |
| `supercli argo <any>` | Passthrough to argo CLI |

## Usage

```bash
supercli argo workflow submit -- -n argo --watch myworkflow.yaml
supercli argo workflow list -- --all-namespaces
supercli argo workflow logs -- my-workflow-abc -f
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
