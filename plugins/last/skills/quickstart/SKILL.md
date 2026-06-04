---
name: last
description: Use this skill when the user needs to view login history, track user sessions, or review system reboots and shutdowns.
---

# last Plugin

Show listing of last logged in users. Monitor login activity, track user sessions, and review system reboot history.

## Commands

### Login History
- `last login show [--limit <n>]` — Show last logged in users
- `last user sessions <username>` — Show login sessions for a specific user
- `last self version` — Show last version info
- `last _ _ <args>` — Passthrough to last CLI

## Usage Examples
- "Show the last 20 login attempts"
- "When did user 'john' last log in?"
- "Show all system reboots and shutdowns"

## Installation

```bash
# Pre-installed on most Linux systems
# If missing:
apt-get install util-linux
supercli plugins install ./plugins/last --on-conflict replace --json
```

## Examples

```bash
# Show all login history
last

# Show last 10 logins
last -10
# or
last --limit 10

# Show logins for a specific user
last john

# Show system shutdowns and reboots
last --system

# Show full login/logout times
last --fulltimes

# Show with IP addresses
last --ip

# Show logins since a specific date
last --since 2025-01-01

# Show logins within a time window
last --since "2025-01-01" --until "2025-06-01"

# Show who was logged in at a specific time
last --present "2025-03-15 10:00"
```

## Key Features
- Track user login/logout history
- Monitor system reboots and shutdowns
- Filter by username, time range, or TTY
- Display IP addresses and DNS hostnames
- Full timestamp output for detailed auditing
- Present time queries to see who was active at a given moment
