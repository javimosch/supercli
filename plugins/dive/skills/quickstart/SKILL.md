# dive Plugin

## Overview
The dive plugin provides a tool for exploring each layer in a docker image. Analyze docker image contents, discover inefficiencies, and optimize image sizes.

## What is dive?
`dive` is a tool for exploring a docker image, layer contents, and discovering ways to shrink the size of your Docker/OCI image. It analyzes each layer and provides insights into wasted space.

## Quick Start

### 1. Install dive
```bash
curl -sL https://raw.githubusercontent.com/wagoodman/dive/master/scripts/install.sh | sh
# or with Homebrew
brew install dive
```

### 2. Analyze an image
```bash
sc dive image analyze nginx:latest
```

### 3. Verify installation
```bash
sc dive self version
```

## Features
- **Layer Analysis**: View each layer's contents and size
- **Efficiency Score**: Get a score for image efficiency
- **Wasted Space**: Identify unused files and wasted bytes
- **File Tree**: Browse file tree with layer attribution
- **CI Mode**: Automated analysis for CI/CD pipelines

## Keybindings (in UI)
- `q` or `Ctrl+C`: Quit
- `Tab`: Switch between layers and file tree
- `Ctrl+space`: Toggle filetree view
- `Ctrl+a`: Toggle layer view
- `Ctrl+f`: Toggle file view
- `Ctrl+l`: Toggle layer details

## Useful Commands
- `sc dive image analyze [image]` - Analyze a docker image interactively
- `sc dive image analyze [image] --ci` - CI mode (JSON output, no TUI)
- `sc dive build analyze [context]` - Build and analyze from Dockerfile

## CI/CD Integration
Use dive in CI to enforce image quality:
```bash
sc dive image analyze myimage:latest --ci \
  --lowestEfficiency 0.9 \
  --highestWastedBytes 100MB
```

Exit code 1 if thresholds are not met.

## Requirements
- Docker installed
- Docker image to analyze

## Tips
- Use dive to find large unnecessary files in your images
- Multi-stage builds often improve efficiency scores
- Analyze both your base images and final images
- Use CI mode in automated pipelines

## Resources
- GitHub: https://github.com/wagoodman/dive
