# Contributing to supercli

Welcome to supercli! We're excited that you're interested in contributing. This guide will help you understand how to contribute effectively.

## Introduction

supercli is a universal capability router that bridges humans and AI agents to multiple CLI tools, APIs, MCP servers, and workflows. We welcome contributions in many forms:

- **Code improvements** - Bug fixes, new features, performance improvements
- **Documentation** - Improving guides, examples, and API references
- **Plugin development** - Creating new harnesses for CLI tools
- **Issue reporting** - Helping us identify and reproduce problems
- **Community support** - Answering questions and helping others

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- Git for version control
- [bun](https://bun.sh/) (optional, only needed for description enhancement pipeline scripts)
- Any CLI tools you want to create plugins for

### Setting Up Your Development Environment

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/supercli.git
cd supercli

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Run tests to verify setup
npm test
```

### Quick Development Commands

| Task | Command |
|------|---------|
| Run all tests | `npm test` |
| Run specific test file | `npx jest path/to/test.js` |
| Build Zig binary | `cd supercli-zig-cli && zig build` |
| Generate plugin catalog | `node scripts/generate-catalog.js` |

### Finding Things to Work On

- Check the [Issues](https://github.com/javimosch/supercli/issues) for bugs and feature requests
- Look for issues tagged with `good first issue` for beginner-friendly contributions
- Review the [Project Board](https://github.com/javimosch/supercli/projects) for planned work
- Propose new features by opening a discussion

## Issue Reporting

### Bug Reports

When reporting bugs, include:

1. **Clear title** describing the issue
2. **Steps to reproduce** - Be specific and detailed
3. **Expected vs actual behavior** - What you expected vs what happened
4. **Environment details** - OS, Node.js version, supercli version
5. **Relevant logs** - Error messages, stack traces
6. **Minimal reproduction** - If possible, a small code snippet that reproduces the issue

### Feature Requests

For new features:

1. **Describe the feature** - What should happen and why it's useful
2. **Use cases** - Who benefits and how they'll use it
3. **Alternatives considered** - What other approaches did you consider?
4. **Implementation suggestions** - If you have ideas, share them

### Issue Template Example

```markdown
## Description
[A clear description of the issue or feature request]

## Steps to Reproduce (for bugs)
1. Run '...'
2. Execute '...'
3. See error

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Environment
- OS: [e.g., macOS 14.0]
- Node.js: [e.g., v20.10.0]
- supercli: [e.g., v1.2.3]

## Additional Context
[Any other relevant information, logs, or screenshots]
```

## Code Contributions

### Branching Strategy

- `master` - Stable release branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation improvements

### Development Workflow

```bash
# Create a feature branch
git checkout -b feature/my-new-feature

# Make your changes
# Write tests for new functionality

# Run tests before committing
npm test

# Commit with clear messages
git commit -m "feat: add support for new CLI tool X"

# Push and create PR
git push origin feature/my-new-feature
```

### Commit Message Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style (formatting, no logic change)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(plugins): add support for new CLI wrapper
fix(docker): resolve container listing timeout
docs(readme): update installation instructions
```

### Pull Request Process

1. **Ensure tests pass** - Run `npm test` locally
2. **Update documentation** - If adding features, update relevant docs
3. **Follow code style** - Use existing patterns in the codebase
4. **Write meaningful PR description** - Explain what and why
5. **Respond to feedback** - Be responsive to review comments

### Code Review Guidelines

**For reviewers:**
- Review code for correctness, not style (let linters handle formatting)
- Test the changes locally when possible
- Provide constructive, actionable feedback
- Focus on the code, not the person
- Aim to review PRs within 2 business days

**For contributors:**
- Keep PRs focused and reasonably sized (under 500 lines preferred)
- Respond to feedback promptly
- Ask for clarification if feedback is unclear
- Mark conversations as resolved once addressed
- Re-request review after making changes

### Testing Requirements

- All new features must include tests
- Bug fixes must include a regression test
- Run `npm test` locally before pushing
- CI must pass before merging
- Maintain or improve code coverage

## Documentation Contributions

### Where to Find Documentation

- `/docs/` - Main documentation directory
- `/docs/plugins-how-to.md` - Plugin development guide
- `/docs/skills-catalog.md` - Skill document catalog and provider management
- `/README.md` - Project overview and quick start
- Plugin-specific docs in `/plugins/*/README.md`

### Documentation Style

- Use clear, concise language
- Include practical examples
- Keep code snippets up to date
- Use consistent formatting

### Contributing Plugin Documentation

When creating or updating plugins:

1. Add a `README.md` in the plugin directory
2. Include installation instructions
3. Document available commands
4. Provide usage examples
5. Reference the upstream CLI documentation

## Plugin Development

### Want to Create a New Plugin?

New bundled plugins use an **isolated file convention** — create files ONLY inside `plugins/<name>/`. Never edit `plugins/plugins.json` or `cli/plugin-install-guidance.js` for new plugins.

```
plugins/my-plugin/
├── plugin.json              # Required: manifest with commands
├── meta.json                # Required: description, tags, has_learn
├── install-guidance.json    # Optional: install steps
├── skills/quickstart/SKILL.md  # Optional: agent guide
└── README.md                # Optional: human docs
```

See our detailed [Plugin Harness Development Guide](docs/plugins-how-to.md) for:

- Isolated plugin structure (`plugin.json` + `meta.json`)
- Command wrapping vs passthrough patterns
- Argument mapping configuration
- Testing and debugging tips

### Quick Plugin Checklist

Before submitting a plugin for inclusion:

- [ ] Plugin has a valid `plugin.json` manifest
- [ ] Plugin has a `meta.json` with description, tags, and optional has_learn
- [ ] Binary dependency checks are configured
- [ ] Commands have clear descriptions
- [ ] JSON output is supported where applicable
- [ ] Plugin README includes installation and usage instructions
- [ ] Tests pass (if applicable)
- [ ] No hardcoded credentials or secrets
- [ ] **No edits to `plugins/plugins.json` or `cli/plugin-install-guidance.js`**

### Plugin Quality Standards

Follow these standards for plugin metadata (see [PLUGIN_STANDARDS.md](PLUGIN_STANDARDS.md)):

**Description requirements:**
- Length: 30-150 characters
- Format: `[Tool Name] — [one sentence purpose/key feature]`
- Must start with the exact tool name

**Tag requirements:**
- Minimum: 3 tags, Maximum: 8 tags
- Use controlled vocabulary from [TAG_VOCABULARY.md](TAG_VOCABULARY.md)
- Include language tag if applicable (e.g., `rust`, `python`)
- Include domain tag if applicable (e.g., `devops`, `security`)

**Source URL requirements:**
- Must be specific GitHub repository: `https://github.com/[owner]/[repo]`
- URL must be accessible and canonical

**Example metadata:**
```json
{
  "description": "ripgrep-all — search documents with ripgrep backend",
  "tags": ["search", "rust", "cli", "file-search"],
  "source": "https://github.com/phiresky/ripgrep-all"
}
```

### Publishing Plugins

Once your plugin is ready:

```bash
# Install locally for testing
supercli plugins install ./plugins/my-plugin

# Test functionality
supercli my-plugin --help

# Publish to community registry
supercli plugins publish ./my-plugin
```

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming, inclusive environment. By participating, you agree to:

- Be respectful and inclusive
- Welcome newcomers and help others learn
- Accept constructive criticism professionally
- Focus on what's best for the community

### Getting Help

- **Discussions** - Use GitHub Discussions for questions
- **Issues** - For bugs and feature requests
- **Documentation** - Check docs/ before asking

### Supporting Others

- Answer questions in discussions
- Help newcomers get started
- Share your experience and knowledge

## Security Vulnerabilities

If you discover a security vulnerability in supercli, please report it responsibly:

**Do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. **Email**: Send a detailed report to the maintainers (see [GitHub profile](https://github.com/javimosch/supercli) for contact).
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fix (if applicable)
3. **Response time**: Expect acknowledgment within 48 hours.

### What to Expect

- Maintainers will work with you to understand and address the issue
- A fix will be developed and released before public disclosure
- Credit will be given to reporters (unless anonymity is preferred)

### Scope

Security issues include but are not limited to:
- Command injection via plugin manifests
- Unsafe path traversal in ZIP extraction
- Sandbox escape in custom adapters (vm2)
- Credential exposure in logs or output
- Server-side request forgery (SSRF) via HTTP adapters

## License

By contributing to supercli, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to supercli! Your help makes this project better for everyone.
