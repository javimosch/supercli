# binsider Plugin for SuperCLI

[binsider](https://binsider.dev) (by orhun) is a TUI for analyzing binaries:
static ELF analysis (headers, sections, symbols, strings, linked libs, hex
view) plus dynamic tracing — a friendly replacement for juggling `readelf`,
`nm`, `strings`, `ldd` and `hexdump`.

## Installation

```bash
cargo install binsider
# or: cargo binstall binsider
# or: brew install binsider

# Install supercli plugin
supercli plugins install ./plugins/binsider
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli binsider self version` | Show binsider version |
| `supercli binsider binary analyze <file>` | Analyze a binary in the TUI |
| `supercli binsider <any>` | Passthrough to binsider CLI |

## Usage

```bash
supercli binsider binary analyze /usr/bin/ls
binsider ./mybin                    # inside: tabs for info/symbols/strings/hex
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
