# cpc - Unit-Aware Calculator

## Overview
cpc is a text calculator with support for units and conversion. Calculate expressions with unit conversions.

## Quick Start

### Calculate expression
```bash
sc cpc calculate expression <expression>
```

### Passthrough to cpc CLI
```bash
sc cpc _ <cpc-args>
```

## Key Features

- **Calculator**: Text-based calculator
- **Unit Support**: Support for various units
- **Conversion**: Unit conversion capabilities
- **CLI Tool**: Command-line interface
- **Web Interface**: Also available as web interface
- **Package**: Available as package

## Installation

```bash
cargo install cpc
```

Also available via:
- Web interface
- API

## Usage Examples

### Basic calculation
```bash
cpc "2 + 2"
```

### Unit conversion
```bash
cpc "100 km to miles"
```

### Complex expression
```bash
cpc "(10 + 5) * 2"
```

### With units
```bash
cpc "5 km/h * 2 h"
```

## Notes

- Run `cpc --help` to see all available options
