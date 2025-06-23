#!/bin/bash

# Voice-to-Text Setup Script
# This script sets up the entire voice-to-text application

set -e  # Exit on any error

echo "🎤 Voice-to-Text Setup Starting..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    print_error "This script is designed for Linux. Please install manually."
    exit 1
fi

# Step 1: Install system dependencies
echo "📦 Installing system dependencies..."
if command -v apt-get &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y build-essential cmake git alsa-utils curl
    print_status "System dependencies installed"
else
    print_warning "apt-get not found. Please install: build-essential cmake git alsa-utils"
fi

# Step 2: Check Node.js
echo "🟢 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/ or use: curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

# Step 3: Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install
print_status "NPM dependencies installed"

# Step 4: Check if whisper.cpp exists
echo "🔍 Checking whisper.cpp..."
if [ ! -d "whisper.cpp" ]; then
    print_warning "whisper.cpp directory not found. Cloning..."
    git clone https://github.com/ggerganov/whisper.cpp.git
fi

# Step 5: Build whisper.cpp
echo "🔨 Building whisper.cpp..."
cd whisper.cpp
make clean &> /dev/null || true
make -j$(nproc)
print_status "whisper.cpp built successfully"

# Step 6: Download model
echo "📥 Downloading Whisper model (base.en)..."
if [ ! -f "models/ggml-base.en.bin" ]; then
    bash models/download-ggml-model.sh base.en
    print_status "Whisper model downloaded (~148MB)"
else
    print_status "Whisper model already exists"
fi

cd ..

# Step 7: Install desktop integration
echo "🖥️  Setting up desktop integration..."
# Copy desktop entry to user applications
mkdir -p ~/.local/share/applications
DESKTOP_FILE="$HOME/.local/share/applications/voice-to-text.desktop"
cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Voice-to-Text
Comment=Offline voice-to-text transcription with global hotkey
Exec=$PWD/node_modules/.bin/electron $PWD/main.js
Icon=microphone
Categories=Utility;Audio;Accessibility;
StartupNotify=true
NoDisplay=false
Path=$PWD
Keywords=voice;speech;text;transcription;whisper;
StartupWMClass=voice-to-text-electron
EOF

chmod +x "$DESKTOP_FILE"
print_status "Desktop integration installed"

# Step 8: Test setup
echo "🧪 Testing setup..."
if [ -f "whisper.cpp/build/bin/whisper-cli" ] && [ -f "whisper.cpp/models/ggml-base.en.bin" ]; then
    print_status "Setup completed successfully!"
else
    print_error "Setup incomplete. Please check for errors above."
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo "To start the app, run: npm start"
echo "Press Super+Space to record voice and transcribe to clipboard"
echo ""
echo "For more info, see: README.md"
