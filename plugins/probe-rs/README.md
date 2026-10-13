# probe-rs Plugin for SuperCLI

[probe-rs](https://github.com/probe-rs/probe-rs) is a modern embedded debugging
toolkit: flash firmware, stream RTT/defmt logs, attach a GDB server, and inspect
targets — ARM, RISC-V, and Xtensa cores over ST-Link, J-Link, CMSIS-DAP, FTDI,
ESP USB-JTAG, WLink, and Blackmagic probes.

## Installation

```bash
# Prebuilt binaries (recommended)
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/probe-rs/probe-rs/releases/latest/download/probe-rs-tools-installer.sh | sh

# or: cargo install probe-rs-tools --locked
# or: cargo binstall probe-rs-tools
# or: brew install probe-rs/probe-rs/probe-rs

# Install supercli plugin
supercli plugins install ./plugins/probe-rs
```

Linux: install the udev rules for non-root probe access (see install-guidance.json).

## Commands

| Command | Description |
|---------|-------------|
| `supercli probe-rs self version` | Show probe-rs version |
| `supercli probe-rs probe list` | List connected debug probes |
| `supercli probe-rs chip info` | Auto-detect connected chip |
| `supercli probe-rs chip download` | Flash a binary/ELF to the target |
| `supercli probe-rs chip run` | Flash + run with RTT/defmt logs |
| `supercli probe-rs chip reset` | Reset the target |
| `supercli probe-rs debug gdb` | Start a GDB server |
| `supercli probe-rs <any>` | Passthrough to probe-rs CLI |

## Usage

```bash
supercli probe-rs probe list
supercli probe-rs chip info
supercli probe-rs chip run --chip STM32L4R5ZITx target/thumbv7em-none-eabihf/release/app
supercli probe-rs chip download --chip nRF52840_xxAA firmware.hex
supercli probe-rs debug gdb --chip RP2350 --gdb-connection-string localhost:1337
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
