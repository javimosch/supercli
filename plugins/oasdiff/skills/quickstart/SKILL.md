---
name: oasdiff
description: Use this skill when the user wants to compare OpenAPI specs, detect breaking API changes, or generate API changelogs with oasdiff.
---

# oasdiff Plugin

oasdiff diffs two OpenAPI specifications and classifies every change as breaking or
non-breaking — endpoints, schemas, parameters, request/response bodies, security
requirements. Used as a CI gate or to generate API changelogs.

## Commands

### Analysis
- `oasdiff spec diff <base> <rev>` — Full diff between two specs
- `oasdiff spec breaking <base> <rev>` — Only breaking changes
- `oasdiff spec changelog <base> <rev>` — Changelog of all changes
- `oasdiff spec summary <base> <rev>` — Change summary
- `oasdiff checks list` — List available checks
- `oasdiff _ _` — Passthrough to oasdiff CLI

## Usage Examples

- "Check if the new OpenAPI spec breaks the old one"
- "Diff api-v1.yaml against api-v2.yaml"
- "Generate a changelog between the last released spec and main"
- "Fail CI if the spec has breaking changes"

## Installation

```bash
go install github.com/oasdiff/oasdiff@latest
# or: brew install oasdiff
```

## Examples

```bash
# Gate a PR on breaking changes
oasdiff breaking old.yaml new.yaml --fail-on ERR

# JSON output for agents/tooling
oasdiff changelog old.yaml new.yaml --format json

# Include examples & descriptions in the diff
oasdiff diff old.yaml new.yaml --include-elements examples,description
```

## Key Features

- Classifies changes as breaking vs non-breaking per check
- `--fail-on ERR|WARN` exit codes for CI gating
- Output formats: text, JSON, YAML, HTML, Markdown
- ~200 built-in checks covering paths, schemas, params, security
