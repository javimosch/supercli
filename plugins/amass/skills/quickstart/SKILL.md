---
name: amass
description: Use this skill when the user wants to map attack surfaces, discover subdomains, or perform OSINT reconnaissance on a target domain — enumerate DNS records, find related assets, and build an external asset inventory.
---

# amass Plugin

OWASP Amass performs in-depth attack surface mapping and external asset discovery using OSINT and active recon techniques. Ideal for security assessments, bug bounty recon, and infrastructure inventory.

## Installation

```bash
go install github.com/owasp-amass/amass/v5@master
# or
brew install amass
```

## Basic Usage

```bash
# Passive subdomain enumeration (no direct contact with target)
amass enum -passive -d example.com

# Active enumeration with DNS brute-force
amass enum -active -d example.com

# Save results to a file
amass enum -d example.com -o results.txt

# Intel mode — gather info about an organization
amass intel -org "Example Corp"
```

## Common Patterns

```bash
# Enumerate multiple domains
amass enum -d example.com -d example.org

# Use custom resolvers for faster DNS lookups
amass enum -d example.com -r 8.8.8.8,1.1.1.1

# Visualize the attack surface (requires graph output)
amass enum -d example.com -oA amass_output/
```

## Usage Examples

- "Find all subdomains of example.com"
- "Run passive OSINT recon on this domain"
- "Discover external assets for this organization"

## SuperCLI

```bash
sc amass _ _ enum -passive -d example.com
sc plugins learn amass
```
