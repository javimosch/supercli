---
name: wrangler
description: Use this skill when the user wants to deploy Cloudflare Workers, manage Pages, KV, R2, D1 databases, Queues, or interact with the Cloudflare edge platform.
---

# Cloudflare Wrangler Plugin

Deploy and manage Workers, Pages, KV, R2, D1, Queues, and more on Cloudflare's edge network.

## Prerequisites

Requires a Cloudflare account and authentication:

```bash
wrangler login
# or
export CLOUDFLARE_API_TOKEN="..."
```

## Commands

### Auth
- `wrangler whoami check` — Check authentication status

### Workers
- `wrangler deploy run [--name my-worker]` — Deploy a Worker
- `wrangler init run [name] -y` — Initialize a new Worker project
- `wrangler tail run [--format json]` — View Worker logs in real-time

### KV
- `wrangler kv list` — List KV namespaces

### R2
- `wrangler r2 list` — List R2 buckets

### D1
- `wrangler d1 list` — List D1 databases

### Pages
- `wrangler pages deploy --directory ./dist` — Deploy a Pages site

### Secrets
- `wrangler secret list [--name worker-name]` — List Worker secrets

### Full Access
- `wrangler _ _` — Passthrough for any wrangler command (queues, durable-objects, mtls-certificate, etc.)

## Usage Examples
- "Deploy my Worker to Cloudflare"
- "List all my R2 buckets"
- "Initialize a new Cloudflare Worker project"
- "Show KV namespaces"
- "View logs for my Worker"
- "Deploy a Pages site from the dist directory"

## Installation

```bash
npm install -g wrangler
```

Then authenticate:
```bash
wrangler login
```

## Key Features
- **Workers**: Deploy and manage serverless functions on the edge
- **Pages**: Deploy static sites and frontend apps
- **KV**: Key-value storage at the edge
- **R2**: Object storage compatible with S3 API
- **D1**: Serverless SQL database
- **Queues**: Message queues at the edge
- **Secrets**: Manage environment secrets for Workers
- **Real-time logs**: Tail Worker logs in real-time
