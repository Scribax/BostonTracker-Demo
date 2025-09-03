#!/bin/bash

echo "================================================="
echo "🔴 BOSTON TRACKER - LIVE DEMO LAUNCHER"
echo "================================================="
echo

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found in current directory"
    echo "Please run this script from the LIVE-DEMO directory"
    exit 1
fi

# Default port
PORT=8080

# Check if port is provided as argument
if [ ! -z "$1" ]; then
    PORT=$1
fi

echo "📂 Demo directory: $(pwd)"
echo "🌐 Starting server on port: $PORT"
echo

# Check if port is available
if netstat -an | grep -q ":$PORT "; then
    echo "⚠️  Warning: Port $PORT appears to be in use"
    echo "You can try a different port: ./launch-demo.sh 8081"
    echo
fi

# Check available Python versions
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python3 to serve the demo"
    echo "📋 Demo will be available at:"
    echo "   • http://localhost:$PORT"
    echo "   • http://$(hostname -I | awk '{print $1}'):$PORT (network access)"
    echo
    echo "Press Ctrl+C to stop the server"
    echo "================================================="
    echo
    
    python3 demo-server.py $PORT
    
elif command -v python &> /dev/null; then
    echo "🐍 Using Python to serve the demo"
    python -m http.server $PORT
    
elif command -v node &> /dev/null && npm list -g http-server &> /dev/null; then
    echo "🟢 Using Node.js http-server"
    http-server -p $PORT
    
else
    echo "❌ No suitable server found. Please install:"
    echo "   • Python 3: apt-get install python3"
    echo "   • Or Node.js with http-server: npm install -g http-server"
    exit 1
fi
