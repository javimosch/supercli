# puredns Plugin for SuperCLI

[puredns](https://github.com/d3mondev/puredns) is a fast domain resolver and subdomain
bruteforcer from the ProjectDiscovery ecosystem. It resolves millions of names against
public resolvers, filters out wildcard answers and cache-poisoned results, and validates
resolver lists — accurate bulk DNS resolution for recon and audits.

## Installation

```bash
# Install puredns binary
go install github.com/d3mondev/puredns/v2@latest
# or: download from https://github.com/d3mondev/puredns/releases

# Install supercli plugin
supercli plugins install ./plugins/puredns
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli puredns self version` | Show puredns version |
| `supercli puredns dns resolve [file]` | Resolve domains (file or stdin) |
| `supercli puredns dns bruteforce <wordlist> <domain>` | Bruteforce subdomains |
| `supercli puredns dns resolvers <file>` | Validate resolver list |
| `supercli puredns <any>` | Passthrough to puredns CLI |

## Usage

```bash
# Resolve a list of subdomains
supercli puredns dns resolve subdomains.txt -r resolvers.txt

# Bruteforce with a wordlist
supercli puredns dns bruteforce wordlist.txt example.com -r resolvers.txt

# Validate resolvers
supercli puredns dns resolvers resolvers.txt -w resolvers-valid.txt
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
