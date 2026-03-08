The idea of **Command Plans** is extremely powerful because it makes the CLI **predictable, safe, and explainable for agents** before execution. It turns DCLI from a simple command runner into a **deterministic execution planner**.

Below is a **practical spec that fits your stack and architecture**.

---

# 1. Concept

A **Command Plan** is a dry-run execution graph returned by DCLI before the command actually runs.

Instead of executing:

```bash
dcli referential users fetch --id 42
```

An agent can request:

```bash
dcli plan referential users fetch --id 42
```

Response:

```json
{
  "version": "1.0",
  "command": "referential.users.fetch",
  "plan_id": "plan_abc123",
  "steps": [
    {
      "step": 1,
      "type": "resolve_command",
      "description": "Resolve command definition from config cache"
    },
    {
      "step": 2,
      "type": "validate_args",
      "description": "Validate input arguments"
    },
    {
      "step": 3,
      "type": "adapter_request",
      "adapter": "openapi",
      "method": "GET",
      "url": "/users/{id}"
    },
    {
      "step": 4,
      "type": "transform_output",
      "description": "Normalize response into output schema"
    }
  ],
  "estimated_duration_ms": 80,
  "side_effects": false
}
```

The agent can then decide to:

```bash
dcli execute plan_abc123
```

---

# 2. Plan Lifecycle

### Create Plan

```bash
dcli plan <namespace> <resource> <action> [args]
```

Example:

```bash
dcli plan referential users fetch --id 42
```

### Execute Plan

```bash
dcli execute <plan_id>
```

### Inspect Plan

```bash
dcli plan inspect <plan_id>
```

### Cancel Plan

```bash
dcli plan cancel <plan_id>
```

---

# 3. Plan Storage (MongoDB)

Collection:

```
plans
```

Document:

```json
{
  "_id": "plan_abc123",
  "command": "referential.users.fetch",
  "args": {
    "id": "42"
  },
  "steps": [],
  "status": "planned",
  "created_at": "2026-03-08T10:00:00Z",
  "expires_at": "2026-03-08T10:05:00Z"
}
```

TTL index:

```
expires_at
```

Plans auto-delete.

---

# 4. Step Types

The runtime produces standardized steps.

### resolve_command

Load command spec.

### validate_args

Validate arguments schema.

### adapter_request

External API call.

Example:

```json
{
  "type": "adapter_request",
  "adapter": "openapi",
  "method": "GET",
  "url": "/users/{id}"
}
```

### transform_output

Normalize response to schema.

### side_effect_operation

For mutating commands.

Example:

```json
{
  "type": "side_effect_operation",
  "resource": "users",
  "operation": "create"
}
```

---

# 5. Safety Flags

Plans explicitly show risk.

Example:

```json
{
  "side_effects": true,
  "risk_level": "medium"
}
```

Risk levels:

```
safe
low
medium
high
destructive
```

Example destructive command:

```bash
dcli infra cluster delete
```

Plan:

```json
{
  "risk_level": "destructive"
}
```

Agents can refuse automatically.

---

# 6. Dependency Graph

Plans can include dependencies.

Example:

```bash
dcli infra deploy service
```

Plan:

```json
{
  "steps": [
    {"step":1,"type":"build"},
    {"step":2,"type":"push_image","depends_on":[1]},
    {"step":3,"type":"deploy","depends_on":[2]}
  ]
}
```

This creates a **directed execution graph**.

---

# 7. HTTP API

DCLI server exposes plan endpoints.

### Create Plan

```
POST /api/plans
```

Body:

```json
{
  "command": "referential.users.fetch",
  "args": {"id": "42"}
}
```

Response:

```json
{
  "plan_id": "plan_abc123"
}
```

---

### Inspect Plan

```
GET /api/plans/:id
```

---

### Execute Plan

```
POST /api/plans/:id/execute
```

---

# 8. CLI Implementation Structure (NodeJS)

```
/cli
  plan.js
  execute.js

/runtime
  planner.js
  executor.js

/adapters
  openapi.js
  mcp.js
```

---

# 9. Planner Logic

File:

```
runtime/planner.js
```

Pseudo:

```javascript
async function createPlan(command, args) {

  const spec = await loadCommandSpec(command)

  const steps = []

  steps.push({
    type: "resolve_command"
  })

  steps.push({
    type: "validate_args"
  })

  if (spec.adapter === "openapi") {
    steps.push({
      type: "adapter_request",
      method: spec.method,
      url: spec.path
    })
  }

  steps.push({
    type: "transform_output"
  })

  return {
    steps,
    side_effects: spec.mutation === true
  }
}
```

---

# 10. Execution Engine

Executor runs steps sequentially.

```
runtime/executor.js
```

Pseudo:

```javascript
async function executePlan(plan) {

  for (const step of plan.steps) {

    switch(step.type) {

      case "adapter_request":
        await callAdapter(step)
        break

      case "validate_args":
        validateArgs(plan.args)
        break
    }

  }

}
```

---

# 11. WebUI Plan Viewer

Route:

```
/plans/:id
```

UI displays:

```
Execution Plan

1 Resolve command
2 Validate arguments
3 Call OpenAPI GET /users/{id}
4 Transform output
```

With badges:

```
SAFE
NO SIDE EFFECTS
```

---

# 12. Agent Workflow

Agents now use:

### discover commands

```
dcli commands
```

### inspect command

```
dcli inspect referential users fetch
```

### plan execution

```
dcli plan referential users fetch --id 42
```

### evaluate risk

### execute

```
dcli execute plan_abc123
```

This gives **LLMs deterministic control**.

---

# 13. Massive Future Feature

Plans could support **multi-command orchestration**.

Example:

```bash
dcli plan workflow create-user-and-assign-role
```

Plan:

```
1 create user
2 fetch role
3 assign role
```

Agents get a **complete DAG**.

---

# 14. Why This Is Very Powerful

Most CLIs are:

```
execute-only
```

DCLI becomes:

```
discoverable
introspectable
plannable
executable
```

This aligns perfectly with **AI tool ecosystems** like:

* Model Context Protocol
* LangChain
* OpenAI API

---

# 15. Final Architecture

DCLI becomes **four layers**:

```
CLI
Planner
Executor
Adapters
```

Adapters:

```
OpenAPI
MCP
GraphQL
Custom
```

Planner guarantees:

```
determinism
safety
inspectability
```

---

If you want, I can also show the **next evolution that would make DCLI extremely unique**:

**"Self-Generating CLIs"** — where DCLI automatically converts an entire **OpenAPI spec into a fully functional CLI namespace with zero code.**
