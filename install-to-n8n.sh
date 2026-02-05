#!/bin/bash
# Script to install the built package to n8n's custom directory
# This avoids the recursive symlink issue by copying only necessary files

N8N_CUSTOM_DIR="$HOME/.n8n/custom"
PACKAGE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="$N8N_CUSTOM_DIR/node_modules/@qontext/n8n-nodes-qontext"

echo "Installing @qontext/n8n-nodes-qontext to n8n custom directory..."

# Ensure dist folder exists
if [ ! -d "$PACKAGE_DIR/dist" ]; then
    echo "Error: dist folder not found. Please run 'npm run build' first."
    exit 1
fi

# Create target directory structure
mkdir -p "$TARGET_DIR"

# Copy only necessary files (dist, package.json, and README)
echo "Copying files..."
cp -r "$PACKAGE_DIR/dist" "$TARGET_DIR/"
cp "$PACKAGE_DIR/package.json" "$TARGET_DIR/"
if [ -f "$PACKAGE_DIR/README.md" ]; then
    cp "$PACKAGE_DIR/README.md" "$TARGET_DIR/"
fi

echo "Installation complete!"
echo "You can now start n8n with: n8n start"
