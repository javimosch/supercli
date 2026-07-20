---
name: tinygo
description: Use this skill when the user wants to compile Go for microcontrollers, WebAssembly, or constrained environments — smaller binaries than standard Go with board-specific targets.
---

# tinygo Plugin

TinyGo is a Go compiler for microcontrollers, WebAssembly, and systems with tight memory limits. Produces smaller binaries than `go build` and supports dozens of embedded boards.

## Installation

```bash
brew install tinygo
# or download from https://tinygo.org/getting-started/
```

## Basic Usage

```bash
# Check version and supported targets
tinygo version

# Build for WebAssembly
tinygo build -o app.wasm -target=wasm main.go

# Flash to a microcontroller (example: Arduino Nano 33)
tinygo flash -target=arduino-nano33 main.go
```

## Common Patterns

```bash
# List available boards/targets
tinygo targets

# Build with size optimization
tinygo build -size=short -o firmware.elf main.go

# Run on host (simulator)
tinygo run main.go
```

## Usage Examples

- "Compile this Go program to WebAssembly with tinygo"
- "Flash firmware to an Arduino Nano 33"
- "List tinygo supported targets"

## SuperCLI

```bash
sc tinygo _ _ version
sc tinygo _ _ build -o out.wasm -target=wasm main.go
sc plugins learn tinygo
```
