#!/bin/bash
#
# gopass interactive setup script
# This script sets up gopass with a custom master password securely
# The LLM should NEVER see the master password - this is for human-only setup
#

set -e

echo "🔐 gopass Interactive Setup"
echo "=========================="
echo ""
echo "This script will help you set up gopass with your own master password."
echo "Your password will be used for GPG key encryption and never stored in plain text."
echo ""

# Check if gopass is installed
if ! command -v gopass &> /dev/null; then
    echo "❌ gopass is not installed"
    echo ""
    echo "Please install gopass first:"
    echo "  brew install gopass"
    echo "  # or download from https://github.com/gopasspw/gopass/releases"
    exit 1
fi

echo "✅ gopass is installed"
echo ""

# Get user information for GPG key
read -p "Enter your name (for GPG key): " gpg_name
read -p "Enter your email (for GPG key): " gpg_email

if [[ -z "$gpg_name" || -z "$gpg_email" ]]; then
    echo "❌ Name and email are required for GPG key generation"
    exit 1
fi

# Get master password interactively (twice for confirmation)
echo ""
echo "🔑 Set your master password"
echo "This will be used to encrypt your GPG key and all stored passwords."
echo ""

while true; do
    read -s -p "Enter master password: " master_password
    echo ""
    read -s -p "Confirm master password: " master_password_confirm
    echo ""

    if [[ "$master_password" == "$master_password_confirm" ]]; then
        if [[ ${#master_password} -lt 3 ]]; then
            echo "❌ Password must be at least 3 characters"
            continue
        fi
        break
    else
        echo "❌ Passwords do not match. Please try again."
    fi
done

echo ""
echo "✅ Master password set"
echo ""

# Create GPG batch file
batch_file=$(mktemp)
cat > "$batch_file" << EOF
%no-protection
Key-Type: RSA
Key-Length: 2048
Name-Real: $gpg_name
Name-Email: $gpg_email
Expire-Date: 0
Passphrase: $master_password
EOF

# Generate GPG key
echo "🔐 Generating GPG key..."
if gpg --batch --gen-key "$batch_file"; then
    echo "✅ GPG key generated successfully"
else
    echo "❌ Failed to generate GPG key"
    rm -f "$batch_file"
    exit 1
fi

rm -f "$batch_file"

# Get the new key ID
key_id=$(gpg --list-secret-keys --keyid-format LONG "$gpg_email" | grep -oP 'rsa2048/\K[0-9A-F]{16}' | head -1)

if [[ -z "$key_id" ]]; then
    echo "❌ Could not retrieve GPG key ID"
    exit 1
fi

echo "✅ GPG key ID: $key_id"
echo ""

# Remove existing gopass store if it exists
if [[ -d ~/.local/share/gopass ]]; then
    echo "🗑️  Removing existing gopass store..."
    rm -rf ~/.local/share/gopass
fi

# Initialize gopass with the new key
echo "🚀 Initializing gopass with new GPG key..."
if gopass init "$key_id"; then
    echo "✅ gopass initialized successfully"
else
    echo "❌ Failed to initialize gopass"
    exit 1
fi

echo ""

# Set up environment variables in shell configs
echo "⚙️  Configuring environment variables..."

# Detect shell and add to appropriate config file
if [[ -n "$ZSH_VERSION" ]]; then
    config_file="$HOME/.zshrc"
elif [[ -n "$BASH_VERSION" ]]; then
    config_file="$HOME/.bashrc"
else
    config_file="$HOME/.profile"
fi

# Add GPG_TTY if not already present
if ! grep -q "export GPG_TTY" "$config_file" 2>/dev/null; then
    echo "" >> "$config_file"
    echo "# gopass GPG configuration" >> "$config_file"
    echo "export GPG_TTY=\$(tty)" >> "$config_file"
    echo "✅ Added GPG_TTY to $config_file"
else
    echo "✅ GPG_TTY already configured in $config_file"
fi

# Add gopass to PATH if not already there
if ! grep -q "$HOME/.local/bin" "$config_file" 2>/dev/null; then
    echo "export PATH=\"\$HOME/.local/bin:\$PATH\"" >> "$config_file"
    echo "✅ Added ~/.local/bin to PATH in $config_file"
else
    echo "✅ ~/.local/bin already in PATH"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Restart your shell or run: source $config_file"
echo "  2. Test your setup: echo \"YOUR_PASSWORD\" | gopass show <secret-name>"
echo "  3. Or use via supercli: echo \"YOUR_PASSWORD\" | supercli gopass secret show --path <secret-name>"
echo ""
echo "🔐 Security reminder:"
echo "  - Your master password is: **** (hidden for security)"
echo "  - Never share your master password or GPG private key"
echo "  - Back up your GPG keys: ~/.gnupg/"
echo "  - Back up your password store: ~/.local/share/gopass/"
echo ""
echo "✨ You're ready to use gopass!"
