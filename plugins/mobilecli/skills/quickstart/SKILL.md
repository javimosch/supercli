---
name: mobilecli
description: Use this skill when the user wants to manage iOS or Android devices/simulators/emulators, take screenshots, list apps, boot/shutdown/reboot devices, or interact with mobile devices from the terminal.
---

# mobilecli Plugin

Universal CLI for managing iOS and Android devices, simulators, emulators and apps. List devices, take screenshots, stream screen, control devices, manage apps, and fetch crash reports.

## Commands

### Device Management
- `mobilecli device list` — List connected devices and simulators
- `mobilecli device boot` — Boot an offline emulator or simulator
- `mobilecli device shutdown` — Shutdown a running emulator or simulator
- `mobilecli device reboot` — Reboot a device

### Screenshot
- `mobilecli screenshot capture` — Take a screenshot from a device

### App Management
- `mobilecli apps list` — List installed apps on a device

### Utility
- `mobilecli self version` — Print mobilecli version
- `mobilecli _ _` — Passthrough to mobilecli CLI

## Usage Examples
- "List all connected mobile devices"
- "Take a screenshot from my iPhone"
- "List apps installed on the Android emulator"
- "Boot the iPhone 15 simulator"
- "Reboot the Pixel 6 device"

## Installation

```bash
npm install -g mobilecli@latest
```

## Prerequisites
- Android SDK with adb in PATH (for Android device support)
- Xcode Command Line Tools (for iOS simulator support on macOS)

## Examples

```bash
# List all online devices and simulators
mobilecli device list

# List all devices including offline emulators and simulators
mobilecli device list --include-offline

# Boot an offline emulator or simulator
mobilecli device boot --device Pixel_6

# Shutdown a running emulator
mobilecli device shutdown --device iPhone_15

# Reboot a device
mobilecli device reboot --device Pixel_6

# Take a PNG screenshot (default)
mobilecli screenshot capture --device 12345678-1234567890ABCDEF

# Take a JPEG screenshot with custom quality
mobilecli screenshot capture --device Pixel_6 --format jpeg --quality 80

# Save screenshot to specific path
mobilecli screenshot capture --device iPhone_15 --output screenshot.png

# Output screenshot to stdout
mobilecli screenshot capture --device iPhone_15 --output -

# List installed apps on a device
mobilecli apps list --device Pixel_6
```

## Key Features
- Cross-platform support: iOS physical devices, iOS simulators, Android devices, Android emulators
- JSON output for programmatic consumption
- Screenshot capture in PNG or JPEG with quality control
- Screen capture video streaming (mjpeg/h264)
- Device control: boot, shutdown, reboot, tap, long-press, hardware buttons, text input
- App management: list, launch, terminate, install, uninstall, get foreground app
- Agent management for iOS touch input and screen capture
- Crash report listing and fetching

## Notes
- Device IDs can be found via `mobilecli device list`
- iOS agent is required for touch input, screen capture streaming, and UI tree inspection
- Android features work without an agent for most operations
- Use `--include-offline` to see all simulators and emulators that can be booted
- Hardware buttons supported: HOME, BACK (Android), POWER, VOLUME_UP, VOLUME_DOWN, DPAD_* (Android)
