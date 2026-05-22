# rink Quickstart

Rink is a unit-aware calculator with dimensionality analysis for physics and engineering calculations. Use this skill when you need to:

- Convert between different units of measurement
- Perform physics and engineering calculations
- Analyze dimensionality of physical quantities
- Work with SI, CGS, customary, and historical units
- Perform currency conversions
- Calculate with arbitrary precision

## Installation

```bash
cargo install rink
rink --version
```

Also available via Homebrew: `brew install rink`

## Core Usage

### Interactive Mode

```bash
rink
```

Starts an interactive unit calculator session. Type expressions and press Enter to evaluate.

### Evaluate Single Expression

```bash
rink "5 meters to feet"
```

## Unit Conversions

### Basic Conversions

```bash
# Length
5 meters to feet
1 mile to kilometers
100 centimeters to inches

# Mass
1 kg to pounds
500 grams to ounces

# Temperature
32°F to °C
100°C to °K
```

### Velocity and Speed

```bash
# Speed conversions
100 km/h to mph
60 mph to m/s
speed of light to km/h

# Velocity
10 m/s to km/h
```

### Energy and Power

```bash
# Energy
1 kWh to joules
1 calorie to joules
1 BTU to joules

# Power
100 watts to horsepower
1 horsepower to watts
```

### Volume

```bash
1 gallon to liters
1 liter to cubic meters
1 cubic foot to gallons
```

### Area

```bash
1 square meter to square feet
1 acre to square meters
1 hectare to acres
```

## Physics Calculations

### Force and Work

```bash
# Calculate force
10 kg * 9.8 m/s^2 to newtons

# Work and energy
50 newtons * 10 meters to joules
```

### Electricity

```bash
# Power
120 volts * 2 amps to watts

# Energy consumption
100 watts * 5 hours to kWh
```

### Mechanics

```bash
# Kinetic energy
0.5 * 10 kg * (10 m/s)^2 to joules

# Potential energy
10 kg * 9.8 m/s^2 * 5 meters to joules
```

## Dimensionality Analysis

### Unit Factorization

```bash
# Find units for a quantity
5 kg * m/s^2

# Rink will show this is equivalent to:
# 5 newton (force)
```

### Physical Quantity Analysis

```bash
# Analyze dimensionality
joules / second

# Shows this is:
# watt (power)
```

## Currency Conversions

```bash
# Currency conversion
100 USD to EUR
50 EUR to GBP
1000 JPY to USD
```

## Advanced Features

### Compound Calculations

```bash
# Complex expressions
(5 meters + 3 feet) to centimeters

# Multi-step calculations
10 kg * 9.8 m/s^2 * 5 meters to joules
```

### Custom Units

```bash
# Define and use custom units
# (Rink has extensive built-in unit definitions)
```

### Historical Units

```bash
# Historical measurements
1 rod to meters
1 furlong to kilometers
1 hogshead to liters
```

## Examples

### Electricity Cost Calculation

```bash
# Calculate annual electricity cost
# 100 watts for 4 hours/day at $0.1545/kWh
0.1545 $/kWh * 100 W * (4 hours / day) to $/year
```

### Fuel Efficiency

```bash
# Convert fuel efficiency
9.4 km/l to mpg

# Historical units (rods per hogshead!)
9.4 km/l to rods per hogshead
```

### Physics Problem

```bash
# Surface gravity of gold sphere the size of the moon
volume of moon * (19.283 g/cm^3) * G / (radius of moon)^2 to gravity
```

### Unit Definitions

```bash
# Look up unit definitions
hogshead
liquidbarrel
rod
```

## Supported Unit Systems

- **SI** (International System of Units)
- **CGS** (Centimeter-Gram-Second)
- **Natural units**
- **International customary**
- **US customary**
- **UK customary**
- **Historical measurements**

## Tips

- Use `to` keyword for conversions
- Rink automatically handles unit factorization
- Shows SI physical quantities automatically
- Detailed error messages for invalid operations
- Helps with dimensionality analysis
- Arbitrary precision math for accurate calculations
- Web interface available at https://rinkcalc.app

## Common Patterns

### Distance and Speed

```bash
# Travel time calculation
100 km / (60 km/h) to hours
```

### Energy and Cost

```bash
# Energy cost
1 kWh * 0.15 $/kWh to $
```

### Area and Volume

```bash
# Tank volume
2 meters * 3 meters * 1.5 meters to liters
```

### Scientific Notation

```bash
# Large numbers
1.23e6 meters to kilometers
```
