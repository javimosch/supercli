# Multi-Step Workflows

supercli handles command chaining via Workflow Commands without forcing agents or developers to write complicated shell orchestration. A workflow is a single command that orchestrates multiple steps, passing data between them automatically.

## Key Features

- **Workflow Adapter Definition**: Compound multi-step processes appear as a single command in the capability tree (`type: workflow`). Agents discover and invoke them exactly like any other command.
- **Data Piping (Context Mapping)**: The `stdout` JSON result of step N is automatically injected into the arguments of step N+1 via template expressions. This creates clean API mapping layers (e.g., extract an ID from one endpoint, pass it to another).
- **Atomic Abstraction**: A complex graph of actions is compacted into one deterministic interface with a single JSON envelope output.
- **Sequential Execution**: Steps run in order. If any step fails, the workflow halts and returns a structured error with the failing step index.

## Workflow Definition

A workflow is stored as a standard command in the registry:

```json
{
  "namespace": "aws",
  "resource": "instances",
  "action": "restart_and_log",
  "type": "workflow",
  "adapterConfig": {
    "steps": [
      { "command": "aws.instances.restart", "args": { "instance_id": "{{args.id}}" } },
      { "command": "logging.events.publish", "args": { "message": "Instance {{step.0.data.status}} restarted." } }
    ]
  }
}
```

### Template Expressions

Template expressions reference data from previous steps or the original invocation arguments:

| Expression | Resolves To |
|-----------|-------------|
| `{{args.id}}` | The `--id` flag passed to the workflow command |
| `{{step.0.data.status}}` | The `status` field from step 0's JSON output |
| `{{step.1.data.id}}` | The `id` field from step 1's JSON output |
| `{{step.N.data.field}}` | Any field from step N's output (0-indexed) |

**Important:** Template expressions only resolve against JSON output. If a step returns non-JSON (e.g., raw text), downstream templates that reference its data will resolve to `null`.

## Usage

```bash
# Execute a workflow — same interface as any other command
supercli aws instances restart_and_log --id i-0123456789

# Output is a standard JSON envelope containing all step results
```

The output envelope includes step-by-step results:

```json
{
  "version": "1.0",
  "command": "aws.instances.restart_and_log",
  "duration_ms": 3420,
  "data": {
    "steps": [
      { "step": 0, "command": "aws.instances.restart", "status": "ok", "data": { "status": "restarting" } },
      { "step": 1, "command": "logging.events.publish", "status": "ok", "data": { "published": true } }
    ],
    "final": { "published": true }
  }
}
```

## Error Handling

When a step fails, the workflow halts immediately and returns a structured error:

```json
{
  "version": "1.0",
  "command": "aws.instances.restart_and_log",
  "duration_ms": 1205,
  "error": {
    "code": 105,
    "type": "workflow_step_failed",
    "message": "Step 1 failed: aws.instances.restart returned exit code 105",
    "details": {
      "failed_step": 1,
      "failed_command": "aws.instances.restart",
      "step_exit_code": 105,
      "completed_steps": [0]
    }
  }
}
```

**Agent retry logic:**
- Exit code `0` from a step: proceed to next step
- Exit code `80-89` (validation): do not retry, fix input
- Exit code `100-109` (integration): retry the failed step with backoff
- Exit code `110-119` (internal): report bug, do not retry

## Common Patterns

### Fan-Out / Aggregate

Run multiple independent queries, then combine results:

```json
{
  "namespace": "report",
  "resource": "daily",
  "action": "generate",
  "type": "workflow",
  "adapterConfig": {
    "steps": [
      { "command": "metrics.requests.list", "args": { "date": "{{args.date}}" } },
      { "command": "metrics.errors.list", "args": { "date": "{{args.date}}" } },
      { "command": "ai.text.summarize", "args": { "text": "Requests: {{step.0.data.count}}, Errors: {{step.1.data.count}}" } }
    ]
  }
}
```

### Conditional Steps

Use the `condition` field to skip steps based on previous output:

```json
{
  "steps": [
    { "command": "deploy.status.check", "args": { "env": "{{args.env}}" } },
    { "command": "deploy.approve", "args": { "env": "{{args.env}}" }, "condition": "{{step.0.data.status}} == pending" },
    { "command": "deploy.execute", "args": { "env": "{{args.env}}" } }
  ]
}
```

Conditions use a simple expression syntax: `{{step.N.field}} <operator> <value>`.

### Retry-Aware Workflows

For steps that may experience transient failures, the workflow engine retries steps that return recoverable error codes:

```json
{
  "steps": [
    { "command": "api.data.fetch", "args": { "url": "{{args.url}}" }, "retry": { "max_attempts": 3, "backoff_ms": 1000 } }
  ]
}
```

## Workflow vs `ask`

| Aspect | Workflow | `supercli ask` |
|--------|----------|----------------|
| Definition | Declared in `plugin.json`, version-controlled | Generated at runtime from natural language |
| Execution | Deterministic, same steps every time | May vary based on LLM interpretation |
| Discoverability | Shows in `supercli skills search` | Not discoverable — it creates its own plan |
| Use case | Known, repeatable multi-step processes | One-shot tasks, exploratory queries |
| Error handling | Structured, predictable | Depends on LLM recovery strategy |

**Rule of thumb:** If you'll run the same multi-step process more than once, define it as a workflow. For one-off tasks, use `ask`.
