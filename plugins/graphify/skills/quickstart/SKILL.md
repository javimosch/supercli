---
name: graphify
description: Use this skill when the user wants to build a knowledge graph from code, docs, papers, images, or videos, or query an existing graph.
---

# Graphify Plugin

Turn any folder of code, docs, papers, images, or videos into a queryable knowledge graph. Uses tree-sitter AST for code extraction and Claude for semantic extraction from docs and media.

## Commands

### Build Graph
- `graphify graph build [path]` — Build knowledge graph from a directory (default: current directory)
- `graphify graph update [path]` — Re-extract only changed files, merge into existing graph
- `graphify graph watch [path]` — Auto-sync graph as files change

### Query Graph
- `graphify graph query "<question>"` — Ask a question to the knowledge graph
- `graphify graph path <node1> <node2>` — Find shortest path between two nodes
- `graphify graph explain <node>` — Get plain-language explanation of a node

### Add Content
- `graphify content add <url>` — Fetch and add paper, video, or tweet to the graph

### Setup
- `graphify platform install` — Install graphify skill for your AI assistant
- `graphify git hook-install` — Install git hooks for auto-rebuild on commit/branch switch

## Usage Examples

- "Build a knowledge graph from my codebase"
- "Query the graph about the auth flow"
- "Add this paper to my knowledge graph"
- "What connects Attention to the optimizer?"

## Installation

```bash
pip install graphifyy
graphify install
```

## Examples

```bash
# Build graph from current directory
graphify .

# Build graph from specific folder
graphify ./src

# Query the graph
graphify query "what connects attention to the optimizer?"

# Add a paper
graphify add https://arxiv.org/abs/1706.03762

# Incremental update
graphify update ./src

# Auto-sync on file changes
graphify watch ./src
```

## Key Features
- Tree-sitter AST for deterministic code structure extraction (classes, functions, imports, call graphs)
- Claude-powered semantic extraction from docs, papers, images
- Video/audio transcription via faster-whisper (runs locally)
- NetworkX graph with Leiden community detection clustering
- Confidence scores on inferred relationships
- 71.5x token reduction vs reading raw files
- Git hooks for automatic graph rebuild on commit
