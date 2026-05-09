---
name: netlify-cli
description: Use this skill when the user wants to deploy sites to Netlify, list/manage sites, manage Netlify Functions and environment variables, or interact with the Netlify platform.
---

# Netlify CLI Plugin

Deploy and manage sites on Netlify from the terminal. Supports JSON output via `--json`.

## Prerequisites

Requires a Netlify account and authentication:

```bash
netlify login
# or
export NETLIFY_AUTH_TOKEN="..."
```

## Commands

### Auth
- `netlify auth status` — Check authentication status

### Sites
- `netlify sites list` — List all sites (JSON)
- `netlify site create --name my-site` — Create a new site

### Deploy
- `netlify deploy run --dir dist` — Create a draft deploy
- `netlify deploy run --prod --dir dist --build` — Build and deploy to production

### Functions
- `netlify functions list` — List Netlify Functions

### Environment
- `netlify env list` — List environment variables

### Build
- `netlify build run` — Build project locally

### API
- `netlify api request /api/v1/sites` — Raw Netlify REST API call

### Full Access
- `netlify _ _` — Passthrough for any command (dev, watch, link, unlink, switch, logs, etc.)

## Usage Examples
- "Deploy my site to Netlify production"
- "List all my Netlify sites"
- "What functions does my Netlify site have?"
- "Show environment variables for my Netlify site"
- "Create a new Netlify site called my-app"

## Installation

```bash
npm install -g netlify-cli
```

Then authenticate:
```bash
netlify login
```

## Key Features
- **Deploy sites**: Build and deploy to production or draft
- **JSON output**: `--json` flag on list/status commands
- **Functions**: List and manage serverless functions
- **Environment vars**: Manage per-site environment variables
- **Full API access**: Raw REST API endpoint calls
- **Netlify Dev**: Local dev server with live reloading
