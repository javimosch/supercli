---
name: vacuum
description: vacuum — fast OpenAPI/Spectral-compatible linter and validator for API specifications. Checks OpenAPI 3.x and Swagger 2.0 specs for consistency, completeness, naming conventions, and breaking changes. Supports custom rulesets and JSON output for CI pipelines.
---

# vacuum Plugin

vacuum — fast OpenAPI/Spectral-compatible linter and validator for API specifications. Checks OpenAPI 3.x and Swagger 2.0 specs for consistency, completeness, naming conventions, and breaking changes. Supports custom rulesets and JSON output for CI pipelines.

## Installation

```bash
brew install vacuum
Verify: vacuum --version
```

## Commands

### `sc vacuum self version`

Print vacuum version

## Passthrough

```bash
sc vacuum _ _ <args...>
```

## SuperCLI

```bash
sc vacuum _ _ --help
sc plugins learn vacuum
```
