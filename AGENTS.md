# supercli Agent Instructions

## Choosing the right sc binary

There are two implementations of `sc`. Prefer the Zig version (`sc-zig`) when available — it is faster and a single binary. Fall back to the Node.js version for plugin installs.

| Feature | `sc-zig` | `sc` (Node.js) |
|---|---|---|
| Plugin discover / explore | ✅ | ✅ |
| Execute plugin commands | ✅ | ✅ |
| Plugin install | ✅ (delegates to `sc`) | ✅ native |
| MCP server | ❌ | ✅ |
| HTTP adapter | ❌ | ✅ |

**Agent install (no sudo required):**
```bash
curl -sSL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash -s -- --path ~/.local/bin
# or manual:
curl -sL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/sc-zig-linux-amd64 -o ~/.local/bin/sc-zig && chmod +x ~/.local/bin/sc-zig
```

## Using SuperCLI (for agents)

When working with supercli, use the CLI itself for discovery. Do NOT search
the filesystem (`plugins/`, `grep`, `glob`) — the CLI has built-in filters.

```bash
# Start here — get bootstrap guidance (works with both sc and sc-zig)
sc-zig --json
# or
sc --json

# Explore plugins by name/description (instead of grepping plugin.json files)
sc-zig plugins explore --name <query> --json

# Filter by tags
sc-zig plugins explore --tags <tag1>,<tag2> --json

# Install a plugin (delegates to Node.js sc internally)
sc-zig plugins install <name>

# List all available commands
sc-zig commands --query <keyword> --limit 50 --json

# Inspect a command's schema (includes arg types + positional markers)
sc-zig inspect <namespace> <resource> <action> --json

# Execute a command
sc-zig <namespace> <resource> <action> --flag value --json
```

**Key rules:**
- `sc-zig plugins explore --name <query> --json` — never grep/glob the `plugins/` directory
- `sc-zig --json` first — the CLI guides itself from there
- `--json` flag for machine-readable output in all commands
- Read `inspect` output before running a command — it shows which args are positional

## Agent Memory Workflow (example)

```bash
# 1. Find a memory plugin
sc-zig plugins explore --name memory --json

# 2. Install it (requires Node.js sc in PATH)
sc-zig plugins install agentmemory-cli

# 3. Save a memory
sc-zig agentmemory-cli memory save --text "User name is Javi" --project myproject --json

# 4. Search memories (query is positional — use --query flag, Zig CLI routes it correctly)
sc-zig agentmemory-cli memory search --query Javi --json

# 5. List memories
sc-zig agentmemory-cli memory list --json
```

## Arg handling notes

The Zig CLI parses `--flag value` as flag=value (not `--flag=value`). Inspect output marks positional args with `"positional": true` — those are passed as bare values before named flags when the command is executed.

Node.js `sc` also accepts these patterns:
```bash
# Find plugins for a task
sc discover --intent "<task>" --json
# Learn about a plugin
sc plugins learn <name> --json
```

## Adding a New Bundled Plugin

When adding a new bundled plugin, create files ONLY inside `plugins/<name>/`.
**Never edit** `plugins/plugins.json` or `cli/plugin-install-guidance.js` for new bundled plugins.

### Required files

1. **`plugins/<name>/plugin.json`** — Manifest with metadata, checks, commands
2. **`plugins/<name>/meta.json`** — Registry metadata:
   ```json
   {
     "description": "Plugin description for registry discovery",
     "tags": ["tag1", "tag2"],
     "has_learn": true
   }
   ```

### Optional files

- **`plugins/<name>/install-guidance.json`** — Install steps (if not embedded in meta.json):
  ```json
  {
    "plugin": "name",
    "binary": "binary-name",
    "check": "binary --version",
    "install_steps": ["step1", "step2"],
    "note": "Optional note"
  }
  ```
- **`plugins/<name>/skills/quickstart/SKILL.md`** — Agent usage guide (set `has_learn: true` in meta.json)
- **`plugins/<name>/README.md`** — Human documentation

### Why this convention?

The old method required editing shared files (`plugins/plugins.json`, `cli/plugin-install-guidance.js`)
which caused merge conflicts between parallel plugin PRs. The new `meta.json` convention keeps each
plugin fully isolated — adding a plugin is just creating files in its own directory.

Existing plugins using the old method continue to work (retrocompatible), but all new bundled plugins
must use the isolated approach.

### Quick example: adding a "mytool" plugin

```
plugins/mytool/
├── plugin.json              # Required: manifest with commands
├── meta.json                # Required: description, tags, has_learn
├── install-guidance.json    # Optional: install steps
├── skills/quickstart/SKILL.md  # Optional: agent guide (if has_learn: true)
└── README.md                # Optional: human docs
```

No edits to any file outside `plugins/mytool/` are needed.

## Other Agent Instructions

- Keep source files under 500 LOC
- Use Markdown for all documentation
- Follow existing code conventions
- Never commit secrets or credentials

## Codebase Exploration

When exploring or preparing context from a codebase for LLM consumption, use **yek** to serialize files efficiently.

### Quick Setup
```bash
# Install yek plugin
sc plugins install yek

# Sync skills to make yek skill available
sc skills sync

# Search for yek skill
sc skills search --query yek

# Load yek quickstart skill
sc skills teach yek:quickstart
```

### Usage
```bash
# Serialize entire repo for LLM (with token limit)
yek --tokens 128k

# JSON output for AI pipelines
yek --json --max-size 100KB

# Specific directory with glob patterns
yek "src/**/*.ts" "tests/*.rs"

# Show directory tree only
yek --tree-only
```

See `sc skills get yek` for full command reference.
