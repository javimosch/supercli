# vt-cli Plugin for SuperCLI

[vt-cli](https://github.com/VirusTotal/vt-cli) is the official VirusTotal
command-line tool. Look up file hashes, URLs, IPs, and domains; run VirusTotal
Intelligence searches; upload samples for scanning; and manage comments,
collections, graphs, and hunting rulesets.

## Installation

```bash
# Install vt binary (pick one)
go install github.com/VirusTotal/vt-cli/vt@latest
# or: prebuilt binaries from GitHub releases

# Install supercli plugin
supercli plugins install ./plugins/vt-cli

# One-time auth (free API key from virustotal.com)
vt init
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli vt-cli self version` | Show vt version |
| `supercli vt-cli file lookup <hash>` | File report by hash |
| `supercli vt-cli url lookup <url>` | URL report |
| `supercli vt-cli ip lookup <ip>` | IP address report |
| `supercli vt-cli domain lookup <domain>` | Domain report |
| `supercli vt-cli search run <query>` | VT Intelligence search |
| `supercli vt-cli scan file <path>` | Upload a file for scanning |
| `supercli vt-cli <any>` | Passthrough to vt CLI |

## Usage

```bash
supercli vt-cli file lookup 44d88612fea8a8f36de82e1278abb02f
supercli vt-cli domain lookup example.com
supercli vt-cli search run "type:peexe positives:5+"
supercli vt-cli scan file ./sample.bin
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
