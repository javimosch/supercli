---
name: qrcp
description: Use this skill when the user wants to transfer files to/from mobile device via QR code, send files wirelessly, or receive files from phone.
---

# qrcp Plugin

Transfer files over wifi from your computer to your mobile device by scanning a QR code without leaving the terminal. Secure, fast, and works across platforms.

## Commands

### File Transfer
- `qrcp file send` — Send file to mobile device via QR code
- `qrcp file receive` — Receive file from mobile device

### Utility
- `qrcp _ _` — Passthrough to qrcp CLI

## Usage Examples
- "Send this file to my phone"
- "Transfer files via QR code"
- "Receive file from mobile device"
- "Send files over WiFi"

## Installation

```bash
brew install qrcp
```

Or via Go:
```bash
go install github.com/claudiodangelis/qrcp@latest
```

## Examples

```bash
# Send file
qrcp file send document.pdf

# Send with compression
qrcp file send --zip large-file.tar.gz

# Specify network interface
qrcp file send --interface wlan0 file.txt

# Specify port
qrcp file send --port 8080 file.txt

# Specify output directory for receive
qrcp file receive --output ~/Downloads

# Receive file
qrcp file receive

# Receive with compression
qrcp file receive --zip

# Any qrcp command with passthrough
qrcp _ _ send file.txt
qrcp _ _ receive --output ~/Downloads
```

## Key Features
- **QR code transfer** - Scan QR to get download link
- **WiFi transfer** - Fast local network transfer
- **Cross-platform** - Works on Linux, macOS, Windows
- **Secure** - HTTPS support for encrypted transfer
- **Bidirectional** - Send and receive files
- **Compression** - Optional zip compression
- **Interface selection** - Choose network interface
- **Port control** - Specify custom port
- **No cloud** - Direct device-to-device transfer
- **Mobile friendly** - Works with any QR scanner app

## Notes
- Both devices must be on same WiFi network
- QR code contains download URL
- Transfer happens over local network
- HTTPS mode available for security
- Can send multiple files
- Perfect for quick file sharing
