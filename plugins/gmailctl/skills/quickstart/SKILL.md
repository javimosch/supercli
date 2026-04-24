---
name: gmailctl
description: Use this skill when the user wants to manage Gmail filters as code, apply declarative email automation, or version control Gmail filters.
---

# gmailctl Plugin

Declarative configuration for Gmail filters. Manage Gmail filters as code with a declarative DSL and version control your email automation.

## Commands

### Filter Management
- `gmailctl filter apply` — Apply Gmail filter configuration

### Utility
- `gmailctl _ _` — Passthrough to gmailctl CLI

## Usage Examples
- "Apply Gmail filters"
- "Manage email filters as code"
- "Declarative Gmail configuration"
- "Version control email filters"

## Installation

```bash
brew install gmailctl
```

Or via Go:
```bash
go install github.com/mbrt/gmailctl@latest
```

## Examples

```bash
# Apply filters
/gmailctl filter apply

# Dry run
/gmailctl filter apply --dry-run

# With config file
/gmailctl filter apply --config ./gmailctl.jsonnet

# Remove existing filters
/gmailctl filter apply --remove

# Any gmailctl command with passthrough
gmailctl _ _ apply
gmailctl _ _ export
gmailctl _ _ diff
```

## Key Features
- **Declarative** - Filters as code
- **DSL** - Simple JSONnet DSL
- **Version control** - Git your filters
- **Dry run** - Preview changes
- **Safe** - Review before apply
- **Automation** - Email automation
- **Labels** - Label management
- **Rules** - Complex rules
- **Import** - Import existing
- **Export** - Export filters

## Notes
- Requires Gmail API credentials
- Uses JSONnet for config
- Great for team email rules
- Version control friendly
