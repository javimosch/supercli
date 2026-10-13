---
name: vt-cli
description: Use this skill when the user wants to look up files, URLs, IPs, or domains in VirusTotal, run intel searches, or submit samples via the vt CLI.
---

# vt-cli Plugin

vt-cli is the official VirusTotal command-line tool. Look up file hashes, URLs, IPs, and domains; run VirusTotal Intelligence searches; upload files/URLs for scanning; and manage comments, collections, graphs, and hunting rulesets.

## Commands

### Lookups
- `vt-cli file lookup <hash>` — File report by MD5/SHA-1/SHA-256
- `vt-cli url lookup <url>` — URL report
- `vt-cli ip lookup <ip>` — IP address report
- `vt-cli domain lookup <domain>` — Domain report
- `vt-cli search run <query>` — VT Intelligence search

### Submission
- `vt-cli scan file <path>` — Upload a file for scanning
- `vt-cli _ _` — Passthrough (analysis, comments, collections, monitor, graph, retrofit)

## Usage Examples

- "Is this hash known malware?"
- "Look up this suspicious domain in VirusTotal"
- "Search VT for recent PE files signed by this cert"
- "Upload this sample to VirusTotal"

## Installation

```bash
go install github.com/VirusTotal/vt-cli/vt@latest
# or: prebuilt binaries from GitHub releases
# Requires a free VirusTotal API key: run `vt init` once (or pass -k/--apikey)
```

## Examples

```bash
vt init                                        # store API key once
vt file 44d88612fea8a8f36de82e1278abb02f      # hash lookup
vt url http://suspicious.example/path
vt domain example.com --include="**"
vt ip 8.8.8.8
vt search "type:peexe positives:5+ last_submission_date:7d+"
vt scan file ./sample.bin
```

## Key Features

- Every lookup returns the full VT object; combine with `--include`/`--exclude` field filters and `-F/--filter` queries
- `vt search` runs VT Intelligence queries and can download matched samples (premium)
- Scriptable: CSV/YAML output modes (`-e/--output`, `--format csv`)
- One API key works for public lookups; premium features need an upgraded key
