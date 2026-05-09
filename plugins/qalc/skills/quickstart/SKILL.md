---
name: qalc
description: Use this skill when the user needs to do calculations, convert units (length, mass, temperature), convert currencies, solve equations, or perform mathematical operations from the command line.
---

# qalc Plugin

Powerful command-line calculator from Qalculate!. Non-interactive with `--terse` for clean output.

## Commands

### Math
- `qalc calc eval '5 + 2 * 3'` — Basic arithmetic
- `qalc calc eval 'sin(45deg)'` — Trigonometry
- `qalc calc eval 'sqrt(144)'` — Square root
- `qalc calc eval 'log(100)'` — Logarithms
- `qalc calc eval '2^10'` — Exponentiation
- `qalc calc eval 'factorial(10)'` — Factorial

### Unit Conversion
- `qalc convert units '100 meters to feet'` — Length
- `qalc convert units '1 gallon to liters'` — Volume
- `qalc convert units '50 celsius to fahrenheit'` — Temperature
- `qalc convert units '10 kg to pounds'` — Mass/Weight

### Currency
- `qalc convert currency '100 EUR to USD'` — Euro to Dollar
- `qalc convert currency '50 GBP to JPY'` — Pound to Yen

### Equation Solving
- `qalc solve equation 'x^2 - 4 = 0'` — Quadratic equation
- `qalc solve equation '2*x + 5 = 13'` — Linear equation

### Reference
- `qalc list units length` — List length units
- `qalc list functions trig` — List trig functions

### Full Access
- `qalc _ _` — Passthrough for any qalc command

## Usage Examples
- "What's 25 * 4.5?"
- "Convert 100 meters to feet"
- "How much is 50 EUR in USD?"
- "Solve x^2 + 3x - 10 = 0"
- "List all temperature units"

## Installation

```bash
brew install qalculate-tools
```

## Key Features
- **Non-interactive**: `qalc -t 'expression'` prints result and exits
- **Terse output**: `-t` flag gives clean result only — agent-friendly
- **2000+ units**: Length, mass, volume, temperature, time, and more
- **Currency**: Real-time exchange rates
- **Equations**: Solve linear, quadratic, differential equations
- **Functions**: Trig, log, stats, calculus, and custom functions
- **Physical constants**: Speed of light, Planck constant, etc.
