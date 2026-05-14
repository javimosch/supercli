---
name: spec-driven-develop
description: Use this skill when the user needs to plan large-scale code refactors, rewrites, migrations, or architecture transformations using a disciplined document-driven workflow.
---

# Spec-Driven Develop — Disciplined Engineering Workflow

Cross-platform AI agent skill that turns "rewrite this in Rust" or "migrate to microservices" into a structured 7-phase document-driven pipeline. Works with Claude Code, Codex, Cursor, and any Markdown-reading agent.

## Installation

```bash
git clone https://github.com/zhu1090093659/spec_driven_develop.git
sc skills teach spec-driven-develop:quickstart
```

## Available Skills

### 1. Spec-Driven Develop (Core)
7-phase preparation pipeline for large-scale transformations:

| Phase | Description |
|-------|-------------|
| Phase 0 | Quick Intent Capture — high-level direction (1-2 sentences) |
| Phase 1 | Deep Analysis — architecture analysis, module inventory, S.U.P.E.R health evaluation |
| Phase 2 | Intent Refinement — targeted questions grounded in analysis |
| Phase 3 | Task Decomposition — break work into phases, tasks, parallel lanes |
| Phase 4 | Progress Tracking — MASTER.md + per-phase detail files for cross-conversation continuity |
| Phase 5 | Sub-SKILL Generation — project-level SKILL with inlined S.U.P.E.R + code review checklist |
| Phase 6 | Handoff — present all artifacts, confirm readiness |
| Phase 7 | Archive — preserve all artifacts for traceability |

### 2. Deep Discuss (Structured Problem Analysis)
7-phase structured discussion for technical problems and decisions:
- Receive Information → Problem Audit → Deep Analysis → Solution Design → Self-Review → Final Review → Execution

## S.U.P.E.R Architecture Principles

| Principle | Meaning |
|-----------|---------|
| **S**ingle Purpose | One module, one job |
| **U**nidirectional Flow | Data flows one way, no circular deps |
| **P**orts over Implementation | Contracts before code, schema-defined I/O |
| **E**nvironment-Agnostic | No hardcoded config, runs anywhere |
| **R**eplaceable Parts | Swap without ripple — low replacement cost |

## Usage Prompts

- "Rewrite this Python project in Rust using spec-driven development"
- "Migrate the monolith to microservices — start the spec-driven pipeline"
- "Let's discuss: our API response times have been spiking, what's the root cause?"
- "I'm torn between GraphQL and REST for our new API — help me analyze"
- "Overhaul the authentication system to use OAuth2"

## Key Features

- Cross-conversation progress tracking via MASTER.md
- Native task tracking integration (TodoWrite in supported agents)
- Progress export to JSON for Jira/Linear/Notion import
- S.U.P.E.R code review checklist (10-point mandatory gate)
- Graceful degradation: falls back to sequential if sub-agents unavailable
