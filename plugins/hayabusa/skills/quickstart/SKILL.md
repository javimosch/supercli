---
name: hayabusa
description: Use this skill when the user needs to analyze Windows event logs (.evtx) for threats — building forensic timelines, searching for IoCs, or summarizing logon activity during incident response.
---

# hayabusa Plugin

Hayabusa (Yamato Security) is a fast DFIR tool for Windows event logs. Point it at a directory of exported .evtx files and it applies ~4000 bundled Sigma-compatible rules to produce a severity-tagged forensic timeline — written in Rust, no dependencies.

## Commands

- `hayabusa timeline csv` — CSV timeline from .evtx directory or file
- `hayabusa timeline json` — JSON/JSONL timeline (pipe into jq/SIEM)
- `hayabusa logs metrics` — Event-ID counts per file
- `hayabusa logs search` — Keyword/regex search in event data
- `hayabusa rules update` — Refresh bundled detection rules
- `hayabusa _ _` — Passthrough to hayabusa CLI

## Usage Examples

- "Build a forensic timeline from these exported domain controller logs"
- "Search the evtx files for powershell -enc invocations"
- "Show me which event IDs dominate this Security.evtx"

## Installation

```bash
# Download release zip from
# https://github.com/Yamato-Security/hayabusa/releases
# or: cargo install --git https://github.com/Yamato-Security/hayabusa
hayabusa --version
```

## Examples

```bash
# Full detections timeline → CSV (sorted by severity in output)
hayabusa csv-timeline -d ./evtx -o timeline.csv

# JSONL for agent pipelines — one detection per line
hayabusa json-timeline -d ./evtx -o detections.jsonl -L

# Live analysis on a Windows box (requires admin)
hayabusa csv-timeline -l -o timeline.csv

# Only medium+ severity, then grep for a user
hayabusa csv-timeline -d ./evtx -m medium -o timeline.csv
hayabusa search -d ./evtx -k "administrator"

# Triage: logon summary + event metrics first
hayabusa logon-summary -d ./evtx -o logons.csv
hayabusa log-metrics -d ./evtx
```

## Key Features

- Runs on Linux/macOS/Windows against exported .evtx — no Windows needed
- Severity levels: informational → critical; tune with `level-tuning`
- Extra analyzers: logon-summary, eid-metrics, computer-metrics, extract-base64, pivot-keywords-list
- JSONL output is agent-friendly for post-processing with jq
- Companion: takajo (timeline triage) and the hayabusa-rules repo
