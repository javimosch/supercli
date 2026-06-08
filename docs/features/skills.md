# Skill Documents (SKILL.md)

supercli includes a SKILL.md teaching/catalog system for local LLMs and agents. Skill documents are instruction artifacts that teach AI agents how to use specific tools or the supercli system as a whole.

**Terminology:**
- **Capability**: executable command endpoint (commands, MCP tool bindings, OpenAPI-backed operations, workflows).
- **Skill document**: instruction artifact returned by `supercli skills ...` commands. These are Markdown files compatible with Anthropic/OpenAI instruction formats.

## Key Features

- **Bootstrapping Skill Docs (`teach`)**: Emits a meta-skill document (Markdown compatible with Anthropic/OpenAI instructions) describing SuperCLI and available namespaces/resources.
- **Capability Doc Extraction (`get <cmd>`)**: Pulls one command capability and formats it as a self-contained agent instruction document.
- **Embedded DAG Planning**: Optionally injects execution plan information (`--show-dag`) into the generated skill document to teach dry-run-first workflows.
- **Skill Catalog**: Discover and query skill documents from multiple providers (local filesystem, remote repos, plugin bundles).

## Quick Start

### Teach an Agent About supercli

The `teach` command generates a bootstrap document that teaches any LLM or agent how supercli works:

```bash
# Generate the full bootstrap skill document (stdout, Markdown)
supercli skills teach

# JSON output for programmatic consumption
supercli skills teach --json
```

The output covers:
- Available namespaces and resources
- Command routing pattern (`<namespace> <resource> <action>`)
- Output envelope format and exit codes
- How to discover, inspect, and execute commands

### Generate a Command-Specific Skill Document

The `get` command extracts a single capability and formats it as a self-contained instruction:

```bash
# Basic: get skill doc for a specific command
supercli skills get beads.issue.create

# With DAG planning info (teaches dry-run-first workflow)
supercli skills get beads.issue.create --show-dag

# JSON output
supercli skills get beads.issue.create --json
```

### List Available Capabilities

```bash
# Brief index of all capabilities (JSON by default)
supercli skills list --json

# Search by keyword
supercli skills search --query "deploy" --json

# Get full details for a specific capability
supercli skills get aws.cfn.deploy
```

## Workflow: Teaching an Agent a New Tool

A typical workflow for onboarding an agent to a new tool:

```bash
# 1. Discover what's available
supercli skills search "database" --json

# 2. Inspect a specific command before using it
supercli inspect postgres query

# 3. Generate a skill document for the agent
supercli skills get postgres.query --json

# 4. Execute the command
supercli postgres query --sql "SELECT count(*) FROM users"
```

For agents, the recommended pattern is:

```
1. Run `supercli` (no args) → full capability graph schema (JSON)
2. Run `supercli skills search <query>` → narrow down tools
3. Run `supercli skills get <ns.res.act>` → get usage instructions
4. Run `supercli <ns> <res> <action>` → execute
```

## Skill Document Output Format

When you run `supercli skills get <command>`, the output is a self-contained Markdown document with:

- **Command signature**: exact invocation syntax
- **Argument schema**: all arguments with types, required/optional, defaults
- **Output format**: expected JSON envelope structure
- **Examples**: copy-pasteable usage patterns
- **Error codes**: exit codes and what they mean
- **DAG plan** (with `--show-dag`): step-by-step execution plan for dry-run validation

Example output structure:

```markdown
# supercli beads.issue.create

## Signature
supercli beads.issue create --title <string> [--priority <integer>] [--description <string>]

## Arguments
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | string | yes | — | Issue title |
| priority | integer | no | 0 | Priority level (0-4) |
| description | string | no | — | Issue description |

## Output
Returns JSON envelope with created issue details.

## Exit Codes
- 0: Success
- 82: Validation error (missing required args)
- 105: Integration error (beads_rust not installed)

## Example
supercli beads issue create --title "Fix auth bug" --priority 2
```

## Skill Catalog System

supercli can discover SKILL.md files from multiple providers and expose them with stable `provider:id` identifiers. See [skills-catalog.md](../skills-catalog.md) for the full catalog system documentation.

### Provider Commands

```bash
# List configured providers
supercli skills providers list --json

# Add a local filesystem provider
supercli skills providers add --name mykb --type local_fs --roots /path/to/skills

# Sync catalog from all providers
supercli skills sync --json

# Query catalog skill documents
supercli skills list --catalog --json
supercli skills search --query "planning" --json
supercli skills get opencode:plan-changes
```

### Built-in vs External Skill Documents

| Source | How to Access | Examples |
|--------|--------------|----------|
| Built-in capabilities | `supercli skills get <ns.res.act>` | `beads.issue.create`, `aws.cfn.deploy` |
| Built-in meta-skills | `supercli skills teach` | Bootstrap document for agent onboarding |
| Catalog providers | `supercli skills get <provider:id>` | `opencode:plan-changes`, `nullclaw:root.agents` |
| Plugin-bundled skills | Via plugin's `skills/quickstart/SKILL.md` | Plugin-specific agent guides |

## Writing Your Own Skill Documents

If you're creating a plugin with a `skills/quickstart/SKILL.md`, follow these conventions:

1. **Start with the tool name** as the document title
2. **Include the command signature** with all arguments
3. **Show at least one complete example** with expected output
4. **Document error codes** and recovery steps
5. **Keep it concise** — agents are token-constrained

### Template

```markdown
# <Tool Name> — <one-line purpose>

## Commands
### <namespace> <resource> <action>
<description>

**Usage:**
supercli <ns> <res> <action> --arg value

**Arguments:**
- `--arg` (string, required): description

**Output:**
```json
{ "status": "ok", "data": { ... } }
```

**Errors:**
- Exit 82: validation error
- Exit 105: integration error (tool not installed)
```

Set `has_learn: true` in your plugin's `meta.json` to register the skill document with the catalog system.

## Related Documentation

- [Skill Documents Catalog](../skills-catalog.md) — provider system and remote skill discovery
- [Agent-Friendly Tooling](agent-friendly.md) — design principles for machine-consumable output
- [Natural Language Execution](ask.md) — AI-driven capability composition
- [Plugin Development Guide](../plugins-how-to.md) — creating plugins with bundled skill documents
