---
name: hermit
description: Use this skill when the user needs per-project, isolated CLI tool versions — pin kubectl, terraform, or other binaries per repo so teams and CI share identical toolchains.
---

# hermit Plugin

Per-project tool manager from Cash App. Each repo gets its own isolated set of CLI tools with pinned versions, activated automatically when you `cd` into the project.

## Installation

```bash
curl -fsSL https://github.com/cashapp/hermit/releases/download/stable/get-hermit.sh | sh
```

## Basic Usage

```bash
# Initialize hermit in a project
hermit init

# Install a tool into the project
hermit install kubectl
hermit install terraform

# List installed tools
hermit list

# Run a hermit-managed binary
hermit kubectl version
```

Hermit stores binaries in `bin/` and auto-activates via shell hooks when entering the directory.

## Usage Examples

- "Pin kubectl and terraform versions for this repo"
- "Initialize hermit in my project"
- "List all hermit-managed tools in this directory"

## SuperCLI

```bash
sc hermit env init
sc hermit binary install kubectl
sc plugins learn hermit
```
