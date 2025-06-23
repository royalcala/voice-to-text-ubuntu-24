# 🎤 Voice-to-Text Setup for Ubuntu Unity

## ✅ Quick Setup: Super + Space Shortcut

### Step 1: Set Up Keyboard Shortcut

1. **Open System Settings**
   - Click the gear icon in the top right corner
   - Or press `Super` key and type "System Settings"

2. **Navigate to Keyboard Shortcuts**
   - Go to **Keyboard** → **Shortcuts** → **Custom Shortcuts**

3. **Add New Shortcut**
   - Click the **"+"** button to add a new shortcut
   - **Name**: `Voice to Text`
   - **Command**: `/home/rao-ubuntu/github/aws-solutions-arquitect/quick_voice.sh`

4. **Set Shortcut Key**
   - Click on the shortcut field
   - Press: **`Super + Space`** (Windows key + Spacebar)
   - This will show as "Super+space" in the settings

### Step 2: Test Your Setup

1. **Press `Super + Space`** anywhere in Ubuntu
2. **Speak clearly** when you see the notification
3. **Your speech will be converted to text** and copied to clipboard
4. **Paste with `Ctrl + V`** wherever you need the text

## 🚀 Usage Examples

### In VS Code:
1. Position cursor where you want text
2. Press `Super + Space`
3. Speak your code or comments
4. Press `Ctrl + V` to paste the recognized text

### In Terminal:
1. Press `Super + Space`
2. Speak your command
3. Press `Ctrl + V` to paste the command
4. Press Enter to execute

### In Any Application:
- Web browsers (for search, forms, etc.)
- Text editors
- Chat applications
- Email clients

## 🔧 Technical Details

**What happens when you press `Super + Space`:**
1. Microphone activates
2. Records 5-10 seconds of audio
3. Sends to Google Speech API (requires internet)
4. Converts speech to text
5. Copies text to clipboard automatically
6. Shows Unity notification with result

## 💡 Tips for Better Recognition

1. **Speak clearly** and at normal pace
2. **Minimize background noise**
3. **Use punctuation words**: Say "comma", "period", "new line"
4. **For coding**: Say "open parenthesis", "close parenthesis", etc.
5. **Internet required** for best accuracy

## 🐛 Troubleshooting

### Shortcut Not Working?
- Check System Settings → Keyboard → Shortcuts
- Make sure no other application is using `Super + Space`
- Try logging out and back in

### No Sound/Microphone Issues?
```bash
# Test microphone
arecord -d 3 test.wav && aplay test.wav

# Check microphone permissions
sudo usermod -a -G audio $USER
```

### Script Errors?
```bash
# Reinstall dependencies
python3 voice_to_text.py
# Choose option 3 to install dependencies
```

## 🎯 Alternative Shortcuts (if needed)

If `Super + Space` conflicts with something:
- `Super + M` (M for microphone)
- `F12` (function key)
- `Ctrl + Shift + M`
- `Super + V` (V for voice)

---

**Ready to use!** Press `Super + Space` and start speaking! 🎤✨
