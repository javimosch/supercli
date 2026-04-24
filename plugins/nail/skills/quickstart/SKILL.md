---
name: nail
description: Use this skill when the user wants to analyze, describe, convert, filter, transform, or inspect Parquet, CSV, or XLSX datasets from the command line.
---

# nail Plugin

Lightning-fast data analysis CLI for Parquet, CSV, and XLSX files. Describe, filter, transform, join, compare, and analyze datasets with rich statistics and schema introspection.

## Commands

### Data Analysis
- `nail data describe` — Show global file overview and metadata
- `nail data stats` — Calculate descriptive statistics
- `nail data head` — Display first N rows
- `nail data schema` — Display schema information
- `nail data convert` — Convert between file formats

### Utility
- `nail self version` — Print nail version
- `nail _ _` — Passthrough to nail CLI

## Usage Examples
- "Describe this Parquet file"
- "Show the first 20 rows of the dataset"
- "Calculate statistics for the price and volume columns"
- "Convert this CSV to Parquet"
- "Show the schema of the data file"

## Installation

```bash
cargo install nail-parquet
```

## Examples

```bash
# Describe a dataset
nail data describe sales.parquet

# Statistics for specific columns
nail data stats sales.parquet -c "revenue,profit" --percentiles "0.5,0.9,0.99"

# Correlation matrix
nail _ _ correlations sales.parquet -c "price,volume,discount" --tests t_test

# Frequency distribution
nail _ _ frequency sales.parquet -c "category,region"

# First 20 rows
nail data head sales.parquet -n 20

# Display schema
nail data schema sales.parquet

# Convert CSV to Parquet
nail data convert data.csv -o data.parquet

# Convert Parquet to JSON
nail data convert data.parquet -o data.json -f json

# Remove duplicates
nail _ _ dedup raw.parquet --row-wise -c "id" -o unique.parquet

# Detect and remove outliers
nail _ _ outliers unique.parquet -c "price" --method iqr --remove -o cleaned.parquet

# Create a new column
nail _ _ create cleaned.parquet --column "margin=(price-cost)/price" -o enriched.parquet

# Bin continuous variables
nail _ _ binning opt.parquet -c "age" -b "18,25,35,50,65" --method custom --labels "18-24,25-34,35-49,50-64,65+" -o binned.parquet

# Pivot table
nail _ _ pivot binned.parquet -i "age_binned" -c "category" -l "revenue" --agg sum -o summary.parquet

# Compare two datasets
nail _ _ diff yesterday.parquet --compare today.parquet --keys "id" --changes-only
```

## Key Features
- **Multi-format support**: Parquet, CSV, XLSX, JSON, and text output
- **Rich statistics**: Descriptive stats, correlations, frequency distributions, outliers
- **Data transformation**: dedup, filter, binning, pivot, merge, split, sort, shuffle
- **Schema introspection**: Display column types, metadata, and schema details
- **Format conversion**: Convert between Parquet, CSV, XLSX, JSON, and text
- **Column operations**: Create, rename, drop, select, fill missing values
- **Row operations**: head, tail, sample, preview, filter, deduplicate
- **Join datasets**: merge two datasets on common keys
- **Compare datasets**: diff with key-based change detection
- **Performance**: Multi-threaded with `-j` jobs flag
- **Output control**: `-o` for output file, `-f` for format override

## Notes
- Use `nail <command> --help` for full usage details of any subcommand
- The `-f` flag overrides output format: json, csv, parquet, or text
- The `-j` flag controls parallelism (useful for large datasets)
- Many commands support `-o` to write results to a file instead of stdout
- nail auto-detects input format from file extension
