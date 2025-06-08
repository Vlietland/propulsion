#!/bin/bash

echo "🔧 Setting up Propulsion Game Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js and npm..."
    sudo apt update
    sudo apt install nodejs npm -y
else
    echo "✅ Node.js is already installed ($(node --version))"
fi

# Check Node.js version (require 16 or higher)
node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 16 ]; then
    echo "⚠️  Warning: Node.js version $node_version detected. Version 16 or higher is recommended."
fi

echo "🔧 Setting up project dependencies..."

set -e

# Ensure we're in the project root
cd "$(dirname "$0")"

# Clone excalibur-tiled if it doesn't exist
if [ ! -d "propulsionWeb/external/excalibur-tiled" ]; then
    echo "📦 Cloning excalibur-tiled dependency..."
    mkdir -p propulsionWeb/external
    cd propulsionWeb/external
    git clone https://github.com/excaliburjs/excalibur-tiled.git
    cd ../..
else
    echo "✅ excalibur-tiled already exists"
fi

# Install excalibur-tiled dependencies
echo "📦 Installing excalibur-tiled dependencies..."
cd propulsionWeb/external/excalibur-tiled
npm install
cd ../../../

echo "📦 Installing main project dependencies..."
npm install

echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "  • Run './run.sh' to start the development server"
echo "  • Run './run.sh browser' to start and open browser automatically"
echo "  • Run './publish.sh' to build for production"
echo "  • Open http://localhost:5173 in your browser"