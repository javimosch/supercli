# Disk Analyzer Plugin for SuperCLI

Advanced disk usage analyzer for local systems with file type aggregation, large file detection, and cleanup recommendations.

## Installation

```bash
# Download and install
cd /tmp
curl -LO https://raw.githubusercontent.com/javimosch/supercli/main/plugins/disk-analyzer/disk-analyzer.sh
chmod +x disk-analyzer.sh
sudo mv disk-analyzer.sh /usr/local/bin/disk-analyzer

# Verify installation
disk-analyzer version
```

## Usage

### Analyze directory usage
```bash
# Basic analysis
disk-analyzer analyze /home/user

# With depth control
disk-analyzer analyze /home/user --depth 3

# JSON output
disk-analyzer analyze /var/log --depth 2 --json
```

### Find large files
```bash
# Find files > 100MB
disk-analyzer large-files /home/user --min-size 100M

# Top 20 large files
disk-analyzer large-files /var --top 20

# JSON output
disk-analyzer large-files /home/user --min-size 1G --json
```

### Analyze file types
```bash
# File type distribution
disk-analyzer file-types /home/user/projects

# JSON output
disk-analyzer file-types /var/lib --json
```

### Generate cleanup recommendations
```bash
# Conservative cleanup report
disk-analyzer cleanup-report /home/user

# Aggressive mode
disk-analyzer cleanup-report /var/log --aggressive

# JSON output
disk-analyzer cleanup-report /home/user --json
```

## Options

- `--json` - Output in JSON format
- `--min-size SIZE` - Minimum file size (e.g., 100M, 1G)
- `--depth N` - Directory depth for analysis (default: 2)
- `--top N` - Show top N results (default: 10)
- `--aggressive` - More aggressive cleanup recommendations

## Features

- **Directory size analysis** with depth control
- **Large file detection** with size thresholds
- **File type aggregation** by extension
- **Cleanup recommendations** with safety modes
- **JSON output** for machine parsing
- **No external dependencies** (uses standard Unix utilities)

## Common Cleanup Targets

The cleanup report identifies common space-consuming items:
- `node_modules` - Development dependencies
- `.git` - Git repositories (use with caution)
- `.cache` - Application cache
- `*.log` - Log files
- `*tmp*` - Temporary files

## Examples

### Quick disk usage check
```bash
disk-analyzer analyze . --depth 1
```

### Find space hogs
```bash
disk-analyzer large-files . --min-size 500M --top 5
```

### Analyze project composition
```bash
disk-analyzer file-types ~/projects/myapp
```

### Generate cleanup plan
```bash
disk-analyzer cleanup-report ~/Downloads --aggressive
```

## Requirements

- Linux or macOS
- Standard Unix utilities: `du`, `find`, `sort`, `ls`, `wc`
- Bash shell

## License

MIT