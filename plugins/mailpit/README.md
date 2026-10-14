# mailpit Plugin for SuperCLI

[mailpit](https://github.com/axllent/mailpit) — SMTP testing tool for developers — catches outgoing email in a local web UI and API (Mailhog successor).

## Installation

```bash
brew install mailpit
# or: go install github.com/axllent/mailpit@latest
# or: docker run -p 1025:1025 -p 8025:8025 axllent/mailpit

# Install supercli plugin
supercli plugins install ./plugins/mailpit
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli mailpit self version` | Print mailpit version and update info |
| `supercli mailpit server start` | Start Mailpit SMTP server + web UI |
| `supercli mailpit mail sendmail` | Send mail via the sendmail-compatible command |
| `supercli mailpit <any>` | Passthrough to mailpit CLI |

## Usage

```bash
supercli mailpit server start
supercli mailpit mail sendmail
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
