---
name: cron-validate
description: Validate cron expressions.
---
# cron-validate Plugin
Validate and describe cron schedule expressions.

## Commands
- `cron-validate <resource> <action>` — Execute cron-validate commands
- `cron validate run` — cron-validate utility

## Usage
- `cron validate expr "*/5 * * * *"` → Every 5 minutes
- `cron validate expr "0 9 * * 1-5"` → Weekdays at 9 AM
