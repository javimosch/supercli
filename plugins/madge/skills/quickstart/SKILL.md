---
name: madge
description: Use this skill when the user wants to generate module dependency graphs for JavaScript/TypeScript projects.
---

# madge Plugin

Generate module dependency graphs for JavaScript/TypeScript/CommonJS/AMD projects.

## Commands

### Graph
- `madge graph generate` — Generate a dependency graph

### Basic
- `madge _ _` — Passthrough to madge CLI

## Usage Examples
- "Generate a dependency graph for this project"
- "Find circular dependencies in my codebase"
- "Visualise module dependencies as an image"

## Installation

```bash
npm install -g madge
```

## Key Features
- Detect circular dependencies
- Generate dependency graphs (text, JSON, or image)
- Support for CommonJS, AMD, ES6, TypeScript
- Webpack resolver support
- Image output with Graphviz
