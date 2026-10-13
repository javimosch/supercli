# dalfox Plugin for SuperCLI

[dalfox](https://github.com/hahwul/dalfox) is a fast open-source XSS scanner
written in Go. It mines parameters, applies context-aware payload encoding, and
detects reflected, stored, and DOM XSS — with blind-XSS callbacks and WAF
evasion.

## Installation

```bash
# Install dalfox binary (pick one)
go install github.com/hahwul/dalfox/v2@latest
# or: brew install dalfox
# or: snap install dalfox

# Install supercli plugin
supercli plugins install ./plugins/dalfox
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli dalfox self version` | Show dalfox version |
| `supercli dalfox scan url <url>` | Scan a single URL for XSS |
| `supercli dalfox scan file <file>` | Scan targets from a file |
| `supercli dalfox scan pipe` | Scan URLs from stdin |
| `supercli dalfox payload list` | List built-in XSS payloads |
| `supercli dalfox <any>` | Passthrough to dalfox CLI |

## Usage

```bash
supercli dalfox scan url "https://target.com/search?q=test"
supercli dalfox scan url "https://target.com/x" -b https://callback.io
cat urls.txt | supercli dalfox scan pipe
```

Only scan targets you are authorized to test.

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
