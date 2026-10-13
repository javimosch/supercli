---
name: espflash
description: Use this skill when the user wants to flash firmware, monitor serial output, or manage flash/partitions on Espressif ESP32/ESP8266 chips.
---

# espflash Plugin

espflash is a Rust serial flasher for Espressif chips (ESP32, ESP32-C/S/H/P variants, ESP8266). No esptool.py or ESP-IDF needed. Supports USB-Serial-JTAG and UART bridges, defmt logging, and partition table conversion.

## Commands

### Device
- `espflash board info` — Detect connected chip and show flash info
- `espflash serial monitor` — Serial monitor (defmt-aware); long-running

### Flashing
- `espflash flash write` — Flash image (`espflash flash <image> --monitor`)
- `espflash flash erase` — Erase entire flash (`erase-region`, `erase-parts` for partial)
- `espflash flash read` — Read flash region to file
- `espflash partition table` — Read/convert/write partition table (csv↔bin)
- `espflash _ _` — Passthrough (save-image, write-bin, checksum-md5, hold-in-reset, completions, ...)

## Usage Examples

- "Flash this binary to my ESP32-C3"
- "What ESP chip is connected?"
- "Erase the flash and monitor the serial output"
- "Convert this partitions.csv to a binary partition table"

## Installation

```bash
cargo install espflash --locked
# or: cargo binstall espflash
# or: https://github.com/esp-rs/espflash/releases (prebuilt binaries)
```

## Examples

```bash
espflash board-info
espflash flash firmware.bin --monitor
espflash monitor --port /dev/ttyUSB0
espflash erase-flash
espflash partition-table partitions.csv --to-binary -o partitions.bin
espflash read-flash 0x9000 0x6000 nvs.bin
```

## Key Features

- Works standalone — no Python or ESP-IDF dependency
- `--monitor` flashes then opens serial output in one step
- defmt log decoding when firmware uses defmt
- Linux serial access needs the `dialout` group
