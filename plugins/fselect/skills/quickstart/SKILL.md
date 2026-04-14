---
name: fselect
description: Use this skill when the user wants to find files using SQL-like queries, search by date, size, metadata, or format output as CSV/JSON/HTML.
---

# Fselect Plugin

Find files with SQL-like queries.

## Commands

### Query Execution
- `fselect query execute` — Execute SQL-like file search query

## Usage Examples

Basic searches:
```
fselect path from /home/user where name = '*.cfg'
fselect size, path from /home/user where size gt 2g
fselect path from /tmp where modified = today
```

With formatting:
```
fselect size, path from /home/user limit 5 into json
fselect size, path from /home/user limit 5 into csv
```

Complex queries:
```
fselect "name from /tmp where (name = *.tmp and size = 0) or (name = *.cfg and size > 1m)"
fselect "ext, count(*) from /tmp group by ext"
fselect "path from /home/user where path =~ '.*Rust.*'"
```

Search by metadata:
```
fselect path from /home/user/photos where width gte 2000 or height gte 2000
fselect duration, path from /home/user/music where genre = Rap and bitrate = 320
```

## Installation

```bash
cargo install fselect
```

Or via package manager:
```bash
brew install fselect        # macOS
apt install fselect         # Debian/Ubuntu
```

## Key Features
- SQL-like grammar for file queries
- Complex queries with subqueries
- Aggregate functions (MIN, MAX, AVG, SUM, COUNT)
- Date and time filtering
- Search within archives (zip)
- `.gitignore` support
- Image dimensions and EXIF metadata
- MP3 info and metadata
- File hashes and MIME types
- Output formats: CSV, JSON, HTML
- Interactive mode (`-i`)