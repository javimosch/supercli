# espflash Plugin for SuperCLI

[espflash](https://github.com/esp-rs/espflash) is a serial flasher for Espressif
ESP32/ESP8266 chips written in Rust — flash firmware, monitor serial output
(defmt-aware), read/erase flash regions, and manage partition tables without
esptool.py or the ESP-IDF.

## Installation

```bash
cargo install espflash --locked
# or: cargo binstall espflash
# or: prebuilt binaries at https://github.com/esp-rs/espflash/releases

# Install supercli plugin
supercli plugins install ./plugins/espflash
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli espflash self version` | Show espflash version |
| `supercli espflash board info` | Detect chip and show board info |
| `supercli espflash flash write` | Flash a firmware image |
| `supercli espflash serial monitor` | Open serial monitor |
| `supercli espflash flash erase` | Erase entire flash |
| `supercli espflash flash read` | Read flash region to file |
| `supercli espflash partition table` | Read/convert/write partition table |
| `supercli espflash <any>` | Passthrough to espflash CLI |

## Usage

```bash
supercli espflash board info
supercli espflash flash write firmware.bin --monitor
supercli espflash flash read 0x1000 0x10000 out.bin
supercli espflash partition table partitions.csv -o partitions.bin
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
