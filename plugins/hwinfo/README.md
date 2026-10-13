# hwinfo Plugin for SuperCLI

[hwinfo](https://github.com/openSUSE/hwinfo) is openSUSE's hardware probing
tool. It reports deeply detailed Linux system information — CPU, memory,
disks, network cards, GPUs, USB, Bluetooth, and every other bus — in short or
exhaustive form.

## Installation

```bash
# Install hwinfo binary
sudo apt install hwinfo

# Install supercli plugin
supercli plugins install ./plugins/hwinfo
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli hwinfo self version` | Show hwinfo/libhd version |
| `supercli hwinfo system short` | Compact whole-machine overview |
| `supercli hwinfo system all` | Full verbose probe |
| `supercli hwinfo cpu info` | CPU details |
| `supercli hwinfo disk info` | Storage devices |
| `supercli hwinfo memory info` | Memory/DIMMs |
| `supercli hwinfo network info` | Network interfaces |
| `supercli hwinfo gpu info` | Graphics cards |
| `supercli hwinfo <any>` | Passthrough to hwinfo CLI |

## Usage

```bash
# Quick inventory
supercli hwinfo system short
supercli hwinfo cpu info
supercli hwinfo disk info

# Forensic dump (root sees more)
sudo hwinfo --all --log /tmp/hw.txt
supercli hwinfo network info
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
