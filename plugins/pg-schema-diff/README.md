# pg-schema-diff Plugin for SuperCLI

[pg-schema-diff](https://github.com/stripe/pg-schema-diff) is Stripe's Postgres
schema diffing and migration-planning tool. It diffs a live database against a
desired schema (a directory of `.sql` files or another DSN), generates a migration
plan, validates it against a temporary database, and flags hazards like missing
index coverage or long-held locks.

## Installation

```bash
# Install pg-schema-diff binary (pick one)
brew install pg-schema-diff
# or: go install github.com/stripe/pg-schema-diff/cmd/pg-schema-diff@latest
# or: prebuilt binary from GitHub releases

# Install supercli plugin
supercli plugins install ./plugins/pg-schema-diff
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli pg-schema-diff self version` | Show version |
| `supercli pg-schema-diff plan generate` | Generate migration plan (`--from-dsn`/`--to-dir`, `--output-format json`) |
| `supercli pg-schema-diff apply run` | Apply the planned migration |
| `supercli pg-schema-diff schema dump` | Dump live DB schema to .sql files |
| `supercli pg-schema-diff <any>` | Passthrough to pg-schema-diff CLI |

## Usage

```bash
# Diff a live DB against desired schema files, machine-readable
supercli pg-schema-diff plan generate \
  --from-dsn "postgres://postgres@localhost:5432/mydb" \
  --to-dir ./schema --output-format json

# Snapshot a live schema to files
supercli pg-schema-diff schema dump \
  --dsn "postgres://postgres@localhost:5432/mydb" --output-dir ./schema
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
