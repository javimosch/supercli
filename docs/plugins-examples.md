# Plugin Manifest Examples

Real-world examples of plugin harnesses you can use as reference for creating your own.

## Example 1: beads - Wrapped Commands

The beads plugin demonstrates selective command wrapping. It exposes key beads_rust commands through dcli's interface.

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
      "resource": "install",
      "action": "steps",
      "description": "Show beads_rust installation steps for LLM automation",
      "adapter": "shell",
      "adapterConfig": { "script": "cat install-guidance.json", "unsafe": true },
      "args": []
    },
    {
      "namespace": "beads",
      "resource": "workspace",
      "action": "init",
      "description": "Initialize beads workspace in current repository",
      "adapter": "process",
      "adapterConfig": {
        "command": "br",
        "baseArgs": ["init"],
        "parseJson": false,
        "missingDependencyHelp": "Run: supercli beads install steps"
      },
      "args": []
    },
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
        { "name": "type", "type": "string", "required": false },
        { "name": "priority", "type": "integer", "required": false },
        { "name": "description", "type": "string", "required": false }
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
        { "name": "priority", "type": "string", "required": false },
        { "name": "assignee", "type": "string", "required": false }
      ]
    },
    {
      "namespace": "beads",
      "resource": "issue",
      "action": "update",
      "description": "Update a beads issue",
      "adapter": "process",
      "adapterConfig": {
        "command": "br",
        "baseArgs": ["update"],
        "positionalArgs": ["id"],
        "jsonFlag": "--json",
        "parseJson": true,
        "missingDependencyHelp": "Run: supercli beads install steps"
      },
      "args": [
        { "name": "id", "type": "string", "required": true },
        { "name": "status", "type": "string", "required": false },
        { "name": "priority", "type": "integer", "required": false },
        { "name": "assignee", "type": "string", "required": false }
      ]
    },
    {
      "namespace": "beads",
      "resource": "issue",
      "action": "close",
      "description": "Close a beads issue",
      "adapter": "process",
      "adapterConfig": {
        "command": "br",
        "baseArgs": ["close"],
        "positionalArgs": ["id"],
        "jsonFlag": "--json",
        "parseJson": true,
        "missingDependencyHelp": "Run: supercli beads install steps"
      },
      "args": [
        { "name": "id", "type": "string", "required": true },
        { "name": "reason", "type": "string", "required": false }
      ]
    }
  ]
}
```

**Key Points**:
- Uses wrapped commands (selective exposure)
- JSON parsing for automation
- Install guidance via isolated install-guidance.json file
- Clear error messages with help guidance
- Multiple related commands under same namespace/resource

**Usage Examples**:
```bash
supercli beads issue create --title "Fix authentication bug" --priority 0
supercli beads issue list --status open
supercli beads issue update dcli-15q --status in_progress
supercli beads issue close dcli-15q --reason "completed"
```

---

## Example 2: gwc - Full Passthrough

The Google Workspace CLI plugin demonstrates full passthrough, giving access to all gws commands without selective wrapping.

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
      "resource": "install",
      "action": "steps",
      "description": "Show gws installation steps for LLM automation",
      "adapter": "shell",
      "adapterConfig": { "script": "cat install-guidance.json", "unsafe": true },
      "args": []
    },
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

**Key Points**:
- Single `_` wildcard command captures all gws functionality
- Longer timeout for complex operations
- Passthrough mode passes all arguments directly
- Install guidance via isolated install-guidance.json file
- Minimal manifest for maximum CLI access

**Usage Examples**:
```bash
# Any gws command works transparently
supercli gwc drive files list
supercli gwc drive files get <file-id>
supercli gwc sheets values get <sheet-id> A1:B10
supercli gwc gmail messages list --query "from:user@example.com"
supercli gwc docs get <doc-id>
```

---

## Example 3: commiat - Simple Passthrough

A minimal passthrough plugin for commit automation.

```json
{
  "name": "commiat",
  "version": "0.1.0",
  "description": "Wrap commiat CLI with passthrough support",
  "source": "https://www.npmjs.com/package/commiat",
  "checks": [
    { "type": "binary", "name": "commiat" }
  ],
  "commands": [
    {
      "namespace": "commiat",
      "resource": "install",
      "action": "steps",
      "description": "Show commiat installation steps for LLM automation",
      "adapter": "shell",
      "adapterConfig": { "script": "cat install-guidance.json", "unsafe": true },
      "args": []
    },
    {
      "namespace": "commiat",
      "resource": "_",
      "action": "_",
      "description": "Passthrough to commiat CLI",
      "adapter": "process",
      "adapterConfig": {
        "command": "commiat",
        "passthrough": true,
        "parseJson": true,
        "timeout_ms": 15000,
        "missingDependencyHelp": "Run: supercli commiat install steps"
      },
      "args": []
    }
  ]
}
```

**Usage Examples**:
```bash
supercli commiat validate --commit-msg "fix: resolve bug #123"
supercli commiat generate --changes src/file.js
supercli commiat suggest
```

---

## Example 4: Custom Plugin Template

A template for creating your own wrapped command plugin:

```json
{
  "name": "my-cli",
  "version": "0.1.0",
  "description": "Wrap my-cli with dcli integration",
  "source": "https://github.com/user/my-cli",
  "tags": ["category", "keyword"],
  "author": "Your Name",
  "checks": [
    { "type": "binary", "name": "my-cli" }
  ],
  "commands": [
    {
      "namespace": "my-cli",
      "resource": "feature",
      "action": "list",
      "description": "List features",
      "adapter": "process",
      "adapterConfig": {
        "command": "my-cli",
        "baseArgs": ["feature", "list"],
        "jsonFlag": "--json",
        "parseJson": true,
        "timeout_ms": 5000,
        "missingDependencyHelp": "Install my-cli: npm install -g my-cli"
      },
      "args": [
        { 
          "name": "filter", 
          "type": "string", 
          "required": false,
          "description": "Filter by feature name"
        }
      ]
    },
    {
      "namespace": "my-cli",
      "resource": "feature",
      "action": "create",
      "description": "Create a new feature",
      "adapter": "process",
      "adapterConfig": {
        "command": "my-cli",
        "baseArgs": ["feature", "create"],
        "positionalArgs": ["name"],
        "jsonFlag": "--json",
        "parseJson": true,
        "timeout_ms": 5000,
        "missingDependencyHelp": "Install my-cli: npm install -g my-cli"
      },
      "args": [
        { 
          "name": "name", 
          "type": "string", 
          "required": true,
          "description": "Feature name"
        },
        { 
          "name": "description", 
          "type": "string", 
          "required": false,
          "description": "Feature description"
        }
      ]
    }
  ]
}
```

**Customization**:
- Replace `my-cli` with your CLI name
- Adjust `baseArgs` to match your CLI structure
- Add/remove commands as needed
- Update the binary name in `checks`
- Add tags for discoverability

---

## Comparison: Wrapped vs. Passthrough

| Aspect | Wrapped | Passthrough |
|--------|---------|-------------|
| **Definition** | Selectively expose specific commands | Expose all commands transparently |
| **Best For** | Well-structured, stable CLIs | Large CLI with many commands |
| **Manifest Size** | Larger (document each command) | Minimal (one wildcard) |
| **Control** | Fine-grained control | Full CLI access |
| **Examples** | beads (specific issue ops) | gwc (full Workspace access) |
| **Maintenance** | More effort as CLI grows | Less maintenance |
| **Discoverability** | Excellent (all exposed) | Good (passthrough handled) |

**Choose wrapped when**:
- The CLI has well-defined, stable commands
- You want to curate the user experience
- Different commands have different argument patterns
- You want to provide rich documentation per command

**Choose passthrough when**:
- The CLI is stable and comprehensive
- It has many commands that change frequently
- You want full access without reimplementation
- The CLI's interface is consistent

---

## Testing Plugin Manifests

Validate your plugin manifest before installing:

```bash
# Syntax check
jq . my-plugin/plugin.json

# Schema validation (if schema available)
ajv validate -s plugin-schema.json -d my-plugin/plugin.json

# Install locally
supercli plugins install ./my-plugin

# Test a command
supercli my-plugin resource action --test-arg value

# Inspect command
supercli inspect my-cli resource action

# Show plugin health
supercli plugins doctor my-cli
```

---

## Next Steps

1. **Choose your approach**: Wrapped commands or passthrough?
2. **Create your manifest**: Use examples above as reference
3. **Test locally**: Use `supercli plugins install ./path`
4. **Iterate**: Refine based on usage feedback
5. **Publish**: Share with the community via GitHub

See [plugin-harness-guide.md](plugin-harness-guide.md) for detailed documentation.
