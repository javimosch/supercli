# sc-zig Usage

Use this skill when working with the Zig implementation of SuperCLI (sc-zig). This is a single-binary, high-performance version of SuperCLI written in Zig, optimized for AI agents.

## Quick Start

```bash
# Install sc-zig (single binary, no Node.js required)
curl -sL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash

# Or manual install to custom location
curl -sL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/sc-zig-linux-amd64 -o ~/.local/bin/sc-zig && chmod +x ~/.local/bin/sc-zig

# Verify installation
sc-zig --version
# → SuperCLI (Zig) v0.1.0
```

## Agent Workflow

The optimal agent workflow with sc-zig:

```bash
# 1. Get bootstrap guidance (self-documenting)
sc-zig --json

# 2. Discover plugins by topic
sc-zig plugins explore --name <topic> --json

# 3. Install plugin (delegates to Node.js sc when needed)
sc-zig plugins install <plugin-name>

# 4. Inspect command schema
sc-zig inspect <namespace> <resource> <action> --json

# 5. Execute command
sc-zig <namespace> <resource> <action> --flag value --json
```

## Key Features for Agents

### Bootstrap JSON
sc-zig returns self-documenting bootstrap JSON:
```json
{
  "version":"1.0",
  "mode":"agent_bootstrap",
  "name":"supercli-zig",
  "workflow":"discover -> inspect -> execute",
  "first_steps":[...],
  "memory_workflow":{...},
  "feature_notes":[...]
}
```

### Plugin Discovery
```bash
# Search by name
sc-zig plugins explore --name memory --json

# Search by tags (comma-separated)
sc-zig plugins explore --tags docker,kubernetes --json

# Filter to installed only
sc-zig plugins explore --installed --json

# Limit results
sc-zig plugins explore --name docker --limit 10 --json
```

### Agent Guidance
When no plugins match your search, sc-zig provides actionable guidance:
```json
{
  "total":0,
  "returned":0,
  "plugins":[],
  "suggestion":"Run: sc-zig plugins update"
}
```

### Plugin Catalog Management
```bash
# Update plugin catalog from GitHub
sc-zig plugins update

# Check for updates without applying
sc-zig plugins update --check

# List installed plugins
sc-zig plugins list --json
```

## Arg Parsing

sc-zig supports both flag formats for maximum compatibility:

```bash
# Space-separated (recommended for broad compatibility)
sc-zig plugins explore --name memory --json

# Equals-separated (also works)
sc-zig plugins explore --name=memory --json
```

### Positional Arguments
Commands with positional arguments are handled correctly:
```bash
# Query is a positional arg (defined in plugin.json)
sc-zig agentmemory-cli memory search --query "search term" --json

# ID is a positional arg
sc-zig agentmemory-cli memory forget --id <uuid> --json
```

Check `sc-zig inspect <ns> <res> <act> --json` to see which args are positional (marked with `"positional": true`).

## Memory Workflow Example

Complete example using the memory plugin:

```bash
# 1. Find memory plugin
sc-zig plugins explore --name memory --json

# 2. Install agentmemory-cli
sc-zig plugins install agentmemory-cli

# 3. Save a memory
sc-zig agentmemory-cli memory save --text "User prefers dark mode" --project myproject --json

# 4. Search memories
sc-zig agentmemory-cli memory search --query "dark mode" --json

# 5. List all memories
sc-zig agentmemory-cli memory list --json

# 6. Forget a memory
sc-zig agentmemory-cli memory forget --id <uuid> --json
```

## Plugin Installation

sc-zig delegates plugin installation to Node.js sc when needed:

```bash
# Install from registry
sc-zig plugins install <plugin-name>

# Install from local path
sc-zig plugins install ./plugins/my-plugin --on-conflict replace

# Install with JSON output
sc-zig plugins install <plugin-name> --json
```

**Note:** Plugin installation requires Node.js sc in PATH. sc-zig will delegate to `sc plugins install` automatically.

## Error Handling

sc-zig returns structured errors with codes:

```json
{
  "error": {
    "code": 92,
    "type": "resource_not_found",
    "message": "Namespace not found. Is the plugin installed?",
    "recoverable": false,
    "suggestions": [
      "Run: sc-zig plugins list --json",
      "Run: sc plugins install <name>"
    ]
  }
}
```

Common error codes:
- `92` — Resource not found (plugin not installed)
- `85` — Invalid argument (wrong command usage)
- `105` — Integration error (external command failed)

## sc-zig vs Node.js sc

| Feature | sc-zig | sc (Node.js) |
|---------|--------|--------------|
| Plugin discover/execute | ✅ | ✅ |
| Plugin install | ✅ (delegates to sc) | ✅ native |
| MCP server | ❌ | ✅ |
| HTTP adapter | ❌ | ✅ |
| Dependencies | None (single binary) | Node.js runtime |
| Startup time | Instant | ~100ms |
| Binary size | ~260KB | ~50MB (node_modules) |

**When to use sc-zig:**
- Agent workflows (single binary, no dependencies)
- Performance-critical scenarios
- Environments without Node.js
- Minimal footprint required

**When to use Node.js sc:**
- Need MCP server or HTTP adapter
- Developing plugins
- Need full feature parity

## Troubleshooting

### "sc-zig: command not found"
Add to PATH or use full path:
```bash
export PATH="$HOME/.local/bin:$PATH"
# or use full path: ~/.local/bin/sc-zig
```

### "Plugin install failed"
Ensure Node.js sc is in PATH:
```bash
which sc
# If not found, install: npm install -g superacli
```

### "No plugins found"
Update the plugin catalog:
```bash
sc-zig plugins update
```

### Arg parsing issues
Use the inspect command to check arg types:
```bash
sc-zig inspect <namespace> <resource> <action> --json
```

## Advanced Usage

### JSON Output Mode
Always use `--json` for agent workflows:
```bash
sc-zig <command> --json
```

### Human-Readable Output
Omit `--json` for human-readable output (TTY detection):
```bash
sc-zig <command>
```

### Combining with Other Tools
```bash
# Pipe to jq for JSON processing
sc-zig plugins explore --name docker --json | jq '.plugins[].name'

# Save to file
sc-zig plugins list --json > plugins.json
```

## Version Information

```bash
# Get version info
sc-zig --version
# → SuperCLI (Zig) v0.1.0

# Get detailed info
sc-zig --info --json
# → {"name":"SuperCLI","implementation":"Zig","version":"0.1.0",...}
```

## See Also

- [Main README](../../README.md) — General SuperCLI documentation
- [AGENTS.md](../../AGENTS.md) — Agent instructions for both sc and sc-zig
- [Smoke Tests](../../supercli-zig-cli/docs/v0.1.0-zig-smoke-test.md) — Test results
- [OpenCode Test](../../supercli-zig-cli/docs/v0.1.0-zig-opencode-smoke-test.md) — Agent workflow validation