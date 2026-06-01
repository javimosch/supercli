---
name: dkit
description: Use this skill when the user wants to convert, query, or explore data across formats (JSON, CSV, YAML, TOML, XML, etc.).
---

# dkit Plugin

Unified CLI to convert, query, and explore data across 20+ formats. Acts as a swiss army knife for data format manipulation.

## Commands
- `dkit self version` — Print dkit version
- `dkit data convert` — Convert data between formats (JSON, CSV, YAML, TOML, XML, etc.)
- `dkit data query` — Query data using dot notation
- `dkit data view` — View data as formatted table
- `dkit data stats` — Compute statistics on data files
- `dkit data diff` — Diff two data files, even across formats

## Usage Examples
- "convert this JSON file to YAML"
- "query the records where name contains Smith"
- "view this CSV as a table"
- "get statistics on this data file"

## Installation

```bash
cargo install dkit
```

## Key Features
- Convert between JSON, CSV, YAML, TOML, XML, MessagePack, Parquet, Excel, SQLite, and more
- Built-in query engine with dot notation
- Table preview for any data format
- File diff across different formats
- Statistics: count, average, percentiles, histograms
