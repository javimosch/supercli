# SuperCLI Tag Vocabulary

Standardized tags for categorizing and discovering plugins.

## Language Tags
- `bash` — Bash shell
- `c` — C language
- `cpp` — C++ language
- `csharp` — C# language
- `go` — Go language
- `java` — Java language
- `javascript` — JavaScript language
- `python` — Python language
- `rust` — Rust language
- `typescript` — TypeScript language
- `lua` — Lua language
- `ruby` — Ruby language
- `php` — PHP language

## Category: Development

### Build & Compilation
- `build` — Build tools and systems
- `compiler` — Language compilers
- `bundler` — Code bundling tools
- `transpiler` — Code transpilers

### Testing & Quality
- `testing` — Testing frameworks
- `unit-testing` — Unit test tools
- `integration-testing` — Integration test tools
- `coverage` — Code coverage tools
- `linting` — Code linters
- `formatting` — Code formatters
- `benchmarking` — Performance benchmarking

### Package Management
- `package-manager` — Package/dependency managers
- `npm` — NPM packages
- `cargo` — Rust packages
- `pip` — Python packages

### Development Tools
- `development` — General development tools
- `debugging` — Debuggers and debugging tools
- `documentation` — Documentation generators
- `asm` — Assembly language tools

## Category: DevOps & Infrastructure

### Container & Orchestration
- `docker` — Docker containers
- `kubernetes` — Kubernetes orchestration
- `container` — Container technologies
- `orchestration` — Orchestration tools

### Infrastructure & IaC
- `devops` — DevOps tools and practices
- `iac` — Infrastructure as Code
- `terraform` — Terraform IaC
- `cloud` — Cloud computing
- `deployment` — Deployment tools
- `ci-cd` — CI/CD pipelines

### Cloud Providers
- `aws` — Amazon Web Services
- `azure` — Microsoft Azure
- `gcp` — Google Cloud Platform
- `linode` — Linode cloud
- `digital-ocean` — DigitalOcean cloud
- `vultr` — Vultr cloud
- `scaleway` — Scaleway cloud

### Monitoring & Logging
- `monitoring` — Monitoring tools
- `logging` — Logging tools
- `observability` — Observability tools
- `metrics` — Metrics collection

## Category: Data & Database

### Databases
- `database` — Database tools
- `sql` — SQL databases
- `nosql` — NoSQL databases
- `postgresql` — PostgreSQL
- `mysql` — MySQL/MariaDB
- `mongodb` — MongoDB
- `redis` — Redis cache
- `elasticsearch` — Elasticsearch

### Data Processing
- `data` — Data processing tools
- `analytics` — Data analytics
- `machine-learning` — ML/AI tools
- `data-processing` — Data transformation

## Category: Web & Networking

### Web
- `web` — Web technologies
- `http` — HTTP tools
- `api` — API tools
- `rest` — REST APIs
- `websocket` — WebSocket tools
- `frontend` — Frontend development
- `backend` — Backend development
- `nodejs` — Node.js

### Networking
- `network` — Networking tools
- `dns` — DNS tools
- `vpn` — VPN tools
- `proxy` — Proxy servers
- `socket` — Socket programming

## Category: Security

- `security` — Security tools
- `crypto` — Cryptography
- `ssl` — SSL/TLS
- `auth` — Authentication
- `encryption` — Encryption tools
- `password` — Password management
- `vulnerability` — Vulnerability scanning

## Category: Shell & Terminal

### Shell Tools
- `shell` — Shell tools and utilities
- `bash` — Bash shell (also language)
- `zsh` — Zsh shell
- `fish` — Fish shell
- `terminal` — Terminal utilities
- `console` — Console tools
- `prompt` — Shell prompts

### Shell Utilities
- `file-search` — File search tools
- `text-processing` — Text processing
- `system` — System utilities
- `process` — Process management

## Category: Utilities

### System
- `system` — System tools
- `linux` — Linux-specific
- `unix` — Unix-like systems
- `macos` — macOS-specific
- `windows` — Windows-specific
- `os` — OS tools
- `kernel` — Kernel-related

### File & Directory
- `filesystem` — File system tools
- `file-search` — File searching
- `file-management` — File operations
- `directory` — Directory utilities
- `compression` — Compression tools
- `archive` — Archive tools

### Productivity
- `productivity` — Productivity tools
- `task-management` — Task management
- `note-taking` — Note taking
- `project-management` — Project management
- `time-tracking` — Time tracking

### Media & Graphics
- `media` — Media tools
- `image` — Image processing
- `video` — Video processing
- `audio` — Audio processing
- `graphics` — Graphics tools
- `conversion` — File conversion

## Category: CLI & Interface

- `cli` — Command-line tools
- `command-line` — Command-line utilities
- `interactive` — Interactive tools
- `filter` — Data filtering
- `search` — Search tools
- `fuzzy-search` — Fuzzy searching

## Emerging Categories

- `ai` — AI/ML tools
- `llm` — Large Language Models
- `blockchain` — Blockchain tools
- `web3` — Web3 tools
- `devtools` — Developer tools
- `utility` — General utilities

---

## Guidelines for Using Tags

1. **Always use 3-8 tags** per plugin
2. **Use specific tags** over generic ones
   - ✓ `rust`, `async`, `tokio`
   - ✗ `development`, `tool`
3. **Match tool primary purpose** first
   - `ripgrep-all` → `search`, `rust`, `file-search`
   - Not: `cli`, `utility`
4. **Include language if relevant**
   - `tokio` → `rust`, `async`, ...
5. **Include domain if applicable**
   - `terraform` → `devops`, `iac`, `cloud`, ...

## Statistics

- **Total tags:** 120+
- **Most used:** `cli`, `utility`, `development`
- **Categories:** 12 major categories
- **New tags encouraged** as collection grows (propose in PR)
