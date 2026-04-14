---
name: diesel-guard
description: Use this skill when the user wants to lint Postgres migrations for unsafe patterns, prevent downtime from bad migrations, or check Diesel/SQLx migration safety.
---

# diesel-guard Plugin

Linter for dangerous Postgres migration patterns in Diesel and SQLx.

## Commands

### Check
- `diesel-guard migration check` — Check migrations for unsafe patterns

## Usage Examples
- "Lint migrations for unsafe patterns"
- "Initialize diesel-guard config"
- "Check specific migration files"

## Installation

```bash
cargo install diesel-guard
```

Or:
```bash
brew install ayarotsky/tap/diesel-guard
```

## Examples

```bash
# Initialize
diesel-guard init

# Check migrations
diesel-guard check

# Check specific path
diesel-guard check ./migrations/

# CI with GitHub Actions
# - uses: ayarotsky/diesel-guard-action@v1
```

## Key Features
- Uses libpg_query (Postgres parser)
- Detects table-locking operations
- Works with Diesel and SQLx
- Safety-assured blocks for verified ops
- Version-aware checks
- No DB connection required
