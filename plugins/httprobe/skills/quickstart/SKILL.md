---
name: httprobe
description: Use this skill when the user wants to probe a list of domains for working HTTP/HTTPS servers — asset discovery, subdomain validation, or security recon from stdin.
---

# httprobe Plugin

Takes line-delimited domains on stdin and outputs only those with live HTTP or HTTPS endpoints. Built for pipeline workflows with other recon tools (subfinder, amass, etc.).

## Installation

```bash
go install github.com/tomnomnom/httprobe@latest
```

## Basic Usage

```bash
# Probe domains from a file
cat domains.txt | httprobe

# Prefer HTTPS only (skip HTTP when HTTPS works)
cat domains.txt | httprobe -prefer-https

# Tune concurrency and timeout
cat domains.txt | httprobe -c 50 -t 5000
```

## Pipeline Examples

```bash
# Subdomains → live hosts
subfinder -d example.com -silent | httprobe

# Save working URLs
cat targets.txt | httprobe > live.txt
```

## Usage Examples

- "Which of these subdomains have a web server?"
- "Probe this domain list for HTTP and HTTPS"
- "Filter live hosts from recon output"

## SuperCLI

```bash
echo "example.com" | sc httprobe domain probe
sc plugins learn httprobe
```
