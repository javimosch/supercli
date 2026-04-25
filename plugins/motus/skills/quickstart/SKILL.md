# motus - Password Generator

## Overview
motus is a dead simple password generator. Generate memorable passwords, random passwords, and PINs.

## Quick Start

### Generate a password
```bash
sc motus generate password
```

### Passthrough to motus CLI
```bash
sc motus _ <motus-args>
```

## Key Features

- **Simple**: Dead simple password generation
- **Memorable**: Generate memorable passwords
- **Random**: Generate random passwords
- **PINs**: Generate PIN codes
- **Headless**: Works in headless environments
- **SSH Friendly**: Suitable for SSH usage

## Installation

```bash
cargo install motus
```

Also available via:
- Homebrew
- Debian/Ubuntu packages

## Usage Examples

### Generate memorable password
```bash
motus
```

### Generate random password
```bash
motus --random
```

### Generate PIN
```bash
motus --pin
```

### Specify length
```bash
motus --length 16
```

## Notes

- Run `motus --help` to see all available options
