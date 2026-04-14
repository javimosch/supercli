---
name: govctl
description: Use this skill when the user wants to govern AI coding with RFCs, ADRs, work items, and verification guards for software development.
---

# govctl Plugin

A governance harness for AI coding — turn prompts and patches into RFCs, ADRs, work items, and guarded delivery.

## Commands

### Artifacts
- `govctl rfc new` — Create a new RFC
- `govctl adr new` — Create a new ADR
- `govctl work new` — Create a new work item

### Status
- `govctl status` — Show current state

## Usage Examples
- "Create an RFC for caching strategy"
- "Create an ADR for database choice"
- "Track work with acceptance criteria"

## Installation

```bash
cargo install govctl
```

Or:
```bash
cargo binstall govctl
```

## Examples

```bash
# Initialize
govctl init
govctl status

# Create artifacts
govctl rfc new "Caching Strategy"
govctl adr new "Choose cache backend"
govctl work new --active "implement caching"

# Edit artifacts
govctl rfc get RFC-0001 status
govctl adr edit ADR-0038 decision --stdin

# TUI mode
govctl tui
```

## Key Features
- RFCs describe externally relevant behavior
- ADRs record design choices
- Work items track execution
- Verification guards enforce completion gates
- Artifacts live in repo as TOML
- Works in brownfield repositories
