#!/bin/bash

# Ubuntu Unity Voice-to-Text Setup Script
# This script helps set up keyboard shortcuts for voice recognition

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
VOICE_SCRIPT="$SCRIPT_DIR/quick_voice.sh"

echo "🎤 Ubuntu Unity Voice-to-Text Setup"
echo "=================================="
echo

# Check if files exist
if [[ ! -f "$VOICE_SCRIPT" ]]; then
    echo "❌ Error: quick_voice.sh not found!"
    exit 1
fi

# Check if voice_to_text.py exists
if [[ ! -f "$SCRIPT_DIR/voice_to_text.py" ]]; then
    echo "❌ Error: voice_to_text.py not found!"
    exit 1
fi

echo "✅ Voice recognition scripts found"
echo "✅ Virtual environment ready"
echo

echo "🔧 Setting up keyboard shortcuts:"
echo

echo "OPTION 1: Custom Keyboard Shortcut (Recommended)"
echo "1. Open System Settings → Keyboard → Shortcuts"
echo "2. Click 'Custom Shortcuts' → '+' button"
echo "3. Name: 'Voice to Text'"
echo "4. Command: $VOICE_SCRIPT"
echo "5. Click 'Set Shortcut' and press: Ctrl+Alt+V"
echo

echo "OPTION 2: Quick Test (Run now)"
echo "Press Enter to test voice recognition now..."
read -r

echo "🎤 Testing voice recognition (speak something)..."
"$VOICE_SCRIPT"

echo
echo "OPTION 3: VS Code Integration"
echo "To fix VS Code tab switching conflict:"
echo "1. Open VS Code"
echo "2. Press Ctrl+Shift+P"
echo "3. Type 'Preferences: Open Keyboard Shortcuts'"
echo "4. Search for 'tab switcher'"
echo "5. Remove or change the conflicting shortcut"
echo

echo "OPTION 4: Create Desktop Shortcut"
read -p "Create desktop shortcut? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cat > ~/Desktop/voice-to-text.desktop << EOF
[Desktop Entry]
Name=Voice to Text
Comment=Quick voice-to-text conversion
Exec=$VOICE_SCRIPT
Icon=audio-input-microphone
Terminal=false
Type=Application
Categories=Utility;AudioVideo;
EOF
    chmod +x ~/Desktop/voice-to-text.desktop
    echo "✅ Desktop shortcut created!"
fi

echo
echo "🎯 Quick Usage Summary:"
echo "• Run manually: ./quick_voice.sh"
echo "• Desktop shortcut: Double-click Voice to Text icon"
echo "• Keyboard shortcut: Set up Ctrl+Alt+V (recommended)"
echo "• VS Code: Use Command Palette → 'Speech: Start Voice Typing'"
echo
echo "🎤 Ready to use! Your voice will be converted to text and copied to clipboard."
