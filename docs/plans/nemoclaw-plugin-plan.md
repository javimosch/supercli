# NemoClaw Plugin Plan

## Goal

Add a bundled `nemoclaw` plugin to supercli with a hybrid command surface:

- curated wrappers for common host and sandbox actions
- full passthrough for advanced/edge commands
- remote skill-doc indexing from the upstream NVIDIA NemoClaw repository

## Scope

### Plugin artifacts

- `plugins/nemoclaw/plugin.json`
- `plugins/nemoclaw/README.md`
- `plugins/nemoclaw/skills/quickstart/SKILL.md`
- `plugins/nemoclaw/scripts/post-install.js`
- `plugins/nemoclaw/scripts/post-uninstall.js`
- `plugins/nemoclaw/scripts/run-sandbox-action.js`

### Registry integration

- add `nemoclaw` entry to `plugins/plugins.json`

### Testing

- `__tests__/plugin-nemoclaw.test.js` for post-install/post-uninstall units
- `__tests__/nemoclaw-plugin.test.js` for runtime install/routing/doctor/provider lifecycle

## Wrapped commands (v1)

- `nemoclaw self version`
- `nemoclaw sandbox list`
- `nemoclaw system status`
- `nemoclaw service start`
- `nemoclaw service stop`
- `nemoclaw host onboard`
- `nemoclaw host onboard-auto --non-interactive ...`
- `nemoclaw host setup-spark`
- `nemoclaw deploy instance --instance <name>`
- `nemoclaw sandbox status --name <name>`
- `nemoclaw sandbox logs --name <name> [--follow]`
- `nemoclaw sandbox connect --name <name>`
- `nemoclaw -- <raw args>` (via passthrough)

## Fork support

- allow docs indexing from a private fork with `NEMOCLAW_DOCS_REPO` and `NEMOCLAW_DOCS_REF` during plugin install

## Remote catalog coverage

Curate high-value docs from upstream:

- `README.md`
- `docs/index.md`
- `docs/get-started/quickstart.md`
- `docs/about/*`
- `docs/reference/*`
- selected deployment/monitoring/network-policy guides

## Notes

- NemoClaw is alpha and Linux-first; wrappers should prioritize discoverability and safe defaults.
- Destructive sandbox actions remain available via passthrough in v1.
