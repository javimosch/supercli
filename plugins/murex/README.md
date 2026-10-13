# murex Plugin for SuperCLI

[murex](https://murex.rocks) is a smarter shell and scripting environment:
typed pipelines that natively understand JSON, YAML, CSV and other structured
formats, inline hinting, and shell syntax designed around usability, safety
and productivity — a modern alternative to bash for DevOps work.

## Installation

```bash
go install github.com/lmorg/murex@latest
# or: brew install murex
# or: binary from https://github.com/lmorg/murex/releases

# Install supercli plugin
supercli plugins install ./plugins/murex
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli murex self version` | Show murex version |
| `supercli murex shell exec "<code>"` | Execute murex code (`murex -c`) |
| `supercli murex script run <file.mx>` | Run a murex script |
| `supercli murex <any>` | Passthrough to murex CLI |

## Usage

```bash
supercli murex shell exec 'open example.json -> [ foo ]'
supercli murex script run deploy.mx
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
