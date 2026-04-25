# nvidia_oc - NVIDIA GPU Overclocking

## Overview
nvidia_oc is a simple command line tool to overclock Nvidia GPUs using the NVML library on Linux. Supports both X11 and Wayland.

## Quick Start

### Passthrough to nvidia_oc CLI
```bash
sc nvidia_oc _ <nvidia_oc-args>
```

## Key Features

- **NVML Library**: Uses NVIDIA Management Library
- **Linux Support**: Works on Linux systems
- **X11 & Wayland**: Supports both display servers
- **Overclocking**: Adjust GPU performance
- **Fan Control**: Manage GPU fan speeds

## Installation

```bash
cargo install nvidia_oc
```

## Usage Examples

### View current settings
```bash
nvidia_oc
```

### Set power limit
```bash
nvidia_oc --power-limit 200
```

### Set fan speed
```bash
nvidia_oc --fan-speed 80
```

### Set clock offset
```bash
nvidia_oc --clock-offset 100
```

## Notes

- Run `nvidia_oc --help` to see all available options
- Requires NVIDIA GPU and NVML library
- Works on Linux with X11 or Wayland
