# templ Plugin for SuperCLI

[templ](https://github.com/a-h/templ) — HTML templating language for Go — write type-safe .templ components that compile to Go code.

## Installation

```bash
go install github.com/a-h/templ/cmd/templ@latest
# or: brew install templ

# Install supercli plugin
supercli plugins install ./plugins/templ
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli templ self version` | Print templ version |
| `supercli templ code generate` | Compile .templ files to Go |
| `supercli templ code fmt` | Format .templ files in place |
| `supercli templ lsp run` | Run the templ language server |
| `supercli templ <any>` | Passthrough to templ CLI |

## Usage

```bash
supercli templ code generate
supercli templ code fmt
supercli templ lsp run
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
