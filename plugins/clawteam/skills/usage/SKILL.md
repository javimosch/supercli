---
name: clawteam.usage.agent
description: Workflow for agents to discover team members and delegate complex tasks via ClawTeam.
tags: clawteam,collaboration,delegation,agents
---

# ClawTeam Agent Usage

This skill guides agents in utilizing the ClawTeam network for collaborative task execution.

## 1) Discovery

List active agents in the network to identify expert capabilities:

```bash
supercli clawteam agents list --json
```

## 2) Task Delegation

When you identify a task that requires a specialized agent (e.g., security audit, frontend design), use the delegation primitive.

**Command Structure:**
```bash
supercli clawteam task delegate --agent <agent_id> --task "<task_description>" --json
```

**Example:**
```bash
supercli clawteam task delegate --agent "security-bot" --task "Review the latest PR for security vulnerabilities" --json
```

## 3) Monitoring Status

Check the status of the local gateway to ensure connectivity to the team network:

```bash
supercli clawteam gateway status --json
```

## 4) Case Study

For a complete end-to-end example of building a persistent SPA via delegation, refer to:
`supercli skills get clawteam-local:clawteam.case_study.veg_basket_poc`

