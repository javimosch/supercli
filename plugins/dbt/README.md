# dbt Plugin for SuperCLI

[dbt Core](https://github.com/dbt-labs/dbt-core) is the industry-standard analytics
engineering tool. You write plain `select` statements as *models*; dbt compiles them
to your warehouse's SQL dialect, executes them in dependency order, and runs data
tests against the results.

## Installation

```bash
# Install dbt (pick one)
pipx install dbt-core
pipx inject dbt-core dbt-postgres   # required: a warehouse adapter
# or: pip install dbt-core dbt-duckdb  (inside a venv)

# Install supercli plugin
supercli plugins install ./plugins/dbt
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli dbt self version` | Show dbt + adapter versions |
| `supercli dbt project init` | Scaffold a new dbt project |
| `supercli dbt models run` | Run models |
| `supercli dbt tests run` | Run data tests |
| `supercli dbt build run` | Models + tests + seeds + snapshots in DAG order |
| `supercli dbt deps install` | Install packages.yml dependencies |
| `supercli dbt debug check` | Validate profile/connection |
| `supercli dbt docs generate` | Generate catalog + manifest |
| `supercli dbt parse run` | Parse project (syntax check) |
| `supercli dbt <any>` | Passthrough to dbt CLI |

## Usage

```bash
# Inside a dbt project (dbt_project.yml present)
supercli dbt debug check
supercli dbt models run --select staging+
supercli dbt tests run --select orders
supercli dbt ls --resource-type model --output json
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
