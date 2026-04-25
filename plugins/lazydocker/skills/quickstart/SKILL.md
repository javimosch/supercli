# lazydocker Plugin

## Overview
The lazydocker plugin provides a terminal UI for both docker and docker-compose. Manage containers, images, volumes, and networks with an intuitive terminal interface.

## What is lazydocker?
`lazydocker` is a terminal UI for docker and docker-compose. It provides a visual interface to manage all your docker resources without leaving the terminal.

## Quick Start

### 1. Install lazydocker
```bash
curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash
# or with Homebrew
brew install lazydocker
```

### 2. Open the UI
```bash
sc lazydocker ui open
```

### 3. Verify installation
```bash
sc lazydocker self version
```

## Features
- **Container Management**: Start, stop, restart, remove containers
- **Logs**: View container logs with filtering
- **Stats**: Monitor container resource usage
- **Image Management**: View, remove, and prune images
- **Volume Management**: Manage docker volumes
- **Network Management**: View and manage networks
- **Docker Compose**: Manage compose projects

## Keybindings (in UI)
- `q` or `Ctrl+C`: Quit
- `x`: Remove selected item
- `e`: Remove selected item with confirmation
- `s`: Stop container
- `r`: Restart container
- `l`: View logs
- `enter`: View details
- `]` and `[`: Navigate panels

## Useful Commands
- `sc lazydocker ui open` - Open the lazydocker terminal UI
- `sc lazydocker logs view [container]` - View logs for a container
- `sc lazydocker ui open --cwd /path/to/project` - Open in specific directory

## Requirements
- Docker installed and running
- Docker Compose (optional, for compose projects)

## Configuration
Create `~/.config/lazydocker/config.yml` to customize behavior:
```yaml
gui:
  theme:
    activeBorderColor:
      - green
      - bold
```

## Tips
- Use arrow keys or vim-style navigation (j/k)
- Press `?` in the UI for help
- Use `/` to search/filter lists
- Press `space` to select multiple items

## Resources
- GitHub: https://github.com/jesseduffield/lazydocker
- Documentation: https://github.com/jesseduffield/lazydocker
