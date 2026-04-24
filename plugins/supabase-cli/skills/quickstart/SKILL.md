---
name: supabase-cli
description: Use this skill when the user wants to manage Supabase projects, run database migrations, deploy edge functions, or interact with Supabase from the command line.
---

# supabase-cli Plugin

Supabase CLI. Manage your Supabase projects, databases, edge functions, and authentication directly from the command line.

## Commands

### Database Management
- `supabase-cli db migrate` — Run database migrations

### Edge Functions
- `supabase-cli function deploy` — Deploy an edge function

### Utility
- `supabase-cli _ _` — Passthrough to supabase CLI

## Usage Examples
- "Run database migrations"
- "Deploy edge function"
- "Manage Supabase project"
- "Start local Supabase"

## Installation

```bash
brew install supabase/tap/supabase
```

Or via npm:
```bash
npm install -g supabase
```

## Examples

```bash
# Push database migrations
supabase-cli db migrate

# Dry run migrations
supabase-cli db migrate --dry-run

# Deploy function
supabase-cli function deploy my-function

# Deploy to specific project
supabase-cli function deploy my-function --project-ref abcdefghijklmnopqrst

# Any supabase command with passthrough
supabase-cli _ _ start
supabase-cli _ _ status
supabase-cli _ _ db reset
```

## Key Features
- **Local dev** - Local development
- **Migrations** - Database migrations
- **Functions** - Edge functions
- **Auth** - Authentication
- **Storage** - File storage
- **Realtime** - Realtime subscriptions
- **Types** - Type generation
- **Linking** - Project linking
- **Testing** - Local testing
- **CI/CD** - Pipeline friendly

## Notes
- Requires Docker for local dev
- Great for backend development
- Supports edge functions
- Perfect for full-stack projects
