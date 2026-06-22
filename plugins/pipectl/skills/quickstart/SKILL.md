---
name: pipectl
description: Use this skill when the user wants to run YAML-defined data pipelines, transform data between JSON/JSONL/CSV, or validate pipeline definitions.
---

# pipectl Plugin

CLI for running YAML-defined data pipelines. Supports JSON, JSONL, and CSV payloads with built-in steps for filtering, normalizing, redacting, casting, sorting, validating, converting, and more.

## Commands

### Pipeline execution
- `pipectl pipeline run <pipeline.yaml>` — Run a YAML-defined data pipeline
- `pipectl pipeline validate <pipeline.yaml>` — Validate a pipeline without executing it

### Documentation
- `pipectl docs show` — Show documentation for all built-in steps
- `pipectl docs show <step>` — Show documentation for a specific step

### Utilities
- `pipectl self version` — Print pipectl version
- `pipectl _ _` — Passthrough to pipectl CLI

## Usage Examples
- "pipectl pipeline run transform.yaml --input data.json --output result.jsonl"
- "pipectl pipeline validate pipeline.yaml --dry-run"
- "cat data.csv | pipectl pipeline run filter.yaml --quiet"
- "pipectl docs show filter"

## Installation

```bash
go install github.com/pipectl/pipectl/cmd/pipectl@latest
```

## Examples

### Simple filter pipeline
```yaml
steps:
  - name: filter
    type: filter
    condition: "age > 18"
```

```bash
cat users.json | pipectl pipeline run filter.yaml --output adults.json
```

### Validate before running
```bash
pipectl pipeline validate pipeline.yaml --dry-run
```

## Key Features
- CLI-only, no auth required
- Supports JSON, JSONL, and CSV with automatic conversions
- Built-in steps: filter, normalize, redact, cast, sort, dedupe, validate, convert, http-request
- JSON Schema validation at any pipeline stage
- Dry-run mode for validation and preview
- Variable substitution with `--var KEY=VALUE`
