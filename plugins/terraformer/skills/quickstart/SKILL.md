---
name: terraformer
description: Use this skill when the user wants to generate Terraform configs from existing cloud infrastructure, import AWS/GCP resources, or reverse-engineer IaC from live resources.
---

# terraformer Plugin

Generate Terraform files from existing infrastructure.

## Commands

### Import
- `terraformer import aws` — Import AWS resources into Terraform
- `terraformer import gcp` — Import GCP resources into Terraform
- `terraformer import github` — Import GitHub resources into Terraform

## Usage Examples
- "Import my AWS VPC and EC2 into Terraform"
- "Generate Terraform configs from GCP"
- "Import GitHub repositories into Terraform state"

## Installation

```bash
brew install terraformer
```

## Examples

```bash
# Import AWS resources
terraformer import aws --resources=vpc,ec2,sg --regions=us-east-1

# Import GCP resources
terraformer import gcp --resources=compute,storage --projects=my-project

# Import GitHub
terraformer import github --organizations=my-org --token=ghp_xxx

# List supported resources
terraformer import aws list
```
