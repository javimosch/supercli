# terramate Plugin for SuperCLI

[Terramate](https://github.com/terramate-io/terramate) orchestrates Infrastructure as Code:
it organizes Terraform/OpenTofu/Terragrunt into stacks, runs commands only on stacks that
changed in git, generates shared code from `generate_*` blocks, and optionally syncs to
Terramate Cloud for drift detection.

## Installation

```bash
# Install terramate (pick one)
go install github.com/terramate-io/terramate/cmd/...@latest
# or: brew install terramate

# Install supercli plugin
supercli plugins install ./plugins/terramate
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli terramate self version` | Show terramate version |
| `supercli terramate stack create` | Create a new stack |
| `supercli terramate stack list` | List stacks (`--changed`) |
| `supercli terramate run exec` | Run command per stack |
| `supercli terramate generate run` | Generate code from generate_* blocks |
| `supercli terramate fmt run` | Format Terramate config |
| `supercli terramate script run` | Run a Terramate Script |
| `supercli terramate <any>` | Passthrough to terramate CLI |

## Usage

```bash
supercli terramate stack list -- --changed
supercli terramate run exec -- --changed -- terraform plan
supercli terramate generate run
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
