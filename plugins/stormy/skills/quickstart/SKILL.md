---
name: stormy
description: Use this skill when the user wants to check weather information for a city with ASCII art output, similar to neofetch style.
---

# stormy Plugin

Minimal neofetch-style weather CLI with ASCII art output. Fetch weather information for any city with configurable units and display formats.

## Commands

### Weather
- `stormy weather get` — Get weather information for a city

### Utility
- `stormy self version` — Print stormy version
- `stormy _ _` — Passthrough to stormy CLI

## Usage Examples
- "Show me the weather in New York"
- "Get weather for Tokyo in imperial units"
- "Check the weather in my current city"

## Installation

```bash
go install github.com/ashish0kumar/stormy@latest
```

## Examples

```bash
# Get weather (uses default city from config or auto-detect)
stormy weather get

# Get weather for a specific city
stormy weather get -c "New York"

# Get weather in imperial units (Fahrenheit)
stormy weather get -c "London" -u imperial

# Get weather in metric units (Celsius)
stormy weather get -c "Tokyo" -u metric

# Use a custom config file
stormy weather get --config ~/.config/stormy/config.toml
```

## Key Features
- Neofetch-style ASCII art weather display
- Support for any city worldwide
- Configurable units (metric/imperial)
- Configuration file support
- Minimal and fast
- Cross-platform (Linux, macOS, Windows, FreeBSD)

## Notes
- The default city can be set in the configuration file
- If no city is specified and no config exists, the tool may auto-detect location
- ASCII art style varies based on weather conditions
- Supports both metric (Celsius) and imperial (Fahrenheit) units
