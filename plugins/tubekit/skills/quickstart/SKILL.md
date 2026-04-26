---
name: tubekit
description: Use this skill when the user wants to kubectl alternative with quick context switching.
---

# Tubekit Plugin

kubectl alternative with quick context switching.

## Commands

### Operations
- `tubekit context switch` — switch context via tk
- `tubekit pod list` — list pod via tk
- `tubekit deployment list` — list deployment via tk
- `tubekit service list` — list service via tk
- `tubekit namespace list` — list namespace via tk
- `tubekit secret list` — list secret via tk
- `tubekit configmap list` — list configmap via tk

## Usage Examples
- "tubekit --help"
- "tubekit <args>"

## Installation

```bash
go install github.com/reconquest/tubekit@latest
```

## Examples

```bash
tk --version
tk --help
```

## Key Features
- kubernetes\n- kubectl\n- context-switching
