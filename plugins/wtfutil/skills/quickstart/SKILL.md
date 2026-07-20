---
name: wtfutil
description: Use this skill when the user wants a personal terminal dashboard — at-a-glance GitHub activity, weather, calendar, RSS feeds, and system stats in one TUI.
---

# wtfutil Plugin

Personal information dashboard for your terminal. Modular widgets show GitHub PRs, Google Calendar, weather, Hacker News, security advisories, and more — all in a single scrollable view.

## Installation

```bash
go install github.com/wtfutil/wtf@latest
# or
brew install wtfutil
```

## Basic Usage

```bash
# Launch the dashboard (uses ~/.config/wtf/config.yml)
wtfutil

# Open with a custom config file
wtfutil --config=~/my-wtf-config.yml
```

## Configuration

Create `~/.config/wtf/config.yml` to enable modules. Example modules:

- **GitHub** — open PRs and issues (`github` module)
- **Google Calendar** — upcoming events
- **Weather** — current conditions via OpenWeatherMap
- **HackerNews** — top stories
- **Security** — CVE/advisory feeds

See [wtfutil docs](https://github.com/wtfutil/wtf#documentation) for module setup and API keys.

## Usage Examples

- "Show my GitHub PRs and today's calendar in the terminal"
- "Set up a dev dashboard with weather and Hacker News"
- "Launch my personal WTF dashboard"

## SuperCLI

```bash
sc wtfutil _ _
sc plugins learn wtfutil
```
