# Vercel Plugin for SuperCLI

Semantic commands + passthrough for Vercel CLI — deployments, projects, environment variables, and serverless functions.

## Installation

```bash
# Install Vercel CLI first
npm install -g vercel

# Install the plugin
supercli plugins install ./plugins/vercel --on-conflict replace --json
```

## Authentication

```bash
# Login to Vercel (required for deployments)
vercel login
```

## Commands

### Wrapped Commands
```bash
supercli vercel account whoami --json
```

### Full Passthrough
All Vercel CLI commands work through passthrough:

```bash
# Projects
supercli vercel project ls
supercli vercel project add my-project

# Deployments
supercli vercel                    # Deploy to preview
supercli vercel --prod            # Deploy to production
supercli vercel list             # List deployments
supercli vercel logs <url>        # View logs
supercli vercel remove <url>       # Remove deployment

# Environment Variables
supercli vercel env add KEY=value --env
supercli vercel env add KEY=value --production
supercli vercel env pull .env.local
supercli vercel env ls

# Serverless Functions
supercli vercel function ls
supercli vercel function deploy ./api

# Domains & Certificates
supercli vercel domains ls
supercli vercel certs ls
```

## Common Patterns

```bash
# Deploy with production flag
supercli vercel --prod

# Deploy specific project
supercli vercel --yes --project my-project

# Add production secret
supercli vercel env add DATABASE_URL=xxx --production

# View deployment logs
supercli vercel logs deploy-name
```

## Flags

| Flag | Description |
|------|-------------|
| `--prod` | Deploy to production |
| `--env` | Preview environment |
| `--yes` | Auto-confirm prompts |
| `--project` | Specify project name |

## Requirements

- `vercel` CLI (`npm install -g vercel`)
- Vercel account (run `vercel login` first)