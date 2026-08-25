/* ============ PLAN PRESETS & DATA ============ */
const RECOVERY_OPTIMIZED_PLAN = [
  { id:'mon', num:1, name:'Recovery Pull — Pull Power & Core',
    goal:'Build pulling strength & lat width with 1 RIR recovery focus (35-40 min max).',
    warmup:['Arm circles ×10 each direction', 'Dead hang ×20 seconds', 'Scapular pull-ups ×3'],
    main:[
      {id:'mon_pullups', name:'Pull-ups', sets:5, target:'2 reps', note:'1 RIR (Stop 1 rep before failure)', unit:'reps', rest:90},
      {id:'mon_negatives', name:'Negative Pull-ups', sets:2, target:'3 reps', note:'6–8 sec lowering', unit:'reps', rest:90},
      {id:'mon_bandrows', name:'Band Rows', sets:3, target:'10–12 reps', unit:'reps', rest:60},
    ],
    skill:[
      {id:'mon_kneeraises', name:'Hanging Knee Raises', sets:3, target:'8–10 reps', unit:'reps', rest:60},
    ],
    finisher:[],
    cue:'Never train to failure. Leave 1 rep in reserve on pull-ups.'
  },
  { id:'tue', num:2, name:'Recovery Legs — Hip Drive & Quad Power',
    goal:'Build leg & glute power without overloading recovery or CNS.',
    warmup:['Hip circles ×10', 'Leg swings ×10', 'Bodyweight squats ×5'],
    main:[
      {id:'tue_bulgarian', name:'Bulgarian Split Squats', sets:3, target:'8–10 reps/leg', note:'Rear foot elevated', unit:'reps', rest:75},
      {id:'tue_hipthrusts', name:'Band Hip Thrusts', sets:3, target:'12–15 reps', unit:'reps', rest:60},
      {id:'tue_bandsquats', name:'Band Squats', sets:2, target:'15 reps', unit:'reps', rest:60},
    ],
    skill:[],
    finisher:[],
    cue:'Controlled tempo. Feel fresh when finishing.'
  },
  { id:'wed', num:3, name:'Active Recovery & Mobility', recovery:true,
    goal:'Active circulation, leg mobility, and mental reset for study performance.',
    routine:['Walk 30–45 minutes', 'Hamstring stretch', 'Hip flexor stretch', 'Passive hang 20–30 seconds'],
    reflection:[
      {id:'walk_mins', label:'Walk duration (minutes)?'},
      {id:'soreness', label:'Muscular soreness (1-10)?'}
    ],
    cue:'Recovery is where study focus and adaptation occur.'
  },
  { id:'thu', num:4, name:'Recovery Push — Pushing & Overhead Strength',
    goal:'Develop push strength & shoulder stability with low joint stress.',
    warmup:['Wrist circles ×20 seconds', 'Arm circles ×10', 'Scapular push-ups ×5'],
    main:[
      {id:'thu_deep_pushups', name:'Deep Parallette Push-ups', sets:3, target:'8–12 reps', unit:'reps', rest:60},
      {id:'thu_pike_pushups', name:'Pike Push-ups', sets:3, target:'6–8 reps', unit:'reps', rest:60},
      {id:'thu_band_press', name:'Band Overhead Press', sets:2, target:'12 reps', unit:'reps', rest:60},
    ],
    skill:[],
    finisher:[],
    cue:'Focus on deep stretch and scapular control.'
  },
  { id:'fri', num:5, name:'Complete Rest — Brain & Body Recovery', recovery:true,
    goal:'Complete rest day for full neural recovery during intense study phase.',
    routine:['Complete rest from workout', 'Light walking / passive stretch (optional)'],
    reflection:[
      {id:'study_focus', label:'Study performance & energy (1-10)?'}
    ],
    cue:'Total rest restores study stamina and muscle growth.'
  },
  { id:'sat', num:6, name:'Pull Volume — Submaximal Pulling',
    goal:'Submaximal volume for pulling gains without fatigue accumulation.',
    warmup:['Dead hang ×20 seconds', 'Scapular pull-ups ×3'],
    main:[
      {id:'sat_pullups', name:'Pull-ups', sets:4, target:'2 reps', note:'Clean technique, 1 RIR', unit:'reps', rest:90},
      {id:'sat_rows', name:'Inverted Rows', sets:3, target:'10 reps', unit:'reps', rest:60},
      {id:'sat_pulldowns', name:'Band Straight-arm Pulldowns', sets:2, target:'15 reps', unit:'reps', rest:60},
    ],
    skill:[],
    finisher:['1 round only (if fresh): Push-ups ×10 & Squats ×15'],
    cue:'Stay fresh. 1 round of finisher only if feeling great.'
  },
  { id:'sun', num:7, name:'Complete Rest & Weekly Reflection', recovery:true,
    goal:'Evaluate progress, rest completely, and prepare for next week.',
    routine:['Complete rest', 'Light walk or stretching'],
    reflection:[
      {id:'pullup_max', label:'Pull-up Max Reps (Retest)?'},
      {id:'study_perf', label:'Weekly Study Performance (1-10)?'},
      {id:'waist', label:'Waist Measurement (cm/in)?'}
    ],
    cue:'Reflect on study consistency and overall energy.'
  }
];

const ATHLETIC_CUT_WEEK12_PLAN = [
  { id:'mon', num:1, name:'Pull Power + Core Stability',
    goal:'Increase pulling strength, back width, and core stability.',
    warmup:['Dead hang — 30s (x2 rounds)','Scapular pull-ups — x8 (x2 rounds)','Band pull-aparts — x15 (x2 rounds)'],
    main:[
      {id:'mon_pullups', name:'Pull-ups', sets:6, target:'3–5 reps', note:'Full ROM, controlled', unit:'reps', rest:90},
      {id:'mon_negatives', name:'Negative Pull-ups', sets:3, target:'3 reps', note:'6–8s controlled descent', unit:'reps', rest:90},
      {id:'mon_bandrows', name:'Band Rows', sets:3, target:'12–15 reps', unit:'reps', rest:90},
    ],
    skill:[
      {id:'mon_kneeraises', name:'Hanging Knee Raises', sets:4, target:'10–12 reps', unit:'reps', rest:60},
      {id:'mon_hollowhold', name:'Hollow Body Hold', sets:4, target:'30–45s', unit:'sec', rest:60},
    ],
    finisher:['3 rounds — Mountain Climbers x30s','3 rounds — High Knees x30s','Rest 30s between rounds'],
    cue:'Explode up. Hold the hollow body tight.'
  },
  { id:'tue', num:2, name:'Legs & Glutes (Hip Power)',
    goal:'Develop legs, glutes, and hip drive to support stamina and explosive power.',
    warmup:['Leg swings + Hip circles','Bodyweight Squats — x15'],
    main:[
      {id:'tue_bulgarian', name:'Bulgarian Split Squats', sets:4, target:'10–12/leg', note:'Rear foot on chair or low parallettes', unit:'reps', rest:75},
      {id:'tue_hipthrusts', name:'Band Hip Thrusts', sets:4, target:'15–20 reps', note:'Band around knees', unit:'reps', rest:60},
      {id:'tue_bandrdl', name:'Single-leg Romanian Deadlifts', sets:3, target:'10–12/leg', note:'With band', unit:'reps', rest:60},
      {id:'tue_bandsquats', name:'Band Squats', sets:3, target:'20 reps', note:'Slow tempo', unit:'reps', rest:60},
    ],
    skill:[
      {id:'tue_lsit', name:'L-sit / Tuck Hold on parallettes', sets:5, target:'15–25s', unit:'sec', rest:60},
    ],
    finisher:['4 rounds — Jump Squats x12','4 rounds — Glute Bridges (bodyweight) x15','Rest 30s between rounds'],
    cue:'Drive through the heels. Squeeze the glutes at the top.'
  },
  { id:'wed', num:3, name:'Rest or Active Recovery', recovery:true,
    goal:'Give your muscles rest to grow and keep active with steps.',
    routine:['8k+ steps walk','Light stretching / mobility'],
    reflection:[
      {id:'steps', label:'Total steps today?'},
      {id:'soreness', label:'Soreness level (1-10)?'}
    ],
    cue:'Rest is where the muscle grows and fat burns.'
  },
  { id:'thu', num:4, name:'Push + Athletic Shoulders',
    goal:'Build pushing power, shoulder stability, and core endurance.',
    warmup:['Wrist prep + Scapular push-ups — x12','Band dislocates — x12'],
    main:[
      {id:'thu_deep_pushups', name:'Deep Parallettes Push-ups', sets:4, target:'10–12 reps', unit:'reps', rest:60},
      {id:'thu_pike_pushups', name:'Pike Push-ups', sets:4, target:'8–10 reps', unit:'reps', rest:60},
      {id:'thu_band_press', name:'Band Overhead Press', sets:3, target:'12–15 reps', unit:'reps', rest:60},
    ],
    skill:[
      {id:'thu_side_plank', name:'Side Plank', sets:3, target:'45s/side', unit:'sec', rest:45},
      {id:'thu_ab_vacuum', name:'Ab Vacuum', sets:3, target:'40s', unit:'sec', rest:45},
    ],
    finisher:['3 rounds — Burpees x8','3 rounds — Plank Shoulder Taps x20','Rest 45s between rounds'],
    cue:'Push deep on parallettes. Engage core fully.'
  },
  { id:'fri', num:5, name:'Pull Volume + Metabolic Conditioning',
    goal:'Build lats width, pulling volume, and high-density full body conditioning.',
    warmup:['Dead hang — 40s','Band pull-aparts'],
    main:[
      {id:'fri_pullups', name:'Pull-ups', sets:5, target:'AMRAP', note:'Stop 1–2 reps before failure', unit:'reps', rest:120},
      {id:'fri_rows', name:'Inverted Rows (under bar)', sets:4, target:'10–12 reps', unit:'reps', rest:75},
      {id:'fri_pulldowns', name:'Band Straight-Arm Pulldowns', sets:3, target:'15 reps', unit:'reps', rest:60},
    ],
    skill:[],
    finisher:['3-4 rounds — Push-ups x10','3-4 rounds — Squats x20','3-4 rounds — Hanging Knee Raises x10','Rest 60–75s between rounds'],
    cue:'High pull volume builds shape. Power through the metabolic circuit.'
  },
  { id:'sat', num:6, name:'Light Legs & Active Recovery', recovery:true,
    goal:'Active recovery session focusing on hip mobility and light activation.',
    routine:['30–40 min brisk walk','Hip mobility + Pigeon stretch','Light band glute work','Passive hang — 2 × 60s'],
    reflection:[
      {id:'walk_time', label:'Brisk walk duration (mins)?'},
      {id:'hips_feel', label:'How do your hips feel (1-10)?'}
    ],
    cue:'Consistency in recovery builds performance.'
  },
  { id:'sun', num:7, name:'Full Rest + Reflection', recovery:true,
    goal:'Reflect on your weekly progress, measure waist, and fully recharge.',
    routine:['Light walk, stretch, or mobility'],
    reflection:[
      {id:'pullup_max', label:'Pull-up max reps?'},
      {id:'waist', label:'Waist measurement (in/cm)?'},
      {id:'energy_bed', label:'Energy levels / Stamina (1-10)?'},
      {id:'morning_wood', label:'Recovery quality (1-10)?'}
    ],
    cue:'Progress is measured across all indicators of health.'
  }
];

const BUILTIN_PLANS = {
  recovery_v2: {
    name: "Recovery-Optimized Plan",
    data: RECOVERY_OPTIMIZED_PLAN
  },
  athletic_cut_w12: {
    name: "Athletic Cut — Week 12",
    data: ATHLETIC_CUT_WEEK12_PLAN
  }
};

const ALL_PLANS = { ...BUILTIN_PLANS };

function isCustomPlan(planId) {
  return !(planId in BUILTIN_PLANS);
}

let activePlanId = 'recovery_v2';
function getCurrentPlan() {
  return (ALL_PLANS[activePlanId] || ALL_PLANS.recovery_v2 || Object.values(ALL_PLANS)[0]).data;
}

function updatePlanSelector() {
  const sel = document.getElementById('planSelector');
  const delBtn = document.getElementById('deletePlanBtn');
  if(!sel) return;
  sel.innerHTML = '';
  Object.entries(ALL_PLANS).forEach(([key, plan]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = plan.name;
    if(key === activePlanId) opt.selected = true;
    sel.appendChild(opt);
  });

  if (delBtn) {
    const currentPlan = ALL_PLANS[activePlanId];
    const canDelete = isCustomPlan(activePlanId);
    delBtn.disabled = !canDelete;
    if (canDelete) {
      delBtn.title = `Delete active plan: "${currentPlan ? currentPlan.name : 'Custom Plan'}"`;
      delBtn.setAttribute('aria-label', `Delete active plan: "${currentPlan ? currentPlan.name : 'Custom Plan'}"`);
    } else {
      delBtn.title = "Built-in preset plans cannot be deleted";
      delBtn.setAttribute('aria-label', "Built-in preset plans cannot be deleted");
    }
  }
}

const WEEKDAY_ORDER = ['mon','tue','wed','thu','fri','sat','sun'];

/* ============ STATE / STORAGE ============ */
const LS_LOGS = 'athletic_cut_week12_logs';

function todayISO(){ return new Date().toISOString().slice(0,10); }
function todayWeekdayId(){
  const jsDay = new Date().getDay();
  return WEEKDAY_ORDER[(jsDay+6)%7];
}

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

function loadLogs(){
  try {
    const saved = localStorage.getItem(LS_LOGS);
    if (!saved) return [];
    return JSON.parse(saved) || [];
  } catch (e) {
    console.error("Failed to parse logs from localStorage:", e);
    return [];
  }
}

function saveLogs(logs){
  try {
    localStorage.setItem(LS_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error("Failed to save logs to localStorage:", e);
    alert("Warning: Browser storage limit exceeded.");
  }
}

let selectedDayId = todayWeekdayId();
let draft = {};

function getDay(id){
  const plan = getCurrentPlan();
  return plan.find(d=>d.id===id) || plan[0];
}

/* ============ REST TIMER STATE ============ */
let restState = { active:false, remaining:0, total:0, nextLabel:'', intervalId:null };

function clearRestTimer(){
  if(restState.intervalId) clearInterval(restState.intervalId);
  restState = { active:false, remaining:0, total:0, nextLabel:'', intervalId:null };
}

function fmtTime(sec){
  const m = Math.floor(sec/60), s = sec%60;
  return m + ':' + String(s).padStart(2,'0');
}

function beep(){
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    [0, 0.18].forEach(delay => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.setValueAtTime(880, now + delay);
      g.gain.setValueAtTime(0, now + delay);
      g.gain.linearRampToValueAtTime(0.16, now + delay + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.14);
      o.start(now + delay);
      o.stop(now + delay + 0.14);
    });
  } catch(e) {
    console.warn("Failed to play alert beep:", e);
  }
}

function vibrate(){ if(navigator.vibrate) navigator.vibrate([200,80,200]); }

function updateRestDisplay(){
  const el = document.getElementById('restCountdown');
  if(el) el.textContent = fmtTime(Math.max(0, restState.remaining));
}

function startRest(seconds, nextLabel){
  clearRestTimer();
  restState.active = true;
  restState.remaining = seconds;
  restState.total = seconds;
  restState.nextLabel = nextLabel;
  restState.intervalId = setInterval(()=>{
    restState.remaining--;
    updateRestDisplay();
    if(restState.remaining <= 0){
      clearInterval(restState.intervalId);
      restState.intervalId = null;
      restState.active = false;
      beep(); vibrate();
      renderTrain();
    }
  }, 1000);
  renderTrain();
}

/* ============ CHAIN NAV ============ */
function renderChain(){
  const wrap = document.getElementById('chainWrap');
  const logs = loadLogs();
  const today = todayISO();
  const loggedTodayDayIds = new Set(logs.filter(l=>l.date===today).map(l=>l.dayId));
  let html = '<div class="chain">';
  const plan = getCurrentPlan();
  
  plan.forEach((d,i)=>{
    const isToday = d.id === todayWeekdayId();
    const isSelected = d.id === selectedDayId;
    const isDone = loggedTodayDayIds.has(d.id);
    let cls = 'node-dot';
    if(isDone) cls += ' done';
    if(isToday) cls += ' today';
    if(isSelected) cls += ' selected';
    
    if(i > 0){
      html += `<div class="chain-line-wrap ${loggedTodayDayIds.has(plan[i-1].id) ? 'filled':''}"></div>`;
    }
    html += `<div class="chain-node" data-day="${d.id}">
      <div class="${cls}">${isDone ? '✓' : d.num}</div>
      <div class="node-label">${d.id.toUpperCase()}</div>
    </div>`;
  });
  html += '</div>';
  wrap.innerHTML = html;
  
  wrap.querySelectorAll('.chain-node').forEach(el=>{
    el.addEventListener('click', ()=>{
      const dayId = el.dataset.day;
      if(dayId === selectedDayId) return;
      clearRestTimer();
      selectedDayId = dayId;
      draft = {};
      renderAll();
    });
  });
}

/* ============ GUIDED FLOW ============ */
function ensureDraft(ex){
  if(!draft[ex.id]) draft[ex.id] = Array.from({length: ex.sets}, ()=>({value:'', rpe:''}));
}

function buildQueue(exercises){
  const queue = [];
  exercises.forEach(ex=>{
    for(let s=1; s<=ex.sets; s++){
      queue.push({ ex, setNum:s });
    }
  });
  return queue;
}

function findCurrentStep(phases){
  for(const phase of phases){
    const queue = buildQueue(phase.exercises);
    for(let idx=0; idx<queue.length; idx++){
      const item = queue[idx];
      ensureDraft(item.ex);
      const val = draft[item.ex.id][item.setNum-1].value;
      if(val === '' || val === null || val === undefined){
        const next = queue[idx+1] || null;
        return { phase, queue, item, idx, next, phaseIdx: phases.indexOf(phase) };
      }
    }
  }
  return null;
}

function parseTargetNumber(target){
  const m = String(target).match(/^\d+/);
  return m ? m[0] : '';
}

function renderGuidedSection(day){
  const phases = [
    { label:'Main Workout', exercises: day.main || [] },
    { label:'Skill Work', exercises: day.skill || [] },
  ].filter(p => p.exercises.length);

  if(!phases.length) return '';

  phases.forEach(p => p.exercises.forEach(ensureDraft));

  if(restState.active){
    return `<div class="section-label">Resting Period</div>
      <div class="rest-card">
        <div class="rest-label">Rest Countdown</div>
        <div class="rest-countdown mono" id="restCountdown">${fmtTime(restState.remaining)}</div>
        <div class="rest-next">Up next: ${restState.nextLabel}</div>
        <div class="rest-controls">
          <button class="rest-adj" data-adj="-15">−15s</button>
          <button class="rest-skip" id="skipRestBtn">Skip</button>
          <button class="rest-adj" data-adj="15">+15s</button>
        </div>
      </div>`;
  }

  const current = findCurrentStep(phases);

  if(!current){
    return `<div class="section-label">Main + Skill Work</div>
      <div class="complete-card">
        <div class="tick">✓</div>
        <div class="msg"><b>All sets logged!</b><br>Main workout and skill work complete for today.</div>
      </div>`;
  }

  const { phase, item, next, phaseIdx } = current;
  const ex = item.ex;
  const setNum = item.setNum;
  const rowIdx = setNum - 1;
  const s = draft[ex.id][rowIdx];
  const placeholder = parseTargetNumber(ex.target) || '0';

  let nextLabel = 'Section complete';
  if(next){
    nextLabel = `${next.ex.name} — set ${next.setNum}`;
  } else {
    if(phaseIdx < phases.length - 1) nextLabel = `${phases[phaseIdx+1].label} begins`;
  }
  const restSeconds = ex.rest || 60;

  return `<div class="section-label">${phase.label}</div>
    <div class="guided-card">
      <div class="guided-meta">
        <div class="phase-tag">${phase.label}</div>
        <div class="round-tag">Set ${setNum} of ${ex.sets}</div>
      </div>
      <div class="guided-ex-name">${ex.name}</div>
      <div class="guided-ex-target">Target: ${ex.sets} × ${ex.target}</div>
      ${ex.note ? `<div class="guided-ex-note">💡 ${ex.note}</div>` : ''}
      <div class="guided-set-row">
        <div class="stepper lg">
          <button type="button" data-act="dec" data-ex="${ex.id}" data-i="${rowIdx}">–</button>
          <input type="number" inputmode="numeric" data-ex="${ex.id}" data-i="${rowIdx}" data-field="value" value="${s.value}" placeholder="${placeholder}">
          <button type="button" data-act="inc" data-ex="${ex.id}" data-i="${rowIdx}">+</button>
        </div>
        <div class="set-unit">${ex.unit}</div>
        <select class="rpe-select" data-ex="${ex.id}" data-i="${rowIdx}" data-field="rpe">
          <option value="">RPE</option>
          <option value="easy" ${s.rpe==='easy'?'selected':''}>Easy</option>
          <option value="moderate" ${s.rpe==='moderate'?'selected':''}>Moderate</option>
          <option value="hard" ${s.rpe==='hard'?'selected':''}>Hard</option>
        </select>
      </div>
      <button class="log-rest-btn" id="logRestBtn" data-ex="${ex.id}" data-i="${rowIdx}" data-rest="${restSeconds}" data-nextlabel="${encodeURIComponent(nextLabel)}">Log Set &amp; Start Rest (${restSeconds}s)</button>
    </div>`;
}

function wireGuidedEvents(){
  const logBtn = document.getElementById('logRestBtn');
  if(logBtn){
    logBtn.addEventListener('click', ()=>{
      const exId = logBtn.dataset.ex, i = +logBtn.dataset.i;
      const val = draft[exId][i].value;
      if(val === '' || val === null || val === undefined){
        showToast('Enter reps or weight first');
        return;
      }
      const nextLabel = decodeURIComponent(logBtn.dataset.nextlabel || '');
      startRest(+logBtn.dataset.rest, nextLabel);
    });
  }
  const skipBtn = document.getElementById('skipRestBtn');
  if(skipBtn) skipBtn.addEventListener('click', ()=>{ clearRestTimer(); renderTrain(); });
  document.querySelectorAll('.rest-adj').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const adj = +btn.dataset.adj;
      restState.remaining = Math.max(0, restState.remaining + adj);
      restState.total = Math.max(restState.total, restState.remaining);
      updateRestDisplay();
    });
  });
}

/* ============ CHECKLIST ITEMS ============ */
function makeCheckItem(text, key){
  draft.checks = draft.checks || {};
  const checked = !!draft.checks[key];
  return `<div class="check-item ${checked?'checked':''}" data-check="${key}">
    <div class="box">${checked?'✓':''}</div><div class="label">${text}</div>
  </div>`;
}

/* ============ TRAIN VIEW ============ */
function renderTrain(){
  const day = getDay(selectedDayId);
  const el = document.getElementById('trainView');
  let html = `<div class="day-header-card">
    <div class="day-badge">DAY ${day.num}</div>
    <div class="day-title">${day.name}</div>
    <div class="day-goal">${day.goal}</div>
  </div>`;

  if(day.recovery){
    html += `<div class="section-label">Recovery Routine</div>`;
    day.routine.forEach((r,i)=> html += makeCheckItem(r, 'routine_'+i));
    html += `<div class="section-label">Weekly Reflection</div><div class="reflect">`;
    draft.reflect = draft.reflect || {};
    day.reflection.forEach(r=>{
      html += `<label>${r.label}</label><input type="text" data-reflect="${r.id}" value="${draft.reflect[r.id]||''}">`;
    });
    html += `</div>`;
  } else {
    if(day.warmup && day.warmup.length){
      html += `<div class="section-label">Warm-Up</div>`;
      day.warmup.forEach((w,i)=> html += makeCheckItem(w, 'warmup_'+i));
    }

    html += renderGuidedSection(day);

    if(day.skillChoice){
      html += `<div class="section-label">Skill Work — Choose One</div>`;
      day.skillChoice.forEach((s,i)=> html += makeCheckItem(s + ' (10 min)', 'skillchoice_'+i));
    }
    if(day.finisher && day.finisher.length){
      html += `<div class="section-label">Finisher Circuit</div>`;
      day.finisher.forEach((f,i)=> html += makeCheckItem(f, 'finisher_'+i));
    }
  }

  if(day.cue) html += `<div class="cue">⚡ "${day.cue}"</div>`;

  html += `<div class="save-container">
    <button class="save-btn" id="inlineSaveBtn">Save Session Log</button>
  </div>`;

  el.innerHTML = html;
  wireTrainEvents();
  wireGuidedEvents();
}

function wireTrainEvents(){
  document.querySelectorAll('.stepper button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const exId = btn.dataset.ex, i = +btn.dataset.i, act = btn.dataset.act;
      const cur = parseFloat(draft[exId][i].value) || 0;
      draft[exId][i].value = act==='inc' ? cur+1 : Math.max(0, cur-1);
      renderTrain();
    });
  });
  document.querySelectorAll('.stepper input[data-field="value"]').forEach(inp=>{
    inp.addEventListener('input', ()=>{
      draft[inp.dataset.ex][+inp.dataset.i].value = inp.value;
    });
  });
  document.querySelectorAll('.rpe-select').forEach(sel=>{
    sel.addEventListener('change', ()=>{
      draft[sel.dataset.ex][+sel.dataset.i].rpe = sel.value;
    });
  });
  document.querySelectorAll('.check-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      const key = item.dataset.check;
      draft.checks = draft.checks || {};
      draft.checks[key] = !draft.checks[key];
      renderTrain();
    });
  });
  document.querySelectorAll('[data-reflect]').forEach(inp=>{
    inp.addEventListener('input', ()=>{
      draft.reflect = draft.reflect || {};
      draft.reflect[inp.dataset.reflect] = inp.value;
    });
  });

  const inlineSaveBtn = document.getElementById('inlineSaveBtn');
  if(inlineSaveBtn) inlineSaveBtn.addEventListener('click', saveSession);
}

function saveSession(){
  const day = getDay(selectedDayId);
  const exercises = {};
  (day.main||[]).concat(day.skill||[]).forEach(ex=>{
    if(draft[ex.id]){
      const sets = draft[ex.id].filter(s=>s.value!=='' && s.value!=null);
      if(sets.length) exercises[ex.id] = { name: ex.name, unit: ex.unit, sets };
    }
  });
  const today = todayISO();
  const entry = {
    date: today,
    dayId: selectedDayId,
    dayName: day.name,
    exercises,
    checks: draft.checks || {},
    reflect: draft.reflect || {},
    timestamp: Date.now()
  };
  let logs = loadLogs();
  logs = logs.filter(l => !(l.dayId === selectedDayId && l.date === today));
  logs.push(entry);
  saveLogs(logs);
  clearRestTimer();
  draft = {};
  showToast('Session saved');
  renderAll();
}

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 1800);
}

/* ============ HISTORY VIEW ============ */
let charts = {};
window.deleteCalisthenicsSession = function(dayId, date) {
  if (confirm(`Delete session log for ${dayId.toUpperCase()} on ${date}?`)) {
    let logs = loadLogs();
    logs = logs.filter(l => !(l.dayId === dayId && l.date === date));
    saveLogs(logs);
    showToast('Session deleted');
    renderAll();
  }
};

function renderHistory(){
  const el = document.getElementById('historyView');
  const logs = loadLogs();

  const uniqueDates = [...new Set(logs.map(l=>l.date))].sort();
  const totalSessions = logs.length;

  let streak = 0;
  {
    const todayStr = todayISO();
    let d = new Date();
    if(!uniqueDates.includes(todayStr)){
      d.setDate(d.getDate()-1);
    }
    while(true){
      const iso = d.toISOString().slice(0,10);
      if(uniqueDates.includes(iso)){ streak++; d.setDate(d.getDate()-1); }
      else break;
    }
  }

  let html = `<div class="streak-strip">
    <div class="streak-box"><div class="streak-num mono">${totalSessions}</div><div class="streak-label">Sessions</div></div>
    <div class="streak-box"><div class="streak-num mono">${streak}</div><div class="streak-label">Day Streak</div></div>
    <div class="streak-box"><div class="streak-num mono">${uniqueDates.length}</div><div class="streak-label">Active Days</div></div>
  </div>`;

  const allExercises = [];
  getCurrentPlan().forEach(day=>{ (day.main||[]).concat(day.skill||[]).forEach(ex=> allExercises.push(ex)); });
  const exWithData = allExercises.filter(ex => logs.some(l => l.exercises && l.exercises[ex.id]));

  if(exWithData.length === 0){
    html += `<div class="hist-empty">No sessions logged yet for this plan.<br>Complete a workout on the Train tab to see progress telemetry here.</div>`;
  } else {
    if (typeof Chart === 'undefined') {
      html += `<div style="color:var(--text-dim); font-size:13px; text-align:center; padding: 24px; background:var(--surface); border:1px solid var(--border); border-radius:14px; margin-bottom: 20px;">
        Chart library (Chart.js) failed to load. Progress graphs are temporarily unavailable.
      </div>`;
    } else {
      html += `<div class="section-label">Performance Telemetry By Exercise</div>`;
      exWithData.forEach(ex=>{
        html += `<div class="hist-ex">
          <div class="hist-ex-name">${ex.name}</div>
          <div class="hist-ex-meta">Target: ${ex.sets} × ${ex.target}</div>
          <div class="chart-wrap"><canvas id="chart_${ex.id}"></canvas></div>
        </div>`;
      });
    }
  }

  // Recent Workout Logs
  html += `<div class="section-label" style="margin-top: 30px;">Recent Workout Logs &amp; Reflections</div>`;
  if (logs.length === 0) {
    html += `<div class="hist-empty">No workout sessions logged yet.</div>`;
  } else {
    const sortedLogs = [...logs].sort((a,b) => b.timestamp - a.timestamp);
    sortedLogs.forEach(log => {
      const dateDisplay = log.date;
      const dayName = log.dayName || log.dayId;
      
      let exHtml = '';
      if (log.exercises && Object.keys(log.exercises).length > 0) {
        exHtml += '<div style="margin-top: 10px; font-size:12px; color:var(--text);">';
        exHtml += '<b style="color:var(--accent); text-transform:uppercase; letter-spacing:0.04em;">Logged Performance:</b>';
        exHtml += '<div style="margin-left: 8px; display:flex; flex-direction:column; gap:4px; margin-top:6px;">';
        Object.entries(log.exercises).forEach(([exId, data]) => {
          const setStrings = data.sets.map((s, sIdx) => `S${sIdx+1}: ${s.value}${data.unit === 'sec' ? 's' : ''} (${s.rpe || 'N/A'})`);
          exHtml += `<div>• <b>${data.name}:</b> ${setStrings.join(', ')}</div>`;
        });
        exHtml += '</div></div>';
      }
      
      let checkHtml = '';
      if (log.checks && Object.keys(log.checks).length > 0) {
        const checkedLabels = [];
        const dayPlan = getDay(log.dayId);
        if (dayPlan) {
          if (dayPlan.warmup) {
            dayPlan.warmup.forEach((w, i) => {
              if (log.checks['warmup_'+i]) checkedLabels.push(w.split(' — ')[0]);
            });
          }
          if (dayPlan.finisher) {
            dayPlan.finisher.forEach((f, i) => {
              if (log.checks['finisher_'+i]) checkedLabels.push(f.split(' — ')[0]);
            });
          }
          if (dayPlan.routine) {
            dayPlan.routine.forEach((r, i) => {
              if (log.checks['routine_'+i]) checkedLabels.push(r.split(' — ')[0]);
            });
          }
        }
        if (checkedLabels.length > 0) {
          checkHtml += `<div style="margin-top: 8px; font-size:12px; color:var(--text-dim);">`;
          checkHtml += `<b>Checklist Done:</b> ${checkedLabels.join(', ')}`;
          checkHtml += `</div>`;
        }
      }
      
      let reflectHtml = '';
      if (log.reflect && Object.keys(log.reflect).length > 0) {
        reflectHtml += '<div style="margin-top: 10px; border-top:1px solid var(--border); padding-top:8px; font-size:12px; color:var(--text-dim);">';
        reflectHtml += '<b>Weekly Reflection:</b>';
        reflectHtml += '<div style="margin-left: 8px; display:flex; flex-direction:column; gap:3px; margin-top:4px;">';
        
        const dayPlan = getDay(log.dayId);
        Object.entries(log.reflect).forEach(([key, val]) => {
          if (val) {
            let label = key;
            if (dayPlan && dayPlan.reflection) {
              const rItem = dayPlan.reflection.find(r => r.id === key);
              if (rItem) label = rItem.label;
            }
            reflectHtml += `<div>- ${label} <span style="color:var(--accent); font-weight:700;">${val}</span></div>`;
          }
        });
        reflectHtml += '</div></div>';
      }
      
      html += `<div class="hist-ex">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
          <span style="font-weight:700; font-size:14px; color:var(--accent); text-transform:uppercase; font-family:var(--font-display);">${dayName}</span>
          <span class="mono" style="font-size:12px; color:var(--text-dim);">${dateDisplay}</span>
        </div>
        ${exHtml}
        ${checkHtml}
        ${reflectHtml}
        <div style="margin-top: 12px; text-align:right;">
          <button class="util-btn" style="padding: 6px 12px; font-size: 11px; background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.3); color: #ef4444; display: inline-flex; width: auto;" onclick="deleteCalisthenicsSession('${log.dayId}', '${log.date}')">Delete Log</button>
        </div>
      </div>`;
    });
  }

  html += `<div class="util-row">
      <div class="util-btn" id="exportExcelBtn">Export Excel (Logs)</div>
      <div class="util-btn" id="exportBtn">Export Logs (JSON)</div>
      <div class="util-btn" id="exportPlanBtn" style="border-color: var(--secondary); color: var(--secondary);">📤 Export Workout Plan</div>
      <div class="util-btn" id="importBtn">Import File</div>
      <div class="util-btn" id="pasteAiPlanBtn" style="border-color: var(--accent); color: var(--accent);">🤖 Import AI Plan</div>
      <div class="util-btn" id="managePlansBtn" style="border-color: rgba(239, 68, 68, 0.4); color: #ef4444;">🗑️ Manage / Delete Plans</div>
    </div>`;

  el.innerHTML = html;

  if (typeof Chart !== 'undefined') {
    exWithData.forEach(ex=>{
      const points = logs
        .filter(l => l.exercises && l.exercises[ex.id])
        .sort((a,b)=> a.timestamp - b.timestamp)
        .map(l => {
          const vals = l.exercises[ex.id].sets.map(s=>parseFloat(s.value)||0);
          const best = Math.max(...vals);
          const total = vals.reduce((a,b)=>a+b,0);
          return { date: l.date, best, total };
        });
      const ctx = document.getElementById('chart_'+ex.id);
      if(!ctx) return;
      if(charts[ex.id]) charts[ex.id].destroy();
      
      charts[ex.id] = new Chart(ctx, {
        type:'line',
        data:{
          labels: points.map(p=>p.date.slice(5)),
          datasets:[
            { label:'Best Set ('+ex.unit+')', data: points.map(p=>p.best), borderColor:'#f59e0b', backgroundColor:'rgba(245, 158, 11, 0.12)', tension:0.3, fill:true, pointRadius:4, pointBackgroundColor:'#f59e0b' },
            { label:'Total Volume', data: points.map(p=>p.total), borderColor:'#38bdf8', backgroundColor:'transparent', tension:0.3, borderDash:[4,3], pointRadius:3, pointBackgroundColor:'#38bdf8' }
          ]
        },
        options:{
          responsive:true,
          maintainAspectRatio:false,
          resizeDelay:100,
          plugins:{ legend:{ labels:{ color:'#94a3b8', font:{size:10, family:'Inter'}, boxWidth:12 } } },
          scales:{
            x:{ ticks:{ color:'#94a3b8', font:{size:10, family:'JetBrains Mono'} }, grid:{ color:'rgba(255,255,255,0.05)' } },
            y:{ ticks:{ color:'#94a3b8', font:{size:10, family:'JetBrains Mono'} }, grid:{ color:'rgba(255,255,255,0.05)' } }
          }
        }
      });
    });
  }

  wireUtilButtons();
}

function wireUtilButtons(){
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const exportExcelBtn = document.getElementById('exportExcelBtn');
  const pasteAiPlanBtn = document.getElementById('pasteAiPlanBtn');
  const managePlansBtn = document.getElementById('managePlansBtn');
  const exportPlanBtn = document.getElementById('exportPlanBtn');

  if(exportBtn) exportBtn.addEventListener('click', exportData);
  if(importBtn) importBtn.addEventListener('click', ()=> document.getElementById('importFile').click());
  if(exportExcelBtn) exportExcelBtn.addEventListener('click', exportExcel);
  if(pasteAiPlanBtn) pasteAiPlanBtn.addEventListener('click', openAiModal);
  if(managePlansBtn) managePlansBtn.addEventListener('click', openManagePlansModal);
  if(exportPlanBtn) exportPlanBtn.addEventListener('click', () => exportPlan(activePlanId));
}

function openAiModal() {
  document.getElementById('aiPlanModal').style.display = 'flex';
}
function closeAiModal() {
  document.getElementById('aiPlanModal').style.display = 'none';
}

function openManagePlansModal() {
  renderManagePlansList();
  const modal = document.getElementById('managePlansModal');
  if (modal) modal.style.display = 'flex';
}

function closeManagePlansModal() {
  const modal = document.getElementById('managePlansModal');
  if (modal) modal.style.display = 'none';
}

function exportPlan(planId) {
  const targetId = planId || activePlanId;
  const plan = ALL_PLANS[targetId];
  if (!plan) {
    showToast("Plan not found");
    return;
  }

  const routines = {};
  const goals = [];
  const principles = [];

  if (Array.isArray(plan.data)) {
    plan.data.forEach(day => {
      const exList = [];
      if (day.goal && !goals.includes(day.goal)) goals.push(day.goal);
      if (day.cue && !principles.includes(day.cue)) principles.push(day.cue);

      if (day.warmup && Array.isArray(day.warmup)) {
        day.warmup.forEach(w => {
          exList.push({
            name: `Warm-up: ${w}`,
            sets: 1,
            targetReps: '1 round',
            restSeconds: 30,
            notes: 'Warm-up preparation'
          });
        });
      }

      if (day.main && Array.isArray(day.main)) {
        day.main.forEach(ex => {
          exList.push({
            name: ex.name,
            sets: ex.sets,
            targetReps: ex.target,
            restSeconds: ex.rest || 60,
            notes: ex.note || ''
          });
        });
      }

      if (day.skill && Array.isArray(day.skill)) {
        day.skill.forEach(ex => {
          exList.push({
            name: `Skill: ${ex.name}`,
            sets: ex.sets,
            targetReps: ex.target,
            restSeconds: ex.rest || 60,
            notes: ex.note || 'Skill work'
          });
        });
      }

      if (day.finisher && Array.isArray(day.finisher)) {
        day.finisher.forEach(f => {
          exList.push({
            name: `Finisher: ${f}`,
            sets: 1,
            targetReps: '1 round',
            restSeconds: 45,
            notes: 'Metabolic finisher'
          });
        });
      }

      if (day.recovery && day.routine && Array.isArray(day.routine)) {
        day.routine.forEach(r => {
          exList.push({
            name: `Recovery: ${r}`,
            sets: 1,
            targetReps: '1 round',
            restSeconds: 0,
            notes: 'Active recovery'
          });
        });
      }

      routines[day.name || `Day ${day.num || 1}`] = exList;
    });
  }

  const exportPayload = {
    $schema: "http://json-schema.org/draft-07/schema#",
    planName: plan.name,
    description: goals[0] || `Workout routine: ${plan.name}`,
    goals: goals.length ? goals.slice(0, 5) : ['Strength progression', 'Hypertrophy', 'Recovery optimization'],
    principles: principles.length ? principles : ['1-2 RIR on compound sets', 'Progressive overload', 'Controlled tempo'],
    routines: routines,
    days: plan.data
  };

  const safeFilename = plan.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `workout-plan-${safeFilename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Exported "${plan.name}" plan`);
}

function deletePlan(planId) {
  const plan = ALL_PLANS[planId];
  if (!plan) {
    showToast("Plan not found");
    return false;
  }
  if (!isCustomPlan(planId)) {
    alert("Default built-in preset plans cannot be deleted.");
    return false;
  }

  const confirmDelete = confirm(
    `Are you sure you want to delete the plan "${plan.name}"?\n\nThis will remove this routine from your plan list. (Your logged workout history will remain preserved).`
  );
  if (!confirmDelete) return false;

  const deletedName = plan.name;
  delete ALL_PLANS[planId];

  // If deleted plan was active, switch to fallback
  if (activePlanId === planId) {
    const remainingKeys = Object.keys(ALL_PLANS);
    if (remainingKeys.includes('recovery_v2')) {
      activePlanId = 'recovery_v2';
    } else if (remainingKeys.length > 0) {
      activePlanId = remainingKeys[0];
    }
    selectedDayId = todayWeekdayId();
    draft = {};
    clearRestTimer();
  }

  saveToServer();
  renderAll();
  renderManagePlansList();
  showToast(`Plan "${deletedName}" deleted`);
  return true;
}

function renderManagePlansList() {
  const listEl = document.getElementById('managePlansList');
  if (!listEl) return;
  listEl.innerHTML = '';

  const entries = Object.entries(ALL_PLANS);
  if (entries.length === 0) {
    listEl.innerHTML = '<div style="color:var(--text-dim); text-align:center; padding:24px 10px; font-size:13px;">No workout plans installed.</div>';
    return;
  }

  entries.forEach(([planId, plan]) => {
    const isCustom = isCustomPlan(planId);
    const isActive = planId === activePlanId;
    const daysCount = Array.isArray(plan.data) ? plan.data.length : 0;

    const card = document.createElement('div');
    card.className = `plan-manage-card ${isActive ? 'active' : ''}`;

    let badgeHtml = '';
    if (isActive) {
      badgeHtml += `<span class="plan-manage-badge current">ACTIVE</span>`;
    }
    if (isCustom) {
      badgeHtml += `<span class="plan-manage-badge custom">CUSTOM AI PLAN</span>`;
    } else {
      badgeHtml += `<span class="plan-manage-badge built-in">PRESET</span>`;
    }
    badgeHtml += `<span style="font-size:11px; color:var(--text-dim); font-family:var(--font-mono);">${daysCount} ${daysCount === 1 ? 'day' : 'days'}</span>`;

    let actionsHtml = '';
    if (!isActive) {
      actionsHtml += `<button class="plan-manage-btn" data-action="switch" data-id="${planId}">Select</button>`;
    }
    actionsHtml += `<button class="plan-manage-btn export" data-action="export" data-id="${planId}" title="Export this plan as JSON">Export</button>`;
    if (isCustom) {
      actionsHtml += `<button class="plan-manage-btn delete" data-action="delete" data-id="${planId}" title="Delete this plan">Delete</button>`;
    }

    card.innerHTML = `
      <div class="plan-manage-info">
        <div class="plan-manage-name" title="${plan.name}">${plan.name}</div>
        <div class="plan-manage-badge-row">${badgeHtml}</div>
      </div>
      <div class="plan-manage-actions">${actionsHtml}</div>
    `;

    listEl.appendChild(card);
  });

  listEl.querySelectorAll('button[data-action="switch"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.id;
      if (ALL_PLANS[pId]) {
        activePlanId = pId;
        selectedDayId = todayWeekdayId();
        draft = {};
        clearRestTimer();
        renderAll();
        renderManagePlansList();
        saveToServer();
        showToast(`Switched to "${ALL_PLANS[pId].name}"`);
      }
    });
  });

  listEl.querySelectorAll('button[data-action="export"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.id;
      exportPlan(pId);
    });
  });

  listEl.querySelectorAll('button[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.id;
      deletePlan(pId);
    });
  });
}

const closeManagePlansBtn = document.getElementById('closeManagePlansBtn');
if (closeManagePlansBtn) closeManagePlansBtn.addEventListener('click', closeManagePlansModal);

const closeManagePlansBottomBtn = document.getElementById('closeManagePlansBottomBtn');
if (closeManagePlansBottomBtn) closeManagePlansBottomBtn.addEventListener('click', closeManagePlansModal);

const importAiFromManageBtn = document.getElementById('importAiFromManageBtn');
if (importAiFromManageBtn) {
  importAiFromManageBtn.addEventListener('click', () => {
    closeManagePlansModal();
    openAiModal();
  });
}

const deletePlanBtn = document.getElementById('deletePlanBtn');
if (deletePlanBtn) {
  deletePlanBtn.addEventListener('click', () => {
    deletePlan(activePlanId);
  });
}

document.getElementById('closeAiModalBtn').addEventListener('click', closeAiModal);
document.getElementById('submitAiPlanBtn').addEventListener('click', ()=>{
  const text = document.getElementById('aiPlanJsonText').value.trim();
  if(!text) { alert("Please paste plan JSON content first."); return; }
  if(importAiPlanJson(text)) {
    closeAiModal();
    document.getElementById('aiPlanJsonText').value = '';
  }
});

function importAiPlanJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);

    if (Array.isArray(parsed.logs)) {
      saveLogs(parsed.logs);
      if (parsed.customPlans && typeof parsed.customPlans === 'object') {
        Object.assign(ALL_PLANS, parsed.customPlans);
      }
      if (parsed.activePlanId && ALL_PLANS[parsed.activePlanId]) {
        activePlanId = parsed.activePlanId;
      }
      saveToServer();
      showToast('Imported workout logs & plans');
      renderAll();
      return true;
    }

    let planName = parsed.planName || parsed.name || "AI Workout Plan";

    if (Array.isArray(parsed.days) && parsed.days.length > 0) {
      const planId = 'custom_' + Date.now();
      ALL_PLANS[planId] = {
        name: planName,
        data: parsed.days
      };
      activePlanId = planId;
      saveToServer();
      updatePlanSelector();
      renderAll();
      showToast(`Imported "${planName}"!`);
      return true;
    }

    if (Array.isArray(parsed.data) && parsed.data.length > 0) {
      const planId = 'custom_' + Date.now();
      ALL_PLANS[planId] = {
        name: planName,
        data: parsed.data
      };
      activePlanId = planId;
      saveToServer();
      updatePlanSelector();
      renderAll();
      showToast(`Imported "${planName}"!`);
      return true;
    }

    let routines = parsed.routines || parsed.templates || parsed.plan;

    if (!routines || typeof routines !== 'object') {
      alert("Invalid AI Plan JSON format. Must contain a 'routines' object with day workouts.");
      return false;
    }

    const weekdayIds = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const convertedPlan = [];
    const entries = Object.entries(routines);

    entries.forEach(([dayName, exercises], idx) => {
      const dayId = weekdayIds[idx % 7];
      const dayNum = (idx % 7) + 1;
      let dayObj = {
        id: dayId,
        num: dayNum,
        name: dayName,
        goal: parsed.description || `AI Workout routine for ${dayName}`,
        warmup: [],
        main: [],
        skill: [],
        finisher: [],
        cue: (parsed.principles && parsed.principles[0]) || 'Maintain proper form and 1-2 RIR.'
      };

      if (Array.isArray(exercises)) {
        exercises.forEach((ex, exIdx) => {
          let name = ex.name || `Exercise ${exIdx+1}`;
          let sets = parseInt(ex.sets, 10) || 3;
          let target = ex.targetReps || ex.target || '8-12 reps';
          let note = ex.notes || ex.note || '';
          let unit = (target.includes('sec') || target.includes('s hold') || target.includes('s')) ? 'sec' : 'reps';
          let rest = parseInt(ex.restSeconds || ex.rest, 10) || 60;

          if (name.toLowerCase().includes('warmup') || name.toLowerCase().includes('warm-up')) {
            dayObj.warmup.push(`${name} — ${target}`);
          } else {
            dayObj.main.push({
              id: `${dayId}_ex_${exIdx+1}`,
              name: name,
              sets: sets,
              target: target,
              note: note,
              unit: unit,
              rest: rest
            });
          }
        });
      }
      convertedPlan.push(dayObj);
    });

    const planId = 'custom_' + Date.now();
    ALL_PLANS[planId] = {
      name: planName,
      data: convertedPlan
    };
    activePlanId = planId;
    saveToServer();
    updatePlanSelector();
    renderAll();
    showToast(`Imported "${planName}"!`);
    return true;
  } catch(e) {
    alert("Error parsing AI Plan JSON: " + e.message);
    return false;
  }
}

function exportData(){
  try {
    const customPlans = {};
    Object.keys(ALL_PLANS).forEach(k => {
      if(isCustomPlan(k)) customPlans[k] = ALL_PLANS[k];
    });
    const data = { logs: loadLogs(), activePlanId, customPlans, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `calisthenics-log-${todayISO()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported JSON');
  } catch(e) {
    alert("Export JSON failed: " + e.message);
  }
}

function exportExcel(){
  try {
    if(typeof XLSX === 'undefined'){ 
      alert('Excel library (SheetJS) failed to load. Please check your internet connection.'); 
      return; 
    }
    const logs = loadLogs();
    const rows = [];
    logs.forEach(l=>{
      const dayLabel = l.dayName || l.dayId;
      Object.values(l.exercises || {}).forEach(exData=>{
        exData.sets.forEach((s,i)=>{
          rows.push({
            Date: l.date,
            Day: dayLabel,
            Exercise: exData.name,
            Set: i+1,
            Value: s.value,
            Unit: exData.unit,
            RPE: s.rpe || ''
          });
        });
      });
    });
    if(rows.length === 0){ 
      alert('No data to export. Please log some exercise sets first!'); 
      return; 
    }

    const wb = XLSX.utils.book_new();
    const wsSessions = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, wsSessions, 'Sessions');

    const byExercise = {};
    rows.forEach(r=>{
      byExercise[r.Exercise] = byExercise[r.Exercise] || {};
      byExercise[r.Exercise][r.Date] = byExercise[r.Exercise][r.Date] || [];
      byExercise[r.Exercise][r.Date].push(parseFloat(r.Value) || 0);
    });
    const summaryRows = [];
    Object.entries(byExercise).forEach(([exName, byDate])=>{
      Object.entries(byDate).forEach(([date, vals])=>{
        summaryRows.push({
          Exercise: exName,
          Date: date,
          'Best Set': Math.max(...vals),
          'Total Volume': vals.reduce((a,b)=>a+b,0),
          Sets: vals.length
        });
      });
    });
    const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    XLSX.writeFile(wb, `calisthenics-log-${todayISO()}.xlsx`);
    showToast('Exported Excel');
  } catch(e) {
    alert("Export Excel failed: " + e.message);
  }
}

document.getElementById('importFile').addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    importAiPlanJson(reader.result);
  };
  reader.readAsText(file);
  e.target.value = '';
});

/* ============ SERVER SYNC & PLAN SWITCH ============ */
const planSelEl = document.getElementById('planSelector');
if (planSelEl) {
  planSelEl.addEventListener('change', (e) => {
    activePlanId = e.target.value;
    selectedDayId = todayWeekdayId();
    draft = {};
    renderAll();
    saveToServer();
  });
}

async function syncWithServer() {
  try {
    const res = await fetch('/api/data');
    if(res.ok) {
      const serverData = await res.json();
      if(serverData.logs && Array.isArray(serverData.logs)) {
        const localLogs = loadLogs();
        const mergedMap = new Map();
        serverData.logs.forEach(l => mergedMap.set(l.date + '_' + l.dayId, l));
        localLogs.forEach(l => mergedMap.set(l.date + '_' + l.dayId, l));
        const merged = Array.from(mergedMap.values());
        localStorage.setItem(LS_LOGS, JSON.stringify(merged));
      }
      for (const k in ALL_PLANS) {
        delete ALL_PLANS[k];
      }
      Object.assign(ALL_PLANS, BUILTIN_PLANS);
      if(serverData.customPlans && typeof serverData.customPlans === 'object') {
        Object.assign(ALL_PLANS, serverData.customPlans);
      }
      if(serverData.activePlanId && ALL_PLANS[serverData.activePlanId]) {
        activePlanId = serverData.activePlanId;
      } else if (!ALL_PLANS[activePlanId]) {
        activePlanId = 'recovery_v2';
      }
      updatePlanSelector();
      renderAll();
    }
  } catch(e) {
    console.log("Server sync offline:", e);
  }
}

async function saveToServer() {
  try {
    const logs = loadLogs();
    const customPlans = {};
    Object.keys(ALL_PLANS).forEach(k => {
      if(isCustomPlan(k)) customPlans[k] = ALL_PLANS[k];
    });
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs, customPlans, activePlanId })
    });
  } catch(e) {
    console.log("Error posting to server:", e);
  }
}

/* ============ VIEW SWITCH ============ */
document.querySelectorAll('.header-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.header-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const view = tab.dataset.view;
    document.getElementById('trainView').style.display = view==='train' ? 'block':'none';
    document.getElementById('historyView').style.display = view==='history' ? 'block':'none';
    document.getElementById('guideView').style.display = view==='guide' ? 'block':'none';
    document.getElementById('chainWrap').style.display = view==='train' ? 'block':'none';
    
    const header = document.querySelector('header');
    if (view === 'train') {
      header.classList.remove('history-active');
    } else {
      header.classList.add('history-active');
    }
    
    if(view==='history') renderHistory();
  });
});

function renderAll(){
  updatePlanSelector();
  renderChain();
  renderTrain();
}
renderAll();
syncWithServer();