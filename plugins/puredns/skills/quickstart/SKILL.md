---
name: puredns
description: Use this skill when the user wants to bulk-resolve domains, bruteforce subdomains, or validate DNS resolver lists with puredns.
---

# puredns Plugin

puredns resolves domains at scale against public resolvers while filtering wildcard responses and DNS poisoning. Modes: `resolve` (a list of names), `bruteforce` (wordlist + domain), `resolvers` (validate a resolver list). Uses massdns under the hood.

## Commands

### Resolution
- `puredns dns resolve [file]` — Resolve domain list (file or stdin)
- `puredns dns bruteforce <wordlist> <domain>` — Subdomain bruteforce
- `puredns dns resolvers <file>` — Validate resolver list
- `puredns _ _` — Passthrough to puredns CLI

## Usage Examples

- "Resolve this list of subdomains and keep only valid ones"
- "Bruteforce subdomains of example.com with this wordlist"
- "Clean up my resolver list, keep the trustworthy ones"

## Installation

```bash
go install github.com/d3mondev/puredns/v2@latest
# Requires massdns for high-throughput mode:
git clone https://github.com/blechschmidt/massdns && cd massdns && make && sudo cp bin/massdns /usr/local/bin/
```

## Examples

```bash
# Resolve domains, write valid ones
puredns resolve subs.txt -r resolvers.txt -w alive.txt

# Pipe from another tool (subfinder, amass...)
subfinder -d example.com -silent | puredns resolve -r resolvers.txt

# Bruteforce
puredns bruteforce subdomains-top1million.txt example.com -r resolvers.txt

# Validate resolvers against trusted ones
puredns resolvers resolvers.txt -t 8.8.8.8,1.1.1.1 -w resolvers-clean.txt

# Quiet + rate limit (public resolvers tolerate ~100 qps)
puredns resolve subs.txt -q --rate-limit 100
```

## Key Features

- Wildcard detection + filtering (removes false positives other tools keep)
- DNS-poisoning mitigation via trusted resolvers
- Millions of domains via massdns; stdin-friendly for recon pipelines
- `resolvers` mode sanitizes public resolver lists automatically
