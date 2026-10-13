---
name: wafw00f
description: Use this skill when the user wants to fingerprint the Web Application Firewall protecting a target site with wafw00f.
---

# wafw00f Plugin

wafw00f fingerprints the WAF (Web Application Firewall) in front of a web application. It sends a normal request plus a mildly-malicious probe and matches responses against 200+ WAF signatures — Cloudflare, Akamai, AWS/Azure WAF, F5, ModSecurity, FortiWeb, and more.

## Commands

### Detection
- `wafw00f detect run <url>` — Fingerprint the WAF on a target (`-a` test all, `-o`/`-f` output)
- `wafw00f wafs list` — List all detectable WAFs
- `wafw00f _ _` — Passthrough (-i input file, -p proxy, --headers)

## Usage Examples

- "What WAF is protecting example.com"
- "Fingerprint WAFs on this list of hosts"
- "Check if the site is behind Cloudflare"

## Installation

```bash
pipx install wafw00f
# or: pip install wafw00f
# or: apt install wafw00f  (Kali/Debian)
```

## Examples

```bash
wafw00f https://target.com
wafw00f https://target.com -a          # try every WAF test, not just first match
wafw00f https://target.com -o out.json -f json
wafw00f -i targets.txt                 # batch from file
wafw00f --list                         # show detectable WAFs
```

## Key Features

- 200+ WAF vendor signatures
- Batch mode via `-i` file or stdin, JSON/CSV output via `-f`/`-o`
- Proxy and custom-header support for routing through burp/mitmproxy

Only probe targets you are authorized to test.
