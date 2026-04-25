# timetrace - Time Tracking

## Overview
timetrace is a simple CLI for tracking your working time. Track time by project, generate reports, and integrate with shell prompts.

## Quick Start

### Start tracking time
```bash
sc timetrace start tracking <project>
```

### Stop tracking time
```bash
sc timetrace stop tracking
```

### Passthrough to timetrace CLI
```bash
sc timetrace _ <timetrace-args>
```

## Key Features

- **Simple Tracking**: Start and stop time tracking for projects
- **Project Management**: Create and manage projects
- **Reports**: Generate time reports
- **Shell Integration**: Integrate with Starship and other prompts
- **Multiple Install Methods**: Homebrew, Snap, AUR, Scoop, Docker, Binary
- **Configurable**: 12-hour/24-hour clock, decimal hours, editor settings

## Installation

```bash
brew install timetrace
```

Also available via:
- Snap
- AUR (Arch Linux)
- Scoop (Windows)
- Docker
- Binary

## Usage Examples

### Start tracking
```bash
timetrace start my-project
```

### Stop tracking
```bash
timetrace stop
```

### Check status
```bash
timetrace status
```

### Create project
```bash
timetrace create project my-project
```

### List projects
```bash
timetrace list projects
```

### Generate report
```bash
timetrace report
```

## Notes

- Run `timetrace --help` to see all available commands
- Supports shell integration with Starship
- Can be configured for 12-hour or 24-hour clock
