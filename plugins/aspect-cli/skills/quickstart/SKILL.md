# aspect-cli - Bazel CLI

## Overview
aspect-cli is Aspect CLI for Bazel - Correct, Fast, Usable. Bazel CLI with improvements and extensions.

## Quick Start

### Build Bazel target
```bash
sc aspect build target <target>
```

### Passthrough to aspect CLI
```bash
sc aspect _ <aspect-args>
```

## Key Features

- **Correct**: Reliable Bazel builds
- **Fast**: Optimized build performance
- **Usable**: Better user experience
- **Extensions**: Additional features
- **Bazel Compatible**: Works with Bazel
- **Enterprise Ready**: For enterprise use

## Installation

```bash
cargo install aspect-cli
```

Also available via:
- Various package managers

## Usage Examples

### Build target
```bash
aspect build //path/to:target
```

### Test target
```bash
aspect test //path/to:target
```

### Run target
```bash
aspect run //path/to:target
```

### Query dependencies
```bash
aspect query deps //path/to:target
```

## Notes

- Run `aspect --help` to see all available options
