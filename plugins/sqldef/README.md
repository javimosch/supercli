# sqldef Plugin for SuperCLI

[sqldef](https://github.com/sqldef/sqldef) is the easiest way to manage database
schemas idempotently. You keep the desired schema in a `schema.sql` file and run
`mysqldef`/`psqldef`/`sqlite3def`/`mssqldef` — it diffs the live database and emits
only the DDL needed to converge. No hand-written migrations.

## Installation

```bash
# Install sqldef binaries (pick one)
brew install sqldef
# or per-binary on Linux:
curl -sL https://github.com/sqldef/sqldef/releases/latest/download/mysqldef_linux_amd64.tar.gz | tar xz
sudo mv mysqldef /usr/local/bin/

# Install supercli plugin
supercli plugins install ./plugins/sqldef
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli sqldef self version` | Show sqldef version |
| `supercli sqldef postgres apply <db> --file schema.sql` | Apply schema to PostgreSQL |
| `supercli sqldef postgres export <db>` | Dump current PostgreSQL schema |
| `supercli sqldef mysql apply <db> --file schema.sql` | Apply schema to MySQL |
| `supercli sqldef mysql export <db>` | Dump current MySQL schema |
| `supercli sqldef sqlite apply <dbfile> --file schema.sql` | Apply schema to SQLite file |
| `supercli sqldef sqlite export <dbfile>` | Dump SQLite schema |
| `supercli sqldef <any>` | Passthrough to mysqldef CLI |

## Usage

```bash
# Preview then apply to PostgreSQL
supercli sqldef postgres apply mydb --file schema.sql --dry-run
supercli sqldef postgres apply mydb --file schema.sql

# Export the live schema as a starting point
supercli sqldef mysql export mydb > schema.sql
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
