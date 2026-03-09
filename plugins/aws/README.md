# AWS CLI Plugin Harness

This plugin integrates the AWS CLI into dcli with one wrapped core command and full namespace passthrough.

## Prerequisites

Install AWS CLI with your preferred package manager, then verify it is available:

```bash
aws --version
```

Configure credentials before running account or service commands:

```bash
aws configure
```

## Available Commands

### Account Identity (Wrapped)

Returns the active caller identity via `aws sts get-caller-identity`.

```bash
dcli aws account identity --json
```

### Full Passthrough

You can run any AWS CLI command through the `aws` namespace.

```bash
# List S3 buckets
dcli aws s3api list-buckets

# List EC2 regions
dcli aws ec2 describe-regions

# Show CLI help
dcli aws --help
```

## Output

Wrapped commands and passthrough responses are returned in dcli envelope format when `--json` is used with dcli-level commands.
