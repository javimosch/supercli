---
name: rash
description: Use this skill when the user wants to write declarative shell scripts, container entrypoints, or YAML-based automation workflows inspired by Ansible.
---

# rash Plugin

Declarative shell scripting using Rust native bindings inspired by Ansible.

## Commands

### Script
- `rash script run` — Execute a rash declarative script (YAML)
- `rash script doc` — Show rash script documentation (docopt)

## Usage Examples
- "Run a declarative shell script"
- "Execute a rash YAML workflow"
- "Show documentation for a rash script"

## Installation

```bash
cargo install rash_core
```

## Examples

```bash
# Execute a rash script
rash script.yml

# Show script documentation
rash --doc script.yml

# With variables
rash -e "name=world" script.yml
```

## Key Features
- Declarative YAML syntax (Ansible-inspired)
- Single binary with no dependencies
- MiniJinja templating
- Built-in docopt CLI parsing
- Privilege escalation support
- Perfect for container entrypoints
