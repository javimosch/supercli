---
name: mmx.agent-guide
description: Agent-facing guide for mmx CLI — agent flags, piping patterns, tool schema export, async video workflow, streaming, and CI/CD examples.
tags: mmx,minimax,agent,ci-cd,piping,streaming,async,tool-schema
---

# mmx Agent Guide

Advanced patterns for AI agents and CI/CD pipelines using the mmx CLI.

## Agent Flags Reference

These flags are essential in non-interactive contexts:

| Flag | Purpose |
|---|---|
| `--non-interactive` | Fail fast on missing args instead of prompting |
| `--quiet` | Suppress spinners/progress; stdout is pure data |
| `--output json` | Machine-readable JSON output for parsing |
| `--async` | Return task ID immediately; do not poll |
| `--dry-run` | Preview the API request without executing |
| `--yes` | Skip all confirmation prompts |

Always prefer `--output json --quiet` when piping or parsing results.

## Piping Patterns

stdout is always clean data — safe to pipe. stderr carries progress spinners and non-essential messages.

```bash
# Discard stderr spinners, keep stdout data
mmx video generate --prompt "Waves" 2>/dev/null

# Parse JSON output
mmx text chat --message "Hello" --output json --quiet | jq '.content'

# Chain commands
mmx image generate --prompt "A sunset" --quiet
mmx vision describe --image "$URL" --quiet
```

## Tool Schema Export

Export all mmx commands as Anthropic/OpenAI-compatible JSON tool schemas for dynamic tool registration:

```bash
# Export all tool-worthy commands (excludes auth/config/update)
mmx config export-schema

# Export a specific command
mmx config export-schema --command "video generate"

# Export all commands
mmx config export-schema --command "text chat"
```

Use this to dynamically register mmx commands as tools in your agent framework at runtime.

## Async Video Workflow

Video generation is async. Use `--async` to get the task ID immediately, then poll until done.

```bash
# 1. Start generation, get task ID
TASK=$(mmx video generate --prompt "A robot painting" --async --quiet | jq -r '.taskId')
echo "Task ID: $TASK"

# 2. Poll until complete (or use --download to block)
STATUS=""
while [ "$STATUS" != "Success" ]; do
  sleep 5
  STATUS=$(mmx video task get --task-id "$TASK" --output json --quiet | jq -r '.status')
  echo "Status: $STATUS"
done

# 3. Get file ID and download
FILE_ID=$(mmx video task get --task-id "$TASK" --output json --quiet | jq -r '.file_id')
mmx video download --file-id "$FILE_ID" --out robot.mp4 --quiet
```

## Chain Workflows

### Image → Vision (describe a generated image)

```bash
URL=$(mmx image generate --prompt "A sunset over mountains" --quiet)
mmx vision describe --image "$URL" --prompt "What time of day is shown?" --output json --quiet
```

### Image → Vision with local file

```bash
mmx image generate --prompt "A cat" --out-dir ./gen/ --quiet
mmx vision describe --image ./gen/image_0001.jpg --prompt "What breed?" --output json
```

### Music cover with auto-extracted lyrics

```bash
mmx music cover \
  --prompt "Jazz, piano, warm female vocal" \
  --audio https://example.com/song.mp3 \
  --out cover.mp3 --quiet
# Lyrics are auto-extracted via ASR if not provided
```

## Streaming

### Text chat streaming

```bash
mmx text chat --message "Tell me a story" --stream
# Tokens stream to stdout in real-time
```

### Audio streaming

```bash
mmx speech synthesize --text "Stream me" --stream | mpv --no-terminal -
```

## Config and Auth Precedence

**Auth precedence** (first match wins):
1. `--api-key` flag
2. `MINIMAX_API_KEY` env var
3. `~/.mmx/credentials.json`
4. `api_key` in `~/.mmx/config.yaml`

**Config precedence**:
1. CLI flags
2. Environment variables (`MINIMAX_REGION`, `MINIMAX_API_KEY`, etc.)
3. `~/.mmx/config.json`
4. Built-in defaults

## Environment Variables

| Variable | Effect |
|---|---|
| `MINIMAX_API_KEY` | API key for all requests |
| `MINIMAX_REGION` | `global` or `cn` |
| `HTTP_PROXY` / `HTTPS_PROXY` | Proxy settings |

## CI/CD Examples

### GitHub Actions

```yaml
- name: Generate and describe image
  env:
    MINIMAX_API_KEY: ${{ secrets.MINIMAX_API_KEY }}
  run: |
    URL=$(mmx image generate --prompt "Hero image" --quiet)
    mmx vision describe --image "$URL" --output json --quiet
```

### Docker

```dockerfile
RUN npm install -g mmx-cli
ENV MINIMAX_API_KEY=$API_KEY
```

## Exit Codes

| Code | Meaning | Action |
|---|---|---|
| 0 | Success | — |
| 1 | General error | Check error message |
| 2 | Usage error | Fix arguments |
| 3 | Authentication error | Re-authenticate |
| 4 | Quota exceeded | Check `mmx quota show` |
| 5 | Timeout | Retry with `--poll-interval` |
| 6 | Network error | Check proxy/network |
| 10 | Content filter | Modify prompt |
| 130 | Interrupted | User cancelled |
