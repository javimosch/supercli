---
name: clawteam.case_study.veg_basket_poc
description: Documentation of the Vegetable Basket Reservation POC, showing how opencode delegates to ClawTeam sub-agents.
tags: clawteam,case-study,delegation,poc,example
---

# Case Study: Vegetable Basket Reservation Tool

This case study demonstrates how an autonomous orchestrator (e.g., `opencode`) can replace a human in managing a complex development lifecycle by delegating specialized tasks to the **ClawTeam** agent network via **SuperCLI**.

## 1. Scenario
A user requests a Single Page Application (SPA) for vegetable basket reservations with:
- **Frontend**: Vue 3 (CDN) + Tailwind (CDN).
- **Backend**: Node.js + SQLite.
- **Simulation**: Pre-populated seasonal data and persistent stock management.

## 2. Protocol Trace

### Phase A: Environment Readiness
The orchestrator verifies the ClawTeam Gateway is healthy before initiating delegation.

**Command:**
```bash
supercli clawteam gateway status --json
```

**ClawTeam Response:**
```json
{
  "version": "1.0",
  "command": "clawteam.gateway.status",
  "data": {
    "uptime": 1765224,
    "trackedTasks": 0,
    "activeSessions": 0,
    "pollerRunning": true,
    "heartbeatRunning": true
  }
}
```

### Phase B: Backend Delegation
The orchestrator delegates the heavy-lifting of API and Database design to a `backend-expert` agent.

**Command:**
```bash
supercli clawteam task delegate \
  --agent "backend-expert" \
  --task "Implement a Node.js + better-sqlite3 backend for a vegetable basket reservation tool. Need endpoints for listing baskets and creating reservations. Pre-populate with seasonal produce. Run on port 3300." \
  --json
```

**ClawTeam Response:**
```json
{
  "version": "1.0",
  "command": "clawteam.task.delegate",
  "data": {
    "taskId": "task-1773855101",
    "sessionKey": "agent:expert:a1b2c3d4",
    "status": "accepted",
    "message": "Task delegated to expert agent successfully."
  }
}
```

### Phase C: UI Delegation
Simultaneously or sequentially, the orchestrator delegates the frontend design.

**Command:**
```bash
supercli clawteam task delegate \
  --agent "ui-expert" \
  --task "Design a beautiful SPA for vegetable basket reservation using Vue 3 and Tailwind CDNs. Connect to http://localhost:3300/api/baskets." \
  --json
```

**ClawTeam Response:**
```json
{
  "version": "1.0",
  "command": "clawteam.task.delegate",
  "data": {
    "taskId": "task-1773855123",
    "sessionKey": "agent:expert:e5f6g7h8",
    "status": "accepted",
    "message": "Task delegated to expert agent successfully."
  }
}
```

## 3. Implementation Patterns

### Artifact Handover
In this POC, the orchestrator (opencode) fulfilled the sub-agent roles by generating the files directly after the delegation commands were "accepted" by the protocol. In a true multi-agent environment, the sub-agents would write these files to the shared workspace or provide them via the `ClawTeam` artifact primitive.

### Verification Flow
The orchestrator verifies the integration by simulating a user action (a reservation) and checking the database state.

```bash
# Test reservation via the newly created API
curl -X POST -H "Content-Type: application/json" \
  -d '{"basketId": 1, "customerName": "ClawTeam Tester"}' \
  http://localhost:3300/api/reserve
```

## 4. Key Takeaways
1.  **Separation of Concerns**: Delegation allows the orchestrator to focus on integration while "experts" handle implementation details.
2.  **Protocol Transparency**: Using `--json` ensures that every handover is logged and parseable by the system.
3.  **Persistence**: The state (SQLite) is shared across the network, allowing any agent to verify the results of another's work.
