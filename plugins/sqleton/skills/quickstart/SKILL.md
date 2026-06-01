# Sqleton Plugin Quickstart

## Overview

Sqleton is a powerful SQL CLI tool with rich output formatting that supports MySQL, PostgreSQL, SQLite and other databases. The supercli sqleton plugin provides convenient commands for database operations with structured JSON output, making it ideal for scripting and automation.

## Installation

The sqleton binary must be installed on your system:

```bash
# Via Go
go install github.com/go-go-golems/sqleton@latest

# Or download from releases
# https://github.com/go-go-golems/sqleton/releases
```

## Available Commands

### Execute SQL Query

```bash
sc sqleton query --db-type mysql --host localhost --user root --database mydb "SELECT * FROM users LIMIT 10"
```

Executes a SQL query and returns results in JSON format.

### Execute MySQL Query

```bash
sc sqleton query-mysql --host localhost --user root --database mydb "SELECT * FROM users"
```

Executes a SQL query on MySQL with JSON output.

### Execute PostgreSQL Query

```bash
sc sqleton query-postgres --host localhost --user postgres --database mydb "SELECT * FROM users"
```

Executes a SQL query on PostgreSQL with JSON output.

### Execute SQLite Query

```bash
sc sqleton query-sqlite --database /path/to/db.sqlite "SELECT * FROM users"
```

Executes a SQL query on SQLite with JSON output.

### Export to CSV

```bash
sc sqleton export-csv --db-type mysql --host localhost --database mydb "SELECT * FROM users"
```

Exports query results to CSV format.

### Export to YAML

```bash
sc sqleton export-yaml --db-type mysql --host localhost --database mydb "SELECT * FROM users"
```

Exports query results to YAML format.

### List Tables

```bash
sc sqleton list-tables --db-type mysql --host localhost --database mydb
```

Lists all tables in the database.

### Describe Table

```bash
sc sqleton describe-table --table users --db-type mysql --host localhost --database mydb
```

Shows the structure (columns, types) of a specific table.

### Test Connection

```bash
sc sqleton test-connection --db-type mysql --host localhost --database mydb
```

Tests the database connection.

## Output Format

JSON commands return structured output, making it easy to parse and process in scripts:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
]
```

## Use Cases

- **Database administration**: Quick queries and data inspection
- **Automation scripts**: Integrate database operations into CI/CD pipelines
- **Data export**: Export data in various formats (JSON, CSV, YAML)
- **Cross-database operations**: Work with multiple database types using consistent interface
- **Reporting**: Generate professional-formatted reports

## Caveats & Pitfalls

- **Connection security**: Avoid hardcoding passwords in command lines; use environment variables or config files
- **Large result sets**: Use LIMIT clauses for large tables to avoid excessive output
- **Database permissions**: Ensure the database user has necessary permissions for the operations
- **Port configuration**: Specify port if not using default ports for your database type
- **Character encoding**: Ensure proper encoding settings for international characters

## Examples

### Quick MySQL query

```bash
sc sqleton query-mysql --host localhost --user root --database ecommerce "SELECT COUNT(*) FROM orders"
```

### PostgreSQL query with JSON output

```bash
sc sqleton query-postgres --host localhost --user postgres --database analytics "SELECT category, SUM(revenue) FROM sales GROUP BY category"
```

### SQLite database query

```bash
sc sqleton query-sqlite --database /path/to/app.db "SELECT * FROM config"
```

### Export data to CSV

```bash
sc sqleton export-csv --db-type mysql --host localhost --database mydb "SELECT id, name, email FROM users" > users.csv
```

### List all tables in database

```bash
sc sqleton list-tables --db-type postgres --host localhost --database mydb
```

### Describe table structure

```bash
sc sqleton describe-table --table products --db-type mysql --host localhost --database ecommerce
```

### Test database connection

```bash
sc sqleton test-connection --db-type mysql --host localhost --database mydb
```