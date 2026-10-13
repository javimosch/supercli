# tbls Plugin for SuperCLI

[tbls](https://github.com/k1LoW/tbls) is a CI-friendly database documentation generator.
It documents a database's schema in Markdown — tables, columns, indexes, constraints,
relations, and ER diagrams — and supports PostgreSQL, MySQL, SQLite, BigQuery,
Snowflake, and more. It can also lint a schema and diff a database against its docs.

## Installation

```bash
# Install tbls binary (pick one)
go install github.com/k1LoW/tbls@latest
# or: brew install k1LoW/tap/tbls
# or: download .deb/.rpm/binary from GitHub releases

# Install supercli plugin
supercli plugins install ./plugins/tbls
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli tbls self version` | Show tbls version |
| `supercli tbls docs generate <dsn>` | Generate schema documentation |
| `supercli tbls lint run <dsn>` | Lint schema against tbls.yml rules |
| `supercli tbls diff check <dsn>` | Diff database vs generated docs |
| `supercli tbls schema out <dsn>` | Dump schema (use `-t json` for JSON) |
| `supercli tbls <any>` | Passthrough to tbls CLI |

## Usage

```bash
# Generate docs for a Postgres database into ./dbdoc
supercli tbls docs generate postgres://user:pass@localhost:5432/mydb

# Lint using rules in tbls.yml
supercli tbls lint run postgres://user:pass@localhost:5432/mydb

# Export the schema as JSON
supercli tbls out -t json sqlite://app.db
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
