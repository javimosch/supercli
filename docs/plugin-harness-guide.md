# Plugin Harness Development Guide

Learn how to create plugin harnesses that turn any CLI into a dcli harness.

## What is a Plugin Harness?

A **plugin harness** bridges dcli to an external CLI tool. It allows dcli to:
- Discover and route commands to the external CLI
- Expose the CLI's functionality through dcli's unified interface
- Provide consistent output formatting and error handling
- Integrate AI-driven skill discovery across all harnesses

## Anatomy of a Plugin Harness

Every plugin harness consists of:

1. **plugin.json** — Manifest defining metadata and commands
2. **Optional**: Custom adapter code (for complex logic)
3. **Optional**: Documentation and examples

### Minimal Plugin Structure

```
my-plugin/
├── plugin.json          # Required: manifest
├── README.md            # Optional: plugin documentation
└── examples/            # Optional: example usage
    └── example.sh
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
  "description": "Wrap my-cli with dcli integration",
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
  "description": "...",         // Short description
  "source": "https://...",      // Link to upstream CLI
  "tags": ["task", "automation"], // Optional: discovery tags
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

Each command maps dcli routing to CLI execution.

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
    "positionalArgs": ["title"],// Map dcli args to CLI positional args
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
| `positionalArgs` | string[] | Map dcli args to CLI positional args |
| `optionalArgs` | object | Map dcli flag args to CLI flags |
| `jsonFlag` | string | Flag for JSON output (e.g., `--json`) |
| `parseJson` | boolean | Parse CLI output as JSON (default: false) |
| `passthrough` | boolean | Pass all args directly to CLI (default: false) |
| `timeout_ms` | number | Execution timeout in milliseconds |
| `missingDependencyHelp` | string | Message if binary not found |

### builtin Adapter

For dcli-specific functionality (e.g., showing installation steps).

```json
{
  "adapter": "builtin",
  "adapterConfig": {
    "builtin": "beads_install_steps"  // Builtin handler key
  }
}
```

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
    "priority": "--priority",   // dcli --priority maps to --priority
    "json": "--json"            // dcli --json maps to --json
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

### Validation

```bash
# Check syntax of plugin.json
cat plugins/my-plugin/plugin.json | jq .

# Verify binary detection
which my-cli
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
   ├── plugin.json
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
- **Handle errors gracefully**: Map CLI exit codes to dcli exit codes
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

## Contributing to dcli

Have a plugin you'd like to share? Consider:
1. Creating a quality, well-documented plugin
2. Opening a discussion in the dcli community
3. Submitting your plugin for inclusion in the built-in registry

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
