# DuckDB Quickstart Guide

DuckDB is an in-process SQL OLAP database system designed for high-speed analytical queries. It can read CSV, Parquet, and JSON files directly without importing, making it perfect for data exploration and transformation.

## Installation

```bash
brew install duckdb
```

Or via Homebrew on Linux, or download precompiled binaries from [GitHub](https://github.com/duckdb/duckdb/releases).

## Basic Usage

### Interactive shell
```bash
duckdb
```

### Query CSV file directly
```bash
duckdb -c "SELECT * FROM read_csv('data.csv') LIMIT 10"
```

### Query Parquet file
```bash
duckdb -c "SELECT COUNT(*) FROM read_parquet('data.parquet')"
```

### Query JSON
```bash
duckdb -c "SELECT * FROM read_json('data.json')"
```

## Common Operations

### Read and filter data
```bash
duckdb :memory: "SELECT name, age FROM read_csv('people.csv') WHERE age > 30"
```

### Aggregate and group
```bash
duckdb -c "SELECT category, COUNT(*) as count FROM read_csv('sales.csv') GROUP BY category"
```

### Join multiple files
```bash
duckdb -c "SELECT * FROM read_csv('orders.csv') o JOIN read_csv('customers.csv') c ON o.customer_id = c.id"
```

### Write results to file
```bash
duckdb -c "COPY (SELECT * FROM read_csv('input.csv')) TO 'output.parquet' (FORMAT PARQUET)"
```

## File Formats Supported

- **CSV** - `read_csv('file.csv')`
- **Parquet** - `read_parquet('file.parquet')`
- **JSON** - `read_json('file.json')`
- **JSON Lines** - `read_ndjson('file.ndjson')`
- **Excel** - `read_excel('file.xlsx')`
- **Avro** - `read_avro('file.avro')`
- **Iceberg** - `read_iceberg('table')`

## Database Persistence

### Work in-memory (temporary)
```bash
duckdb :memory:
```

### Create persistent database
```bash
duckdb mydb.duckdb
# Now all queries are saved to mydb.duckdb
```

### Open existing database
```bash
duckdb mydb.duckdb
```

## Advanced Queries

### Window functions
```bash
duckdb -c "
SELECT name, salary, 
       AVG(salary) OVER (PARTITION BY dept) as dept_avg
FROM read_csv('employees.csv')
"
```

### CTEs (Common Table Expressions)
```bash
duckdb -c "
WITH filtered AS (
  SELECT * FROM read_csv('data.csv') WHERE age > 25
)
SELECT COUNT(*) FROM filtered
"
```

### Generate data
```bash
duckdb -c "SELECT * FROM range(1, 10)"
```

### Statistical functions
```bash
duckdb -c "
SELECT 
  AVG(value) as mean,
  STDDEV(value) as std,
  MIN(value) as min,
  MAX(value) as max
FROM read_csv('metrics.csv')
"
```

## Real-world Use Cases

### Analyze log files
```bash
duckdb -c "
SELECT timestamp, COUNT(*) as errors
FROM read_json('app.log')
WHERE level = 'ERROR'
GROUP BY timestamp
"
```

### Data quality checks
```bash
duckdb -c "
SELECT 
  SUM(CASE WHEN id IS NULL THEN 1 ELSE 0 END) as null_ids,
  COUNT(DISTINCT id) as unique_ids
FROM read_csv('data.csv')
"
```

### Convert file formats
```bash
# CSV to Parquet
duckdb -c "COPY (SELECT * FROM read_csv('data.csv')) TO 'data.parquet' (FORMAT PARQUET)"

# JSON to CSV
duckdb -c "COPY (SELECT * FROM read_json('data.json')) TO 'data.csv' (FORMAT CSV)"
```

### Quick data validation
```bash
duckdb -c "
SELECT COUNT(*), COUNT(DISTINCT name), 
       MAX(LENGTH(name)) as max_name_len
FROM read_csv('users.csv')
"
```

## Performance Tips

- DuckDB automatically parallelizes queries across CPU cores
- Use Parquet format for large datasets (much faster than CSV)
- Filter data early in queries to reduce memory usage
- Use appropriate data types (don't read everything as VARCHAR)
- DuckDB spills to disk for very large workloads

## Command-line Options

- `-c <QUERY>` - Execute query and exit
- `-readonly` - Open database in read-only mode
- `-unsigned` - Enable unsigned integer types
- `-json` - Output results as JSON lines
- `-csv` - Output as CSV (default)
- `-noheader` - No header row in output
- `-separator <SEP>` - Custom delimiter (default: `,`)

## Scripting

### From file
```bash
duckdb mydb.duckdb < queries.sql
```

### Multiple queries
```bash
duckdb -c "
  CREATE TABLE my_table AS SELECT * FROM read_csv('input.csv');
  SELECT * FROM my_table LIMIT 10;
"
```

## Memory Management

DuckDB automatically:
- Uses multi-threading for parallelization
- Spills to disk when memory is insufficient
- Optimizes query execution plans
- Manages buffer pools efficiently

For very large datasets:
```bash
# Query with explicit memory limit
duckdb -c "PRAGMA memory_limit='4GB'; SELECT * FROM read_parquet('big.parquet')"
```

## Integration with Other Tools

### Pipe with other commands
```bash
cat data.csv | duckdb -c "SELECT * FROM read_csv('/dev/stdin') WHERE value > 100"
```

### Combined with jq
```bash
duckdb -c "SELECT * FROM read_json('data.json')" | jq '.[] | select(.active == true)'
```

## Resources

- [Official Documentation](https://duckdb.org/docs/)
- [GitHub Repository](https://github.com/duckdb/duckdb)
- [SQL Reference](https://duckdb.org/docs/sql/introduction)
- [Function Reference](https://duckdb.org/docs/sql/functions/overview)
- [Awesome DuckDB](https://github.com/davidgasquez/awesome-duckdb)

## Troubleshooting

### "File not found" error
Ensure path is relative or absolute:
```bash
duckdb -c "SELECT * FROM read_csv('./data/file.csv')"
```

### Out of memory
Reduce data or use Parquet format:
```bash
# Convert CSV to Parquet first
duckdb -c "COPY (SELECT * FROM read_csv('large.csv')) TO 'large.parquet' (FORMAT PARQUET)"
```

### Slow queries
Use EXPLAIN to see query plan:
```bash
duckdb -c "EXPLAIN SELECT * FROM read_csv('data.csv') WHERE id > 1000"
```
