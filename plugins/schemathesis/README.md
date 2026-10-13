# schemathesis Plugin for SuperCLI

[schemathesis](https://github.com/schemathesis/schemathesis) performs property-based
fuzz testing of APIs. Point it at an OpenAPI or GraphQL schema plus a running server
and it generates thousands of edge-case requests, checking responses for crashes,
schema violations, and conformance bugs. The CLI binary is `st` (v4+).

## Installation

```bash
# Install schemathesis (binary: st)
pipx install schemathesis
# or: pip install schemathesis
# or: docker run schemathesis/schemathesis

# Install supercli plugin
supercli plugins install ./plugins/schemathesis
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli schemathesis self version` | Show st version |
| `supercli schemathesis api run <schema>` | Fuzz-test API against a live server |
| `supercli schemathesis api validate <schema>` | Conformance checks without deep fuzzing |
| `supercli schemathesis <any>` | Passthrough to st CLI |

## Usage

```bash
# Fuzz a running service
supercli schemathesis api run openapi.yaml --base-url http://localhost:8080

# Remote schema, auth header, limited phases
supercli schemathesis api run https://api.example.com/openapi.json \
  --header 'Authorization: Bearer tok' --phases coverage

# Reproduce a failure
supercli schemathesis api run openapi.yaml --base-url ... --seed 42
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
