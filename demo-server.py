#!/usr/bin/env python3
"""
Simple HTTP server for Boston Tracker Live Demo
Usage: python3 demo-server.py [port]
Default port: 8080
"""

import http.server
import socketserver
import sys
import os
from pathlib import Path

# Default port
PORT = 8080

# Get port from command line if provided
if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        print(f"Invalid port number: {sys.argv[1]}")
        sys.exit(1)

# Change to the directory containing this script
script_dir = Path(__file__).parent.absolute()
os.chdir(script_dir)

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        
        # Add caching headers for better performance
        if self.path.endswith(('.css', '.js')):
            self.send_header('Cache-Control', 'max-age=3600')  # 1 hour
        elif self.path.endswith(('.ico', '.png', '.jpg', '.jpeg')):
            self.send_header('Cache-Control', 'max-age=86400')  # 1 day
        
        super().end_headers()

    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.log_date_time_string()}] {format % args}")

if __name__ == "__main__":
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print("=" * 60)
            print("🔴 BOSTON TRACKER - LIVE DEMO SERVER")
            print("=" * 60)
            print(f"📂 Serving directory: {script_dir}")
            print(f"🌐 Server running on: http://localhost:{PORT}")
            print(f"📱 Mobile access: http://[YOUR_IP]:{PORT}")
            print("=" * 60)
            print("📋 Available endpoints:")
            print(f"   • Main Dashboard: http://localhost:{PORT}/")
            print(f"   • Direct HTML: http://localhost:{PORT}/index.html")
            print("=" * 60)
            print("Press Ctrl+C to stop the server")
            print()
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Error: Port {PORT} is already in use.")
            print(f"Try a different port: python3 demo-server.py {PORT + 1}")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)
