---
name: noseyparker
description: Use this skill when the user wants to scan files, git history, or GitHub orgs for leaked secrets, credentials, and API keys.
---

# noseyparker Plugin

noseyparker is Praetorian's deep secrets scanner. A Rust engine with 160+ rules scans files and full git history into a deduplicating datastore, then emits human or JSON reports.

## Commands

### Scanning
- `noseyparker scan run` — Scan paths into a datastore (`scan -d <ds> <path>...`)
- `noseyparker _ _` — Passthrough (`github repos list`, `summarize`, `datastore`)

### Reporting
- `noseyparker report generate` — Report findings (`-d <ds>`, `-f human|json|jsonl`)
- `noseyparker datastore export` — Export a datastore
- `noseyparker rules list` — List detection rules

### Info
- `noseyparker self version` — Show version

## Usage Examples

- "Scan this repo's git history for leaked keys"
- "Give me a JSON report of findings"
- "Enumerate this GitHub org's repos and scan them"
- "What rules does noseyparker detect?"

## Installation

```bash
cargo install noseyparker-cli
# or: brew install noseyparker / GitHub release zip / docker ghcr.io/praetorian-inc/noseyparker
```

## Examples

```bash
# Scan current directory + git history into a datastore
supercli noseyparker scan run -d scan.ds .

# Findings as JSON for pipelines
supercli noseyparker report generate -d scan.ds -f json

# Enumerate then scan GitHub repos (needs NP_GITHUB_TOKEN)
supercli noseyparker _ _ github repos list --all-user-members some-org

# Rule inventory
supercli noseyparker rules list
```

## Key Features

- Scans files and complete git history (blobs included) — much faster than ripgrep-based scanners
- Datastore dedupes identical findings across repos; resumable incremental scans
- `-f json`/`jsonl` output for automation; `--rules`/custom rules files supported
- `noseyparker github repos list` enumerates users/orgs for fleet-wide scanning
- `noseyparker summarize` gives a quick findings count without a full report
