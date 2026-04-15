# ghgrab Quickstart

Use ghgrab to search and download files from GitHub directly from your terminal.

## Commands

- `ghgrab search [query]` - Search for files on GitHub
- `ghgrab download [owner] [repo] [path]` - Download a specific file from a GitHub repository
- `ghgrab version` - Show version information

## Installation

Requires Go to be installed:
```bash
go install github.com/abhixdd/ghgrab@latest
```

## Usage Examples

Search for a file:
```bash
ghgrab search config.yaml
```

Download a file from a repository:
```bash
ghgrab download owner repo path/to/file.txt
```
