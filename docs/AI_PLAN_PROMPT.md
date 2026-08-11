# 🤖 AI Prompt Guide for Generating Compatible Workout Plans

Use the prompt below to generate a workout plan using any AI model (ChatGPT, Gemini, Claude, etc.) that can be directly imported into the **Workout Tracker** app.

---

## 📋 Copy-Paste AI Prompt

```text
Please generate a structured workout plan formatted strictly as valid JSON adhering to the following JSON schema:

{
  "planName": "Your Plan Name Here",
  "description": "Short description of the plan",
  "goals": ["Goal 1", "Goal 2"],
  "principles": ["Principle 1", "Principle 2"],
  "routines": {
    "Day 1: Pull": [
      { "name": "Arm Circles & Dead Hang (Warm-up)", "sets": 1, "targetReps": "20s", "notes": "Warmup" },
      { "name": "Pull-ups", "sets": 5, "targetReps": "2-3", "notes": "1 RIR" },
      { "name": "Negative Pull-ups", "sets": 2, "targetReps": "3", "notes": "6s lowering" },
      { "name": "Band Rows", "sets": 3, "targetReps": "10-12" }
    ],
    "Day 2: Push": [
      { "name": "Wrist circles (Warm-up)", "sets": 1 },
      { "name": "Parallette Push-ups", "sets": 3, "targetReps": "8-12" },
      { "name": "Pike Push-ups", "sets": 3, "targetReps": "6-8" }
    ]
  }
}

Instructions for the AI:
1. Output ONLY valid JSON inside a ```json ``` code block.
2. Every exercise in each routine MUST have a "name" (string) and "sets" (integer).
3. Optionally include "targetReps" (string), "restSeconds" (integer), and "notes" (string) for each exercise.
4. Ensure routines map day names to arrays of exercise objects.
```

---

## 📥 How to Import into the App

1. Copy the generated JSON from the AI response.
2. Save it as a `.json` file (or paste it using the **Import JSON** button in the Workout Tracker app).
3. The app will automatically parse the plan and add all routines into your **Routine Presets** dropdown!
