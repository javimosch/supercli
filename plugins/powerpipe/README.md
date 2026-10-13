# powerpipe Plugin for SuperCLI

[Powerpipe](https://github.com/turbot/powerpipe) is dashboards-as-code from the
Steampipe team. Define SQL-powered dashboards, controls, and compliance benchmarks
in `.pp` files (HCL-like mods), run them against Postgres, SQLite, MySQL, or DuckDB,
and view interactive visualizations — or export JSON snapshots for automation.

## Installation

```bash
# Install powerpipe (pick one)
sudo /bin/sh -c "$(curl -fsSL https://powerpipe.io/install/powerpipe.sh)"
# or: brew install turbot/tap/powerpipe

# Install supercli plugin
supercli plugins install ./plugins/powerpipe
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli powerpipe self version` | Show version |
| `supercli powerpipe mod init` | Create powerpipe.mod in current dir |
| `supercli powerpipe query run "<sql>"` | Run SQL (--output json supported) |
| `supercli powerpipe dashboard run` | Run a dashboard / snapshot |
| `supercli powerpipe benchmark run` | Run a compliance benchmark |
| `supercli powerpipe server start` | Serve dashboards on :9033 |
| `supercli powerpipe mod install` | Install mod dependencies |
| `supercli powerpipe <any>` | Passthrough to powerpipe CLI |

## Usage

```bash
# Ad-hoc SQL as JSON
supercli powerpipe query run "select count(*) from users" \
  --database "postgres://localhost/mydb" --output json

# Inside a mod directory
supercli powerpipe mod init
supercli powerpipe benchmark run my_benchmark
supercli powerpipe server start   # browse dashboards
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
