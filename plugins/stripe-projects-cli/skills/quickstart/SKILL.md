---
name: stripe-projects-cli
description: Use this skill when the user wants to provision Stripe-powered services, manage project credentials, or handle billing from the terminal.
---

# Stripe Projects CLI

Provision provider-backed services from the terminal, link existing accounts, sync credentials into .env, and manage upgrades and billing.

## Commands

- `stripe-projects-cli project init` — Initialize a new Stripe project
- `stripe-projects-cli _ _` — Passthrough to stripe projects CLI

## Installation

```bash
brew install stripe/stripe-cli/stripe
```

## Usage Examples

- "Initialize a new Stripe project"
- "Link a Stripe account to my project"
- "Sync credentials to .env"
- "Upgrade my Stripe project plan"

## Key Commands

```bash
# Initialize
stripe projects init

# Link account
stripe projects link

# Sync credentials
stripe projects sync

# Upgrade
stripe projects upgrade
```

## Key Features
- **Provisioning** - Set up services quickly
- **Credential Sync** - Auto .env management
- **Non-Interactive** - Agent-friendly
- **JSON Output** - Structured data
- **Public Preview** - Early access
