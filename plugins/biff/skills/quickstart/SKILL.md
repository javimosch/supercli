---
name: biff
description: Use this skill when the user wants to format, parse, add, subtract, or compare dates and times from the command line, or manipulate timestamps in log files.
---

# biff Plugin

Datetime arithmetic, parsing, formatting, timezone conversion, sequence generation, and log timestamp tagging for the command line. By BurntSushi (author of ripgrep, xsv, and jiff).

## Commands

### Time Formatting
- `biff time fmt` — Format one or more timestamps

### Time Arithmetic
- `biff time add` — Add a duration to a timestamp

### Duration Calculation
- `biff span since` — Calculate the duration since a given timestamp

### Utility
- `biff self version` — Print biff version
- `biff _ _` — Passthrough to biff CLI

## Usage Examples
- "What time is it now?"
- "Format this date as RFC 3339"
- "What will the date be 6 months from now?"
- "How long has it been since January 20th?"
- "Convert UTC timestamps in a log to my local timezone"
- "Generate the next 5 Mondays at 9am"

## Installation

```bash
cargo install biff
```

## Examples

```bash
# Print the current time
biff _ _

# Format current time as RFC 3339
biff time fmt -f rfc3339 now

# Format current time as RFC 9557 (with timezone)
biff time fmt -f rfc9557 now

# Custom format
biff time fmt -f '%Y-%m-%d %H:%M:%S %Z' now

# Format multiple relative times
biff time fmt -f '%c' now -1d 'next sat' 'last monday' '9pm last mon'

# Add a duration to the current time
biff time add -1w now

# Add natural-language duration
biff time add '1 week, 12 hours ago' now

# Add 6 months
biff time add 6mo now

# Convert time to another timezone and round to nearest 15 minutes
biff time fmt now | biff _ _ time in Asia/Bangkok | biff _ _ time round -i 15 -s minute

# Calculate duration since a date
biff span since 2025-01-20T12:00

# Calculate duration with year-level precision
biff span since 2025-01-20T12:00 -l year

# Round a duration
biff span since 2025-01-20T12:00 | biff _ _ span round -l year -s day

# Generate a sequence of the next 5 weekdays at 9am
biff _ _ time seq day today -c5 -H 9 -w mon,wed,fri

# Generate all days remaining in the current month
biff _ _ time seq daily --until $(biff _ _ time end-of month now) today

# Generate the last weekday of each of the next 12 months
biff _ _ time seq -c12 monthly -w mon,tue,wed,thu,fri --set-position -1 | biff time fmt -f '%a, %Y-%m-%d'

# Reformat timestamps in a log file to local time
biff _ _ tag lines /tmp/access.log | biff _ _ time in system | biff time fmt -f '%c' | head -n3 | biff _ _ untag -s
```

## Key Features
- Print current time in various formats
- Format timestamps with RFC 3339, RFC 9557, or custom strftime patterns
- Parse natural-language relative times (now, -1d, next sat, last monday, 9pm last mon)
- Add/subtract durations with natural language (1 week, 12 hours ago, 6mo)
- Convert between timezones
- Round times to arbitrary increments
- Calculate durations since a given timestamp
- Round durations to desired precision
- Generate date/time sequences with filtering (weekdays, specific days)
- Tag and untag timestamps in log files for batch reformatting

## Notes
- biff uses the jiff datetime library (also by BurntSushi) for high-quality parsing and arithmetic
- For locale-aware output, set BIFF_LOCALE and use a release binary or build with the locale feature
- biff supports IANA timezone names (e.g. America/New_York, Asia/Bangkok)
- Duration parsing accepts shorthand (-1w) and verbose forms ("1 week, 12 hours ago")
