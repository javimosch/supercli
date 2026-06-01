---
name: scute
description: Use this skill when the user wants to enforce code quality guardrails — check complexity, duplication, commit message linting, or dependency freshness.
---

# scute Plugin

Open-source toolkit for deterministic fitness checks, guardrails, and harness engineering. All output is structured JSON by default.

## Commands
- `scute self version` — Print scute version
- `scute code complexity` — Check code complexity fitness
- `scute code similarity` — Check code similarity / duplication
- `scute commit lint` — Lint commit messages
- `scute dependencies freshness` — Check dependency freshness

## Usage Examples
- "check code complexity in src/"
- "find code duplication in the project"
- "lint the last commit message"
- "check if dependencies are up to date"

## Installation

```bash
cargo install scute
```

## Key Features
- Deterministic — same input always produces same output
- Agent-native — all output is structured JSON
- No cloud dependency — runs fully offline
- Multiple check categories: complexity, similarity, commit messages, dependencies
- Threshold-based pass/fail with detailed evidence
