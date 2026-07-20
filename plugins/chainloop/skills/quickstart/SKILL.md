---
name: chainloop
description: Use this skill when the user wants to manage software supply chain attestations — sign artifacts, record build provenance, verify SLSA compliance, or integrate attestation into CI/CD pipelines.
---

# chainloop Plugin

Software supply chain attestation and metadata framework. Record artifact integrity, build provenance, and compliance evidence for SLSA and related standards.

## Installation

```bash
curl -sSL https://raw.githubusercontent.com/chainloop-dev/chainloop/main/install.sh | sh
```

## Basic Usage

```bash
# Check CLI version
chainloop version

# Authenticate with a Chainloop server
chainloop auth login

# Initialize an attestation for a workflow
chainloop attestation init

# Add an artifact to the current attestation
chainloop attestation add --name my-artifact --value ./dist/app.tar.gz

# Push/finalize the attestation
chainloop attestation push
```

## Common Patterns

```bash
# List available workflows
chainloop workflow list

# Run attestation in CI (non-interactive)
chainloop attestation init --workflow my-workflow
chainloop attestation add --name binary --value ./build/output
chainloop attestation push --yes

# Verify an attestation
chainloop attestation verify --digest sha256:abc123...
```

## Usage Examples

- "Create a supply chain attestation for this build artifact"
- "Sign and record provenance for a Docker image in CI"
- "Verify the attestation on a released binary"

## SuperCLI

```bash
sc chainloop _ _ version
sc chainloop _ _ attestation init
sc plugins learn chainloop
```
