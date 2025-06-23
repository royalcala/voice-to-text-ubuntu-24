# Ubuntu Voice-to-Text Setup Guide

## 🎤 Quick Start Methods

### Method 1: Ubuntu Built-in Voice Typing (Recommended)
**✅ Works immediately, no setup required**

1. **Enable Voice Typing:**
   ```bash
   # Enable via command line
   gsettings set org.gnome.desktop.a11y.applications screen-keyboard-enabled true
   ```
   
   Or go to: **Settings** → **Accessibility** → **Typing** → Enable "Voice Typing"

2. **Usage:**
   - Press `Super + Alt + Shift + S` anywhere you want to type
   - Speak clearly and your words will appear as text
   - Works in VS Code, browsers, terminal, and any text field

### Method 2: VS Code Speech Extension
**✅ Already installed in your VS Code**

1. **Activate Voice Commands:**
   - Press `Ctrl + Shift + P` in VS Code
   - Type "Speech" and select voice commands
   - Or use keyboard shortcuts defined in the extension

2. **Features:**
   - Voice dictation directly in code editor
   - Voice commands for VS Code actions
   - Multiple language support

### Method 3: Advanced Python Script
**✅ Custom solution with multiple options**

Run the script I created:
```bash
python3 /home/rao-ubuntu/github/aws-solutions-arquitect/voice_to_text.py
```

## 🔧 Audio Setup

### Check Your Microphone
```bash
# List audio devices
arecord -l

# Test microphone recording
arecord -d 3 test.wav && aplay test.wav

# Adjust microphone levels
alsamixer
```

### Test Speech Recognition
```bash
# Test espeak (text-to-speech)
espeak "Hello, this is a test"

# Test festival (text-to-speech)
echo "Hello world" | festival --tts
```

## 🌐 Online Speech Recognition

### Install Python Dependencies (Optional)
```bash
# In a virtual environment (recommended)
python3 -m venv ~/voice_env
source ~/voice_env/bin/activate
pip install speechrecognition pyaudio pocketsphinx

# Or system-wide (use --user flag)
pip3 install --user speechrecognition pyaudio pocketsphinx
```

### Create Quick Voice Script
```bash
#!/bin/bash
# Quick voice recognition script
echo "Speak now (5 seconds)..."
arecord -d 5 -f cd /tmp/voice.wav
echo "Processing..."
# Add your preferred recognition method here
```

## 🎯 VS Code Integration

### Method A: Use Built-in Voice Typing
1. Place cursor where you want to type in VS Code
2. Press `Super + Alt + Shift + S`
3. Start speaking
4. Text appears where your cursor was

### Method B: VS Code Speech Extension
1. Open Command Palette (`Ctrl + Shift + P`)
2. Type "Speech: Start Voice Typing"
3. Speak your code or text
4. Use voice commands for VS Code actions

### Method C: Terminal Integration
1. Open terminal in VS Code
2. Run: `python3 voice_to_text.py`
3. Choose your preferred recognition method
4. Text gets copied to clipboard automatically

## 🚀 Advanced Features

### Voice Commands for VS Code
You can create custom voice commands using the VS Code Speech extension:

1. Open VS Code settings
2. Search for "speech"
3. Configure voice commands and shortcuts
4. Set up custom voice triggers for common actions

### Offline Recognition
- **PocketSphinx**: Works offline but less accurate
- **Vosk**: More accurate offline option (requires additional setup)
- **OpenAI Whisper**: Highest accuracy but requires more resources

### Online Recognition
- **Google Speech API**: Most accurate, requires internet
- **Microsoft Speech API**: Good accuracy, requires internet
- **IBM Watson**: Professional grade, requires API key

## 📝 Tips for Better Recognition

1. **Speak Clearly**: Enunciate words properly
2. **Quiet Environment**: Minimize background noise
3. **Good Microphone**: Use a quality microphone if possible
4. **Practice**: Learn the voice commands and dictation style
5. **Punctuation**: Say "comma", "period", "new line" explicitly

## 🔧 Troubleshooting

### Microphone Not Working
```bash
# Check if microphone is detected
lsusb | grep -i audio
cat /proc/asound/cards

# Test microphone permissions
arecord -l
```

### VS Code Speech Extension Issues
1. Restart VS Code
2. Check microphone permissions in browser (if using web version)
3. Verify extension is enabled and updated

### Python Script Issues
```bash
# Install missing dependencies
sudo apt install python3-dev portaudio19-dev
pip3 install --user pyaudio speechrecognition
```

## 🎯 Quick Commands

```bash
# Enable Ubuntu voice typing
gsettings set org.gnome.desktop.a11y.applications screen-keyboard-enabled true

# Test microphone
arecord -d 3 test.wav && aplay test.wav

# Run voice-to-text script
python3 voice_to_text.py

# Copy text to clipboard
echo "your text" | xclip -selection clipboard
```

## 🔗 Additional Resources

- **Ubuntu Accessibility Guide**: Settings → Accessibility
- **VS Code Speech Documentation**: Check extension documentation
- **Voice Training**: Practice with short phrases first
- **Alternative Tools**: 
  - Talon Voice (advanced voice control)
  - Dragon NaturallySpeaking (commercial)
  - Simon (KDE speech recognition)

---

**Quick Start**: Just press `Super + Alt + Shift + S` and start speaking! 🎤
