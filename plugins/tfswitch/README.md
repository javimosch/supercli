# tfswitch Plugin for SuperCLI

[tfswitch](https://github.com/warrensbox/terraform-switcher) lets you switch Terraform versions instantly: pick interactively, pass a version like `tfswitch 1.6.6`, or pin per-project via `.tfswitch.toml` / `required_version` constraints.

## Installation

```bash
# brew install warrensbox/tap/tfswitch
# Or: curl -L https://raw.githubusercontent.com/warrensbox/terraform-switcher/master/install.sh | bash
# Or: go install github.com/warrensbox/terraform-switcher@latest
# Verify: tfswitch --help

# Install supercli plugin
supercli plugins install ./plugins/tfswitch
```

## Commands

- `tfswitch self usage` — Print tfswitch usage and flags
- `tfswitch versions list` — List all downloadable Terraform versions (tfswitch --list-all). Pipes well into grep
- `tfswitch versions switch` — Switch terraform to a version (tfswitch 1.6.6). Bare 'tfswitch' prompts interactively or honors .tfswitch.toml
- `tfswitch _ _` — Passthrough to tfswitch CLI (version arg, --chdir, --bin, --opentofu and other flags)

All commands pass extra flags through to the underlying `tfswitch` CLI.
