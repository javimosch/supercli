# uni Plugin for SuperCLI

[uni](https://github.com/arp242/uni) queries the Unicode database from the
command line. Identify every codepoint in a string, search characters by
name, print blocks/categories/ranges as tables, and find emojis — with
`-format` templates and `-json` output.

## Installation

```bash
# Install uni binary
go install zgo.at/uni/v2@latest
# or: GitHub release binaries / distro packages

# Install supercli plugin
supercli plugins install ./plugins/uni
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli uni self help` | Show uni usage + `-format` reference |
| `supercli uni unicode identify` | Identify codepoints in a string/stdin |
| `supercli uni unicode search` | Search characters by description |
| `supercli uni unicode print` | Print codepoints/blocks/categories |
| `supercli uni unicode emoji` | Find emojis by keyword |
| `supercli uni <any>` | Passthrough to uni CLI |

## Usage

```bash
# What is this character?
supercli uni unicode identify -- "€🧟"

# Find characters / emojis
supercli uni unicode search -- rightwards arrow
supercli uni unicode emoji -- cry

# Print a block as a table
supercli uni unicode print -- -as table box
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
