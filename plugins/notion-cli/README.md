# Notion CLI Plugin Harness

This plugin integrates [4ier/notion-cli](https://github.com/4ier/notion-cli) into SuperCLI. It wraps the most agent-friendly Notion commands and provides a full namespace passthrough for the upstream CLI.

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
supercli notion self version --json
```

### Auth

```bash
supercli notion auth status --json
```

### Search

```bash
supercli notion search run "meeting notes" --json
```

### Pages

```bash
supercli notion page list --json
supercli notion page view <pageId> --json
supercli notion page create <dbId> --db "Name=Task" --db "Status=Todo" --json
```

### Databases

```bash
supercli notion db list --json
supercli notion db query <dbId> --filter "Status=Done" --sort "Date:desc" --json
```

### Blocks

```bash
supercli notion block list <pageId> --md --depth 3 --json
supercli notion block append <pageId> --file document.md --json
```

### Users

```bash
supercli notion user list --json
```

### Raw API Requests

```bash
supercli notion api request GET /v1/users/me --json
```

### Full Passthrough

Run any upstream notion command through the `notion` namespace:

```bash
supercli notion _ _ -- --help
```

## Output

Wrapped commands return a SuperCLI JSON envelope when `--json` is used. The upstream CLI auto-detects JSON output when piped.

## Key Features

- Full Notion API coverage in a single binary
- JSON output when piped, colored tables in terminal
- Schema-aware database queries with human-friendly filters
- Markdown I/O for reading and writing page content
- URL or ID support for pages and databases
