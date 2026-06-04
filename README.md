# Workout Tracker - Elite Edition

A dual-interface workout tracking application featuring a premium Python desktop client and a responsive web dashboard. It helps you design workout templates, track set completions, time your rests with audio feedback, and visualize historical data.

---

## ✨ Features

### 🖥️ 1. Python Desktop Application (`tkinter` + `Pillow`)
- **Dark Mode Design System**: Translucent-style card borders, clean modern headings, and glowing status indicators.
- **Dynamic Viewport Resizing**: Responsive Tkinter panels that scale dynamically.
- **Audio Chimes**: Built-in sound chimes (using `winsound` on Windows) for workout start, rest timers, and completion alerts.
- **Template Builder**: Default and custom templates for up to 6 different workout days.
- **JSON Storage**: Logs session progress inside `~/.workout_tracker/data.json`.

### 🌐 2. Web Dashboard (`web_app/`)
- **Interactive UI**: Fully local HTML/CSS/JS dashboard that requires zero server-side setup.
- **Web Audio API Synth**: Custom synthesized bell sounds (ascending/descending chime chords) generated dynamically in the browser.
- **LocalStorage Persistence**: Saves configuration and history directly inside browser memory.
- **Timer Engine**: Automated intervals to time your rest periods between sets.

---

## 📁 Project Structure

- `src/workout_tracker_v2.py` - Core Python Desktop application.
- `web_app/` - Standalone web client interface.
  - `index.html` - Premium glassmorphic workspace page.
  - `styles.css` - Custom styling theme.
  - `app.js` - Client logic and Web Audio API synthesizer.
- `pyproject.toml` - Python dependency manifest (managing `pillow`).

---

## 🚀 Setup & Execution

### Running the Desktop Application
1. Install dependencies and activate the virtual environment:
   ```bash
   uv venv
   uv sync
   ```
2. Launch the desktop tracker:
   ```bash
   uv run python src/workout_tracker_v2.py
   ```

### Running the Web Application
1. Double-click [index.html](file:///D:/PythonTools/workout_tracker/web_app/index.html) or host it with any local server (e.g. `npx serve web_app` or Python's `http.server`).
2. The web interface will open in your browser, fully functional offline.
