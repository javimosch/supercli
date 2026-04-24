---
name: colgrep
description: Use this skill when the user wants to search code semantically, find functions or patterns by meaning (not just text), or index a codebase for AI-powered code search.
---

# colgrep Plugin

Semantic code search for your terminal. Combines regex filtering with semantic ranking. All local — your code never leaves your machine. A single Rust binary with ONNX Runtime baked in.

## Commands

### Indexing
- `colgrep index init` — Build the search index for a project
- `colgrep index clear` — Clear the search index

### Search
- `colgrep search query` — Semantic code search with optional regex filtering

### Model Management
- `colgrep model set` — Persist a ColBERT-style model as the default
- `colgrep model status` — Show which model an index was built with

### Utility
- `colgrep self version` — Print colgrep version
- `colgrep _ _` — Passthrough to colgrep CLI

## Usage Examples
- "Search for database connection pooling code in this project"
- "Find error handling patterns in the codebase"
- "Build a search index for the current project"
- "Index a specific project at /path/to/code"
- "Search using a regex for async functions first"

## Installation

```bash
brew install lightonai/tap/colgrep
```

## Examples

```bash
# Build the index for the current project
colgrep index init

# Build the index for a specific project
colgrep index init /path/to/project

# Semantic search
colgrep search query "database connection pooling"

# Regex + semantic search
colgrep search query -e "async.*await" "error handling"

# One-shot model override
colgrep search query --model lightonai/LateOn-Code "recursive tree traversal"

# Persist a model as default
colgrep model set lightonai/LateOn-Code

# Check which model the index was built with
colgrep model status

# Clear the index for the active model
colgrep index clear

# Wipe every index across all models
colgrep index clear --all
```

## Key Features
- Semantic ranking using ColBERT-style multi-vector embeddings
- Regex pre-filtering combined with semantic search
- All local — code never leaves your machine
- Incremental updates — detects file changes automatically
- Single binary with ONNX Runtime baked in (no external dependencies)
- Grep-compatible flags
- SQLite metadata pre-filtering
- CPU-optimized (CUDA supported when available)

## Default Model

The default model is `lightonai/LateOn-Code-edge`. You can switch to any other ColBERT-style model on HuggingFace:

```bash
colgrep model set lightonai/LateOn-Code
```

Each (project, model) pair has its own index directory, so switching models never corrupts existing indexes.

## Agent Integrations

ColGREP can integrate with AI coding agents:

```bash
colgrep _ _ --install-claude-code
colgrep _ _ --install-opencode
colgrep _ _ --install-codex
```

## Notes
- Run `colgrep index init` before your first search in a project
- After indexing, every search detects file changes and updates the index automatically
- No server, no API, no external inference server needed
- Works on CPU; GPU acceleration available when CUDA is present
