---
name: schemathesis
description: Use this skill when the user wants to fuzz-test an API, generate edge-case requests from an OpenAPI/GraphQL schema, or check API conformance with schemathesis (CLI: st).
---

# schemathesis Plugin

schemathesis generates property-based test cases from an OpenAPI or GraphQL schema and
fires them at a running API — checking for 5xx crashes, schema-incompatible responses,
and spec violations. CLI binary: `st` (Schemathesis 4+).

## Commands

### Testing
- `schemathesis api run <schema>` — Fuzz the API (needs `--base-url` for local schemas)
- `schemathesis api validate <schema>` — Light conformance pass
- `schemathesis _ _` — Passthrough to `st` CLI

## Usage Examples

- "Fuzz my API for 10 minutes"
- "Check that responses conform to the OpenAPI spec"
- "Reproduce the failing case from CI"
- "Test the GraphQL endpoint"

## Installation

```bash
pipx install schemathesis
# or: pip install schemathesis
# or: docker run schemathesis/schemathesis
```

## Examples

```bash
# Basic run against a local server
st run openapi.yaml --base-url http://localhost:8080

# Remote schema URL (server inferred)
st run https://api.example.com/openapi.json

# Control phases & checks
st run openapi.yaml --base-url :8080 --phases coverage,fuzzing \
  --checks not_a_server_error,status_code_conformance

# Deterministic reproduction
st run openapi.yaml --base-url :8080 --seed 42 --report-junit-path report.xml
```

## Key Features

- Property-based generation of boundary/mutation inputs via hypothesis
- Checks: 5xx detection, schema conformance, content-type, status codes
- `--phases coverage|examples|fuzzing|stateful` to control test depth
- JUnit/VCR reports, `--seed` for reproducible failures
