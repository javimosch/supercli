---
name: consul
description: Use this skill when working with consul via supercli.
---

# consul

Consul — service networking for service discovery and configuration

## Install

```bash
brew tap hashicorp/tap && brew install hashicorp/tap/consul
```

Verify installation:

```bash
which consul
```

## Commands

- `consul self version` — print consul version
- `consul cli run ...` — pass any arguments straight through to `consul`
