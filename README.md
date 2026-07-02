# Workout Tracker

A premium web-based workout tracking application designed for performance. It helps you design workout templates, track set completions, time your rests with audio feedback, and visualize historical data.

---

## ✨ Features

- **Athletic Dark Design System**: A high-contrast, modern carbon-charcoal and active safety orange theme designed for maximum visibility and visual appeal during workouts.
- **Unified Custom Preset Combobox**: A custom-built combobox widget that displays saved routines in a neat dropdown, allowing you to name new presets or select existing ones without fear of wiping your configured exercises.
- **LocalStorage Persistence**: Saves configuration, presets, and history directly inside the browser's persistent storage.
- **Web Audio API Chime Synth**: Custom-synthesized bell chords generated dynamically in the browser for starting exercises, rest periods, and workout completion.
- **Set Timer Engine**: Automated stopwatch and rest interval tracker with live split logging.
- **History Visualizer & Export**: Filter history records by date range, delete old entries, or download your history as a CSV spreadsheet.

---

## 📁 Project Structure

- `web_app/` - Standalone web application.
  - [index.html](file:///D:/PythonTools/workout_tracker/web_app/index.html) - Application interface.
  - [styles.css](file:///D:/PythonTools/workout_tracker/web_app/styles.css) - Custom modern stylesheet.
  - [app.js](file:///D:/PythonTools/workout_tracker/web_app/app.js) - Application logic and sound chime synthesizer.

---

## 🚀 Execution

1. Double-click [index.html](file:///D:/PythonTools/workout_tracker/web_app/index.html) to run it locally in any modern web browser.
2. Alternatively, host the `web_app` directory using any lightweight server (e.g. `npx serve web_app` or `python -m http.server` inside the directory).
