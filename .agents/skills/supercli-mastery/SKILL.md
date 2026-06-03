---
name: supercli-mastery
description: Master the supercli capability router. Covers the full agent workflow — discover plugins, inspect commands, preview with plan, execute safely, use skills, interpret output and exit codes.
---

# supercli-mastery — Agent's Guide to SuperCLI

## What SuperCLI Is

SuperCLI is a **capability router**. It wraps external CLIs (plugins) behind a uniform `namespace.resource.action` command model. Every command follows the same pattern:

```
sc <namespace> <resource> <action> --<arg> <value> --json
```

The workflow is: `discover → learn → inspect → plan → execute`

## Core Capabilities

| Capability | Description |
|---|---|
| `commands` | Query available commands |
| `plugins` | Plugin management and discovery |
| `skills` | Agent-facing skill documents |
| `inspect` | View command schema |
| `plan` | Preview execution steps before running |
| `ask` | LLM suggests which commands to run (no execution) |
| `mcp` | Model Context Protocol adapter |

## Output Conventions

All commands return JSON when `--json` is used (or by default in non-TTY):

```
sc <ns> <res> <act> --json
→ { "version": "1.0", "command": "ns.res.act", "data": {...} }
```

- **stdout**: Primary data (JSON envelope)
- **stderr**: Progress events, warnings, structured errors
- **Exit code 0**: Success

## Semantic Exit Codes

| Code | Meaning | Agent action |
|---|---|---|
| 0 | Success | Proceed |
| 82 | Validation error | Fix input arguments |
| 85 | Invalid argument | Fix the args, don't retry |
| 91 | Safety violation | Non-TTY interactive command blocked |
| 92 | Resource not found | Use different ID/name |
| 105 | Integration / API error | Retry with backoff (transient) |
| 110 | Internal error | Report bug, don't retry |

> Range convention (Square-style): 80-89 input errors, 90-99 resource errors,
> 100-109 integration errors, 110-119 internal errors. Currently implemented
> codes listed above; unused slots reserved for future granularity.

## Agent Workflow

### 1. Discover — Find what's available

```
sc --json
# → lists first_steps with {command, purpose} pairs

sc commands --query backup --limit 50 --json
# → { commands: [{ namespace, resource, action, description }] }

sc plugins explore --name <tool> --json
# → { plugins: [{ name, description, tags, installed }] }
```

### 2. Learn — Understand a plugin

```
sc plugins learn <name> --json
# → plugin metadata, commands, install guidance

sc skills get <name> --json
# → agent-facing SKILL.md content for that tool
```

### 3. Inspect — See a command's schema before using it

```
sc inspect <namespace> <resource> <action> --json
# → { namespace, resource, action, args: [{name, type, required, positional}], adapterConfig }
```

Inspect tells you:
- Which `--flags` are required vs optional
- Which args are positional (marked `"positional": true`)
- The adapter type (process, http, mcp, shell)
- Timeout and safety settings

### 4. Plan — Preview before executing mutations

```
sc plan <namespace> <resource> <action> --<args> --json
# → { plan_id, command, steps, risk_level, side_effects, persisted }
```

`plan` does NOT execute — it returns a plan document showing:
- The 4 execution steps (resolve → validate → adapter → transform)
- `risk_level`: "safe" for reads, "medium" for mutations
- `side_effects`: true for write operations

Use plan before any command that modifies state.

### 5. Execute — Run commands

```
# Direct execution (no server)
sc <namespace> <resource> <action> --<arg> <value> --json

# Or via persisted plan (with SUPERCLI_SERVER)
sc plan <ns> <res> <act> --<args> --json
sc execute <plan_id> --json
```

### Ask — LLM suggests a plan

```
sc ask "send an email to user@example.com"
# → { mode: "ask_suggest", suggested_steps: [{ command, args, dry_run }] }
```

`ask` uses an LLM to map natural language to supercli commands. It NEVER executes — returns suggestions with `dry_run` strings you can choose to run.

## Working with Output

Always use `--json` for machine-readable output:

```bash
# Pipe to jq for extraction
sc commands --query backup --json | jq '.commands[].namespace'

# Chain commands
sc easyredmine issue search "correction" --current-month | \
  jq -r '.results[].id' | \
  xargs -I {} sc easyredmine issue show {} --json
```

Error responses are always on stderr:

```
sc nonexistent command --json
# stderr: {"error":{"code":92,"type":"resource_not_found","message":"...","recoverable":false,"suggestions":["Run: supercli commands"]}}
```

## Token Optimization

For large outputs (50+ files, long command results), use context-mode:

```
sc mcp call --mcp-server context-mode --tool ctx_batch_execute --input-json '...' --json
```

See `sc skills get context-mode:quickstart --json` for context-mode usage.

## Skills System

Skills are agent-facing documents that teach you how to use tools:

```
sc skills sync --json                    # index all skills
sc skills list --catalog --limit 10      # browse
sc skills search --query <topic>         # find by topic
sc skills get <id>                       # read a skill
```

Skills come from:
- **plugin_fs**: Bundled with supercli plugins (`plugins/<name>/skills/quickstart/SKILL.md`)
- **local_fs**: From provider-scanned directories (e.g. `~/.config/opencode/skills/`)
- **supercli**: Built-in skills shipped with the supercli package itself

## Navigation Pattern

When you don't know a command's namespace:

```
# 1. Browse capabilities
sc --json

# 2. Search commands
sc commands --query <keyword> --json

# 3. Inspect the most promising match
sc inspect <ns> <res> <act> --json

# 4. Plan if it's a write operation
sc plan <ns> <res> <act> --args

# 5. Execute
sc <ns> <res> <act> --args --json
```

## Key Principles

1. **`--json` everywhere** — all commands support it
2. **Plan before write** — use `plan` for any command that might have side effects
3. **Inspect before run** — check `args` and `positional` markers in inspect output
4. **Errors are structured** — always on stderr with `code`, `type`, `recoverable`, `suggestions`
5. **Skills teach you** — if you don't know a tool, `sc skills search --query <tool>`
6. **Exit codes drive decisions** — 85=fix args, 92=try different resource, 105=retry
