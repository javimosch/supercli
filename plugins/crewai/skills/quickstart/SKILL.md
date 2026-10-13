---
name: crewai
description: Use this skill when the user wants to scaffold, run, train, or test multi-agent CrewAI crews and flows from the command line.
---

# crewai Plugin

CrewAI orchestrates teams of role-playing agents (crews) and event-driven pipelines (flows). The `crewai` CLI covers the full lifecycle: scaffold → run → train → test → replay → deploy.

## Commands

### Scaffold
- `crewai crew create <name>` — New crew project (agents.yaml/tasks.yaml wizard)
- `crewai flow create <name>` — New flow project

### Run
- `crewai crew run` — Execute the crew in the current directory
- `crewai flow kickstart` — Execute the flow in the current directory
- `crewai crew replay` — Re-run from a specific task (`-t <task_id>`)

### Improve
- `crewai crew train` — `crewai train -n <iters> --filename <pkl>`; trains via RL-ish iteration
- `crewai crew test` — `crewai test -n <runs> --model <eval-model>`; scores outputs
- `crewai _ _` — Passthrough (`install`, `update`, `deploy`, `log-tasks-outputs`, `reset-memories`, ...)

## Usage Examples

- "Scaffold a crew that researches competitors and writes a report"
- "Run my crew and then test it 3 times"
- "Replay the crew from the failed task"

## Installation

```bash
pip install crewai crewai-tools      # Python 3.10-3.13
# or: uv tool install crewai --with crewai-tools
```

The CLI manages per-project envs with uv (`crewai install`). LLMs via LiteLLM: `OPENAI_API_KEY`/`ANTHROPIC_API_KEY`/... or a local endpoint (`OPENAI_BASE_URL` → ollama/vllm).

## Examples

```bash
crewai create crew market_research
cd market_research
crewai run

crewai train -n 5 --filename trained_agents.pkl
crewai test -n 3 --model gpt-4o-mini
crewai log-tasks-outputs
```

## Key Features

- Crews: YAML-defined agents with roles, goals, backstories, tools, memory
- Flows: code-first event-driven orchestration that can embed crews
- Train/test/replay built in — no separate eval harness needed
- Provider-agnostic via LiteLLM; local models work through OpenAI-compatible endpoints
