# rpk Plugin for SuperCLI

[rpk](https://github.com/redpanda-data/redpanda) is the all-in-one CLI for
Redpanda, the Kafka-compatible streaming platform. It manages topics, consumer
groups, ACLs, and schema registry — and produces/consumes records. Because it
speaks the Kafka protocol it also works against Apache Kafka.

## Installation

```bash
brew install redpanda-data/tap/redpanda
# or download rpk-*-linux-amd64.zip from GitHub releases

# Install supercli plugin
supercli plugins install ./plugins/rpk
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli rpk self version` | Show rpk version |
| `supercli rpk cluster info` | Brokers, controller, versions |
| `supercli rpk cluster health` | Partition health overview |
| `supercli rpk topic create` | Create a topic |
| `supercli rpk topic list` | List topics |
| `supercli rpk topic produce` | Produce records |
| `supercli rpk topic consume` | Consume records |
| `supercli rpk <any>` | Passthrough to rpk CLI |

## Usage

```bash
# Local dev broker
supercli rpk redpanda start --dev-mode

# Remote cluster ops
supercli rpk cluster info -X brokers=kafka.example.com:9092
supercli rpk topic consume events -o start -n 10
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
