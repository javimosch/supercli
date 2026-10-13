---
name: hwinfo
description: Use this skill when the user wants detailed Linux hardware information — CPU, RAM, disks, NICs, GPU, USB — via the openSUSE hwinfo prober.
---

# hwinfo Plugin

hwinfo probes the machine's hardware and prints either a `--short` summary or an `--all` dump. Per-item flags (`--cpu`, `--disk`, `--memory`, `--netcard`, `--gfxcard`, `--usb`, `--bluetooth`, `--monitor`, ...) scope the report. Root probes return more (DMI/SMBIOS).

## Commands

- `hwinfo system short` — One-line-per-device overview
- `hwinfo system all` — Verbose probe of everything
- `hwinfo cpu info` / `disk info` / `memory info` / `network info` / `gpu info` — Scoped `--short` reports
- `hwinfo self version` — libhd version
- `hwinfo _ _` — Passthrough (`--usb`, `--bluetooth`, `--wlan`, `--sound`, `--listmd`, `--log FILE`, `--debug`, `--verbose`)

## Usage Examples

- "Give me a hardware summary of this machine"
- "What NICs does this server have?"
- "List disks and partitions"
- "Dump full hardware info to a file for support"

## Installation

```bash
sudo apt install hwinfo
```

## Examples

```bash
hwinfo --short                    # overview
hwinfo --short --cpu              # CPU only
hwinfo --short --netcard          # NICs only
hwinfo --disk --partition         # verbose disk+partition report
sudo hwinfo --all --log hw.txt    # full dump to file
hwinfo --listmd                   # compact detected-device list
```

## Key Features

- libhd prober sees more than /proc scraping (DMI, bus scans, monitor EDID)
- `--short` vs verbose modes; scoped per hardware class
- `--log FILE` for support bundles; `--listmd` compact device inventory
- Some sections richer as root (SMBIOS/DMI tables)
