---
name: websocat
description: Use this skill when the user wants to connect to WebSockets, test WebSocket servers, or interact with WebSocket endpoints from the terminal.
---

# websocat Plugin

Command-line client for WebSockets, like netcat or curl for ws://. Connect, send, and receive WebSocket messages from the terminal with advanced socat-like functions.

## Commands

### WebSocket Connection
- `websocat websocket connect` — Connect to WebSocket server

### Utility
- `websocat _ _` — Passthrough to websocat CLI

## Usage Examples
- "Connect to WebSocket server"
- "Test WebSocket endpoint"
- "Send WebSocket message"
- "Listen on WebSocket port"

## Installation

```bash
brew install websocat
```

Or via Cargo:
```bash
cargo install websocat
```

## Examples

```bash
# Connect to WebSocket server
websocat websocket connect ws://echo.websocket.org

# Connect with text mode
websocat websocket connect ws://echo.websocket.org --text

# Set ping interval
websocat websocket connect ws://echo.websocket.org --ping-interval 30

# Set protocol
websocat websocket connect ws://example.com --protocol chat

# Add custom header
websocat websocket connect ws://example.com --header "Authorization: Bearer token"

# Secure WebSocket connection
websocat websocket connect wss://echo.websocket.org

# Any websocat command with passthrough
websocat _ _ ws://echo.websocket.org --text
websocat _ _ wss://example.com --protocol v1.0
```

## Key Features
- **WebSocket client** - Connect to ws:// and wss://
- **WebSocket server** - Can also act as server
- **Text mode** - Human-readable text mode
- **Binary mode** - Raw binary data support
- **Ping/pong** - Automatic keepalive
- **Custom headers** - HTTP header support
- **Protocol negotiation** - WebSocket subprotocols
- **Proxy support** - Proxy WebSocket connections
- **Broadcast** - Broadcast to multiple clients
- **Cross-platform** - Linux, macOS, Windows

## Notes
- Press Ctrl+D to close connection
- Type messages and press Enter to send
- Received messages printed to stdout
- Supports SSL/TLS for wss://
- Can be used for WebSocket testing
- Great for debugging WebSocket APIs
