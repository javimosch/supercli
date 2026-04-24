---
name: tock
description: Use this skill when the user wants to track time, generate time reports, export activity data, or analyze productivity from the command line.
---

# tock Plugin

Powerful time tracking tool for the command line with headless report generation, CSV/JSON export, and productivity analysis including Deep Work Score and Chronotype estimation.

## Commands

### Activity Tracking
- `tock activity start` — Start tracking time for an activity
- `tock activity stop` — Stop the current activity
- `tock activity continue` — Continue a previous activity
- `tock activity current` — Show the currently running activity
- `tock activity last` — List recent activities

### Reporting
- `tock report generate` — Generate a text report for a specific day
- `tock report export` — Export report data as text, CSV, or JSON
- `tock report analyze` — Generate productivity analysis with Deep Work Score

### Utility
- `tock self version` — Print tock version
- `tock _ _` — Passthrough to tock CLI

## Usage Examples
- "Start tracking work on Project X"
- "Generate a time report for today"
- "Export yesterday's report as CSV"
- "Analyze my productivity for the last 7 days"
- "Show my current activity"

## Installation

```bash
brew install kriuchkov/tap/tock
```

## Examples

```bash
# Start tracking
tock activity start "My Project" "Implementing features"
tock activity start -p "My Project" -d "Implementing features"

# Start with specific time and tags
tock activity start -p "My Project" -d "Meeting" -t 14:30 --note "Sprint planning" --tag "work"

# Stop tracking
tock activity stop
tock activity stop -t 17:00 --note "Finished for the day"

# Continue previous activity
tock activity continue
tock activity continue 1

# Show current activity
tock activity current
tock activity current --format "{{.Project}}: {{.Duration}}"

# List recent activities
tock activity last
tock activity last -n 20

# Generate reports
tock report generate --today
tock report generate --yesterday
tock report generate --date 2025-12-01
tock report generate -p "My Project" -d "meeting"
tock report generate --summary
tock report generate --json

# Export reports
tock report export --today
tock report export --yesterday --fmt csv
tock report export --date 2026-01-29 --fmt json
tock report export --today --stdout

# Productivity analysis
tock report analyze
tock report analyze --days 7
```

## Key Features
- Simple CLI time tracking (start/stop/continue)
- Headless text reports with project/description filters
- JSON and CSV export with stdout option
- Productivity analysis (Deep Work Score, Chronotype, Context Switching)
- Calendar and iCal integration
- Shell completion support
- TodoTXT and TimeWarrior storage backends
- Custom themes and time formats
