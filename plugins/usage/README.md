# usage Plugin for SuperCLI

[usage](https://usage.jdx.dev) is a spec-driven CLI toolkit by jdx (author of
mise). Declare your CLI in a `usage.kdl` spec — flags, args, subcommands,
completions — and get bash/zsh/fish completions, markdown docs, and argument
parsing for free. It powers mise's completion machinery.

## Installation

```bash
cargo install usage-cli
# or: mise use usage
# or: brew install usage

# Install supercli plugin
supercli plugins install ./plugins/usage
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli usage self version` | Show usage version |
| `supercli usage completion generate` | Generate shell completions from spec |
| `supercli usage json generate` | Emit CLI spec as JSON |
| `supercli usage spec list` | List commands in a spec |
| `supercli usage <any>` | Passthrough to usage CLI |

## Usage

```bash
supercli usage completion generate -- zsh mycli.usage.kdl > _mycli
supercli usage json generate -- -f usage.kdl
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
