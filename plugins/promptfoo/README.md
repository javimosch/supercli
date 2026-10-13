# promptfoo Plugin for SuperCLI

[promptfoo](https://github.com/promptfoo/promptfoo) is the standard open-source
CLI for evaluating and red-teaming LLM apps. Define prompts, providers, and
tests in `promptfooconfig.yaml`; run matrices across models; assert on output;
and fire adversarial attacks at your app with the built-in red team.

## Installation

```bash
# Install promptfoo binary
npm install -g promptfoo       # or: npx promptfoo@latest

# Install supercli plugin
supercli plugins install ./plugins/promptfoo
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli promptfoo self version` | Show promptfoo version |
| `supercli promptfoo project init` | Scaffold promptfooconfig.yaml |
| `supercli promptfoo eval run` | Run evaluations |
| `supercli promptfoo eval list` | List past eval runs |
| `supercli promptfoo redteam init` | Scaffold redteam config |
| `supercli promptfoo redteam run` | Run a redteam scan |
| `supercli promptfoo cache clear` | Clear response cache |
| `supercli promptfoo <any>` | Passthrough to promptfoo CLI |

## Usage

```bash
# New eval project
supercli promptfoo project init

# Run evals, save machine-readable output
supercli promptfoo eval run --output results.json
supercli promptfoo eval run -p prompts.txt -r ollama:qwen2.5 -n 5

# Red-team an endpoint
supercli promptfoo redteam run --target https://myapp.example/chat

# Browse results (local web UI)
supercli promptfoo _ _ view
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
