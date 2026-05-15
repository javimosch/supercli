---
name: ordercli
description: Use this skill when the user wants to check food delivery order history, track active orders, or reorder from Foodora or Deliveroo.
---

# ordercli — Food Delivery CLI

CLI for Foodora and Deliveroo food delivery services. View order history, track active orders, and reorder past meals.

## Commands

- `ordercli foodora history` — View Foodora order history
- `ordercli foodora orders` — Track active Foodora orders
- `ordercli _ _` — Passthrough to ordercli CLI

## Installation

```bash
go install github.com/steipete/ordercli/cmd/ordercli@latest
```

## Usage Examples

- "Show my Foodora order history"
- "Track my active food delivery"
- "Reorder my last pasta from Foodora"

## Key Commands

```bash
# Order history
ordercli foodora history
ordercli foodora history --limit 50
ordercli foodora history show <orderCode> --json

# Active orders
ordercli foodora orders
ordercli foodora orders --watch

# Reorder (preview)
ordercli foodora reorder <orderCode>
ordercli foodora reorder <orderCode> --confirm
```

## Key Features
- **Order History** - View past orders
- **Active Tracking** - Track live orders
- **Reorder** - Quick reorder favorites
- **JSON Output** - Scriptable
