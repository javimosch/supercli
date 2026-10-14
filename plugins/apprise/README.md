# apprise Plugin for SuperCLI

[apprise](https://github.com/caronc/apprise) — Push notifications to 100+ services (Discord, Slack, Telegram, email, Pushover…) from one CLI.

## Installation

```bash
pip install apprise
# or: pipx install apprise
# or: brew install apprise

# Install supercli plugin
supercli plugins install ./plugins/apprise
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli apprise self version` | Print apprise version |
| `supercli apprise notify send` | Send a notification: apprise -t 'Title' -b 'Body' <urls>. The URL scheme picks the service |
| `supercli apprise <any>` | Passthrough to apprise CLI |

## Usage

```bash
supercli apprise notify send
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
