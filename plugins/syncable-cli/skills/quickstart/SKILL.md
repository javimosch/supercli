# syncable-cli Quickstart

syncable-cli is a DevOps toolbox for AI coding agents and developers. Use this skill when you need to:

- Analyze codebases and detect tech stacks
- Scan for security issues and secrets
- Check dependencies for known CVEs
- Validate infrastructure files (Docker, Kubernetes, Terraform)
- Generate CI/CD pipeline configurations
- Deploy services to cloud providers

## Installation

```bash
cargo install syncable-cli
sync-ctl --version
```

## Project Analysis

### Analyze Codebase

```bash
# Analyze current directory
sync-ctl analyze .

# Human-readable matrix view
sync-ctl analyze . --agent=false

# Compressed JSON for AI agents
sync-ctl analyze . --agent
```

Detects 260+ technologies across JavaScript, Python, Go, Rust, and Java ecosystems.

## Security Scanning

### Security Scan

```bash
# Standard scan (balanced mode)
sync-ctl security . --mode balanced

# Fast scan for pre-commit hooks
sync-ctl security . --mode lightning

# Deep compliance audit
sync-ctl security . --mode paranoid

# Agent-friendly output
sync-ctl security . --mode balanced --agent
```

### Scan Modes

| Mode | Speed | Use Case |
|------|-------|----------|
| `lightning` | Fastest | Pre-commit hooks |
| `fast` | Fast | Development |
| `balanced` | Standard | Default |
| `thorough` | Complete | PR reviews |
| `paranoid` | Maximum | Compliance audits |

## Vulnerability Detection

### CVE Scanning

```bash
# Scan all dependencies for CVEs
sync-ctl vulnerabilities .

# Only high+ severity
sync-ctl vulnerabilities . --severity high

# Critical severity only
sync-ctl vulnerabilities . --severity critical
```

Scans npm, pip, cargo, go, and Java dependencies. Automatically discovers and scans all subdirectories in monorepos.

## IaC Validation

### Validate Infrastructure Files

```bash
# Lint all IaC files
sync-ctl validate .

# Specific file types
sync-ctl validate . --types dockerfile,compose

# Auto-fix issues
sync-ctl validate . --types compose --fix
```

### Supported Linters

| Linter | What it checks | Rules |
|--------|---------------|-------|
| **Hadolint** | Dockerfiles | 60+ rules |
| **Dclint** | Docker Compose | 15 rules (8 auto-fixable) |
| **Kubelint** | K8s manifests | 63+ security & best-practice checks |
| **Helmlint** | Helm charts | 40+ rules |

## Dependency Auditing

```bash
# Audit licenses and dependencies
sync-ctl dependencies .

# Check production vs dev split
sync-ctl dependencies . --split
```

## CI/CD Generation

### Generate CI Pipeline

```bash
# GitHub Actions (preview)
sync-ctl generate ci . --platform github --dry-run

# Azure Pipelines
sync-ctl generate ci . --platform azure

# Google Cloud Build
sync-ctl generate ci . --platform gcp --target cloud-run

# Hetzner with notifications
sync-ctl generate ci . --platform hetzner --notify
```

### Generate CD Pipeline

```bash
# Cloud Run
sync-ctl generate cd . --platform gcp --target cloud-run --dry-run

# Azure Kubernetes Service
sync-ctl generate cd . --platform azure --target aks -o ./pipelines

# Hetzner VPS
sync-ctl generate cd . --platform hetzner --target vps --notify
```

### Generate Both CI + CD

```bash
# One-shot generation
sync-ctl generate ci-cd . --platform gcp --target cloud-run --dry-run
sync-ctl generate ci-cd . --platform hetzner --target vps --notify
```

## Deployment

### Deployment Preview

```bash
# Get deployment recommendation
sync-ctl deploy preview .
```

### Deploy Services

```bash
# Deploy to Hetzner
sync-ctl deploy run . --provider hetzner --port 8080 --public

# Monitor deployment
sync-ctl deploy status --watch

# Interactive wizard
sync-ctl deploy wizard
```

## Platform Management

```bash
# Authenticate with Syncable
sync-ctl auth login

# Show current context
sync-ctl project current

# List organizations
sync-ctl org list

# Switch project
sync-ctl project select

# Switch environment
sync-ctl env select staging
```

## AI Agent Skills

Install AI agent skills for natural language control:

```bash
npx syncable-cli-skills
```

### Available Skills

**Command Skills:**
- `syncable-analyze` - Detect tech stack, languages, frameworks, dependencies
- `syncable-security` - Scan for secrets, hardcoded credentials, insecure patterns
- `syncable-vulnerabilities` - Check dependencies for known CVEs
- `syncable-dependencies` - Audit licenses, production vs dev split
- `syncable-validate` - Lint Dockerfiles, Compose files, K8s manifests, Helm charts, Terraform
- `syncable-optimize` - Analyze Kubernetes resource requests, limits, cost efficiency
- `syncable-platform` - Authenticate, switch projects/environments, deploy to cloud

**Workflow Skills:**
- `syncable-project-assessment` - Full health check: stack + security + vulnerabilities + dependencies
- `syncable-security-audit` - Deep pre-deployment review with paranoid-mode scanning
- `syncable-iac-pipeline` - Validate all IaC files + Kubernetes optimization
- `syncable-deploy-pipeline` - End-to-end: auth → analyze → security gate → deploy + monitor

## Agent Mode

```bash
# Compressed JSON output for AI agents (~2KB)
sync-ctl security . --mode balanced --agent

# Retrieve full details when needed (paginated)
sync-ctl retrieve --query "severity:critical" --limit 10
```

## Supported Technologies

**260+ technologies across 5 ecosystems:**

- **JavaScript/TypeScript** — React, Vue, Angular, Next.js, Express, Nest.js, Fastify, and 40+ more
- **Python** — Django, Flask, FastAPI, Celery, NumPy, TensorFlow, PyTorch, and 70+ more
- **Go** — Gin, Echo, Fiber, gRPC, Kubernetes client, and 20+ more
- **Rust** — Actix-web, Axum, Rocket, Tokio, SeaORM, and 20+ more
- **Java/Kotlin** — Spring Boot, Micronaut, Quarkus, Hibernate, and 90+ more

## Tips

- Use `--agent` flag for AI-friendly compressed JSON output
- Balanced mode is best for general security scanning
- Use paranoid mode for compliance audits
- Auto-fix available for Docker Compose linting
- Supports monorepos with automatic subdirectory discovery
- Integrates with major AI coding agents via skills
