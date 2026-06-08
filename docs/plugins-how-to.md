# Plugin Harness Development Guide

> **New plugins: use the isolated method.** Create files only inside `plugins/<name>/`.
> Never edit `plugins/plugins.json` or `cli/plugin-install-guidance.js` for new bundled plugins.
> See the "Isolated Plugin Structure" section below.

## Isolated Plugin Structure

A bundled plugin is fully self-contained in its own directory. The system auto-discovers
plugins by scanning `plugins/` for directories containing `plugin.json`.

### File layout

```
plugins/my-plugin/
├── plugin.json              # Required: manifest (commands, checks, adapters)
├── meta.json                # Required: registry metadata (description, tags, has_learn)
├── install-guidance.json    # Optional: install steps (can also go in meta.json)
├── skills/quickstart/SKILL.md  # Optional: agent learning content
├── README.md                # Optional: human documentation
└── examples/                # Optional: example usage
```

### meta.json

The `meta.json` file provides registry-level metadata that would previously have required
editing the shared `plugins/plugins.json` file:

```json
{
  "description": "My CLI tool integration for supercli",
  "tags": ["mytool", "category", "keyword"],
  "has_learn": true,
  "install_guidance": {
    "plugin": "my-plugin",
    "binary": "mytool",
    "check": "mytool --version",
    "install_steps": [
      "npm install -g mytool",
      "mytool --version"
    ],
    "note": "Optional installation note"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | Yes | Short description shown in `plugins explore` |
| `tags` | string[] | Yes | Discovery tags for filtering |
| `has_learn` | boolean | No | Set to `true` if plugin has a `skills/quickstart/SKILL.md` |
| `install_guidance` | object | No | Install steps (alternative: use `install-guidance.json`) |

### install-guidance.json (alternative)

If you prefer to keep install guidance separate from metadata, use `install-guidance.json`:

```json
{
  "plugin": "my-plugin",
  "binary": "mytool",
  "check": "mytool --version",
  "install_steps": [
    "npm install -g mytool",
    "mytool --version"
  ],
  "note": "Optional note"
}
```

### Resolution priority

When the system looks for plugin metadata and install guidance, it checks in this order:

1. `meta.json` (description, tags, has_learn, install_guidance)
2. `install-guidance.json` (install guidance only)
3. `plugin.json` fields (fallback for description, install_guidance)
4. Legacy: `plugins/plugins.json` registry entries
5. Legacy: `cli/plugin-install-guidance.js` hardcoded map

### Testing your isolated plugin

```bash
# Install from local directory
supercli plugins install ./plugins/my-plugin

# Verify discovery
supercli plugins explore --name my-plugin

# Check health
supercli plugins doctor my-plugin
```

---

## What is a Plugin Harness?

A **plugin harness** bridges supercli to an external CLI tool. It allows supercli to:
- Discover and route commands to the external CLI
- Expose the CLI's functionality through supercli's unified interface
- Provide consistent output formatting and error handling
- Integrate AI-driven capability discovery across all harnesses

## Anatomy of a Plugin Harness

Every plugin harness consists of:

1. **plugin.json** — Manifest defining metadata and commands
2. **Optional**: Custom adapter code (for complex logic)
3. **Optional**: Documentation and examples

### Minimal Plugin Structure

Use the isolated plugin structure described at the top of this guide. Every file
must live inside `plugins/<name>/` — never at the top level or in shared directories.

```
plugins/my-plugin/
├── plugin.json              # Required: manifest with commands
├── meta.json                # Required: description, tags, has_learn
├── install-guidance.json    # Optional: install steps
├── skills/quickstart/SKILL.md  # Optional: agent guide
└── README.md                # Optional: human docs
```

## plugin.json Manifest

The `plugin.json` file is the core of your harness. It describes:
- Plugin metadata (name, version, description)
- External CLI requirements (binary checks)
- Available commands and their routing

### Manifest Structure

```json
{
  "name": "my-cli-harness",
  "version": "0.1.0",
  "description": "Wrap my-cli with supercli integration",
  "source": "https://github.com/user/my-cli",
  "checks": [
    { "type": "binary", "name": "my-cli" }
  ],
  "commands": [
    {
      "namespace": "my-cli",
      "resource": "resource-name",
      "action": "action-name",
      "description": "What this command does",
      "adapter": "process",
      "adapterConfig": { ... },
      "args": [ ... ]
    }
  ]
}
```

### Plugin Metadata

```json
{
  "name": "beads",              // Unique plugin identifier
  "version": "0.1.0",           // Semantic versioning
  "description": "...",         // Short description (30-150 chars, see PLUGIN_STANDARDS.md)
  "source": "https://...",      // Link to upstream CLI
  "tags": ["task", "automation"], // Optional: discovery tags (3-8 tags, see TAG_VOCABULARY.md)
  "author": "Your Name"         // Optional: plugin author
}
```

### Dependency Checks

```json
"checks": [
  {
    "type": "binary",
    "name": "br",               // Binary name to check
    "version": ">=1.0.0"        // Optional: minimum version
  }
]
```

## Command Definitions

Each command maps supercli routing to CLI execution.

### Wrapped Commands (Selective Routing)

Use for CLIs where you want to expose specific commands:

```json
{
  "namespace": "beads",
  "resource": "issue",
  "action": "create",
  "description": "Create a beads issue",
  "adapter": "process",
  "adapterConfig": {
    "command": "br",            // Binary to execute
    "baseArgs": ["create"],     // Base command arguments
    "positionalArgs": ["title"],// Map supercli args to CLI positional args
    "jsonFlag": "--json",       // Flag for JSON output
    "parseJson": true,          // Parse CLI output as JSON
    "timeout_ms": 5000,         // Execution timeout
    "missingDependencyHelp": "Run: supercli beads install steps"
  },
  "args": [
    {
      "name": "title",
      "type": "string",
      "required": true,
      "description": "Issue title"
    },
    {
      "name": "priority",
      "type": "integer",
      "required": false,
      "description": "Priority level (0-4)"
    }
  ]
}
```

### Passthrough Commands (Full CLI Access)

Use for CLIs where you want full access to all functionality:

```json
{
  "namespace": "gwc",
  "resource": "_",              // Wildcard namespace/resource
  "action": "_",                // Wildcard action
  "description": "Passthrough to gws CLI",
  "adapter": "process",
  "adapterConfig": {
    "command": "gws",           // Binary to execute
    "passthrough": true,        // Enable full passthrough mode
    "parseJson": true,          // Parse CLI output
    "timeout_ms": 15000,        // Longer timeout for complex operations
    "missingDependencyHelp": "Run: supercli gwc install steps"
  },
  "args": []                    // No mapped args (passthrough)
}
```

## Adapter Configuration

### process Adapter

The most common adapter. Executes an external CLI binary.

**Configuration Options**:

| Key | Type | Description |
|-----|------|-------------|
| `command` | string | Binary name to execute (must be in PATH) |
| `baseArgs` | string[] | Default arguments (e.g., `["create"]`) |
| `positionalArgs` | string[] | Map supercli args to CLI positional args |
| `optionalArgs` | object | Map supercli flag args to CLI flags |
| `jsonFlag` | string | Flag for JSON output (e.g., `--json`) |
| `parseJson` | boolean | Parse CLI output as JSON (default: false) |
| `passthrough` | boolean | Pass all args directly to CLI (default: false) |
| `timeout_ms` | number | Execution timeout in milliseconds |
| `missingDependencyHelp` | string | Message if binary not found |

## Argument Mapping

### Positional Arguments

```json
"adapterConfig": {
  "command": "my-cli",
  "baseArgs": ["cmd"],
  "positionalArgs": ["name", "email"]  // First arg -> name, second -> email
}
```

Usage:
```bash
supercli my-cli resource action myname myemail@example.com
```

Maps to: `my-cli cmd myname myemail@example.com`

### Optional Arguments (Flags)

```json
"adapterConfig": {
  "command": "my-cli",
  "baseArgs": ["cmd"],
  "optionalArgs": {
    "priority": "--priority",   // supercli --priority maps to --priority
    "json": "--json"            // supercli --json maps to --json
  }
}
```

Usage:
```bash
supercli my-cli resource action --priority high --json
```

Maps to: `my-cli cmd --priority high --json`

## Real-World Examples

### Example 1: beads Plugin (Wrapped Commands)

```json
{
  "name": "beads",
  "version": "0.1.0",
  "description": "Wrap beads_rust (br) issue tracking commands",
  "source": "https://github.com/Dicklesworthstone/beads_rust",
  "checks": [
    { "type": "binary", "name": "br" }
  ],
  "commands": [
    {
      "namespace": "beads",
      "resource": "issue",
      "action": "create",
      "description": "Create a beads issue",
      "adapter": "process",
      "adapterConfig": {
        "command": "br",
        "baseArgs": ["create"],
        "positionalArgs": ["title"],
        "jsonFlag": "--json",
        "parseJson": true,
        "missingDependencyHelp": "Run: supercli beads install steps"
      },
      "args": [
        { "name": "title", "type": "string", "required": true },
        { "name": "priority", "type": "integer", "required": false }
      ]
    },
    {
      "namespace": "beads",
      "resource": "issue",
      "action": "list",
      "description": "List beads issues",
      "adapter": "process",
      "adapterConfig": {
        "command": "br",
        "baseArgs": ["list"],
        "jsonFlag": "--json",
        "parseJson": true,
        "missingDependencyHelp": "Run: supercli beads install steps"
      },
      "args": [
        { "name": "status", "type": "string", "required": false },
        { "name": "priority", "type": "string", "required": false }
      ]
    }
  ]
}
```

### Example 2: gwc Plugin (Passthrough)

```json
{
  "name": "gwc",
  "version": "0.1.0",
  "description": "Wrap Google Workspace CLI (gws) with passthrough support",
  "source": "https://github.com/googleworkspace/cli",
  "checks": [
    { "type": "binary", "name": "gws" }
  ],
  "commands": [
    {
      "namespace": "gwc",
      "resource": "_",
      "action": "_",
      "description": "Passthrough to gws CLI",
      "adapter": "process",
      "adapterConfig": {
        "command": "gws",
        "passthrough": true,
        "parseJson": true,
        "timeout_ms": 15000,
        "missingDependencyHelp": "Run: supercli gwc install steps"
      },
      "args": []
    }
  ]
}
```

## Testing Your Plugin

### Local Installation

```bash
# Install from local directory
supercli plugins install ./path/to/my-plugin

# Test a command
supercli my-plugin resource action --arg value

# Show plugin info
supercli plugins show my-plugin

# Check plugin health
supercli plugins doctor my-plugin
```

### Validation Checklist

Run these checks before submitting a plugin:

**1. Manifest syntax and required fields:**

```bash
# Validate JSON syntax
jq . plugins/my-plugin/plugin.json
jq . plugins/my-plugin/meta.json

# Check required plugin.json fields
jq '{name, version, description, source}' plugins/my-plugin/plugin.json

# Check required meta.json fields
jq '{description, tags}' plugins/my-plugin/meta.json

# Verify tags count (must be 3-8)
jq '.tags | length' plugins/my-plugin/meta.json

# Verify description length (must be 30-150 chars)
jq '.description | length' plugins/my-plugin/meta.json
```

**2. Command definitions:**

```bash
# List all commands your plugin exposes
jq '.commands[] | {namespace, resource, action}' plugins/my-plugin/plugin.json

# Verify each command has required fields
jq '.commands[] | {adapter, description}' plugins/my-plugin/plugin.json

# Check that adapterConfig has the binary name
jq '.commands[] | select(.adapter=="process") | .adapterConfig.command' plugins/my-plugin/plugin.json
```

**3. Binary dependency:**

```bash
# Verify the required binary is in PATH
which my-cli

# Verify the binary runs
my-cli --version

# Check install-guidance.json if present
jq . plugins/my-plugin/install-guidance.json
```

**4. Discovery and inspection:**

```bash
# Verify supercli discovers the plugin
supercli plugins explore --name my-plugin

# Inspect command argument schemas
supercli inspect my-plugin resource action

# Verify commands appear in listing
supercli commands --namespace my-plugin
```

**5. Execution smoke test:**

```bash
# Run with --json to verify structured output
supercli my-plugin resource action --json

# Run with --verbose for debugging
supercli my-plugin resource action --verbose

# Show the planned command before execution
supercli plan my-plugin resource action --args
```

### Debugging

```bash
# Verbose output
supercli my-plugin resource action --verbose

# See command details
supercli inspect my-plugin resource action

# Show generated command before execution
supercli plan my-plugin resource action --args
```

## Publishing Your Plugin

Once your plugin is tested and working:

1. **Create a GitHub repository** with your plugin code
2. **Structure it properly**:
   ```
   my-plugin-harness/
   ├── plugin.json              # Required: manifest with commands
   ├── meta.json                # Required: description, tags, has_learn
   ├── install-guidance.json    # Optional: install steps
   ├── skills/quickstart/SKILL.md  # Optional: agent guide
   ├── README.md
   ├── LICENSE
   └── examples/
   ```

3. **Publish to registry**:
   ```bash
   supercli plugins publish ./my-plugin-harness
   ```

4. **Community members can install**:
   ```bash
   supercli plugins install --git https://github.com/user/my-plugin-harness.git
   # Or once in registry:
   supercli plugins install my-plugin-harness
   ```

## Best Practices

### Plugin Design

- **Be selective with wrapped commands**: Only expose stable, frequently-used commands
- **Use passthrough for flexibility**: If the CLI is stable, passthrough is often better
- **Provide clear descriptions**: Help users understand what each command does
- **Include dependency checks**: Always verify the external CLI is installed
- **Set appropriate timeouts**: Long-running operations may need extended timeouts

### Output Handling

- **Prefer JSON output**: Use `jsonFlag` and `parseJson: true` for structured data
- **Document output schema**: Help users understand the response format
- **Handle errors gracefully**: Map CLI exit codes to supercli exit codes
- **Provide helpful error messages**: Use `missingDependencyHelp` to guide installation

### Argument Design

- **Keep argument names simple**: Use lowercase, hyphenated names
- **Document constraints**: Specify required vs. optional arguments
- **Type arguments correctly**: Use string, integer, boolean, etc.
- **Provide examples**: Show common usage patterns in docs

### Documentation

- **Write a clear README**: Explain what the plugin does and how to use it
- **Include examples**: Show real-world usage patterns
- **Link to upstream CLI**: Help users learn more about the tool
- **Add install instructions**: Make it easy to get started

## Troubleshooting

### Plugin Not Loading

```bash
# Check syntax
jq . plugin.json

# Verify binary is installed
which my-cli

# Check plugin directory
supercli plugins show my-plugin
```

### Command Execution Failing

```bash
# Test the binary directly
my-cli cmd arg

# Run with verbose output
supercli my-plugin resource action --verbose

# Check timeout isn't too short
# Increase timeout_ms in adapterConfig
```

### Argument Mapping Issues

```bash
# See generated command plan
supercli plan my-plugin resource action --arg value

# Test arg parsing
supercli inspect my-plugin resource action
```

## Legacy Compatibility

> **Note:** This section describes the previous method of registering plugins. It remains
> functional for existing plugins but should NOT be used for new bundled plugins.

Previously, adding a bundled plugin required editing two shared files:

1. **`plugins/plugins.json`** — Add a registry entry with description, tags, and source
2. **`cli/plugin-install-guidance.js`** — Add an entry to `PLUGIN_INSTALL_GUIDANCE` map

This approach caused merge conflicts when multiple plugins were added in parallel. The new
isolated `meta.json` convention eliminates this problem entirely.

If you are maintaining an existing plugin that uses the old method, it will continue to work.
Consider migrating to the isolated method by:

1. Creating `plugins/<name>/meta.json` with description, tags, and has_learn
2. Optionally creating `plugins/<name>/install-guidance.json` with install steps
3. Removing the plugin's entry from `plugins/plugins.json`
4. Removing the plugin's entry from `cli/plugin-install-guidance.js`

---

## Contributing to supercli

Have a plugin you'd like to share? Consider:
1. Creating a quality, well-documented plugin
2. Opening a discussion in the supercli community
3. Submitting your plugin for inclusion in the built-in registry

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
