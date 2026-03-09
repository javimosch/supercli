# Terraform Plugin Harness

This plugin integrates the Terraform CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Install Terraform with your preferred package manager, then verify it is available:

```bash
terraform version -json
```

If you plan to run state or output commands, ensure you are in a Terraform working directory with initialized state:

```bash
terraform init
```

## Available Commands

### CLI Version (Wrapped)

Returns Terraform CLI version information via `terraform version -json`.

```bash
dcli terraform cli version --json
```

### Full Passthrough

You can run any Terraform CLI command through the `terraform` namespace.

```bash
# Show outputs in JSON
dcli terraform output -json

# Show plan help
dcli terraform plan --help

# Show CLI help
dcli terraform --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
