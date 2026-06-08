# Natural Language Execution ("ask")

supercli translates natural language intents into execution steps by mapping user queries to the configured command capability graph. Instead of learning command syntax, you describe what you want and supercli builds and runs the workflow.

## Key Features

- **Natural Language → Execution Plan**: Describe your intent in plain English; supercli generates a DAG workflow from available capabilities.
- **Decentralized Execution**: Run on the backend server (`SUPERCLI_SERVER`) to share API keys across teams, or locally on your machine using `OPENAI_BASE_URL`.
- **Automatic Fallback Execution**: The translation produces a DAG workflow JSON that runs sequentially via the standard workflow planner.
- **Dynamic Context**: The LLM context is strictly limited to the definitions and JSON schemas of the actual configured commands — no hallucinated tools.

## Setup

### Local Mode

Run the translation directly on your machine:

```bash
export OPENAI_BASE_URL=https://api.openai.com/v1
export OPENAI_MODEL=gpt-4
export OPENAI_API_KEY=sk-...

# Now ask is available
supercli ask "list my recent commits"
```

### Server Mode

Run the translation on the supercli server to share API keys and models across a team:

```bash
# On the server (server/app.js), set:
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
OPENAI_API_KEY=sk-...

# On the client, point to the server:
export SUPERCLI_SERVER=http://localhost:3001
supercli ask "list my recent commits"
```

### Configuration Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_BASE_URL` | Yes | — | OpenAI-compatible API endpoint |
| `OPENAI_MODEL` | No | `gpt-4` | Model to use for translation |
| `OPENAI_API_KEY` | Yes | — | API key for the LLM provider |
| `SUPERCLI_SERVER` | No | — | Server URL for server-side execution |

Any OpenAI-compatible provider works (OpenAI, Azure OpenAI, local LLMs via llama.cpp, Ollama, etc.). Set `OPENAI_BASE_URL` to your provider's endpoint.

## Usage

### Basic Invocation

```bash
# Describe what you want in natural language
supercli ask "list the posts and summarize them"

# The system:
# 1. Searches capabilities for relevant commands
# 2. Generates a DAG workflow
# 3. Executes each step sequentially
# 4. Returns the combined result
```

### Output Format

`ask` returns a standard JSON envelope with the workflow execution results:

```json
{
  "version": "1.0",
  "command": "ask",
  "duration_ms": 4520,
  "data": {
    "query": "list the posts and summarize them",
    "steps": [
      {
        "step": 0,
        "command": "jsonplaceholder.posts.list",
        "status": "ok",
        "data": { "posts": [...], "count": 10 }
      },
      {
        "step": 1,
        "command": "ai.text.summarize",
        "status": "ok",
        "data": { "summary": "The posts cover..." }
      }
    ],
    "final": { "summary": "The posts cover..." }
  }
}
```

### What the LLM Sees

The LLM context is strictly limited to your configured commands. It does not hallucinate tools — it only references capabilities that exist in your registry. This means:

- If you only have `github` and `aws` plugins, the LLM can only compose those tools
- Unknown requests fail gracefully with a structured error (exit code 82)
- No API keys or secrets leak into the LLM context

## Examples

### Multi-Tool Composition

```bash
# Combine data from multiple sources
supercli ask "show me open GitHub issues and recent deploy logs"

# The system finds:
# 1. gh issue list --state open
# 2. aws cloudwatch logs ...
# And chains them automatically
```

### Data Transformation

```bash
# Ask for analysis of existing data
supercli ask "list my database tables and suggest indexes"

# Steps:
# 1. database.tables.list
# 2. ai.text.analyze with table schemas as context
```

### Reporting

```bash
# Generate a report from multiple commands
supercli ask "create a summary of this week's commits and failed builds"

# Steps:
# 1. git.log --since "1 week ago"
# 2. ci.builds.list --status failed
# 3. ai.text.summarize combining both outputs
```

## Error Handling

| Scenario | Exit Code | Behavior |
|----------|-----------|----------|
| No matching capabilities found | 82 | Returns error: no relevant commands in registry |
| LLM API failure | 105 | Returns error with provider details |
| Step execution failure | 105 | Workflow halts, returns failed step details |
| Invalid/malicious input | 82 | Input validation rejects the request |

### Common Issues

```bash
# "ask" not showing in help
# → LLM environment variables not set. Run:
echo $OPENAI_BASE_URL  # Should be set
echo $OPENAI_API_KEY   # Should be set

# "No matching capabilities"
# → Install relevant plugins first:
supercli plugins explore --name <tool>
supercli plugins install <plugin-name>

# Timeout on complex queries
# → The LLM translation may take time for complex intents.
# → Retry or simplify the query.
```

## Workflow vs `ask`

| Aspect | Workflow (defined in plugin.json) | `ask` (natural language) |
|--------|-----------------------------------|--------------------------|
| Definition | Declared in `plugin.json`, version-controlled | Generated at runtime from natural language |
| Execution | Deterministic, same steps every time | May vary based on LLM interpretation |
| Discoverability | Shows in `supercli skills search` | Not discoverable — it creates its own plan |
| Use case | Known, repeatable multi-step processes | One-shot tasks, exploratory queries |
| Error handling | Structured, predictable | Depends on LLM recovery strategy |

**Rule of thumb:** If you'll run the same multi-step process more than once, define it as a [workflow](workflows.md). For one-off tasks, use `ask`.

## Related Documentation

- [Workflows](workflows.md) — declarative multi-step execution with data piping
- [Execution Plans](execution-plans.md) — dry-run and plan-gated execution
- [Skill Documents](skills.md) — teaching agents about available capabilities
- [Adapters](adapters.md) — the adapter types that back each capability
