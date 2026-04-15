---
name: domain-check.quickstart
description: Agent workflow for using domain-check CLI to check domain availability across 1,200+ TLDs.
tags: domain,dns,whois,rdap,tld,availability,check,pattern,generator
---

# domain-check Quickstart

Use this when AI agents need to check domain name availability, batch check multiple domains, or generate domain patterns.

## 1) Install plugin and dependency

```bash
cargo install domain-check
domain-check --version
supercli plugins install ./plugins/domain-check --json
```

## 2) Validate CLI wiring

```bash
domain-check --version
supercli domain-check self version
supercli plugins doctor domain-check --json
```

## 3) Core command patterns

### Self commands

```bash
supercli domain-check self version
```

### Check single domain

```bash
supercli domain-check domain check example.com
```

### Bulk check domains

```bash
supercli domain-check domain bulk domains.txt
```

## 4) Common workflows

### Domain availability search

1. Check a single domain: `supercli domain-check domain check myidea.io`
2. Generate domain patterns for a brand: `domain-check pattern "mybrand"`
3. Bulk verify generated patterns: `supercli domain-check domain bulk patterns.txt`

### Domain research pipeline

1. Check primary domain: `supercli domain-check domain check yourbrand.com`
2. Check variations: `supercli domain-check domain bulk brand-variations.txt`
3. Filter available domains for registration

## 5) Safety levels

| Command | Level | Description |
|---------|-------|-------------|
| `self version` | safe | Read-only version check |
| `domain check` | safe | Read-only domain availability check |
| `domain bulk` | safe | Read-only bulk domain check |

All domain-check commands are safe — they only query domain availability without making any changes.
