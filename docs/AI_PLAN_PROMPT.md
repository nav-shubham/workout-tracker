# 🤖 AI Prompt Guide for Generating Compatible Workout Plans

Use the prompt below to generate a workout plan using any AI model (ChatGPT, Gemini, Claude, etc.) that can be directly imported into the **Workout Tracker** app with structured **Warm-Up**, **Main Workout**, **Core**, and **Finisher** sections.

---

## 📋 Copy-Paste AI Prompt

```text
Please generate a structured workout plan formatted strictly as valid JSON adhering to the following sectioned JSON schema:

{
  "planName": "Your Plan Name Here",
  "description": "Short description of the plan goals and structure",
  "goals": ["Goal 1", "Goal 2", "Goal 3"],
  "principles": ["Principle 1 (e.g. 1-2 RIR)", "Principle 2 (e.g. Progressive Overload)"],
  "routines": {
    "Day 1 — Pull Power + Core Stability": {
      "warmup": [
        "Dead hang — 30s (x2 rounds)",
        "Scapular pull-ups — x8 (x2 rounds)",
        "Band pull-aparts — x15 (x2 rounds)"
      ],
      "main": [
        { "name": "Pull-ups", "sets": 6, "targetReps": "3-5 reps", "restSeconds": 90, "notes": "Full ROM, controlled tempo" },
        { "name": "Negative Pull-ups", "sets": 3, "targetReps": "3 reps", "restSeconds": 90, "notes": "6-8s descent" },
        { "name": "Band Rows", "sets": 3, "targetReps": "12-15 reps", "restSeconds": 90 }
      ],
      "core": [
        { "name": "Hanging Knee Raises", "sets": 4, "targetReps": "10-12 reps", "restSeconds": 60, "notes": "Pelvic tilt" },
        { "name": "Hollow Body Hold", "sets": 4, "targetReps": "30-45s", "restSeconds": 60 }
      ],
      "finisher": [
        "3 rounds — Mountain Climbers x30s",
        "3 rounds — High Knees x30s",
        "Rest 30s between rounds"
      ],
      "cue": "Explode up. Hold the hollow body tight."
    },
    "Day 2 — Legs & Glutes": {
      "warmup": [
        "Leg swings + Hip circles",
        "Bodyweight Squats — x15"
      ],
      "main": [
        { "name": "Bulgarian Split Squats", "sets": 4, "targetReps": "10-12 reps/leg", "restSeconds": 75 },
        { "name": "Band Hip Thrusts", "sets": 4, "targetReps": "15-20 reps", "restSeconds": 60 }
      ],
      "core": [
        { "name": "L-sit / Tuck Hold on Parallettes", "sets": 5, "targetReps": "15-25s", "restSeconds": 60 }
      ],
      "finisher": [
        "4 rounds — Jump Squats x12",
        "Rest 30s between rounds"
      ],
      "cue": "Drive through the heels."
    },
    "Day 3 — Rest or Active Recovery": {
      "recovery": true,
      "routine": [
        "8k+ steps brisk walk",
        "Light stretching / mobility"
      ],
      "reflection": [
        { "id": "steps", "label": "Total steps today?" },
        { "id": "soreness", "label": "Soreness level (1-10)?" }
      ],
      "cue": "Rest is where adaptation occurs."
    }
  }
}

Instructions for the AI:
1. Output ONLY valid JSON inside a ```json ``` code block.
2. Structure each training day into "warmup", "main", "core", and "finisher" sections.
3. Every exercise in "main" and "core" MUST include "name" (string), "sets" (integer), "targetReps" (string), and "restSeconds" (integer).
4. For active recovery or rest days, set "recovery": true and include a "routine" array and "reflection" prompts.
```

---

## 📥 How to Import into the App

1. Copy the generated JSON from the AI response.
2. Click **🤖 Import AI Plan** in the Workout Tracker app.
3. Paste the JSON and click **Import Plan**.
4. The app will automatically parse the plan and display your **Warm-Up**, **Main Workout**, **Core**, and **Finisher** sections seamlessly!

