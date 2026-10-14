# mqttx Plugin for SuperCLI

[mqttx](https://github.com/emqx/MQTTX) — All-in-one MQTT 5.0 CLI toolbox — connect, publish, subscribe, and benchmark brokers from the terminal.

## Installation

```bash
npm install -g mqttx-cli
# or: brew install mqttx
# or: grab a binary at https://mqttx.app/downloads

# Install supercli plugin
supercli plugins install ./plugins/mqttx
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli mqttx self version` | Print mqttx version |
| `supercli mqttx conn connect` | Connect to a broker and echo session info |
| `supercli mqttx pub publish` | Publish a message |
| `supercli mqttx sub subscribe` | Subscribe to a topic and stream messages |
| `supercli mqttx bench run` | Benchmark a broker |
| `supercli mqttx <any>` | Passthrough to mqttx CLI |

## Usage

```bash
supercli mqttx conn connect
supercli mqttx pub publish
supercli mqttx sub subscribe
supercli mqttx bench run
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
