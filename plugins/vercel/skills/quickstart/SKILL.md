---
name: vercel.quickstart
description: Agent workflow for deployments, projects, environment variables, and serverless function management via Vercel CLI passthrough.
tags: vercel,deployment,frontend,serverless,edge,ci-cd,hosting
---

# Vercel Quickstart

Use this when AI agents need to manage Vercel deployments — projects, environment variables, or serverless functions.

## 1) Install plugin and dependency

```bash
supercli plugins learn vercel
npm install -g vercel
vercel --version
supercli plugins install ./plugins/vercel --on-conflict replace --json
```

## 2) Validate CLI wiring

```bash
vercel --version
supercli plugins doctor vercel --json
```

## 3) Core command patterns

### Account & Authentication
```bash
supercli vercel account whoami
supercli vercel login
```

### Projects
```bash
supercli vercel project ls
supercli vercel project add <name>
```

### Deployments
```bash
supercli vercel --prod                  # Deploy to production
supercli vercel                     # Deploy to preview
supercli vercel list                 # List deployments
supercli vercel logs <deployment>  # View deployment logs
supercli vercel remove <deployment> # Remove deployment
```

### Environment variables
```bash
supercli vercel env add DATABASE_URL --[env|production]
supercli vercel env pull .env.local
supercli vercel env ls
supercli vercel env rm VARIABLE_NAME --[env|production]
```

### Serverless Functions
```bash
supercli vercel function ls
supercli vercel function deploy ./api/my-function
supercli vercel function rm api/my-function
```

### Domains
```bash
supercli vercel domains ls
supercli vercel domains add example.com
supercli vercel domains rm example.com
```

### DNS & Certificates
```bash
supercli vercel dns ls
supercli vercel certs ls
supercli vercel certs issue example.com
```

## 4) Agent workflow examples

### Deploy a new version
```bash
# 1. Check current deployments
supercli vercel list
# 2. Deploy to preview
supercli vercel
# 3. Deploy to production (when ready)
supercli vercel --prod
```

### Add environment variable
```bash
# Add to preview
supercli vercel env add API_KEY=sk_xxx --env
# Add to production
supercli vercel env add API_KEY=sk_xxx --production
```

## 5) Safety levels

| Command | Level | Description |
|---------|-------|-------------|
| `account whoami`, `project ls`, `env ls`, `list` | safe | Read-only |
| `env pull`, `logs`, `domains ls` | safe | Analysis only |
| `env add`, `function deploy`, `deploy` | guarded | Modifies remote |
| `remove`, `env rm`, `function rm`, `domains rm` | guarded | Destructive |
| `--prod` flag | guarded | Production changes |

Guard commands may require confirmation. Use `--yes` to auto-confirm.