#!/bin/bash

# Quick Voice-to-Text for Ubuntu Unity
# This script provides a simple keyboard shortcut for voice recognition

# Set working directory to script location
cd "$(dirname "$0")"

# Run the voice recognition script in quick mode
python3 voice_to_text.py --quick
