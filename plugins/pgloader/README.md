# pgloader Plugin for SuperCLI

[pgloader](https://github.com/dimitri/pgloader) is the classic ETL tool for loading
data into PostgreSQL. One command migrates an entire MySQL, SQLite, or MS SQL
database — or a CSV/dBase file — into Postgres, handling schema conversion, type
casting, and indexes automatically.

## Installation

```bash
# Install pgloader (pick one)
sudo apt-get install -y pgloader
# or: brew install pgloader
# or: build from source with SBCL (see github.com/dimitri/pgloader)

# Install supercli plugin
supercli plugins install ./plugins/pgloader
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli pgloader self version` | Show version |
| `supercli pgloader migrate run <src> <dst>` | Migrate source into Postgres |
| `supercli pgloader migrate dryrun <src> <dst>` | Dry-run without writing |
| `supercli pgloader load command <file.load>` | Run a .load command file |
| `supercli pgloader encodings list` | List supported encodings |
| `supercli pgloader <any>` | Passthrough to pgloader CLI |

## Usage

```bash
# MySQL -> Postgres in one shot
supercli pgloader migrate run \
  "mysql://root:pass@localhost/sakila" \
  "postgresql://postgres@localhost/sakila"

# CSV -> Postgres
supercli pgloader migrate run data.csv "postgresql://localhost/mydb"

# SQLite -> Postgres
supercli pgloader migrate run sqlite:///app.db "postgresql://localhost/mydb"
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
