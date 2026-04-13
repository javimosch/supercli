# Supabase Plugin for SuperCLI

Semantic commands + passthrough for Supabase CLI — database migrations, edge functions, secrets, and storage management.

## Installation

```bash
# Install Supabase CLI first
npm install -g supabase

# Install the plugin
supercli plugins install ./plugins/supabase --on-conflict replace --json
```

## Authentication

```bash
# Login to Supabase (required for remote operations)
supabase login

# Link to a project (required for --linked commands)
supabase link --project-ref <your-project-ref>
```

## Commands

### Wrapped Commands
```bash
supercli supabase projects list --json
```

### Full Passthrough
All Supabase CLI commands work through passthrough:

```bash
# Database
supercli supabase db push --linked
supercli supabase db pull --linked
supercli supabase db reset --local

# Migrations
supercli supabase migration new create_users
supercli supabase migration list --linked
supercli supabase migration up --local

# Edge Functions
supercli supabase functions list --linked
supercli supabase functions deploy my_func --linked
supercli supabase functions delete my_func --linked

# Secrets
supercli supabase secrets list --linked
supercli supabase secrets set API_KEY=xxx --linked
supercli supabase secrets unset API_KEY --linked

# Storage
supercli supabase storage ls --linked

# Types
supercli supabase gen types --linked --lang typescript
```

## Flags

| Flag | Description |
|------|-------------|
| `--linked` | Use remote Supabase project |
| `--local` | Use local Docker database |
| `--output json` | JSON output |

## Local Development

```bash
# Start local Supabase stack
supabase init
supabase start

# Local database operations
supercli supabase db reset --local
supercli supabase migration up --local
```

## Requirements

- `supabase` CLI (`npm install -g supabase`)
- For remote: Supabase account + linked project
- For local: Docker Desktop running