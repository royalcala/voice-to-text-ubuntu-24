# Voice-to-Text Electron App

A desktop application for offline voice-to-text transcription using OpenAI's Whisper model with global hotkey support.

## Features

- 🎤 **Global Hotkey**: Press `Super+Space` from anywhere to start/stop recording
- 🔇 **Offline**: No internet required - uses local Whisper model
- 📋 **Auto Clipboard**: Transcribed text automatically copied to clipboard
- 🔔 **Notifications**: Desktop notifications for recording status
- 🎯 **System Tray**: Runs in background with tray integration
- ⚡ **Fast**: Real-time recording with efficient transcription

## Quick Setup

### Prerequisites
- Linux Ubuntu 24.04+ (tested)
- Git
- Node.js 18+ (recommended: 22.x)

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/your-username/voice-to-text-ubuntu-24.git
cd voice-to-text-ubuntu-24/nodejs

# Run the automated setup script
chmod +x setup.sh
./setup.sh

# Start the app
npm start
```

### Alternative: NPM Scripts Setup

```bash
# Clone the repository
git clone https://github.com/your-username/voice-to-text-ubuntu-24.git
cd voice-to-text-ubuntu-24/nodejs

# Install system dependencies
npm run install-deps

# Install Node.js dependencies
npm install

# Download model and build whisper.cpp
npm run setup

# Start the app
npm start
```

### Manual Setup (if needed)

1. **Install system dependencies:**
```bash
sudo apt-get update
sudo apt-get install -y build-essential cmake git alsa-utils
```

2. **Install Node.js dependencies:**
```bash
npm install
```

3. **Initialize whisper.cpp submodule (if missing):**
```bash
git submodule update --init --recursive
```

4. **Build whisper.cpp:**
```bash
cd whisper.cpp
make clean
make -j$(nproc)
cd ..
```

5. **Download the Whisper model:**
```bash
cd whisper.cpp
bash models/download-ggml-model.sh base.en
cd ..
```

## Usage

1. **Start the app:**
```bash
npm start
```

2. **Use the hotkey:**
   - Press `Super+Space` to start recording
   - Speak your message
   - Press `Super+Space` again to stop and transcribe
   - Text is automatically copied to clipboard

3. **Alternative controls:**
   - Right-click the system tray icon for manual controls
   - Use the context menu to start/stop recording

## Available NPM Scripts

- `npm start` - Start the Electron app
- `npm run dev` - Start in development mode
- `npm run install-deps` - Install system dependencies (Ubuntu/Debian)
- `npm run setup` - Download model and build whisper.cpp
- `npm run download-model` - Download the Whisper base.en model
- `npm run build-whisper` - Build whisper.cpp from source

## Whisper.cpp Setup

This project uses whisper.cpp as a Git submodule. If you encounter issues:

1. **Initialize submodule:**
```bash
git submodule update --init --recursive
```

2. **Update submodule:**
```bash
git submodule update --remote
```

3. **Manual clone (if submodule fails):**
```bash
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp
make -j$(nproc)
bash models/download-ggml-model.sh base.en
```

## Model Information

- **Default Model**: `ggml-base.en.bin` (~148MB)
- **Language**: English only
- **Accuracy**: Good balance of speed and accuracy
- **Location**: `whisper.cpp/models/ggml-base.en.bin`

### Other Available Models

You can download different models for better accuracy or multilingual support:

```bash
cd whisper.cpp
# Faster, less accurate
bash models/download-ggml-model.sh tiny.en

# More accurate, slower
bash models/download-ggml-model.sh small.en
bash models/download-ggml-model.sh medium.en

# Multilingual (slower)
bash models/download-ggml-model.sh base
```

Update `main.js` to change the model path if needed.

## Project Structure

```
├── main.js              # Main Electron application
├── package.json         # Node.js dependencies and scripts
├── whisper.cpp/         # Whisper C++ implementation
│   ├── build/bin/       # Compiled binaries
│   └── models/          # AI models
└── README.md           # This file
```

## Technical Details

- **Audio Recording**: Uses `arecord` for high-quality audio capture
- **Speech Recognition**: OpenAI Whisper (base.en model) for offline transcription
- **Global Hotkeys**: Electron's globalShortcut API
- **Clipboard**: Electron's native clipboard integration
- **System Integration**: Native desktop notifications and system tray

## Troubleshooting

**No audio recording:**
- Check microphone permissions
- Ensure `arecord` is installed: `sudo apt install alsa-utils`

**Hotkey not working:**
- Use the system tray right-click menu as backup
- Check console output for registration status

**Transcription failed:**
- Ensure whisper.cpp model is downloaded
- Check audio file is being created during recording

## License

ISC