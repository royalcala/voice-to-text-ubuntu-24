// Electron Voice-to-Text App
// Main process with global hotkey support

const { app, globalShortcut, Tray, Menu, nativeImage, Notification, clipboard } = require('electron');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const WHISPER_PATH = path.resolve(__dirname, 'whisper.cpp/build/bin/whisper-cli');
const MODEL_PATH = path.resolve(__dirname, 'whisper.cpp/models/ggml-base.en.bin');
const AUDIO_PATH = path.resolve(__dirname, 'recorded.wav');

// State
let isRecording = false;
let arecordProcess = null;
let tray = null;

// Simple icon creation using empty image
const createSimpleIcon = () => {
  // Create a simple 16x16 transparent image
  const image = nativeImage.createEmpty();
  return image;
};

function createTray() {
  // Create tray icon (simple empty icon)
  tray = new Tray(createSimpleIcon());
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Voice to Text',
      type: 'normal',
      enabled: false
    },
    { type: 'separator' },
    {
      label: isRecording ? 'Stop Recording' : 'Start Recording',
      click: toggleRecording
    },
    {
      label: 'Test Recording',
      click: () => {
        console.log('Manual test triggered');
        toggleRecording();
      }
    },
    { type: 'separator' },
    {
      label: 'Show Available Shortcuts',
      click: () => {
        const shortcuts = globalShortcut.getRegisteredAccelerators();
        console.log('Registered shortcuts:', shortcuts);
        showNotification('Registered Shortcuts', shortcuts.length > 0 ? shortcuts.join(', ') : 'None registered');
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Voice to Text - Right-click for options');
}

function updateTrayIcon() {
  if (tray) {    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Voice to Text',
        type: 'normal',
        enabled: false
      },
      { type: 'separator' },
      {
        label: isRecording ? '🔴 Stop Recording' : '🎤 Start Recording',
        click: toggleRecording
      },
      {
        label: 'Test Recording',
        click: () => {
          console.log('Manual test triggered');
          toggleRecording();
        }
      },
      { type: 'separator' },
      {
        label: 'Show Available Shortcuts',
        click: () => {
          const shortcuts = globalShortcut.getRegisteredAccelerators();
          console.log('Registered shortcuts:', shortcuts);
          showNotification('Registered Shortcuts', shortcuts.length > 0 ? shortcuts.join(', ') : 'None registered');
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        }
      }
    ]);
    
    tray.setContextMenu(contextMenu);
    tray.setToolTip(isRecording ? 'Recording... Right-click to stop' : 'Voice to Text - Right-click for options');
  }
}

function showNotification(title, body) {
  if (Notification.isSupported()) {
    new Notification({
      title: `Voice-to-Text: ${title}`,
      body,
      silent: false,
      icon: 'microphone' // System icon
    }).show();
  }
}

function startRecording() {
  if (isRecording) return;
  
  console.log('🎤 Recording started...');
  showNotification('Voice Recording', 'Recording started... Press Super+Space to stop');
  
  isRecording = true;
  updateTrayIcon();
  
  // Remove previous recording
  if (fs.existsSync(AUDIO_PATH)) {
    fs.unlinkSync(AUDIO_PATH);
  }
  
  // Start recording (no time limit)
  arecordProcess = spawn('arecord', ['-f', 'cd', '-t', 'wav', '-r', '16000', '-c', '1', AUDIO_PATH]);
  
  arecordProcess.on('error', (err) => {
    console.error('Recording error:', err.message);
    showNotification('Recording Error', 'Failed to start recording: ' + err.message);
    isRecording = false;
    updateTrayIcon();
  });
}

function stopRecording() {
  if (!isRecording || !arecordProcess) return;
  
  console.log('⏹️ Recording stopped. Transcribing...');
  showNotification('Voice Recording', 'Recording stopped. Transcribing...');
  
  arecordProcess.kill('SIGTERM');
  isRecording = false;
  arecordProcess = null;
  updateTrayIcon();
  
  // Wait a moment for file to be written, then transcribe
  setTimeout(() => {
    transcribeAudio();
  }, 500);
}

function transcribeAudio() {
  if (!fs.existsSync(AUDIO_PATH)) {
    console.error('❌ No audio file found to transcribe.');
    showNotification('Transcription Error', 'No audio file found to transcribe');
    return;
  }
  
  try {
    console.log('🔄 Transcribing with Whisper...');
    
    const result = execSync(`${WHISPER_PATH} -m ${MODEL_PATH} -f ${AUDIO_PATH} --output-txt --output-file transcribed`, { 
      encoding: 'utf8',
      cwd: __dirname
    });
    
    // Read the output and copy to clipboard
    const transcriptFile = path.resolve(__dirname, 'transcribed.txt');
    if (fs.existsSync(transcriptFile)) {
      const text = fs.readFileSync(transcriptFile, 'utf8').trim();
      
      // Extract just the text without timestamps
      const cleanText = text.replace(/\[.*?\]\s*/g, '').replace(/♪/g, '').trim();
      
      if (cleanText) {
        clipboard.writeText(cleanText);
        console.log('✅ Transcription copied to clipboard!');
        console.log('📝 Transcribed text:', cleanText);
        showNotification('Transcription Complete', `Text copied to clipboard: "${cleanText.substring(0, 50)}${cleanText.length > 50 ? '...' : ''}"`);
      } else {
        console.log('⚠️ No text was transcribed from the audio.');
        showNotification('Transcription Warning', 'No text was transcribed from the audio');
      }
    } else {
      console.error('❌ Transcription failed. No output file found.');
      showNotification('Transcription Error', 'Transcription failed. No output file found');
    }
  } catch (e) {
    console.error('❌ Transcription error:', e.message);
    showNotification('Transcription Error', 'Transcription failed: ' + e.message);
  }
}

function toggleRecording() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

// App event handlers
app.whenReady().then(() => {
  console.log('🎤 Voice-to-Text Electron App Starting...');
  
  // Set app metadata for proper notifications
  app.setName('Voice-to-Text');
  app.setDesktopName('Voice-to-Text');
  if (process.platform === 'linux') {
    app.setPath('desktop', '/usr/share/applications');
  }
  
  // Register only Super+Space for voice recording
  const ret = globalShortcut.register('Super+Space', () => {
    console.log('🎯 Super+Space pressed! Toggling recording...');
    toggleRecording();
  });
  
  if (ret) {
    console.log('✅ Successfully registered Super+Space hotkey');
    showNotification('Voice-to-Text Ready', 'Press Super+Space to start recording');
  } else {
    console.log('❌ Failed to register Super+Space');
    showNotification('Hotkey Error', 'Failed to register Super+Space. Use tray menu instead.');
  }
  
  // Create system tray
  createTray();
  
  console.log('✅ Voice-to-Text is ready!');
  console.log('🎯 Press Super+Space to start/stop recording');
});

app.on('window-all-closed', () => {
  // Don't quit on macOS
  if (process.platform !== 'darwin') {
    // Keep running in background
  }
});

app.on('will-quit', () => {
  // Cleanup
  if (isRecording && arecordProcess) {
    arecordProcess.kill('SIGTERM');
  }
  
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});

// Prevent app from quitting when all windows are closed
app.on('window-all-closed', (event) => {
  event.preventDefault();
});

// Handle second instance
app.on('second-instance', () => {
  showNotification('Voice-to-Text', 'App is already running in system tray');
});

// Make this app a single instance
if (!app.requestSingleInstanceLock()) {
  app.quit();
}
