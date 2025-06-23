#!/usr/bin/env python3
"""
Voice-to-Text Script for Ubuntu Unity
Simple offline and online speech recognition with clipboard integration
"""

import subprocess
import sys
import os

# Try to use the virtual environment
VENV_PYTHON = os.path.expanduser("~/voice_env/bin/python")
if os.path.exists(VENV_PYTHON) and sys.executable != VENV_PYTHON:
    # Re-run with virtual environment Python
    subprocess.run([VENV_PYTHON] + sys.argv)
    sys.exit()

def check_microphone():
    """Check if microphone is available"""
    try:
        result = subprocess.run(['arecord', '-l'], capture_output=True, text=True)
        return "card" in result.stdout.lower()
    except:
        return False

def install_dependencies():
    """Install required dependencies"""
    print("Installing speech recognition dependencies...")
    venv_dir = os.path.expanduser("~/voice_env")
    
    if not os.path.exists(venv_dir):
        print("Creating virtual environment...")
        subprocess.run([sys.executable, '-m', 'venv', venv_dir], check=True)
    
    pip_path = os.path.join(venv_dir, 'bin', 'pip')
    try:
        subprocess.run([pip_path, 'install', 'speechrecognition', 'pyaudio', 'pocketsphinx'], 
                      check=True)
        print("Dependencies installed successfully!")
        print("Restart the script to use the new environment.")
        return True
    except subprocess.CalledProcessError:
        print("Failed to install dependencies.")
        return False

def simple_voice_recognition():
    """Simple voice recognition using system tools"""
    print("Starting voice recognition...")
    print("Speak now (will record for 5 seconds):")
    
    try:
        # Record audio
        subprocess.run(['arecord', '-d', '5', '-f', 'cd', '/tmp/voice_input.wav'], 
                      check=True)
        
        # Try to use pocketsphinx for offline recognition
        try:
            result = subprocess.run(['pocketsphinx_continuous', '-infile', 
                                   '/tmp/voice_input.wav'], 
                                  capture_output=True, text=True)
            if result.stdout.strip():
                text = result.stdout.strip()
                print(f"Recognized: {text}")
                copy_to_clipboard(text)
                return text
        except:
            print("Offline recognition not available")
            
        print("Voice recorded to /tmp/voice_input.wav")
        print("You can process this file with online services")
        
    except subprocess.CalledProcessError:
        print("Error: Could not record audio. Check microphone permissions.")

def advanced_voice_recognition():
    """Advanced voice recognition with Google Speech API"""
    try:
        import speech_recognition as sr
        
        # Initialize recognizer
        r = sr.Recognizer()
        
        # Use microphone as source
        with sr.Microphone() as source:
            print("Adjusting for ambient noise... Please wait.")
            r.adjust_for_ambient_noise(source)
            print("Say something!")
            
            # Listen for audio
            audio = r.listen(source, timeout=10)
            
        print("Processing...")
        
        try:
            # Try Google Speech Recognition (requires internet)
            text = r.recognize_google(audio)
            print(f"Google recognized: {text}")
            copy_to_clipboard(text)
            return text
        except sr.UnknownValueError:
            print("Could not understand audio")
        except sr.RequestError as e:
            print(f"Could not request results; {e}")
            
            # Fallback to offline recognition
            try:
                text = r.recognize_sphinx(audio)
                print(f"Sphinx recognized: {text}")
                copy_to_clipboard(text)
                return text
            except sr.UnknownValueError:
                print("Sphinx could not understand audio")
            except sr.RequestError as e:
                print(f"Sphinx error; {e}")
                
    except ImportError:
        print("SpeechRecognition not installed. Installing...")
        if install_dependencies():
            print("Please restart the script to use the new environment.")
            return None
        else:
            return simple_voice_recognition()

def copy_to_clipboard(text):
    """Copy text to clipboard and show notification"""
    try:
        subprocess.run(['xclip', '-selection', 'clipboard'], 
                     input=text.encode(), check=True)
        print("✅ Text copied to clipboard!")
        
        # Show notification in Unity
        try:
            subprocess.run(['notify-send', 'Voice to Text', 
                          f'Recognized: "{text[:50]}{"..." if len(text) > 50 else ""}"'], 
                         check=False)
        except:
            pass
            
    except:
        print("⚠️  Could not copy to clipboard. Install xclip: sudo apt install xclip")

def create_keyboard_shortcut():
    """Instructions to create keyboard shortcut in Unity"""
    script_path = os.path.dirname(os.path.abspath(__file__))
    quick_script = os.path.join(script_path, "quick_voice.sh")
    
    print("\n🔧 To create a keyboard shortcut in Ubuntu Unity:")
    print("1. Open System Settings")
    print("2. Go to Keyboard → Shortcuts → Custom Shortcuts")
    print("3. Click the '+' button to add a new shortcut")
    print("4. Name: 'Voice to Text'")
    print(f"5. Command: {quick_script}")
    print("6. Choose one of these shortcut keys:")
    print("   • Super + Space (recommended - intuitive for speech)")
    print("   • Super + M ('M' for microphone)")
    print("   • F12 (function key - unlikely to conflict)")
    print("   • Ctrl + Shift + M (microphone)")
    print("   • Super + V (voice)")
    print()
    print("💡 Recommended: Super + Space (Windows key + Space)")
    print()

def quick_recognition():
    """Quick recognition for keyboard shortcuts"""
    if not check_microphone():
        subprocess.run(['notify-send', 'Voice to Text', 'No microphone detected!'])
        return
    
    text = advanced_voice_recognition()
    if text:
        subprocess.run(['notify-send', 'Voice to Text', f'✅ Recognized and copied!'])

def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--quick':
        quick_recognition()
        return
        
    print("=== Ubuntu Unity Voice-to-Text Tool ===")
    print()
    
    if not check_microphone():
        print("Warning: No microphone detected. Please check your audio setup.")
        return
    
    print("Choose recognition method:")
    print("1. Simple recording (always available)")
    print("2. Advanced recognition (requires internet)")
    print("3. Install dependencies")
    print("4. Setup keyboard shortcut")
    
    choice = input("Enter choice (1-4): ").strip()
    
    if choice == "1":
        simple_voice_recognition()
    elif choice == "2":
        text = advanced_voice_recognition()
        if text:
            print(f"\nRecognized text: {text}")
    elif choice == "3":
        install_dependencies()
    elif choice == "4":
        create_keyboard_shortcut()
    else:
        print("Invalid choice")

if __name__ == "__main__":
    main()
