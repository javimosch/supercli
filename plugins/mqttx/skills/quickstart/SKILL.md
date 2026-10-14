---
name: mqttx
description: Use this skill when the user wants to publish or subscribe to MQTT topics, debug a broker connection, or benchmark MQTT broker throughput.
---

# mqttx Plugin

mqttx is the command-line member of the MQTTX family — a scriptable MQTT 5.0 client for pub/sub debugging and load testing brokers.

## Commands

- `mqttx self version` — Print mqttx version
- `mqttx conn connect` — Connect to a broker and echo session info (mqttx conn -h broker.emqx.io -p 1883)
- `mqttx pub publish` — Publish a message (mqttx pub -t topic -m 'hello' -h broker.emqx.io -q 1)
- `mqttx sub subscribe` — Subscribe to a topic and stream messages (mqttx sub -t 'sensors/+' -h broker.emqx.io)
- `mqttx bench run` — Benchmark a broker (mqttx bench conn|pub|sub -c 100 -h broker.emqx.io)
- `mqttx _ _` — Passthrough to mqttx CLI

## Usage Examples

- "Subscribe to sensors/temperature and print each message"
- "Publish a JSON payload to a topic with QoS 1"
- "Benchmark my broker with 500 concurrent publishers"

## Installation

```bash
npm install -g mqttx-cli
# or: brew install mqttx
# or: grab a binary at https://mqttx.app/downloads
```

## Examples

```bash
mqttx conn -h broker.emqx.io -p 1883
mqttx sub -t 'sensors/+' -h broker.emqx.io
mqttx pub -t 'sensors/temp' -m '{"v":21.5}' -q 1 -h broker.emqx.io
mqttx bench sub -c 100 -t 'bench/+' -h broker.emqx.io
```

## Key Features

- Full MQTT 5.0 support incl. user properties, retained messages, wills
- mqtts://, ws:// and wss:// transports for TLS/websocket brokers
- bench subcommand measures conn/pub/sub throughput for capacity testing
