---
name: tfswitch
description: Use this skill when the user needs to switch between Terraform versions — pinning a project version, listing available releases, or installing a specific terraform binary via tfswitch.
---

# tfswitch Plugin

[tfswitch](https://github.com/warrensbox/terraform-switcher) lets you switch Terraform versions instantly: pick interactively, pass a version like `tfswitch 1.6.6`, or pin per-project via `.tfswitch.toml` / `required_version` constraints.

## Commands

- `tfswitch self usage` — Print tfswitch usage and flags
- `tfswitch versions list` — List all downloadable Terraform versions (tfswitch --list-all). Pipes well into grep
- `tfswitch versions switch` — Switch terraform to a version (tfswitch 1.6.6). Bare 'tfswitch' prompts interactively or honors .tfswitch.toml
- `tfswitch _ _` — Passthrough to tfswitch CLI (version arg, --chdir, --bin, --opentofu and other flags)

## Installation

```bash
# brew install warrensbox/tap/tfswitch
# Or: curl -L https://raw.githubusercontent.com/warrensbox/terraform-switcher/master/install.sh | bash
# Or: go install github.com/warrensbox/terraform-switcher@latest
# Verify: tfswitch --help
```

Drops a .tfswitch.toml or reads version constraints from your .tf files — run 'tfswitch' bare in a Terraform dir to auto-pick the right version. Binaries are cached under ~/.terraform.versions.
