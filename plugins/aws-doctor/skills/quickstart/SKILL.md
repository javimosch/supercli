# AWS Doctor Plugin Quickstart

## Commands
- `aws-doctor <resource> <action>` — Execute aws-doctor commands
- `aws-doctor version` — Display aws-doctor version
- `aws-doctor scan` — Scan AWS resources for security, cost, and best practice issues
- `aws-doctor report` — Generate a detailed report of AWS resource analysis
- `aws-doctor audit` — Perform a comprehensive AWS audit

## Overview
The `aws-doctor` plugin provides commands to audit AWS resources for security vulnerabilities, cost optimization opportunities, and best practice compliance.

## Available Commands

### version
Display the installed aws-doctor version.
```bash
aws-doctor version
```

### scan
Scan AWS resources for issues.
```bash
aws-doctor scan [options]
```
Common options:
- `--profile <name>` - AWS profile to use
- `--region <region>` - AWS region to scan
- `--output <format>` - Output format (json, yaml, table)

### report
Generate a detailed analysis report.
```bash
aws-doctor report [options]
```

### audit
Perform a comprehensive AWS audit.
```bash
aws-doctor audit [options]
```

## Prerequisites
- AWS credentials configured via `aws configure`
- Valid AWS account with appropriate permissions

## Examples

Scan with a specific AWS profile:
```
aws-doctor scan --profile production --region us-east-1
```

Generate an audit report:
```
aws-doctor audit --output json > audit-report.json
```
