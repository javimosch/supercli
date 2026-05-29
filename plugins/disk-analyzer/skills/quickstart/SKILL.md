# Disk Analyzer - Agent Quickstart

## Purpose
Advanced disk usage analysis for local systems with file type aggregation, large file detection, and cleanup recommendations.

## When to Use
- When agents need to analyze disk usage patterns
- When identifying large files for cleanup
- When generating storage optimization reports
- When monitoring file type distributions

## Basic Usage

### Analyze directory usage
```bash
disk-analyzer analyze /path/to/directory
disk-analyzer analyze /home/user --depth 3
disk-analyzer analyze /var/log --json
```

### Find large files
```bash
disk-analyzer large-files /home/user --min-size 100M
disk-analyzer large-files /var --top 20 --json
```

### Analyze file types
```bash
disk-analyzer file-types /home/user/projects
disk-analyzer file-types /var/lib --json
```

### Generate cleanup recommendations
```bash
disk-analyzer cleanup-report /home/user
disk-analyzer cleanup-report /var/log --aggressive --json
```

## Machine-Readable Output

### JSON format for parsing
```bash
disk-analyzer analyze /path --json
```

Returns structured JSON with version field:
```json
{
  "version": "1.0",
  "path": "/path/to/directory",
  "depth": 2,
  "directories": [
    {"size": "1.2G", "path": "/path/to/large/dir"},
    {"size": "500M", "path": "/path/to/other/dir"}
  ]
}
```

## Options

- `--json` - Output in JSON format
- `--min-size SIZE` - Minimum file size (e.g., 100M, 1G)
- `--depth N` - Directory depth for analysis
- `--top N` - Show top N results
- `--aggressive` - More aggressive cleanup recommendations

## Common Agent Patterns

### Check if directory exceeds size threshold
```bash
disk-analyzer analyze /path --json | jq '.directories[] | select(.size | endswith("G"))'
```

### Find files larger than specific size
```bash
disk-analyzer large-files /path --min-size 1G --json | jq -r '.files[].path'
```

### Get file type distribution
```bash
disk-analyzer file-types /path --json | jq '.file_types'
```

### Generate cleanup report and extract recommendations
```bash
disk-analyzer cleanup-report /path --json | jq '.recommendations[] | select(.count > 0)'
```

## Exit Codes
- `0` - Success
- `1` - Error (invalid arguments, directory not found)

## Notes
- Uses standard Unix commands (du, find, sort, etc.)
- Works on Linux/macOS systems
- No external dependencies required
- JSON output follows stable schema with version field