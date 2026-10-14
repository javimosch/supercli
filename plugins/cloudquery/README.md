# cloudquery Plugin for SuperCLI

[CloudQuery](https://github.com/cloudquery/cloudquery) is an open-source cloud
asset inventory CLI. It syncs configuration data from AWS, GCP, Azure,
Kubernetes, and 70+ other sources into Postgres, SQLite, BigQuery, and other
destinations — so you can audit your entire infrastructure with plain SQL.

## Installation

```bash
brew install cloudquery/tap/cloudquery
# or download from https://github.com/cloudquery/cloudquery/releases

# Install supercli plugin
supercli plugins install ./plugins/cloudquery
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli cloudquery self version` | Show cloudquery version |
| `supercli cloudquery sync run` | Run a sync from spec files/directory |
| `supercli cloudquery login open` | Authenticate with CloudQuery Cloud |
| `supercli cloudquery plugin docs` | Show plugin tables/columns/config |
| `supercli cloudquery <any>` | Passthrough to cloudquery CLI |

## Usage

```bash
# Sync a specs directory (source + destination YAML pairs)
supercli cloudquery sync run ./specs/

# Inspect what the AWS source plugin produces
supercli cloudquery plugin docs cloudquery/aws
```

Note: `cloudquery login` is required for most source plugins since v6.

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
