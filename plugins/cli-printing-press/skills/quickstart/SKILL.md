---
name: cli-printing-press
description: Use this skill when the user wants to generate a CLI tool from an API, browse the catalog of pre-built CLIs, or score an existing CLI for agent-readiness.
---

# cli-printing-press Plugin

Generate production CLIs from any API. Reads official docs, studies community CLIs, and prints token-efficient Go CLIs plus Claude Code skills and MCP servers.

## Commands

### Generate
- `cli-printing-press generate run --api <url>` — Generate a CLI from an API spec

### Catalog
- `cli-printing-press catalog list` — List available printed CLIs
- `cli-printing-press catalog search --query <term>` — Search catalog

### Scorecard
- `cli-printing-press scorecard run --binary <path>` — Score a CLI for agent-readiness

### Verify
- `cli-printing-press verify run --dir <path>` — Verify generated CLI against spec

### Library
- `cli-printing-press library list` — Browse the Printing Press Library

## Usage Examples
- "Generate a CLI for the Stripe API"
- "Search the catalog for a GitHub CLI"
- "Score this CLI for agent-readiness"
- "List all available printed CLIs"
- "Generate a CLI with MCP server support"

## Installation

```bash
go install github.com/mvanhorn/cli-printing-press/v4/cmd/cli-printing-press@latest
```

Or via the install script:
```bash
curl -fsSL https://raw.githubusercontent.com/mvanhorn/cli-printing-press/main/scripts/install.sh | bash
```

## Key Flags
- `--json` — JSON output for pipeline integration
- `--skill` — Also generate Claude Code skill
- `--mcp` — Also generate MCP server
