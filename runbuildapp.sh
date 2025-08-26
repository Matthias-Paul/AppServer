#!/bin/bash
# Save as run-built-app.sh
echo "Starting MediaUnboxed with console logging..."
cd dist/mac-arm64/MediaUnboxed.app/Contents/MacOS
ELECTRON_ENABLE_LOGGING=true ./MediaUnboxed
