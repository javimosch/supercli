---
name: lat.md
description: Use this skill when the user needs to create, maintain, or navigate a knowledge graph for their codebase — markdown-based, wiki-linked, agent-friendly.
---

# lat.md — Codebase Knowledge Graph

A knowledge graph for your codebase, written in markdown. Agents navigate project context via `[[wiki links]]` instead of grepping. By [1st1](https://github.com/1st1/lat.md) (1.5k⭐).

## Quick Start

```bash
npm install -g lat.md
cd /path/to/your/project
sc lat.md self init              # Scaffold lat.md/ directory
# Write markdown files with [[wiki links]]
sc lat.md self check             # Verify all links resolve
sc lat.md graph section <id>     # Read a specific section
```

## Commands

### Setup
- `sc lat.md self init` — scaffold `lat.md/` directory (run from project root)
- `sc lat.md self version` — print CLI version (0.11.0)

### Maintenance
- `sc lat.md self check` — verify all `[[wiki links]]` resolve, no broken refs
- `sc lat.md graph section <id>` — read a section (e.g. `architecture#Overview`)
- `sc lat.md graph search <query>` — **semantic** search (requires LLM API key)

### Passthrough
- `sc lat.md _ init --install` — init with agent hook installation
- `sc lat.md _ check` — check with verbose output

## How It Works

1. `lat init` creates `lat.md/` at your project root with a root index + sample
2. Write markdown files in `lat.md/` — each section starts with a leading paragraph (≤250 chars) for search snippets
3. Link sections with `[[file#Section]]` and `[[file#Section#Subsection]]` syntax
4. Link to source code: `[[src/auth.ts#validateToken]]`
5. Annotate source code with `// @lat: [[section-id]]` comments
6. `lat check` enforces referential consistency — all links must resolve
7. Sections without backlinks from code may be flagged as warnings

## Requirements

- Node.js 18+ (for npm)
- `npm install -g lat.md`
- **LLM API key** for semantic search (`LAT_LLM_KEY` env var, set via `lat init`)

## Caveats & Pitfalls

### 1. Semantic Search Requires LLM API Key
`lat search` uses AI-powered semantic search, not grep. It requires `LAT_LLM_KEY` configured via `lat init`. Without it, search returns an error. The `section` command works fine without a key.

### 2. Run from Project Root
All lat commands must be run from the project root containing `lat.md/`. The plugin uses `cwd: invoke_cwd` so you must `cd` to your project first.

### 3. Every Section Needs a Leading Paragraph
`lat check` enforces that every section starts with a brief overview (≤250 chars). This powers search snippets. Sections without one will fail validation.

### 4. lat.md/ Root Must Reference All Files
The root `lat.md/lat.md` file must list entries for each knowledge graph file. Missing entries are flagged by `lat check`.

### 5. Exit Code 1 on Errors
`lat check` exits with code 1 if any issues are found (missing entries, broken links, missing paragraphs). This is by design — fix the issues and re-run.

### 6. Agent Hooks Install is Optional
`lat init` offers to install agent hooks for Claude Code, Cursor, etc. You can skip this and re-run with `lat init --install` later.

## Example

```markdown
# lat.md/architecture.md

## Overview
The system is a monorepo with core library and plugins.

## Data Flow
Requests flow through [[middleware#Pipeline]] then to handlers.
```

```markdown
# lat.md/middleware.md

## Middleware

## Pipeline
Requests pass through: auth → rate-limit → handler.
```

Check: `lat check` validates all links resolve.
Section: `lat section architecture#Overview` shows the content.
