import os
import re
import shutil
import sys
import json
import subprocess
import webbrowser

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
PORT = 8000

def ensure_flask_installed():
    try:
        import flask
    except ImportError:
        print("Flask is not installed. Installing flask via pip...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "flask"])
            print("Flask installed successfully!\n")
        except Exception as e:
            print(f"Failed to install Flask automatically: {e}")
            print("Please run: pip install flask")
            sys.exit(1)

def migrate_logs(data_dir):
    workout_data_path = os.path.join(data_dir, "workout_data.json")
    migrated_path = os.path.join(data_dir, "calisthenics_log_migrated.json")
    athletic_logs_path = os.path.join(data_dir, "athletic_cut_logs.json")

    # Load active workout data
    workout_data = {}
    if os.path.exists(workout_data_path):
        try:
            with open(workout_data_path, "r", encoding="utf-8") as f:
                workout_data = json.load(f)
        except Exception as e:
            print(f"Error reading workout_data.json: {e}")

    # Ensure workout_data is a dict
    if not isinstance(workout_data, dict):
        workout_data = {}

    # Initialize logs list
    existing_logs = workout_data.get("logs", [])
    if not isinstance(existing_logs, list):
        existing_logs = []

    # Helper to load a list of logs from file
    def load_migrated_logs(file_path):
        if os.path.exists(file_path):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = json.load(f)
                    if isinstance(content, list):
                        return content
                    elif isinstance(content, dict) and "logs" in content:
                        return content["logs"]
            except Exception as e:
                print(f"Error reading {os.path.basename(file_path)}: {e}")
        return []

    new_logs_to_add = []
    new_logs_to_add.extend(load_migrated_logs(migrated_path))
    new_logs_to_add.extend(load_migrated_logs(athletic_logs_path))

    if not new_logs_to_add:
        print("No historical logs found for migration.")
        return

    # Merge logs avoiding duplicates based on (date, dayId)
    merged_logs_map = {}
    
    # 1. Add existing logs to map
    for log in existing_logs:
        if isinstance(log, dict):
            date = log.get("date") or log.get("isoDate")
            day_id = log.get("dayId") or log.get("dayName")
            if date and day_id:
                merged_logs_map[(date, day_id)] = log
            else:
                merged_logs_map[("unknown_" + str(len(merged_logs_map)), "")] = log

    # 2. Add migrated logs to map
    for log in new_logs_to_add:
        if isinstance(log, dict):
            date = log.get("date") or log.get("isoDate")
            day_id = log.get("dayId") or log.get("dayName")
            if date and day_id:
                if (date, day_id) not in merged_logs_map:
                    merged_logs_map[(date, day_id)] = log

    # Sort merged logs by date
    def get_log_sort_key(item):
        log = item[1]
        date = log.get("date") or log.get("isoDate") or ""
        timestamp = log.get("timestamp") or 0
        return (date, timestamp)

    sorted_logs = [log for _, log in sorted(merged_logs_map.items(), key=get_log_sort_key)]

    # Update workout_data
    workout_data["logs"] = sorted_logs

    # Save back to workout_data.json
    try:
        with open(workout_data_path, "w", encoding="utf-8") as f:
            json.dump(workout_data, f, indent=4, ensure_ascii=False)
        print(f"Successfully migrated/merged {len(sorted_logs)} total logs into workout_data.json!")
    except Exception as e:
        print(f"Error writing merged logs: {e}")

def organize_folder():
    html_file = os.path.join(ROOT_DIR, "calisthenics-tracker-fixed.html")
    
    # Let's try to restore the file from git if it's missing
    if not os.path.exists(html_file):
        try:
            print("Restoring calisthenics-tracker-fixed.html from git to correct previous corruption...")
            subprocess.run(["git", "checkout", "--", "calisthenics-tracker-fixed.html"], cwd=ROOT_DIR)
        except Exception as e:
            print(f"Could not run git checkout: {e}")

    if not os.path.exists(html_file):
        print("Root HTML file not found, assuming static/templates directories are already correctly configured.")
        return

    print("=" * 60)
    print("           ORGANIZING PROJECT DIRECTORY STRUCTURE")
    print("=" * 60)
    
    static_css_dir = os.path.join(ROOT_DIR, "static", "css")
    static_js_dir = os.path.join(ROOT_DIR, "static", "js")
    templates_dir = os.path.join(ROOT_DIR, "templates")
    docs_dir = os.path.join(ROOT_DIR, "docs")
    data_dir = os.path.join(ROOT_DIR, "data")

    os.makedirs(static_css_dir, exist_ok=True)
    os.makedirs(static_js_dir, exist_ok=True)
    os.makedirs(templates_dir, exist_ok=True)
    os.makedirs(docs_dir, exist_ok=True)
    os.makedirs(data_dir, exist_ok=True)

    try:
        with open(html_file, "r", encoding="utf-8") as f:
            content = f.read()

        # Extract CSS
        style_pattern = re.compile(r"<style>(.*?)</style>", re.DOTALL)
        style_match = style_pattern.search(content)
        if style_match:
            css_content = style_match.group(1).strip()
            with open(os.path.join(static_css_dir, "styles.css"), "w", encoding="utf-8") as f_css:
                f_css.write(css_content)
            print(" -> Extracted CSS to: static/css/styles.css")

        # Extract JS (last script block)
        script_pattern = re.compile(r"<script>(.*?)</script>", re.DOTALL)
        script_matches = list(script_pattern.finditer(content))
        if script_matches:
            last_match = script_matches[-1]
            js_content = last_match.group(1).strip()
            with open(os.path.join(static_js_dir, "app.js"), "w", encoding="utf-8") as f_js:
                f_js.write(js_content)
            print(" -> Extracted JS to: static/js/app.js")

        # Create templates/index.html with links (using replace to avoid index shifting bugs)
        html_content = content
        if style_match:
            html_content = html_content.replace(style_match.group(0), '<link rel="stylesheet" href="/static/css/styles.css">')
        if script_matches:
            html_content = html_content.replace(last_match.group(0), '<script src="/static/js/app.js"></script>')

        with open(os.path.join(templates_dir, "index.html"), "w", encoding="utf-8") as f_index:
            f_index.write(html_content)
        print(" -> Created HTML template: templates/index.html")

        # Delete original html file
        os.remove(html_file)
        print(" -> Cleaned up root HTML file.")

    except Exception as e:
        print(f"Error during extraction and split: {e}")

    # Move markdown, json, and schema files from root to docs/
    root_files_to_move = [
        "4.exercise.md",
        "AI_PLAN_PROMPT.md",
        "Recovery_Optimized_Calisthenics_Plan_v2.md",
        "Week12.md",
        "workout_plan_schema.json",
        "plan.json"
    ]

    for fname in root_files_to_move:
        src = os.path.join(ROOT_DIR, fname)
        if os.path.exists(src):
            dst = os.path.join(docs_dir, fname)
            try:
                if os.path.exists(dst):
                    if os.path.isdir(dst):
                        shutil.rmtree(dst)
                    else:
                        os.remove(dst)
                shutil.move(src, dst)
                print(f" -> Moved root file: {fname} -> docs/{fname}")
            except Exception as e:
                print(f"Error moving {fname}: {e}")

    print("-" * 60)
    print("Project organized successfully!\n")

# Run organization and extraction
organize_folder()

# Migrate existing data logs
DATA_DIR = os.path.join(ROOT_DIR, 'data')
migrate_logs(DATA_DIR)

# Ensure dependencies are available
ensure_flask_installed()

# Initialize Flask Application
from flask import Flask, render_template, jsonify, request

app = Flask(__name__, template_folder='templates', static_folder='static')
DATA_FILE = os.path.join(DATA_DIR, 'workout_data.json')

@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {}
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            print(f"[GET] Loaded workout data from disk: {len(data.get('logs', []))} sessions, {len(data.get('plans', {}))} plans.")
        except Exception as e:
            print(f"[GET] Error reading workout data file: {e}")
    else:
        print("[GET] workout_data.json not found. Returning empty structure.")
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def save_data():
    try:
        data = request.get_json()
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"[POST] Saved workout data to disk: {len(data.get('logs', []))} sessions logged.")
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"[POST] Error saving workout data file: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

def run_server():
    print("=" * 60)
    print("        CALISTHENICS WORKOUT TRACKER LOCAL FLASK SERVER")
    print("=" * 60)
    print(f"Server started on http://127.0.0.1:{PORT}")
    print(f"Workout data directory: {DATA_DIR}")
    print("Press Ctrl+C to stop the server.")
    print("-" * 60)
    
    webbrowser.open(f"http://127.0.0.1:{PORT}")
    app.run(host='127.0.0.1', port=PORT, debug=False)

if __name__ == '__main__':
    run_server()
