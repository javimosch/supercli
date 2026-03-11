# Supported Harnesses

A comprehensive guide to all currently supported harnesses in dcli, including bundled harnesses, built-in adapters, and popular community harnesses available via the plugin system.

## Bundled Harnesses

These harnesses are included with dcli and require only the underlying CLI tool to be installed.

### beads (Task/Issue Management)

**CLI**: `br` (beads_rust)  
**Repository**: [github.com/Dicklesworthstone/beads_rust](https://github.com/Dicklesworthstone/beads_rust)  
**Status**: Fully integrated  

A DAG-based issue tracking system designed for automation and task dependencies.

**Key Commands**:
```bash
supercli beads issue create --title "Fix bug"
supercli beads issue list --status open
supercli beads issue update <id> --status in_progress
supercli beads dep add <child> <parent>      # Add dependency
supercli beads sync run                       # Sync to JSONL
```

**Installation**:
```bash
curl -fsSL https://raw.githubusercontent.com/Dicklesworthstone/beads_rust/main/install.sh | bash
br --version
```

**Features**:
- Priority levels (P0-P4)
- Dependency tracking with cycle detection
- JSONL export/import
- JSON output for automation
- Status tracking (open, in_progress, closed)

---

### gwc (Google Workspace CLI)

**CLI**: `gws` (Google Workspace CLI)  
**Repository**: [github.com/googleworkspace/cli](https://github.com/googleworkspace/cli)  
**Status**: Fully integrated with passthrough  

Full passthrough to Google Workspace CLI with access to Google Drive, Sheets, Docs, Gmail, and more.

**Key Commands**:
```bash
supercli gwc drive files list
supercli gwc drive files get <id>
supercli gwc sheets values get <sheet-id> <range>
supercli gwc gmail messages list --query "from:user@example.com"
```

**Installation**:
```bash
npm install -g @googleworkspace/cli
gws --version
```

**Features**:
- Full Google Drive access
- Google Sheets manipulation
- Gmail integration
- Google Docs access
- Full passthrough support (all gws commands available)

---

### commiat (Commit Automation)

**CLI**: `commiat`  
**Repository**: [npmjs.com/package/commiat](https://www.npmjs.com/package/commiat)  
**Status**: Fully integrated with passthrough  

CLI tool for intelligent commit message generation and validation.

**Key Commands**:
```bash
supercli commiat validate --commit-msg "fix: resolve bug"
supercli commiat generate --changes <file>
supercli commiat suggest
```

**Installation**:
```bash
npm install -g commiat
commiat --version
```

**Features**:
- Intelligent commit message generation
- Commit validation against standards
- Integration with git hooks
- Full passthrough support

---

## Built-in Adapters

These don't require external CLI tools but provide core execution capabilities.

### OpenAPI

**Status**: Built-in, no CLI required  

Execute commands defined by OpenAPI 3.0 specifications.

**Usage**:
```bash
supercli openapi <operation-id> [--args]
```

**Features**:
- Automatic schema validation
- Request/response transformation
- Security scheme support
- Parameter validation

---

### HTTP

**Status**: Built-in, no CLI required  

Raw HTTP adapter for direct REST API calls.

**Usage**:
```bash
supercli http <method> <url> [--headers] [--data]
```

**Features**:
- GET, POST, PUT, PATCH, DELETE support
- Custom headers
- Request body handling
- Response parsing

---

### MCP (Model Context Protocol)

**Status**: Built-in, supports both stdio and SSE/HTTP  

Integration with MCP servers for tool execution.

**Key Commands**:
```bash
supercli mcp list                                      # List connected servers
supercli mcp add <name> --url <server-url>           # Add server
supercli mcp remove <name>                            # Remove server
supercli <namespace> <tool> <action>                  # Execute tool
```

**Features**:
- Stdio process management
- SSE/HTTP server support
- Local tool registration
- Remote server integration

---

## Popular Community Harnesses (In Development)

These harnesses are in active development and will be available as plugins. Status shows expected availability.

### GitHub Ecosystem

| Harness | CLI | Status | Purpose |
|---------|-----|--------|---------|
| **gh** | gh (GitHub CLI) | Planned | Repository management, issues, PRs, actions |
| **ghe** | GitHub Enterprise CLI | Planned | Enterprise GitHub deployment |

---

### Cloud Platforms

| Harness | CLI | Status | Purpose |
|---------|-----|--------|---------|
| **aws** | aws (AWS CLI v2) | Planned | EC2, S3, Lambda, RDS, and 200+ services |
| **gcloud** | gcloud (Google Cloud CLI) | Planned | GCP services, Compute Engine, Storage, etc. |
| **az** | az (Azure CLI) | Planned | Azure services, VMs, databases, etc. |
| **do** | doctl (DigitalOcean) | Planned | Droplets, databases, app platform |

---

### Container & Orchestration

| Harness | CLI | Status | Purpose |
|---------|-----|--------|---------|
| **docker** | docker | Planned | Container management, images, volumes |
| **docker-compose** | docker-compose | Planned | Multi-container orchestration |
| **kubectl** | kubectl | Planned | Kubernetes cluster management |
| **helm** | helm | Planned | Kubernetes package management |
| **k3s** | k3s | Planned | Lightweight Kubernetes |

---

### Infrastructure & DevOps

| Harness | CLI | Status | Purpose |
|---------|-----|--------|---------|
| **terraform** | terraform | Planned | Infrastructure as Code provisioning |
| **ansible** | ansible | Planned | Configuration management |
| **pulumi** | pulumi | Planned | Infrastructure as Code (Python/Go/TS) |
| **nomad** | nomad | Planned | Workload orchestration |

---

### Databases

| Harness | CLI | Status | Purpose |
|---------|-----|--------|---------|
| **mysql** | mysql | Available via plugin | MySQL client version checks, one-off queries, passthrough |
| **mongosh** | mongosh | Available via plugin | MongoDB shell ping, eval, and passthrough |

---

### Communication

| Harness | CLI | Status | Purpose |
|---------|-----|--------|---------|
| **himalaya** | himalaya | Available via plugin | Read-only email account, folder, envelope, and preview workflows |
| **wacli** | wacli | Available via plugin | Read-only WhatsApp diagnostics, chats, messages, contacts, and groups |
| **xurl** | xurl | Available via plugin | Read-only X account, timeline, search, and social graph workflows |
| **clix** | clix | Available via plugin | Read-only X timeline, search, user, tweet, and bookmarks workflows |

---

### Version Control & Release

| Harness | CLI | Status | Purpose |
|---------|-----|--------|---------|
| **git** | git | Planned | Git repository operations |
| **git-cliff** | git-cliff | Planned | Changelog generation |
| **commitizen** | cz | Planned | Conventional commits |
| **conventional-changelog** | conventional-changelog | Planned | Changelog automation |

---

### Package Managers

| Harness | CLI | Status | Purpose |
|---------|-----|--------|---------|
| **npm** | npm | Planned | Node.js package management |
| **pnpm** | pnpm | Planned | Fast Node.js package manager |
| **yarn** | yarn | Planned | JavaScript dependency management |
| **pip** | pip | Planned | Python package management |
| **pipenv** | pipenv | Planned | Python environment management |
| **poetry** | poetry | Planned | Python dependency management |
| **cargo** | cargo | Planned | Rust package management |

---

### AI/ML Tools

| Harness | CLI | Status | Purpose |
|---------|-----|--------|---------|
| **huggingface** | huggingface-cli | Planned | Hugging Face model management |
| **langchain** | langchain CLI | Planned | LangChain utilities |
| **ollama** | ollama | Planned | Local LLM management |
| **modal** | modal | Planned | ML cloud computing |

---

### Monitoring & Observability

| Harness | CLI | Status | Purpose |
|---------|-----|--------|---------|
| **datadog** | datadog-cli | Planned | Datadog monitoring |
| **prometheus** | prometheus | Planned | Metrics and alerting |
| **grafana** | grafana CLI | Planned | Visualization and dashboards |
| **newrelic** | newrelic-cli | Planned | Application monitoring |

---

## Contributing a Plugin Harness

Want to create a plugin for your favorite CLI? Follow these steps:

1. **Review the Plugin Guide**: See [plugin-harness-guide.md](plugin-harness-guide.md)
2. **Create a Manifest**: Define your `plugin.json`
3. **Test Locally**: Use `supercli plugins install ./your-plugin`
4. **Publish**: Submit to the plugin registry via `supercli plugins publish`

For detailed instructions, see [plugin-harness-guide.md](plugin-harness-guide.md).

## Request a Harness

Missing a CLI you'd like to use with dcli? [Open an issue](https://github.com/anomalyco/dcli/issues) with:
- CLI name and link
- Use cases in your workflow
- Relevant commands/operations

Community members can create plugins for requested CLIs!
