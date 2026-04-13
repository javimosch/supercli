---
name: supabase.quickstart
description: Agent workflow for database migrations, edge functions, secrets, and storage management via Supabase CLI passthrough.
tags: supabase,database,postgres,migrations,edge-functions,secrets,storage,auth
---

# supabase Quickstart

Use this when AI agents need to manage Supabase projects — database, migrations, functions, secrets, or storage.

## 1) Install plugin and dependency

```bash
supercli plugins learn supabase
npm install -g supabase
supabase --version
supercli plugins install ./plugins/supabase --on-conflict replace --json
```

## 2) Validate CLI wiring

```bash
supabase --version
supercli plugins doctor supabase --json
```

## 3) Core command patterns

### Projects & Linking
```bash
supercli supabase projects list --json
supercli supabase link --project-ref <ref>
```

### Database operations
```bash
# Local development
supercli supabase db start
supercli supabase db reset --local

# Remote (requires link)
supercli supabase db push --linked
supercli supabase db pull --linked
supercli supabase db diff --linked
supercli supabase db lint --local
```

### Migrations
```bash
supercli supabase migration new create_users_table
supercli supabase migration list --local
supercli supabase migration list --linked
supercli supabase migration up --local
supercli supabase migration up --linked
supercli supabase migration down --local
```

### Edge Functions
```bash
supercli supabase functions list --linked
supercli supabase functions new my_function --linked
supercli supabase functions deploy my_function --linked
supercli supabase functions serve my_function
supercli supabase functions delete my_function --linked
```

### Secrets management
```bash
supercli supabase secrets list --linked
supercli supabase secrets set STRIPE_KEY=sk_xxx --linked
supercli supabase secrets unset STRIPE_KEY --linked
```

### Storage
```bash
supercli supabase storage ls --linked
supercli supabase storage cp file.txt bucket/path --linked
supercli supabase storage rm bucket/path --linked
```

### Types generation
```bash
supercli supabase gen types --local --lang typescript
supercli supabase gen types --linked --lang typescript
```

## 4) When to use --linked vs --local

| Flag | Use case |
|------|----------|
| `--local` | Docker-based local development |
| `--linked` | Remote Supabase project (requires `supabase link`) |

## 5) Agent workflow examples

### Deploy schema changes
```bash
# 1. Pull remote schema
supercli supabase db pull --linked
# 2. Create migration
supercli supabase migration new add_columns
# 3. Edit migration file, then push
supercli supabase db push --linked
```

### Deploy edge function
```bash
# 1. List existing functions
supercli supabase functions list --linked
# 2. Create new function
supercli supabase functions new my_handler
# 3. Deploy
supercli supabase functions deploy my_handler --linked
```

## 6) Safety levels

| Command | Level | Description |
|---------|-------|-------------|
| `projects list`, `migration list`, `secrets list` | safe | Read-only |
| `functions list`, `db diff`, `db lint` | safe | Analysis only |
| `db push`, `migration up`, `functions deploy` | guarded | Modifies remote |
| `db reset`, `migration down`, `functions delete` | guarded | Destructive |
| `secrets unset` | guarded | Removes data |

Guard commands may require confirmation.