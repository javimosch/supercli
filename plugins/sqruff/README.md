# sqruff Plugin for SuperCLI

[sqruff](https://github.com/quarylabs/sqruff) is a fast SQL linter and formatter written
in Rust. It implements SQLFluff-compatible rules across 20+ SQL dialects (Postgres,
BigQuery, Snowflake, DuckDB, MySQL...) and is dramatically faster than SQLFluff on
large SQL codebases.

## Installation

```bash
# Install sqruff binary (pick one)
cargo install sqruff
# or: brew install sqruff
# or: pipx install sqruff

# Install supercli plugin
supercli plugins install ./plugins/sqruff
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli sqruff self version` | Show sqruff version |
| `supercli sqruff sql lint [path]` | Lint SQL files/directories |
| `supercli sqruff sql fix [path]` | Auto-fix lint violations |
| `supercli sqruff rules list` | List lint rules |
| `supercli sqruff dialects list` | List supported dialects |
| `supercli sqruff <any>` | Passthrough to sqruff CLI |

## Usage

```bash
# Lint with a specific dialect
supercli sqruff sql lint models/ --dialect postgres

# Auto-fix in place
supercli sqruff sql fix models/

# Parse a query (AST debug)
supercli sqruff parse query.sql --dialect bigquery
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
