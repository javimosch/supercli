# Coding Agent Session Search (cass) Skill

Search across your local coding agent history (Codex, Claude Code, Gemini CLI, Cline, Cursor, Aider, etc.) to reuse past solutions and debugging context.

## Commands
- `cass <resource> <action>` — Execute cass commands
- `cass cli setup` — Install coding-agent-search (cass) dependency
- `cass index health` — Check if the search index is healthy
- `cass index run` — Rebuild or update the search index
- `cass search run` — Search across all agent history
- `cass session view` — View a specific session by path
- `cass session expand` — Expand context around a search hit
- `cass activity stats` — Show aggregate history statistics
- `cass activity timeline` — Display activity timeline

## Quick Start

### 1. Setup
Install `cass` and verify installation:
```bash
dcli cass cli setup
```

### 2. Index History
Rebuild the search index to include recent sessions:
```bash
dcli cass index run --full
```

### 3. Search Across Sessions
Search for specific errors or implementation patterns:
```bash
dcli cass search run --query "authentication error in react" --limit 5
```

### 4. View Session Context
Once you find a hit, view the conversation detail:
```bash
dcli cass session view --path /path/to/session.jsonl --line-number 42
```

Or expand context around the hit:
```bash
dcli cass session expand --path /path/to/session.jsonl --line-number 42 --context 5
```

### 5. Check Activity
See statistics about your agent usage:
```bash
dcli cass activity stats
```

## Tips for Agents
- **Robot Mode**: This plugin always uses `--robot` or `--json` to ensure clean, parseable output.
- **Cross-Agent Knowledge**: Use `cass` to find how *other* agents solved similar problems in this or other codebases.
- **Index Freshness**: If results seem outdated, run `dcli cass index run` to update the index.
- **Semantic Search**: If the `cass` binary is configured with model files, you can use `--mode semantic` or `--mode hybrid` for better conceptual matches.
