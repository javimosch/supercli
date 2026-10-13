---
name: probe-rs
description: Use this skill when the user wants to flash, debug, or inspect embedded microcontrollers (ARM/RISC-V/Xtensa) with debug probes using probe-rs.
---

# probe-rs Plugin

probe-rs is an embedded debugging toolkit: discover debug probes, detect chips, flash images, run firmware with RTT/defmt logging, and attach GDB or a DAP server. Written in Rust.

## Commands

### Discovery
- `probe-rs probe list` — List connected debug probes
- `probe-rs chip info` — Auto-detect and describe the attached chip

### Flash & Run
- `probe-rs chip download` — Flash an ELF/hex/bin (`probe-rs download --chip <chip> <file>`)
- `probe-rs chip run` — Flash + run with live RTT/defmt output (`--chip` usually required)
- `probe-rs chip reset` — Reset the target

### Debug
- `probe-rs debug gdb` — Start a GDB server (default localhost:1337)
- `probe-rs _ _` — Passthrough (attach, erase, trace, dap-server, benchmark, chip, complete, ...)

## Usage Examples

- "List my connected debug probes"
- "Detect which chip is attached and flash this ELF"
- "Run the firmware and show defmt logs"
- "Start a GDB server for this RP2040"

## Installation

```bash
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/probe-rs/probe-rs/releases/latest/download/probe-rs-tools-installer.sh | sh
# or: cargo install probe-rs-tools --locked
# or: cargo binstall probe-rs-tools
```

## Examples

```bash
probe-rs list
probe-rs info
probe-rs download --chip STM32F407VGTx firmware.elf
probe-rs run --chip nrf52840 --chip-allow-list target/thumbv7em-none-eabihf/release/app
probe-rs gdb --chip RP2040
probe-rs erase --chip esp32c3
```

## Key Features

- One tool for flashing, RTT/defmt logging, GDB, and DAP — replaces OpenOCD + pyOCD for most workflows
- Probes: ST-Link, J-Link, CMSIS-DAP/DAPLink, FTDI, ESP USB-JTAG, WLink, Blackmagic
- Linux non-root access needs the probe-rs udev rules (see install-guidance)
- `cargo-flash`/`cargo-embed` come bundled with probe-rs-tools for `cargo flash` workflows
