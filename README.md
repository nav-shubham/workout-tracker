# Workout Tracker

A premium Flask-based workout tracking application designed for performance. It helps you design workout templates, track set completions, time your rests with audio feedback, and visualize historical data.

---

## ✨ Features

- **Athletic Dark Design System**: A high-contrast, modern carbon-charcoal and active safety orange theme designed for maximum visibility and visual appeal during workouts.
- **Unified Custom Preset Combobox**: A custom-built combobox widget that displays saved routines in a neat dropdown, allowing you to name new presets or select existing ones without fear of wiping your configured exercises.
- **Flask Backend & Persistence**: Stores logs and plans inside the local `data/workout_data.json` file via Flask API endpoints.
- **Web Audio API Chime Synth**: Custom-synthesized bell chords generated dynamically in the browser for starting exercises, rest periods, and workout completion.
- **Set Timer Engine**: Automated stopwatch and rest interval tracker with live split logging.
- **History Visualizer & Export**: Filter history records by date range, delete old entries, or download your history as a CSV/Excel spreadsheet.

---

## 📁 Project Structure

- `static/` - Static frontend assets (Vanilla CSS and JS).
  - [styles.css](file:///E:/PythonTools/workout_tracker/static/css/styles.css) - Extracted custom modern stylesheet.
  - [app.js](file:///E:/PythonTools/workout_tracker/static/js/app.js) - Extracted application logic and sound chime synthesizer.
- `templates/` - HTML layout files.
  - [index.html](file:///E:/PythonTools/workout_tracker/templates/index.html) - Application interface.
- `docs/` - Workout plans, design schemas, and references.
- `data/` - Persisted data stores.
- [server.py](file:///E:/PythonTools/workout_tracker/server.py) - Self-organizing Flask application server.
- [requirements.txt](file:///E:/PythonTools/workout_tracker/requirements.txt) - Python dependencies.

---

## 🚀 Execution

1. Start the Flask server by running:
   ```bash
   python server.py
   ```
2. The server will start, automatically organize any root HTML/plans if needed, install `flask` if it is missing, launch the web application at `http://127.0.0.1:8000`, and open it in your default web browser.
