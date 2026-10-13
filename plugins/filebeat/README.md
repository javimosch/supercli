# filebeat Plugin for SuperCLI

[Filebeat](https://github.com/elastic/beats) is the lightweight Elastic log shipper.
It tails log files and other inputs, parses events with modules (nginx, system,
kubernetes, mysql, and 50+ more), and ships to Elasticsearch, Logstash, Kafka, or Redis.

## Installation

```bash
# Install filebeat binary (pick one)
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.17.0-linux-x86_64.tar.gz
tar xzf filebeat-8.17.0-linux-x86_64.tar.gz
ln -sf $(pwd)/filebeat-8.17.0-linux-x86_64/filebeat ~/.local/bin/filebeat
# or via the Elastic apt/yum repository: apt install filebeat

# Install supercli plugin
supercli plugins install ./plugins/filebeat
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli filebeat self version` | Show filebeat version |
| `supercli filebeat test config` | Validate filebeat.yml |
| `supercli filebeat test output` | Probe configured output |
| `supercli filebeat modules list` | List modules and state |
| `supercli filebeat export config` | Export resolved config |
| `supercli filebeat setup run` | Load dashboards/templates |
| `supercli filebeat <any>` | Passthrough to filebeat CLI |

## Usage

```bash
supercli filebeat test config -- -c filebeat.yml -e
supercli filebeat test output -- -c filebeat.yml
supercli filebeat _ _ -e -c filebeat.yml -d "publish"
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
