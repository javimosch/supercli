---
name: argc
description: Use this skill when the user wants to create or run Bash CLIs with argc annotations.
---

# argc Plugin

argc is a Bash CLI framework that turns bash scripts into full-featured command-line tools with help messages, argument validation, and shell completions.

## Commands

### Basic
- `argc self version` — Print argc version
- `argc help show` — Show argc help

### Script Execution
- `argc script run` — Run a bash script with argc annotations

### Shell Integration
- `argc completions generate` — Generate shell completions (bash/zsh/fish/powershell/elvish)

### Passthrough
- `argc _ _` — Pass raw arguments to argc binary

## Usage Examples

```bash
# Show argc help
sc argc help show --json

# Run a script with argc annotations
sc argc script run myscript.sh -- --help

# Generate bash completions
sc argc completions generate bash
```
