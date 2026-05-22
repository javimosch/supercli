# kalker Quickstart

Kalker is a calculator program with support for user-defined variables, functions, differentiation, integration, vectors, matrices, and more. Use this skill when you need to:

- Evaluate mathematical expressions with advanced features
- Perform differentiation and integration
- Work with vectors and matrices
- Define custom functions and variables
- Use different number bases (binary, octal, hexadecimal)
- Perform calculations with syntax highlighting

## Installation

```bash
cargo install kalker
kalker --version
```

Also available via Homebrew: `brew install kalker`

## Core Usage

### Interactive Mode

```bash
kalker
```

Starts an interactive calculator session. Type expressions and press Enter to evaluate.

### Evaluate Single Expression

```bash
kalker "2 + 2"
```

### Load File with Predefined Functions

```bash
kalker -i physics.kalk
```

Loads a file containing predefined functions and constants before starting the interactive session.

## Mathematical Features

### Basic Operations

```bash
2 + 2
10 - 3
4 * 5
20 / 4
```

### Functions

```bash
sin(pi/2)
cos(0)
tan(pi/4)
sqrt(16)
log(100)
```

### Variables

```bash
x = 5
y = 10
x + y
```

### User-Defined Functions

```bash
f(x) = x^2
f(5)

g(x, y) = x * y
g(3, 4)
```

### Differentiation

```bash
f'(2)
sin'(-pi)
```

### Integration

```bash
∫(0, pi, sin(x) dx)
∫(0, π, cos(x) dx)
```

### Vectors

```bash
(1, 2, 3)
(1, 2, 3) + (4, 5, 6)
```

### Matrices

```bash
[1, 2, 3; 4, 5, 6; 7, 8, 9]
```

### Sum Function

```bash
sum(1, 3, 2n+1)
```

Equivalent to: 2*1+1 + 2*2+1 + 2*3+1 = 15

### Piecewise Functions

```bash
f(x) = { f(x + 1) if x <= 1; x otherwise }
```

Press Enter before typing the final `}` to create a new line without submitting.

## Number Bases

### Binary

```bash
0b1101
1101_2
```

### Octal

```bash
0o5.3
```

### Hexadecimal

```bash
0xff
```

## Special Features

### Previous Result

```bash
ans
```

Access the value of the previously calculated expression.

### Multiple Expressions

```bash
2 + 2; 3 + 3
```

Separate expressions with semicolons to write them on the same line.

### Special-Symbol Completion

Type a function name and press Tab to convert to special symbols:

```bash
sqrt → √
```

## Advanced Features

### Root Finding

```bash
x^2 = 64
```

Uses Newton's method to find roots (estimation and limited to one root).

### File Loading

Load files with predefined functions and constants:

```bash
kalker -i filename.kalk
```

Or within the interactive session:

```bash
load filename
```

Useful for domain-specific calculations (e.g., physics constants).

## Examples

### Physics Calculation

```bash
# Define variables
m = 10  # mass in kg
a = 9.8  # acceleration in m/s²

# Calculate force
F = m * a
```

### Geometry

```bash
# Area of circle
r = 5
A = pi * r^2

# Volume of sphere
V = (4/3) * pi * r^3
```

### Calculus

```bash
# Derivative
f(x) = x^3
f'(2)

# Integral
∫(0, 1, x^2 dx)
```

## Tips

- Use `ans` to reference the previous result
- Press Tab after function names for special symbols
- Load domain-specific files for specialized calculations
- Use semicolons for multiple expressions on one line
- Supports ambiguous syntax (e.g., `2sin50 + 2xy`)
- Available as CLI, mobile app (Android), and web interface (https://kalker.xyz)
