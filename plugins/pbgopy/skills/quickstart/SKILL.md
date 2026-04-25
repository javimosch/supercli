# pbgopy - Copy and Paste Between Devices

## Overview
pbgopy allows you to copy and paste between devices. Share clipboard content across devices with end-to-end encryption.

## Quick Start

### Copy text
```bash
sc pbgopy copy text <text>
```

### Passthrough to pbgopy CLI
```bash
sc pbgopy _ <pbgopy-args>
```

## Key Features

- **Cross-Device**: Copy and paste between devices
- **End-to-End Encryption**: Secure data transfer
- **TTL Support**: Set expiration for clipboard data
- **Authentication**: Optional authentication
- **OS Clipboard**: Copy from your OS clipboard
- **Multiple Encryption**: Symmetric-key and public/private key-pair

## Installation

```bash
go install github.com/nakabonne/pbgopy@latest
```

## Usage Examples

### Copy text
```bash
pbgopy copy "Hello, World!"
```

### Paste text
```bash
pbgopy paste
```

### Copy from OS clipboard
```bash
pbgopy copy --from-os
```

### Set TTL
```bash
pbgopy copy "Hello" --ttl 60
```

### With symmetric key
```bash
pbgopy copy "Secret" --key mykey
```

### With public/private key
```bash
pbgopy copy "Secret" --public-key key.pub --private-key key
```

## Notes

- Run `pbgopy --help` to see all available options
- Data is encrypted before transmission
- Can be used for secure clipboard sharing
