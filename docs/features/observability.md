# Observability & Traceability

supercli maintains a rich audit trail to monitor tool utilization natively, eliminating CLI tooling "blind spots". Every command execution is recorded as a job, enabling historical analysis, agent behavior auditing, and performance monitoring.

## Key Features

- **Job Tracing API (`/api/jobs`)**: Every CLI execution fires an asynchronous job tracking payload to the backend server with execution parameters (command, arguments, duration, status, error details).
- **Historical Analysis**: Review which endpoints are failing, identify slow execution patterns, or audit AI agent behaviors over time.
- **Dashboard Interface**: The built-in Express UI ships a dedicated Jobs page that visualizes execution history with stats (total, success, failed, failure rate).
- **Aggregate Statistics**: `/api/jobs/stats` computes top commands by frequency and average latency across all recorded executions.
- **Pruning**: Old jobs can be pruned by age to manage storage (`DELETE /api/jobs?older_than=7`).

## Job Record Schema

Each job execution produces a record with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | Unique job identifier (`job:<timestamp>_<random>`) |
| `command` | string | Full command string (e.g., `aws.cfn.deploy`) |
| `args` | object | Arguments passed to the command |
| `status` | string | `success`, `failed`, or `unknown` |
| `duration_ms` | number | Execution time in milliseconds |
| `timestamp` | string | ISO 8601 timestamp of execution |
| `plan_id` | string | Execution plan ID if command was plan-gated (nullable) |
| `error` | object | Error details if status is `failed` (nullable) |
| `client_id` | string | Client identifier for multi-agent environments (nullable) |

## Usage

Observability is enabled passively — the CLI automatically records each execution trace.

```bash
# Execution is automatically traced
SUPERCLI_SERVER=http://127.0.0.1:3000 supercli github issues list

# Open the dashboard in a browser
open http://localhost:3000/jobs

# Query stats via API
curl -s http://127.0.0.1:3000/api/jobs/stats | jq

# List recent jobs (JSON)
curl -s "http://127.0.0.1:3000/api/jobs?limit=10&format=json" | jq

# Filter jobs by command
curl -s "http://127.0.0.1:3000/api/jobs?command=aws.cfn.deploy&format=json" | jq

# Get a specific job by ID
curl -s "http://127.0.0.1:3000/api/jobs/job:1717849200000_abc1234" | jq

# Prune jobs older than 30 days
curl -s -X DELETE "http://127.0.0.1:3000/api/jobs?older_than=30" | jq
```

## Stats Response

The `/api/jobs/stats` endpoint returns aggregate metrics:

```json
{
  "total": 1247,
  "success": 1189,
  "failed": 58,
  "failure_rate": "4.7%",
  "top_commands": [
    { "command": "github.issue.list", "count": 312, "avg_ms": 245 },
    { "command": "aws.cfn.deploy", "count": 87, "avg_ms": 14200 },
    { "command": "ai.text.summarize", "count": 64, "avg_ms": 3100 }
  ]
}
```

**Key fields:**
- `failure_rate`: Percentage of jobs with `status: "failed"`
- `top_commands`: Top 10 most-executed commands with average latency
- `avg_ms`: Average duration — useful for identifying slow commands

## Interpreting Job Status

| Status | Meaning | Action |
|--------|---------|--------|
| `success` | Command completed with exit code 0 | No action needed |
| `failed` | Command returned non-zero exit code | Check `error` field for details |
| `unknown` | Status was not reported (e.g., crash, timeout) | Investigate client logs |

### Common Failure Patterns

- **High failure rate on a specific command**: Likely a configuration issue or missing dependency. Check the `error` field in individual job records.
- **Spike in `unknown` status**: Client may be crashing before reporting status. Check client connectivity and server logs.
- **High `avg_ms` for a command**: Consider adding `timeout_ms` to `adapterConfig` or caching results.

## Dashboard

The Jobs dashboard at `/jobs` provides:

- **Stats panel**: Click "Stats" to see total/success/failed/failure rate
- **Job table**: Sortable list with command, status badge (green/red), duration, relative timestamp, and client ID
- **Filtering**: Use `?command=<name>` query parameter to filter by command

The dashboard renders server-side (EJS) and loads stats client-side (Vue.js). No additional setup required beyond running the server with `SUPERCLI_SERVER` configured.
