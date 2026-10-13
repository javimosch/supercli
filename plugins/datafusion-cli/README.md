# datafusion-cli Plugin for SuperCLI

[datafusion-cli](https://github.com/apache/datafusion) is Apache DataFusion's
standalone SQL command-line tool. Query CSV, Parquet, JSON, and Avro files directly
with standard SQL — register them as external tables, join them, aggregate, and get
results as tables, CSV, or JSON. No server, no daemon.

## Installation

```bash
# Install datafusion-cli (pick one)
cargo install datafusion-cli
# or: brew install datafusion

# Install supercli plugin
supercli plugins install ./plugins/datafusion-cli
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli datafusion-cli self version` | Show version |
| `supercli datafusion-cli query exec "<sql>"` | Run SQL non-interactively |
| `supercli datafusion-cli file run <script.sql>` | Run a SQL script file |
| `supercli datafusion-cli repl open` | Interactive SQL REPL |
| `supercli datafusion-cli <any>` | Passthrough to the CLI |

## Usage

```bash
# Query a Parquet file directly
supercli datafusion-cli query exec \
  "CREATE EXTERNAL TABLE t STORED AS PARQUET LOCATION 'data.parquet'; \
   SELECT count(*) FROM t;"

# Machine-readable output for scripting
supercli datafusion-cli query exec "SELECT * FROM 'file.csv' LIMIT 5" --format json

# Run a whole SQL script
supercli datafusion-cli file run analysis.sql
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
