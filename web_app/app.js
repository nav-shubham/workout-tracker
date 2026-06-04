/* ==========================================================================
   CONFIG & DATA STORES (LOCAL STORAGE PERSISTENCE)
   ========================================================================== */
const DEFAULT_TEMPLATES = {
    "Pull-up Day": [
        { name: "Pull-ups (Regular)", sets: 4 },
        { name: "Negative Pull-ups", sets: 3 },
        { name: "Active Hangs (Seconds)", sets: 3 }
    ],
    "Push-up Day": [
        { name: "Standard Push-ups", sets: 4 },
        { name: "Decline Push-ups", sets: 3 },
        { name: "Pike Push-ups", sets: 3 }
    ],
    "Leg Day": [
        { name: "Bodyweight Squats", sets: 4 },
        { name: "Forward Lunges", sets: 3 },
        { name: "Single-Leg Calf Raises", sets: 3 }
    ]
};

// Initialize or Load Local Storage
let appData = {
    templates: { ...DEFAULT_TEMPLATES },
    history: []
};

function loadStorageData() {
    const saved = localStorage.getItem("elite_workout_tracker_data");
    if (saved) {
        try {
            appData = JSON.parse(saved);
        } catch (e) {
            console.error("Error parsing storage data:", e);
        }
    } else {
        saveStorageData();
    }
}

function saveStorageData() {
    localStorage.setItem("elite_workout_tracker_data", JSON.stringify(appData));
}

/* ==========================================================================
   WEB AUDIO API SOUND CHIME SYNTHESIZER
   ========================================================================== */
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function synthBell(freq, startTime, duration, type = "sine") {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    
    // Smooth bell-like envelope (ADSR style exponential decay)
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02); // Quick Attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Long Decay/Release
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
}

function playChime(type) {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        if (type === "start") {
            // Ascending A Major Triad Bell Chord
            synthBell(440.00, now, 1.2, "sine");       // A4
            synthBell(554.37, now + 0.08, 1.2, "sine"); // C#5
            synthBell(659.25, now + 0.16, 1.2, "sine"); // E5
            synthBell(880.00, now + 0.24, 1.5, "sine"); // A5
        } 
        else if (type === "rest") {
            // Calming Dual-Tone Descending Chime
            synthBell(659.25, now, 0.8, "triangle");    // E5
            synthBell(493.88, now + 0.15, 1.2, "sine"); // B4
        } 
        else if (type === "complete") {
            // Triumphant Chord Sweep
            synthBell(261.63, now, 2.0, "sine");       // C4
            synthBell(329.63, now + 0.05, 2.0, "sine"); // E4
            synthBell(392.00, now + 0.10, 2.0, "sine"); // G4
            synthBell(523.25, now + 0.15, 2.5, "sine"); // C5
            synthBell(659.25, now + 0.20, 2.5, "sine"); // E5
            synthBell(1046.50, now + 0.25, 3.0, "sine"); // C6
        }
    } catch (e) {
        console.warn("Audio Synthesizer block/error:", e);
    }
}

/* ==========================================================================
   FORMATTING UTILITIES
   ========================================================================== */
function fmtMs(ms) {
    const ts = Math.floor(ms / 1000);
    const h = Math.floor(ts / 3600);
    const m = Math.floor((ts % 3600) / 60);
    const s = ts % 60;
    const millis = Math.floor(ms % 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

function fmtMsShort(ms) {
    const ts = Math.floor(ms / 1000);
    const h = Math.floor(ts / 3600);
    const m = Math.floor((ts % 3600) / 60);
    const s = ts % 60;
    const d = Math.floor((ms % 1000) / 100);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${d}`;
}

/* ==========================================================================
   PAGE ROUTING MANAGEMENT
   ========================================================================== */
const pages = {
    setup: document.getElementById("setup-page"),
    timer: document.getElementById("timer-page"),
    history: document.getElementById("history-page")
};

const navButtons = {
    setup: document.getElementById("nav-btn-setup"),
    timer: document.getElementById("nav-btn-timer"),
    history: document.getElementById("nav-btn-history")
};

function showPage(pageKey) {
    // Hide all pages, remove active states
    Object.keys(pages).forEach(key => {
        pages[key].classList.remove("active");
        navButtons[key].classList.remove("active");
    });
    
    // Show selected page
    pages[pageKey].classList.add("active");
    navButtons[pageKey].classList.add("active");
    
    // Trigger lifecycle events
    if (pageKey === "setup") {
        refreshRoutineOptions();
    } else if (pageKey === "history") {
        renderHistory();
    }
}

// Attach Nav Clicks
Object.keys(navButtons).forEach(key => {
    navButtons[key].addEventListener("click", () => {
        // Resume Audio context if blocked by browser autoplay rules
        getAudioContext();
        showPage(key);
    });
});

/* ==========================================================================
   SETUP PAGE CONTROLLER
   ========================================================================== */
const routineInput = document.getElementById("routine-input");
const routineList = document.getElementById("routine-list");
const exerciseRowsContainer = document.getElementById("exercise-rows-container");

function refreshRoutineOptions() {
    routineList.innerHTML = "";
    Object.keys(appData.templates).forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        routineList.appendChild(option);
    });
}

function loadRoutineFromInput() {
    const routineName = routineInput.value.trim();
    if (!routineName) return;
    
    const routine = appData.templates[routineName];
    exerciseRowsContainer.innerHTML = "";
    
    if (routine && routine.length > 0) {
        routine.forEach(ex => addExerciseRow(ex.name, ex.sets));
    } else {
        addExerciseRow("", 3);
    }
}

function addExerciseRow(name = "", sets = 3) {
    const row = document.createElement("div");
    row.className = "exercise-row";
    
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter Exercise Name (e.g. Push-ups)...";
    input.value = name;
    
    const setsCtrl = document.createElement("div");
    setsCtrl.className = "sets-control";
    
    const minusBtn = document.createElement("button");
    minusBtn.className = "sets-btn";
    minusBtn.textContent = "−";
    
    const setsVal = document.createElement("span");
    setsVal.className = "sets-val";
    setsVal.textContent = sets;
    
    const plusBtn = document.createElement("button");
    plusBtn.className = "sets-btn";
    plusBtn.textContent = "+";
    
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn-remove-row";
    removeBtn.textContent = "✕";
    
    // Bind button events
    minusBtn.addEventListener("click", () => {
        let current = parseInt(setsVal.textContent, 10);
        if (current > 1) setsVal.textContent = current - 1;
    });
    
    plusBtn.addEventListener("click", () => {
        let current = parseInt(setsVal.textContent, 10);
        if (current < 50) setsVal.textContent = current + 1;
    });
    
    removeBtn.addEventListener("click", () => {
        row.remove();
        if (exerciseRowsContainer.children.length === 0) {
            addExerciseRow("", 3);
        }
    });
    
    setsCtrl.appendChild(minusBtn);
    setsCtrl.appendChild(setsVal);
    setsCtrl.appendChild(plusBtn);
    
    row.appendChild(input);
    row.appendChild(setsCtrl);
    row.appendChild(removeBtn);
    
    exerciseRowsContainer.appendChild(row);
}

// Save Preset Action
document.getElementById("btn-save-preset").addEventListener("click", () => {
    const routineName = routineInput.value.trim();
    if (!routineName) {
        alert("Please enter a name for the routine preset.");
        return;
    }
    
    const exercises = [];
    const rows = exerciseRowsContainer.querySelectorAll(".exercise-row");
    rows.forEach(row => {
        const name = row.querySelector('input[type="text"]').value.trim();
        const sets = parseInt(row.querySelector(".sets-val").textContent, 10);
        if (name && sets > 0) {
            exercises.push({ name, sets });
        }
    });
    
    if (exercises.length === 0) {
        alert("Please add at least one exercise to save the preset.");
        return;
    }
    
    appData.templates[routineName] = exercises;
    saveStorageData();
    refreshRoutineOptions();
    alert(`Preset "${routineName}" saved successfully.`);
});

// Add Row Button
document.getElementById("btn-add-exercise").addEventListener("click", () => addExerciseRow("", 3));

// Start Workout
document.getElementById("btn-start-workout").addEventListener("click", () => {
    const exercises = [];
    const rows = exerciseRowsContainer.querySelectorAll(".exercise-row");
    rows.forEach(row => {
        const name = row.querySelector('input[type="text"]').value.trim();
        const sets = parseInt(row.querySelector(".sets-val").textContent, 10);
        if (name && sets > 0) {
            exercises.push({ name, sets });
        }
    });
    
    if (exercises.length === 0) {
        exercises.push({ name: "Custom Bodyweight Exercise", sets: 1 });
    }
    
    setupWorkoutTimer(exercises);
    showPage("timer");
});

// Routine Input handlers
routineInput.addEventListener("input", loadRoutineFromInput);
routineInput.addEventListener("change", loadRoutineFromInput);

/* ==========================================================================
   STOPWATCH TIMER PAGE CONTROLLER
   ========================================================================== */
let activeExercises = [];
let currentExIndex = 0;
let currentSetNum = 1;
let isResting = false;
let workoutActive = false;

let timerRunning = false;
let startTime = 0;
let elapsedTime = 0;
let lastSplitTime = 0;
let splitCounter = 0;
let timerIntervalId = null;
let recordedSplits = [];

const timerStatus = document.getElementById("timer-status");
const timerTime = document.getElementById("timer-time");
const timerLap = document.getElementById("timer-lap");
const splitsListContainer = document.getElementById("splits-list-container");

const btnStart = document.getElementById("btn-control-start");
const btnSplit = document.getElementById("btn-control-split");
const btnSave = document.getElementById("btn-control-save");
const btnReset = document.getElementById("btn-control-reset");

function setupWorkoutTimer(exercises) {
    activeExercises = exercises;
    currentExIndex = 0;
    currentSetNum = 1;
    isResting = false;
    workoutActive = true;
    recordedSplits = [];
    
    resetTimerState();
    updateWorkoutDisplayStatus();
}

function updateWorkoutDisplayStatus() {
    if (!workoutActive) {
        timerStatus.textContent = "Workout Complete";
        timerStatus.style.color = "hsl(var(--text-color))";
    } else if (isResting) {
        timerStatus.textContent = "Rest Period";
        timerStatus.style.color = "hsl(var(--warning))";
    } else {
        const current = activeExercises[currentExIndex];
        timerStatus.textContent = `${current.name} — Set ${currentSetNum}`;
        timerStatus.style.color = "hsl(var(--primary))";
    }

    const progressBadge = document.getElementById("splits-progress-badge");
    if (progressBadge) {
        const completedCount = recordedSplits.filter(s => s.isWorkSet).length;
        const totalCount = activeExercises.reduce((sum, ex) => sum + ex.sets, 0);
        progressBadge.textContent = `${completedCount} / ${totalCount} Sets`;
    }
}

function toggleTimer() {
    // If not active, create ad-hoc workout
    if (!workoutActive && !timerRunning && elapsedTime === 0) {
        setupWorkoutTimer([{ name: "Ad-Hoc Training", sets: 99 }]);
    }
    
    if (timerRunning) {
        // Pause stopwatch
        clearInterval(timerIntervalId);
        elapsedTime += Date.now() - startTime;
        timerRunning = false;
        
        btnStart.querySelector(".circle-btn-text").textContent = "Resume";
        const startIcon = btnStart.querySelector(".circle-btn-icon");
        if (startIcon) startIcon.textContent = "▶";
        btnStart.classList.remove("btn-danger");
        btnStart.classList.add("btn-success");
        
        btnSplit.disabled = true;
    } else {
        // Start/Resume stopwatch
        if (workoutActive && elapsedTime === 0) {
            playChime("start");
        }
        
        startTime = Date.now();
        timerIntervalId = setInterval(updateDisplayTime, 47); // Updates ~21 times a second
        timerRunning = true;
        
        btnStart.querySelector(".circle-btn-text").textContent = "Pause";
        const startIcon = btnStart.querySelector(".circle-btn-icon");
        if (startIcon) startIcon.textContent = "⏸";
        btnStart.classList.remove("btn-success");
        btnStart.classList.add("btn-danger");
        
        if (workoutActive) btnSplit.disabled = false;
        btnSave.disabled = false;
        btnReset.disabled = false;
    }
}

function updateDisplayTime() {
    if (!timerRunning) return;
    const passed = Date.now() - startTime + elapsedTime;
    timerTime.textContent = fmtMsShort(passed);
    
    const lap = passed - lastSplitTime;
    timerLap.textContent = fmtMs(lap);
}

function recordSplit() {
    if (!timerRunning || !workoutActive) return;
    
    splitCounter++;
    const passed = Date.now() - startTime + elapsedTime;
    const splitDur = passed - lastSplitTime;
    const currentLabel = timerStatus.textContent;
    const isWorkSet = !isResting;
    
    // Create DOM split element
    const row = document.createElement("div");
    row.className = isWorkSet ? "split-row split-row-work" : "split-row split-row-rest";
    
    const cellIdx = document.createElement("span");
    cellIdx.className = "split-cell cell-idx";
    cellIdx.textContent = `#${splitCounter}`;
    
    const cellLabel = document.createElement("span");
    cellLabel.className = "split-cell cell-label";
    cellLabel.textContent = currentLabel;
    
    const cellDur = document.createElement("span");
    cellDur.className = "split-cell cell-dur";
    cellDur.textContent = fmtMs(splitDur);
    
    const cellTot = document.createElement("span");
    cellTot.className = "split-cell cell-tot";
    cellTot.textContent = fmtMs(passed);
    
    row.appendChild(cellIdx);
    row.appendChild(cellLabel);
    row.appendChild(cellDur);
    row.appendChild(cellTot);
    
    const splitId = splitCounter;
    
    if (isWorkSet) {
        const cellReps = document.createElement("span");
        cellReps.className = "split-cell cell-reps";
        
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Reps";
        
        input.addEventListener("input", () => {
            const splitObj = recordedSplits.find(s => s.id === splitId);
            if (splitObj) splitObj.reps = input.value.trim();
        });
        
        cellReps.appendChild(input);
        row.appendChild(cellReps);
    } else {
        const cellDash = document.createElement("span");
        cellDash.className = "split-cell cell-dash";
        cellDash.textContent = "—";
        row.appendChild(cellDash);
    }
    
    // Prepend to display top row first
    splitsListContainer.insertBefore(row, splitsListContainer.firstChild);
    
    // Log in-memory
    recordedSplits.push({
        id: splitId,
        label: currentLabel,
        duration: fmtMs(splitDur),
        total: fmtMs(passed),
        isWorkSet: isWorkSet,
        reps: ""
    });
    
    // Core routine workflow state shift
    if (!isResting) {
        isResting = true;
        playChime("rest");
    } else {
        isResting = false;
        currentExIndex++;
        
        const maxSets = Math.max(...activeExercises.map(ex => ex.sets));
        let allDone = true;
        
        while (currentSetNum <= maxSets) {
            if (currentExIndex >= activeExercises.length) {
                currentExIndex = 0;
                currentSetNum++;
            }
            if (currentSetNum > maxSets) break;
            
            if (currentSetNum <= activeExercises[currentExIndex].sets) {
                allDone = false;
                break;
            } else {
                currentExIndex++;
            }
        }
        
        if (allDone) {
            workoutActive = false;
            btnSplit.disabled = true;
            toggleTimer(); // Pause stopwatch
            playChime("complete");
        } else {
            playChime("start");
        }
    }
    
    updateWorkoutDisplayStatus();
    lastSplitTime = passed;
}

function saveWorkoutSession() {
    if (elapsedTime === 0 && !timerRunning) return;
    if (timerRunning) toggleTimer(); // Force pause
    
    const summary = activeExercises.map(ex => `${ex.sets}× ${ex.name}`).join("  |  ");
    const finalTotal = fmtMs(elapsedTime);
    const dateObj = new Date();
    
    const dateDisplay = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + "  " + dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    const isoDate = dateObj.toISOString().split('T')[0];
    
    // Prepend session to history
    appData.history.unshift({
        isoDate,
        dateDisplay,
        totalTime: finalTotal,
        summary: summary,
        splits: [...recordedSplits]
    });
    
    saveStorageData();
    resetTimerState();
    showPage("history");
}

function resetTimerState() {
    if (timerIntervalId) clearInterval(timerIntervalId);
    timerRunning = false;
    elapsedTime = 0;
    lastSplitTime = 0;
    splitCounter = 0;
    
    timerTime.textContent = "00:00:00.0";
    timerLap.textContent = "00:00:00.000";
    
    btnStart.querySelector(".circle-btn-text").textContent = "Start";
    const startIcon = btnStart.querySelector(".circle-btn-icon");
    if (startIcon) startIcon.textContent = "▶";
    btnStart.classList.remove("btn-danger");
    btnStart.classList.add("btn-success");
    
    btnSplit.disabled = true;
    btnSave.disabled = true;
    btnReset.disabled = true;
    
    splitsListContainer.innerHTML = "";
    
    const progressBadge = document.getElementById("splits-progress-badge");
    if (progressBadge) {
        progressBadge.textContent = "0 / 0 Sets";
    }
}

btnStart.addEventListener("click", toggleTimer);
btnSplit.addEventListener("click", recordSplit);
btnSave.addEventListener("click", saveWorkoutSession);
btnReset.addEventListener("click", () => {
    if (confirm("Reset stopwatch? All active recorded splits will be cleared.")) {
        workoutActive = false;
        resetTimerState();
        timerStatus.textContent = "Ready to Start";
        timerStatus.style.color = "hsl(var(--primary))";
    }
});

/* ==========================================================================
   HISTORY PAGE CONTROLLER
   ========================================================================== */
const dateFrom = document.getElementById("filter-date-from");
const dateTo = document.getElementById("filter-date-to");
const historySessionsContainer = document.getElementById("history-sessions-container");

function setupPlaceholderEvents(input, placeholder) {
    input.addEventListener("focus", () => {
        if (input.value === placeholder) {
            input.value = "";
            input.style.color = "hsl(var(--text-color))";
        }
    });
    input.addEventListener("blur", () => {
        if (!input.value.trim()) {
            input.value = placeholder;
            input.style.color = "hsl(var(--text-dim))";
        }
    });
    // Set initial placeholder style
    if (!input.value.trim() || input.value === placeholder) {
        input.value = placeholder;
        input.style.color = "hsl(var(--text-dim))";
    }
}

setupPlaceholderEvents(dateFrom, "YYYY-MM-DD");
setupPlaceholderEvents(dateTo, "YYYY-MM-DD");

function renderHistory() {
    historySessionsContainer.innerHTML = "";
    
    let filteredHistory = [...appData.history];
    const fromVal = dateFrom.value.trim();
    const toVal = dateTo.value.trim();
    
    if (fromVal && fromVal !== "YYYY-MM-DD") {
        filteredHistory = filteredHistory.filter(s => s.isoDate >= fromVal);
    }
    if (toVal && toVal !== "YYYY-MM-DD") {
        filteredHistory = filteredHistory.filter(s => s.isoDate <= toVal);
    }
    
    if (filteredHistory.length === 0) {
        const placeholder = document.createElement("div");
        placeholder.className = "empty-history-placeholder";
        placeholder.innerHTML = "No saved workouts found.<br>Adjust your filters or complete a workout to see entries!";
        historySessionsContainer.appendChild(placeholder);
        return;
    }
    
    filteredHistory.forEach(session => {
        const card = document.createElement("div");
        card.className = "glass-card session-card";
        
        const main = document.createElement("div");
        main.className = "session-main";
        
        const header = document.createElement("div");
        header.className = "session-header";
        
        const date = document.createElement("span");
        date.className = "session-date";
        date.textContent = session.dateDisplay;
        
        const duration = document.createElement("span");
        duration.className = "session-time";
        duration.textContent = session.totalTime;
        
        header.appendChild(date);
        header.appendChild(duration);
        
        const summary = document.createElement("div");
        summary.className = "session-summary";
        summary.textContent = `Routine: ${session.summary}`;
        
        const completedCount = session.splits.filter(s => s.isWorkSet).length;
        const stats = document.createElement("div");
        stats.className = "session-stats";
        stats.innerHTML = `Completed Working Sets: <span class="stats-count">${completedCount}</span>`;
        
        main.appendChild(header);
        main.appendChild(summary);
        main.appendChild(stats);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn-delete-session";
        deleteBtn.textContent = "Delete";
        
        deleteBtn.addEventListener("click", () => {
            if (confirm("Delete this workout permanently?")) {
                const targetIdx = appData.history.indexOf(session);
                if (targetIdx !== -1) {
                    appData.history.splice(targetIdx, 1);
                    saveStorageData();
                    renderHistory();
                }
            }
        });
        
        card.appendChild(main);
        card.appendChild(deleteBtn);
        historySessionsContainer.appendChild(card);
    });
}

// Filter Button Click
document.getElementById("btn-filter-history").addEventListener("click", renderHistory);

// Export CSV Action
document.getElementById("btn-export-csv").addEventListener("click", () => {
    let list = [...appData.history];
    const fromVal = dateFrom.value.trim();
    const toVal = dateTo.value.trim();
    
    if (fromVal && fromVal !== "YYYY-MM-DD") {
        list = list.filter(s => s.isoDate >= fromVal);
    }
    if (toVal && toVal !== "YYYY-MM-DD") {
        list = list.filter(s => s.isoDate <= toVal);
    }
    
    if (list.length === 0) {
        alert("No workout records available in this range to export.");
        return;
    }
    
    // Generate CSV contents
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Name of Set,Duration,Reps\r\n";
    
    list.forEach(session => {
        session.splits.forEach(split => {
            const cleanLabel = split.label.replace(/"/g, '""');
            csvContent += `"${session.dateDisplay}","${cleanLabel}","${split.duration}","${split.reps}"\r\n`;
        });
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `workout_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
loadStorageData();

// Set initial routine row setup
routineInput.value = "Pull-up Day";
loadRoutineFromInput();
refreshRoutineOptions();
showPage("setup");
