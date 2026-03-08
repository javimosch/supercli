# Stripe Plugin Harness

This plugin integrates the [Stripe CLI](https://stripe.com/docs/stripe-cli) natively into dcli, providing both wrapped core commands and full passthrough support.

## Prerequisites

You must have the Stripe CLI installed to use this plugin:

```bash
# macOS (Homebrew)
brew install stripe/stripe-cli/stripe

# Linux/Windows
# See: https://docs.stripe.com/stripe-cli
```

Make sure you are authenticated before using it:
```bash
stripe login
```

## Available Commands

### Customers List

Lists the Stripe customers associated with your account.

```bash
dcli stripe customers list --limit 10 --json
```

### Full Passthrough

You can pass *any* Stripe CLI command directly via the passthrough functionality.

```bash
# Listen to webhooks
dcli stripe listen --forward-to localhost:3000

# Trigger events
dcli stripe trigger payment_intent.succeeded

# Show CLI version
dcli stripe version
```

## Output

All commands execute the underlying `stripe` binary and wrap the standard output in dcli's JSON envelope format.
