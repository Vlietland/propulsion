#!/bin/bash

# Script to serve the design documentation on localhost:8080
# This will start a local HTTP server for the design.html file

echo "🚀 Starting design documentation server..."
echo "📂 Serving from: docs/design/"
echo "🌐 Access at: http://localhost:8080/design.html"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

# Start the HTTP server in the background
python3 -m http.server 8080 &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 2

# Open the default browser
echo "🌐 Opening browser..."
xdg-open http://localhost:8080/design.html

# Bring the server to the foreground
wait $SERVER_PID
