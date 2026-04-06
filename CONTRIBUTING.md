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

- `main` - Stable release branch
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

**For contributors:**
- Keep PRs focused and reasonably sized
- Respond to feedback promptly
- Ask for clarification if feedback is unclear

## Documentation Contributions

### Where to Find Documentation

- `/docs/` - Main documentation directory
- `/docs/plugins-how-to.md` - Plugin development guide
- `/docs/skills/` - Skill system documentation
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

New bundled plugins use an **isolated file convention** — no shared file edits needed.

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

## License

By contributing to supercli, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to supercli! Your help makes this project better for everyone.
