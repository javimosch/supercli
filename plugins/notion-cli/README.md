# Notion CLI Plugin Harness

This plugin integrates [4ier/notion-cli](https://github.com/4ier/notion-cli) into dcli. It wraps the most agent-friendly Notion commands and provides a full namespace passthrough for the upstream CLI.

## Prerequisites

A Notion integration token is required. Create one at https://www.notion.so/profile/integrations and authenticate:

```bash
echo "ntn_xxxxx" | notion auth login --with-token
# or
export NOTION_TOKEN=ntn_xxxxx
```

Verify the binary is available:

```bash
notion --version
```

## Installation

`go install` builds a binary named `notion-cli`. Symlink or rename it to `notion`:

```bash
go install github.com/4ier/notion-cli@latest
GOBIN=$(go env GOBIN); GOPATH=$(go env GOPATH); ln -sf "${GOBIN:-$GOPATH/bin}/notion-cli" "${GOBIN:-$GOPATH/bin}/notion"
```

Other install methods include Homebrew (`brew install 4ier/tap/notion-cli`), npm (`npm install -g @4ier/notion-cli`), GitHub Releases, or Scoop on Windows.

## Available Commands

### Version

```bash
dcli notion self version --json
```

### Auth

```bash
dcli notion auth status --json
```

### Search

```bash
dcli notion search run "meeting notes" --json
```

### Pages

```bash
dcli notion page list --json
dcli notion page view <pageId> --json
dcli notion page create <dbId> --db "Name=Task" --db "Status=Todo" --json
```

### Databases

```bash
dcli notion db list --json
dcli notion db query <dbId> --filter "Status=Done" --sort "Date:desc" --json
```

### Blocks

```bash
dcli notion block list <pageId> --md --depth 3 --json
dcli notion block append <pageId> --file document.md --json
```

### Users

```bash
dcli notion user list --json
```

### Raw API Requests

```bash
dcli notion api request GET /v1/users/me --json
```

### Full Passthrough

Run any upstream notion command through the `notion` namespace:

```bash
dcli notion _ _ -- --help
```

## Output

Wrapped commands return a dcli JSON envelope when `--json` is used. The upstream CLI auto-detects JSON output when piped.

## Key Features

- Full Notion API coverage in a single binary
- JSON output when piped, colored tables in terminal
- Schema-aware database queries with human-friendly filters
- Markdown I/O for reading and writing page content
- URL or ID support for pages and databases
