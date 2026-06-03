---
name: helixdb
description: Use this skill when the user wants to work with a graph-vector database for knowledge graphs and RAG.
---

# HelixDB Plugin

Graph-vector database CLI for building and querying knowledge graphs with vector embeddings. Combines graph traversal with vector search.

## Commands

### Database Operations
- `helixdb db query` — Query the HelixDB graph-vector database

## Usage Examples
- "Start a HelixDB instance"
- "Query the graph database"
- "Insert data into HelixDB"
- "Search vectors in the knowledge graph"

## Installation

```bash
cargo install helixdb
```

## Examples

```bash
helixdb server start --port 8080
helixdb data insert --collection docs --file data.json
helixdb query --search "similar documents" --limit 10
helixdb schema list
```

## Key Features
- Graph-vector hybrid database
- Vector similarity search
- Graph traversal queries
- REST API server mode
- RAG-optimized architecture
- Fast Rust implementation
