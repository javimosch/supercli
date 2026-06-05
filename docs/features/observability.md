# Observability & Traceability

supercli maintains a rich audit trail to monitor tool utilization natively, eliminating CLI tooling "blind spots".

## Key Features

- **Job Tracing API (`/api/jobs`)**: Every time the CLI executes a command, it fires an asynchronous job tracking payload via `fetch` to the backend server with its execution parameters (command called, user arguments, duration, risk classification, outcome code).
- **Historical Analysis**: Administrators can review which endpoints are failing at the network adapter layer, identify slow execution patterns, or audit AI agent behaviors natively.
- **Dashboard Interface**: The built-in Express `.ejs` UI ships a dedicated `Jobs` dashboard that dynamically visualizes job history and computes basic high-level stats (e.g., success rate).

## Usage

Observability is enabled entirely passively. The CLI client naturally logs its outcome up to the server.

```bash
# The CLI automatically records this execution trace
SUPERCLI_SERVER=http://127.0.0.1:3000 supercli github issues list

# The traces can be consumed locally or via REST
open http://localhost:3000/jobs
curl http://127.0.0.1:3000/api/jobs/stats
```
