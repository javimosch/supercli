---
name: nomad
description: Use this skill when working with nomad via supercli.
---

# nomad

Nomad — workload orchestrator across datacenters

## Install

```bash
brew tap hashicorp/tap && brew install hashicorp/tap/nomad
```

Verify installation:

```bash
which nomad
```

## Commands

- `nomad self version` — print nomad version
- `nomad cli run ...` — pass any arguments straight through to `nomad`
