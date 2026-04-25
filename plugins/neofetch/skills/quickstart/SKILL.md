# neofetch Plugin

## Overview
The neofetch plugin provides a command-line system information tool that displays system details with ASCII art logos.

## What is neofetch?
`neofetch` is a command-line system information tool written in bash. It displays information about your operating system, software, and hardware in a visually appealing format with ASCII art.

## Quick Start

### 1. Install neofetch
```bash
sudo apt install neofetch
# or with Homebrew
brew install neofetch
# or with pacman
sudo pacman -S neofetch
```

### 2. Display system info
```bash
sc neofetch system info
```

### 3. Verify installation
```bash
sc neofetch self version
```

## Information Displayed
- **OS**: Operating system name and version
- **Kernel**: Kernel version
- **Uptime**: System uptime
- **Packages**: Number of installed packages
- **Shell**: Shell version
- **Resolution**: Display resolution
- **DE/WM**: Desktop environment/window manager
- **Theme**: GTK theme/icons/font
- **CPU**: CPU model and usage
- **GPU**: GPU model
- **Memory**: RAM usage

## Useful Commands
- `sc neofetch system info` - Display system information
- `sc neofetch system info --ascii_distro arch` - Use specific distro logo
- `sc neofetch system info --disable gpu` - Disable specific info
- `sc neofetch config generate` - Generate config file

## Configuration
Config file: `~/.config/neofetch/config.conf`

Generate a config file:
```bash
sc neofetch config generate
```

Common config options:
```bash
print_info() {
    info title
    info underline
    info "OS" distro
    info "Kernel" kernel
    info "Uptime" uptime
    info "Packages" packages
    info "Shell" shell
    info "Resolution" resolution
    info "DE" de
    info "CPU" cpu
    info "GPU" gpu
    info "Memory" memory
    info cols
}
```

## Customization
- Change ASCII logo with `--ascii` or `--ascii_distro`
- Disable info blocks with `--disable`
- Set custom colors in config
- Modify displayed information order

## Requirements
- Bash shell
- Terminal with color support

## Tips
- Use in shell startup scripts to show info on login
- Great for screenshots and sharing system info
- Customize config to show only what you need
- Works on Linux, macOS, BSD, and more

## Resources
- GitHub: https://github.com/dylanaraps/neofetch
