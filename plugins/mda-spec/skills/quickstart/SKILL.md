---
name: mda-spec
description: Use this skill when the user wants to create agent-facing documents using the MDA Open Spec — a Markdown superset that compiles to SKILL.md, AGENTS.md, MCP-SERVER.md, and CLAUDE.md.
---

# MDA Open Spec — Markdown Driven Agent Documents

MDA is a Markdown superset for agent-facing documents. One `.mda` source compiles to SKILL.md, AGENTS.md, MCP-SERVER.md, and CLAUDE.md.

## Installation
```bash
git clone https://github.com/sno-ai/mda.git
sc skills teach mda-spec:quickstart
```

## Key Features
- **Single Source** — Write once in .mda, compile to all agent document formats
- **JSON Schema Validated** — Ensures document correctness
- **Dependency Graph** — Typed relationships between documents
- **Sigstore Signatures** — Cryptographic verification of document provenance
- **AAIF Compatible** — Works with agentskills.io and AAIF runtimes

## Usage Prompts
- "Create an MDA document that compiles to both SKILL.md and AGENTS.md"
- "Validate my .mda file against the MDA schema"
- "Compile this MDA document for Claude Code and Codex"
