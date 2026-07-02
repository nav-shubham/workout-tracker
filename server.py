import os
import json
import sys
import http.server
import socketserver
import webbrowser

PORT = 8000
# Keep the data file in the same directory as the server script
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'workout_data.json')
WEB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web_app')

class WorkoutTrackerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve static files from the web_app subdirectory
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def do_GET(self):
        if self.path == '/api/data':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.end_headers()
            
            data = {}
            if os.path.exists(DATA_FILE):
                try:
                    with open(DATA_FILE, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    print(f"[GET] Successfully loaded data from local disk: {len(data.get('history', []))} workouts, {len(data.get('templates', {}))} routines.")
                except Exception as e:
                    print(f"[GET] Error reading local data file: {e}")
            else:
                print("[GET] Local workout_data.json not found. Returning empty structure.")
            
            self.wfile.write(json.dumps(data).encode('utf-8'))
        else:
            # Fallback to standard static file serving
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/data':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                data = json.loads(post_data.decode('utf-8'))
                
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=4, ensure_ascii=False)
                
                print(f"[POST] Successfully saved data to disk: {len(data.get('history', []))} workouts, {len(data.get('templates', {}))} routines.")
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                print(f"[POST] Error writing local data file: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    # Disable default request logging to keep terminal output clean and focus on data sync info
    def log_message(self, format, *args):
        try:
            msg = format % args
        except Exception:
            msg = str(format) + " " + str(args)
            
        # Only log errors or api changes, skip 200 GETs of assets to keep console clean
        if "GET /api/data" in msg or "POST /api/data" in msg or "404" in msg or "error" in msg.lower():
            sys.stderr.write("%s - - [%s] %s\n" %
                             (self.address_string(),
                              self.log_date_time_string(),
                              msg))

class DualStackServer(socketserver.TCPServer):
    allow_reuse_address = True

def run_server():
    # If the default templates don't exist in local file, we let the client populate it on first load
    print("=" * 60)
    print("           🏃 WORKOUT TRACKER LOCAL STORAGE SERVER 🏃")
    print("=" * 60)
    
    server_address = ('', PORT)
    try:
        with DualStackServer(server_address, WorkoutTrackerHandler) as httpd:
            print(f"Server successfully started on http://localhost:{PORT}")
            print(f"Workout data file location: {DATA_FILE}")
            print("Press Ctrl+C to stop the server.")
            print("-" * 60)
            
            # Automatically launch the web application in user's default browser
            webbrowser.open(f"http://localhost:{PORT}")
            
            httpd.serve_forever()
    except OSError as e:
        print(f"Error starting server on port {PORT}: {e}")
        print("Is another instance of the server already running?")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nStopping server. Goodbye!")
        sys.exit(0)

if __name__ == '__main__':
    run_server()
