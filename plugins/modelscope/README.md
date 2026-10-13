# modelscope Plugin for SuperCLI

[ModelScope](https://github.com/modelscope/modelscope) is Alibaba's open model
hub — home of Qwen and thousands of other open models. The `modelscope` CLI
downloads models and datasets with revision/include/exclude control, uploads
local artifacts, and manages hub authentication.

## Installation

```bash
# Install modelscope binary
pip install modelscope         # or: pipx install modelscope

# Install supercli plugin
supercli plugins install ./plugins/modelscope
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli modelscope self version` | Show modelscope version |
| `supercli modelscope model download --model <id>` | Download a model |
| `supercli modelscope dataset download --dataset <id>` | Download a dataset |
| `supercli modelscope hub login` | Hub login (token) |
| `supercli modelscope hub upload` | Upload to a repo |
| `supercli modelscope <any>` | Passthrough to modelscope CLI |

## Usage

```bash
# Download a model into the cache (~/.cache/modelscope/hub)
supercli modelscope model download --model Qwen/Qwen3-0.6B

# Download to a plain directory, config files only
supercli modelscope model download --model Qwen/Qwen3-0.6B --local_dir ./qwen3 --include "*.json"

# A dataset
supercli modelscope dataset download --dataset swift/garbage_competition

# Private repo? login first
supercli modelscope hub login --token <your-sdk-token>
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
