---
name: udevadm
description: Manage and query Linux devices, udev events, and device rules
---
# udevadm Plugin
Manage and query Linux devices, udev events, and device rules

## Commands
- `udevadm <resource> <action>` — Execute udevadm commands
- `udevadm self version` — Print udevadm version
- `udevadm device info` — Query sysfs or the udev database for device info
- `udevadm device tree` — Show device tree
- `udevadm event trigger` — Trigger uevents from the kernel
- `udevadm event settle` — Wait for pending udev events to complete
- `udevadm event monitor` — Listen to kernel and udev events
- `udevadm rules verify` — Verify udev rules files for syntax errors
- `udevadm _ _` — Passthrough to udevadm CLI

## Usage
- `udevadm self version` — Print udevadm version
- `udevadm device info <device>` — Query device information
- `udevadm device tree` — Show device tree
- `udevadm event trigger` — Trigger kernel uevents
- `udevadm event settle` — Wait for pending events
- `udevadm event monitor` — Listen to events
- `udevadm rules verify <files>` — Verify rules syntax
- `udevadm _ _ <args>` — Run udevadm with any arguments
