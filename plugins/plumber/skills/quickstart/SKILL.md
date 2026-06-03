---
name: plumber
description: Use this skill when the user wants to check GitLab CI/CD pipeline compliance using plumber.
---

# plumber Plugin

Check GitLab CI/CD pipeline compliance — validate and lint your `.gitlab-ci.yml` files against best practices.

## Commands

- `plumber pipeline check <args>` -- Check GitLab CI/CD pipeline compliance

## Usage Examples

Check compliance in current directory:
```
plumber pipeline check
```

Check specific file:
```
plumber pipeline check .gitlab-ci.yml
```

Check with verbose output:
```
plumber pipeline check --verbose
```

Check specific project:
```
plumber pipeline check --project <project_id>
```

## Installation

```
go install github.com/nicholasgasior/plumber@latest
```

## Key Features

- Validates `.gitlab-ci.yml` syntax
- Checks for compliance with best practices
- Reports warnings and errors
- Supports custom rule sets
- Fast and lightweight
