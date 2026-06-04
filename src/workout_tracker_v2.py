#!/usr/bin/env python3
"""
Workout Tracker — Elite UI Edition
Built with tkinter + Pillow for premium visuals.
Optimized for scalable data handling, dynamic viewport resizing, and data-first layout.
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageTk
import json, os, csv, time
from datetime import datetime

try:
    import winsound
    HAS_WINSOUND = True
except ImportError:
    HAS_WINSOUND = False

def play_chime(sound_alias):
    if HAS_WINSOUND:
        try:
            winsound.PlaySound(sound_alias, winsound.SND_ALIAS | winsound.SND_ASYNC)
        except Exception:
            pass

# ═══════════════════════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════════════════════
DATA_DIR = os.path.join(os.path.expanduser("~"), ".workout_tracker")
DATA_FILE = os.path.join(DATA_DIR, "data.json")

DEFAULT_TEMPLATES = {
    "Day 1": [
        {"name": "Pull-ups (or assisted)", "sets": 4},
        {"name": "Band-assisted pull-ups", "sets": 3},
        {"name": "Negative pull-ups", "sets": 2},
    ],
    "Day 2": [
        {"name": "Overhead Press", "sets": 3},
        {"name": "Deadlift", "sets": 3},
        {"name": "Barbell Rows", "sets": 3},
    ],
    "Day 3": [
        {"name": "Incline Bench", "sets": 3},
        {"name": "Leg Press", "sets": 3},
        {"name": "Lat Pulldowns", "sets": 3},
    ],
    "Day 4": [{"name": "Exercise 1", "sets": 3}],
    "Day 5": [{"name": "Exercise 1", "sets": 3}],
    "Day 6": [{"name": "Exercise 1", "sets": 3}],
}

# ═══════════════════════════════════════════════════════════════════════════
# DESIGN SYSTEM
# ═══════════════════════════════════════════════════════════════════════════
DS = {
    "bg": "#0B0F19",
    "surface": "#111827",
    "surface_hover": "#1A2236",
    "card": "#151B2B",
    "card_border": "#1E293B",
    "card_border_active": "#334155",
    "text": "#F8FAFC",
    "text_muted": "#94A3B8",
    "text_dim": "#64748B",
    "primary": "#3B82F6",
    "primary_dark": "#1D4ED8",
    "success": "#10B981",
    "success_dark": "#047857",
    "danger": "#EF4444",
    "danger_dark": "#B91C1C",
    "warning": "#F59E0B",
    "warning_dark": "#B45309",
    "accent": "#8B5CF6",
    "accent_dark": "#6D28D9",
}

def ensure_data_dir():
    os.makedirs(DATA_DIR, exist_ok=True)

def load_data():
    ensure_data_dir()
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"templates": dict(DEFAULT_TEMPLATES), "history": []}

def save_data(data):
    ensure_data_dir()
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def fmt_ms(ms):
    ts = int(ms // 1000)
    h, rem = divmod(ts, 3600)
    m, s = divmod(rem, 60)
    millis = int(ms % 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{millis:03d}"

def fmt_ms_short(ms):
    ts = int(ms // 1000)
    h, rem = divmod(ts, 3600)
    m, s = divmod(rem, 60)
    d = int((ms % 1000) // 100)
    return f"{h:02d}:{m:02d}:{s:02d}.{d}"

# ═══════════════════════════════════════════════════════════════════════════
# PILLOW RENDERERS
# ═══════════════════════════════════════════════════════════════════════════
def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def lerp_color(c1, c2, t):
    r1, g1, b1 = hex_to_rgb(c1)
    r2, g2, b2 = hex_to_rgb(c2)
    return (int(r1 + (r2 - r1) * t),
            int(g1 + (g2 - g1) * t),
            int(b1 + (b2 - b1) * t))

def rounded_rect(size, radius, fill, border=None, border_w=1, shadow=False):
    w, h = size
    img = Image.new("RGBA", (w + 20 if shadow else w, h + 20 if shadow else h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if shadow:
        shadow_img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(shadow_img)
        sdraw.rounded_rectangle([0, 0, w, h], radius=radius, fill=(0, 0, 0, 60))
        shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(8))
        img.paste(shadow_img, (8, 8), shadow_img)
    
    draw.rounded_rectangle([0, 0, w, h], radius=radius, fill=fill, outline=border, width=border_w if border else 0)
    return img

def gradient_rect(size, radius, c1, c2, direction="vertical"):
    w, h = size
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w, h], radius=radius, fill=255)

    grad = Image.new("RGBA", (w, h))
    rgb1, rgb2 = hex_to_rgb(c1), hex_to_rgb(c2)
    for y in range(h):
        t = y / h if direction == "vertical" else 0
        for x in range(w):
            if direction == "horizontal":
                t = x / w
            r = int(rgb1[0] + (rgb2[0] - rgb1[0]) * t)
            g = int(rgb1[1] + (rgb2[1] - rgb1[1]) * t)
            b = int(rgb1[2] + (rgb2[2] - rgb1[2]) * t)
            grad.putpixel((x, y), (r, g, b, 255))

    img.paste(grad, (0, 0), mask)
    return img

def button_image(size, text, c1, c2, radius=12, font_size=13):
    w, h = size
    base = Image.new("RGBA", (w + 16, h + 16), (0, 0, 0, 0))
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle([0, 0, w, h], radius=radius, fill=(0, 0, 0, 50))
    shadow = shadow.filter(ImageFilter.GaussianBlur(6))
    base.paste(shadow, (6, 8), shadow)

    body = gradient_rect((w, h), radius, c1, c2)
    base.paste(body, (0, 0), body)

    draw = ImageDraw.Draw(base)
    try: font = ImageFont.truetype("arialbd.ttf", font_size)
    except: font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (w - tw) // 2
    ty = (h - th) // 2 - 2
    draw.text((tx, ty), text, fill=(255, 255, 255, 255), font=font)
    return base

def circle_button_image(size, text, c1, c2, font_size=12):
    w = size
    base = Image.new("RGBA", (w + 16, w + 16), (0, 0, 0, 0))
    shadow = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).ellipse([0, 0, w, w], fill=(0, 0, 0, 50))
    shadow = shadow.filter(ImageFilter.GaussianBlur(8))
    base.paste(shadow, (6, 8), shadow)

    body = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    draw = ImageDraw.Draw(body)
    for y in range(w):
        t = y / w
        rgb = lerp_color(c1, c2, t)
        draw.line([(0, y), (w, y)], fill=rgb + (255,))
    
    mask = Image.new("L", (w, w), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, w, w], fill=255)
    base.paste(body, (0, 0), mask)

    draw = ImageDraw.Draw(base)
    try: font = ImageFont.truetype("arialbd.ttf", font_size)
    except: font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (w - tw) // 2
    ty = (w - th) // 2 - 2
    draw.text((tx, ty), text, fill=(255, 255, 255, 255), font=font)
    return base

def card_image(size, radius=16):
    return rounded_rect(size, radius, hex_to_rgb(DS["card"]), hex_to_rgb(DS["card_border"]), 1, shadow=True)

# ═══════════════════════════════════════════════════════════════════════════
# CUSTOM WIDGETS
# ═══════════════════════════════════════════════════════════════════════════
class EliteButton(tk.Label):
    def __init__(self, parent, text, c1, c2, width=140, height=44, radius=12, font_size=13, command=None, **kwargs):
        self.c1, self.c2 = c1, c2
        self.c1_h, self.c2_h = lerp_color(c1, "#FFFFFF", 0.15), lerp_color(c2, "#FFFFFF", 0.15)
        self.cmd = command
        self._normal = button_image((width, height), text, c1, c2, radius, font_size)
        self._hover = button_image((width, height), text, self._to_hex(self.c1_h), self._to_hex(self.c2_h), radius, font_size)
        self._tk_img = None
        
        bg_color = kwargs.pop("bg", None)
        if not bg_color:
            try: bg_color = parent.cget("bg")
            except Exception: bg_color = DS["bg"]
            
        super().__init__(parent, image=self._tk_img, bg=bg_color, cursor="hand2", **kwargs)
        self._set_img(self._normal)
        self.bind("<Enter>", lambda e: self._set_img(self._hover))
        self.bind("<Leave>", lambda e: self._set_img(self._normal))
        self.bind("<Button-1>", self._on_click)

    def _to_hex(self, rgb): return "#%02x%02x%02x" % rgb
    def _set_img(self, pil_img):
        self._tk_img = ImageTk.PhotoImage(pil_img)
        self.config(image=self._tk_img)
    def _on_click(self, event):
        if self.cmd: self.cmd()

class EliteCircleButton(tk.Label):
    def __init__(self, parent, text, c1, c2, size=90, font_size=12, command=None, **kwargs):
        self.c1, self.c2 = c1, c2
        self.c1_h = self._to_hex(lerp_color(c1, "#FFFFFF", 0.15))
        self.c2_h = self._to_hex(lerp_color(c2, "#FFFFFF", 0.15))
        self.cmd = command
        self._normal = circle_button_image(size, text, c1, c2, font_size)
        self._hover = circle_button_image(size, text, self.c1_h, self.c2_h, font_size)
        self._tk_img = None
        
        bg_color = kwargs.pop("bg", None)
        if not bg_color:
            try: bg_color = parent.cget("bg")
            except Exception: bg_color = DS["bg"]
            
        super().__init__(parent, image=self._tk_img, bg=bg_color, cursor="hand2", **kwargs)
        self._set_img(self._normal)
        self.bind("<Enter>", lambda e: self._set_img(self._hover))
        self.bind("<Leave>", lambda e: self._set_img(self._normal))
        self.bind("<Button-1>", self._on_click)

    def _to_hex(self, rgb): return "#%02x%02x%02x" % rgb
    def _set_img(self, pil_img):
        self._tk_img = ImageTk.PhotoImage(pil_img)
        self.config(image=self._tk_img)
    def _on_click(self, event):
        if self.cmd: self.cmd()
    def set_text(self, text, c1, c2, font_size=12):
        self.c1, self.c2 = c1, c2
        self.c1_h = self._to_hex(lerp_color(c1, "#FFFFFF", 0.15))
        self.c2_h = self._to_hex(lerp_color(c2, "#FFFFFF", 0.15))
        self._normal = circle_button_image(self._tk_img.width(), text, c1, c2, font_size)
        self._hover = circle_button_image(self._tk_img.width(), text, self.c1_h, self.c2_h, font_size)
        self._set_img(self._normal)

class EliteCard(tk.Label):
    def __init__(self, parent, width, height, radius=16, **kwargs):
        pil = card_image((width, height), radius)
        self._tk_img = ImageTk.PhotoImage(pil)
        super().__init__(parent, image=self._tk_img, bg=DS["bg"], **kwargs)

class EliteEntry(tk.Entry):
    def __init__(self, parent, width=20, font=None, **kwargs):
        super().__init__(parent, width=width, font=font or ("Segoe UI", 11),
                         bg=DS["surface"], fg=DS["text"], insertbackground=DS["primary"],
                         relief=tk.FLAT, highlightthickness=1,
                         highlightcolor=DS["primary"], highlightbackground=DS["card_border"], **kwargs)

class EliteSpinbox(tk.Spinbox):
    def __init__(self, parent, from_=1, to=50, width=8, font=None, **kwargs):
        super().__init__(parent, from_=from_, to=to, width=width, font=font or ("Segoe UI", 11),
                         bg=DS["surface"], fg=DS["text"], buttonbackground=DS["card_border"],
                         relief=tk.FLAT, highlightthickness=1,
                         highlightcolor=DS["primary"], highlightbackground=DS["card_border"], **kwargs)

# ═══════════════════════════════════════════════════════════════════════════
# MAIN APP
# ═══════════════════════════════════════════════════════════════════════════
class WorkoutTrackerApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Workout Tracker")
        self.geometry("1000x800")
        self.configure(bg=DS["bg"])
        self.minsize(900, 700)

        # Configure dark-themed ttk styles
        self.style = ttk.Style()
        self.style.theme_use("clam")
        self.style.configure("TCombobox",
                             fieldbackground=DS["surface"],
                             background=DS["card_border"],
                             foreground=DS["text"],
                             bordercolor=DS["card_border"],
                             lightcolor=DS["card_border"],
                             darkcolor=DS["card_border"],
                             arrowcolor=DS["text"])
        self.option_add("*TCombobox*Listbox.background", DS["surface"])
        self.option_add("*TCombobox*Listbox.foreground", DS["text"])
        self.option_add("*TCombobox*Listbox.selectBackground", DS["primary"])
        self.option_add("*TCombobox*Listbox.selectForeground", DS["text"])
        self.option_add("*TCombobox*Listbox.font", ("Segoe UI", 10))

        self.data = load_data()
        self.exercises = []
        self.current_ex_index = 0
        self.current_set = 1
        self.is_resting = False
        self.current_label = ""
        self.workout_active = False
        self.recorded_splits = []
        self.start_time = 0
        self.elapsed_time = 0
        self.timer_interval = None
        self.is_running = False
        self.last_split_total = 0
        self.split_counter = 0

        self.nav_frame = tk.Frame(self, bg=DS["bg"], height=70)
        self.nav_frame.pack(fill=tk.X, side=tk.TOP, padx=30, pady=(20, 10))
        self.nav_frame.pack_propagate(False)

        tk.Label(self.nav_frame, text="WORKOUT TRACKER", font=("Segoe UI", 22, "bold"),
                 bg=DS["bg"], fg=DS["text"]).pack(side=tk.LEFT)

        self.nav_buttons = {}
        nav_container = tk.Frame(self.nav_frame, bg=DS["bg"])
        nav_container.pack(side=tk.RIGHT)
        for name in ("Setup", "Timer", "History"):
            btn = tk.Label(nav_container, text=name, bg=DS["bg"], fg=DS["text_muted"],
                           font=("Segoe UI", 13), padx=20, pady=8, cursor="hand2")
            btn.pack(side=tk.LEFT)
            btn.bind("<Button-1>", lambda e, n=name.lower(): self.show_page(n))
            btn.bind("<Enter>", lambda e, b=btn: b.config(fg=DS["text"]))
            btn.bind("<Leave>", lambda e, b=btn, k=name.lower(): b.config(
                fg=DS["primary"] if k == self._current_page else DS["text_muted"]))
            self.nav_buttons[name.lower()] = btn

        self._current_page = "setup"
        sep = tk.Frame(self, bg=DS["card_border"], height=1)
        sep.pack(fill=tk.X, padx=30)

        self.container = tk.Frame(self, bg=DS["bg"])
        self.container.pack(fill=tk.BOTH, expand=True, padx=30, pady=25)

        self.pages = {}
        for PageClass in (SetupPage, TimerPage, HistoryPage):
            page = PageClass(self.container, self)
            self.pages[PageClass.__name__.lower().replace("page", "")] = page
            page.place(in_=self.container, x=0, y=0, relwidth=1, relheight=1)

        self.show_page("setup")

    def show_page(self, name):
        self._current_page = name
        for key, page in self.pages.items():
            if key == name:
                page.lift()
                page.on_show()
            else:
                page.on_hide()
        for key, btn in self.nav_buttons.items():
            if key == name: btn.config(fg=DS["primary"], font=("Segoe UI", 13, "bold"))
            else: btn.config(fg=DS["text_muted"], font=("Segoe UI", 13))

    def get_page(self, name):
        return self.pages.get(name)

# ═══════════════════════════════════════════════════════════════════════════
# SETUP PAGE
# ═══════════════════════════════════════════════════════════════════════════
class SetupPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=DS["bg"])
        self.controller = controller

        left = tk.Frame(self, bg=DS["bg"])
        left.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        hdr_wrapper = tk.Frame(left, bg=DS["bg"], width=560, height=110)
        hdr_wrapper.pack(anchor=tk.NW, pady=(0, 20))
        hdr_wrapper.pack_propagate(False)

        EliteCard(hdr_wrapper, 560, 110, 16).place(x=0, y=0)
        hdr_inner = tk.Frame(hdr_wrapper, bg=DS["card"])
        hdr_inner.place(x=20, y=20, width=520, height=70)

        tk.Label(hdr_inner, text="Configure Routine", font=("Segoe UI", 16, "bold"), bg=DS["card"], fg=DS["text"]).pack(side=tk.LEFT)

        self.routine_var = tk.StringVar(value="Day 1")
        self.routine_combo = ttk.Combobox(hdr_inner, textvariable=self.routine_var, width=15, font=("Segoe UI", 11))
        self.routine_combo.pack(side=tk.RIGHT)
        self.routine_combo.bind("<<ComboboxSelected>>", lambda e: self.load_template())
        self.routine_combo.bind("<Return>", lambda e: self.load_template())
        self.routine_combo.bind("<FocusOut>", lambda e: self.load_template())

        bld_wrapper = tk.Frame(left, bg=DS["bg"], width=560, height=420)
        bld_wrapper.pack(anchor=tk.NW)
        bld_wrapper.pack_propagate(False)

        EliteCard(bld_wrapper, 560, 420, 16).place(x=0, y=0)
        self.builder_inner = tk.Frame(bld_wrapper, bg=DS["card"])
        self.builder_inner.place(x=20, y=20, width=520, height=380)

        hdr = tk.Frame(self.builder_inner, bg=DS["card"])
        hdr.pack(fill=tk.X, pady=(0, 12))
        tk.Label(hdr, text="Exercise Name", font=("Segoe UI", 10, "bold"), bg=DS["card"], fg=DS["text_dim"], width=30, anchor=tk.W).pack(side=tk.LEFT)
        tk.Label(hdr, text="Sets", font=("Segoe UI", 10, "bold"), bg=DS["card"], fg=DS["text_dim"], width=10, anchor=tk.W).pack(side=tk.LEFT)

        self.canvas = tk.Canvas(self.builder_inner, bg=DS["card"], highlightthickness=0)
        self.scrollbar = ttk.Scrollbar(self.builder_inner, orient=tk.VERTICAL, command=self.canvas.yview)
        self.rows_frame = tk.Frame(self.canvas, bg=DS["card"])
        
        self.canvas.configure(yscrollcommand=self.scrollbar.set)
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        self.canvas_window = self.canvas.create_window((0, 0), window=self.rows_frame, anchor="nw")
        self.rows_frame.bind("<Configure>", lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))
        self.canvas.bind("<Configure>", lambda e: self.canvas.itemconfig(self.canvas_window, width=e.width))

        right = tk.Frame(self, bg=DS["bg"], padx=20)
        right.pack(side=tk.RIGHT, fill=tk.Y)

        act_wrapper = tk.Frame(right, bg=DS["bg"], width=280, height=300)
        act_wrapper.pack(anchor=tk.N, pady=(0, 20))
        act_wrapper.pack_propagate(False)

        EliteCard(act_wrapper, 280, 300, 16).place(x=0, y=0)
        action_inner = tk.Frame(act_wrapper, bg=DS["card"])
        action_inner.place(x=20, y=20, width=240, height=260)

        tk.Label(action_inner, text="Actions", font=("Segoe UI", 14, "bold"), bg=DS["card"], fg=DS["text"]).pack(anchor=tk.W, pady=(0, 20))

        self.save_btn = EliteButton(action_inner, "Save Preset", DS["accent"], DS["accent_dark"], width=220, height=46, command=self.save_template)
        self.save_btn.pack(pady=(0, 15))

        self.add_btn = tk.Button(action_inner, text="+ Add Exercise", bg=DS["surface"], fg=DS["primary"], font=("Segoe UI", 12, "bold"), bd=1, relief=tk.SOLID, highlightbackground=DS["primary"], highlightthickness=1, cursor="hand2", command=self.add_row, padx=20, pady=12)
        self.add_btn.pack(fill=tk.X, pady=(0, 15))
        self.add_btn.bind("<Enter>", lambda e: self.add_btn.config(bg=DS["surface_hover"]))
        self.add_btn.bind("<Leave>", lambda e: self.add_btn.config(bg=DS["surface"]))

        self.start_btn = EliteButton(action_inner, "Start Workout →", DS["primary"], DS["primary_dark"], width=220, height=50, font_size=14, command=self.prepare_timer)
        self.start_btn.pack(fill=tk.X)

        self.rows = []
        self.update_combo_values()
        self.load_template()

    def update_combo_values(self):
        templates = self.controller.data.get("templates", DEFAULT_TEMPLATES)
        self.routine_combo.config(values=list(templates.keys()))

    def load_template(self):
        for row in self.rows: row["frame"].destroy()
        self.rows = []
        day = self.routine_var.get()
        templates = self.controller.data.get("templates", DEFAULT_TEMPLATES)
        routine = templates.get(day, [{"name": "", "sets": 3}])
        for ex in routine: self.add_row(ex.get("name", ""), ex.get("sets", 3))
        if not self.rows: self.add_row("", 3)

    def add_row(self, name="", sets=3):
        frame = tk.Frame(self.rows_frame, bg=DS["card"], pady=6)
        frame.pack(fill=tk.X)
        name_entry = EliteEntry(frame, width=28, font=("Segoe UI", 11))
        name_entry.insert(0, name)
        name_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 12))
        sets_entry = EliteSpinbox(frame, from_=1, to=50, width=10, font=("Segoe UI", 11))
        sets_entry.delete(0, tk.END)
        sets_entry.insert(0, str(sets))
        sets_entry.pack(side=tk.LEFT, padx=(0, 12))
        remove_lbl = tk.Label(frame, text="✕", bg=DS["card"], fg=DS["danger"], font=("Segoe UI", 14, "bold"), cursor="hand2", width=3)
        remove_lbl.pack(side=tk.LEFT)
        remove_lbl.bind("<Button-1>", lambda e, f=frame: self.remove_row(f))
        self.rows.append({"frame": frame, "name": name_entry, "sets": sets_entry})

    def remove_row(self, frame):
        self.rows = [r for r in self.rows if r["frame"] != frame]
        frame.destroy()
        if not self.rows: self.add_row("", 3)

    def save_template(self):
        day = self.routine_var.get()
        new_routine = []
        for row in self.rows:
            name = row["name"].get().strip()
            try: sets = int(row["sets"].get())
            except ValueError: sets = 0
            if name and sets > 0: new_routine.append({"name": name, "sets": sets})
        if not new_routine:
            messagebox.showwarning("Empty Routine", "Add at least one exercise to save a preset.")
            return
        self.controller.data["templates"][day] = new_routine
        save_data(self.controller.data)
        self.update_combo_values()
        messagebox.showinfo("Saved", f"Preset '{day}' saved successfully.")

    def prepare_timer(self):
        exercises = []
        for row in self.rows:
            name = row["name"].get().strip()
            try: sets = int(row["sets"].get())
            except ValueError: sets = 0
            if name and sets > 0: exercises.append({"name": name, "sets": sets})
        if not exercises: exercises = [{"name": "Custom Exercise", "sets": 1}]
        self.controller.get_page("timer").set_exercises(exercises)
        self.controller.show_page("timer")

    def on_show(self):
        self.update_combo_values()
    def on_hide(self): pass

# ═══════════════════════════════════════════════════════════════════════════
# TIMER PAGE — COMPRESSED FOR MAXIMUM DATA VISIBILITY
# ═══════════════════════════════════════════════════════════════════════════
class TimerPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=DS["bg"])
        self.controller = controller

        # Timer Card: Compressed Height to allocate space to Data Table
        timer_wrapper = tk.Frame(self, bg=DS["bg"], width=620, height=180)
        timer_wrapper.pack(pady=(0, 15))
        timer_wrapper.pack_propagate(False)

        EliteCard(timer_wrapper, 620, 180, 20).place(x=0, y=0)
        timer_inner = tk.Frame(timer_wrapper, bg=DS["card"])
        timer_inner.place(x=30, y=15, width=560, height=150)

        self.status_label = tk.Label(timer_inner, text="Ready to Start", font=("Segoe UI", 16, "bold"), fg=DS["primary"], bg=DS["card"])
        self.status_label.pack()

        self.time_label = tk.Label(timer_inner, text="00:00:00.0", font=("Consolas", 48, "bold"), fg=DS["text"], bg=DS["card"])
        self.time_label.pack(pady=4)

        self.lap_label = tk.Label(timer_inner, text="00:00:00.000", font=("Consolas", 18), fg=DS["warning"], bg=DS["card"])
        self.lap_label.pack()

        # Control Buttons: Reduced diameter from 100px to 80px
        ctrl_frame = tk.Frame(self, bg=DS["bg"])
        ctrl_frame.pack(pady=5)

        self.start_btn = EliteCircleButton(ctrl_frame, "Start", DS["success"], DS["success_dark"], size=80, font_size=12, command=self.toggle_timer)
        self.start_btn.pack(side=tk.LEFT, padx=12)
        self.split_btn = EliteCircleButton(ctrl_frame, "Split", DS["warning"], DS["warning_dark"], size=80, font_size=12, command=self.record_split)
        self.split_btn.pack(side=tk.LEFT, padx=12)
        self.save_btn = EliteCircleButton(ctrl_frame, "Save", DS["primary"], DS["primary_dark"], size=80, font_size=12, command=self.save_workout)
        self.save_btn.pack(side=tk.LEFT, padx=12)
        self.reset_btn = EliteCircleButton(ctrl_frame, "Reset", DS["text_dim"], DS["text_muted"], size=80, font_size=12, command=self.reset_timer)
        self.reset_btn.pack(side=tk.LEFT, padx=12)
        self.split_enabled = False
        self.save_enabled = False

        # Fluid Datatable: Expanded spatial allocation
        splits_wrapper = tk.Frame(self, bg=DS["card"], highlightbackground=DS["card_border"], highlightthickness=1)
        splits_wrapper.pack(fill=tk.BOTH, expand=True, pady=(15, 0))

        hdr = tk.Frame(splits_wrapper, bg=DS["card"])
        hdr.pack(fill=tk.X, pady=(10, 8), padx=15)
        for text, width, align in [("#", 5, tk.CENTER), ("Exercise", 30, tk.W), ("Duration", 14, tk.CENTER), ("Total", 14, tk.CENTER), ("Reps", 10, tk.CENTER)]:
            tk.Label(hdr, text=text, font=("Segoe UI", 10, "bold"), bg=DS["card"], fg=DS["text_dim"], width=width, anchor=align).pack(side=tk.LEFT, padx=(0, 5))

        self.splits_canvas = tk.Canvas(splits_wrapper, bg=DS["card"], highlightthickness=0)
        self.splits_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(15, 0))

        scrollbar = ttk.Scrollbar(splits_wrapper, orient=tk.VERTICAL, command=self.splits_canvas.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.splits_canvas.configure(yscrollcommand=scrollbar.set)

        self.splits_container = tk.Frame(self.splits_canvas, bg=DS["card"])
        self.splits_canvas_window = self.splits_canvas.create_window((0, 0), window=self.splits_container, anchor=tk.NW)
        
        self.splits_container.bind("<Configure>", lambda e: self.splits_canvas.configure(scrollregion=self.splits_canvas.bbox("all")))
        self.splits_canvas.bind("<Configure>", lambda e: self.splits_canvas.itemconfig(self.splits_canvas_window, width=e.width))

        self.split_rows = []
        self.rep_entries = {}

    def set_exercises(self, exercises):
        c = self.controller
        c.exercises = exercises
        c.current_ex_index = 0
        c.current_set = 1
        c.is_resting = False
        c.workout_active = True
        c.recorded_splits = []
        c.elapsed_time = 0
        c.last_split_total = 0
        c.split_counter = 0
        c.is_running = False
        self.update_status()
        self.clear_splits()
        self.time_label.config(text="00:00:00.0")
        self.lap_label.config(text="00:00:00.000")
        self.start_btn.set_text("Start", DS["success"], DS["success_dark"], 12)
        self.split_enabled = False
        self.save_enabled = False

    def update_status(self):
        c = self.controller
        if not c.workout_active: label = "Workout Complete"
        elif c.is_resting: label = "Rest"
        else:
            if c.current_ex_index < len(c.exercises):
                ex = c.exercises[c.current_ex_index]
                label = f"{ex['name']}  —  Set {c.current_set}"
            else: label = "Ad-Hoc Training"
        c.current_label = label
        self.status_label.config(text=label)

    def toggle_timer(self):
        c = self.controller
        if not c.workout_active and not c.is_running and c.elapsed_time == 0:
            self.set_exercises([{"name": "Ad-Hoc Training", "sets": 99}])

        if c.is_running:
            self.after_cancel(c.timer_interval)
            c.elapsed_time += int((time.time() * 1000) - c.start_time)
            c.is_running = False
            self.start_btn.set_text("Resume", DS["success"], DS["success_dark"], 12)
            self.split_enabled = False
        else:
            if c.workout_active and c.elapsed_time == 0:
                play_chime("SystemQuestion")
            c.start_time = time.time() * 1000
            c.timer_interval = self.after(10, self.update_display)
            c.is_running = True
            self.start_btn.set_text("Pause", DS["danger"], DS["danger_dark"], 12)
            if c.workout_active: self.split_enabled = True
            self.save_enabled = True

    def update_display(self):
        c = self.controller
        if not c.is_running: return
        now = time.time() * 1000
        passed = int(now - c.start_time + c.elapsed_time)
        self.time_label.config(text=fmt_ms_short(passed))
        lap = passed - c.last_split_total
        self.lap_label.config(text=fmt_ms(lap))
        c.timer_interval = self.after(10, self.update_display)

    def record_split(self):
        if not self.split_enabled: return
        c = self.controller
        if not c.is_running or not c.workout_active: return

        c.split_counter += 1
        now = time.time() * 1000
        current_total = int(now - c.start_time + c.elapsed_time)
        split_dur = current_total - c.last_split_total
        recorded_label = c.current_label
        is_work_set = "Rest" not in recorded_label

        row = tk.Frame(self.splits_container, bg=DS["card"], pady=4)
        row.pack(fill=tk.X)

        tk.Label(row, text=f"#{c.split_counter}", font=("Segoe UI", 10), bg=DS["card"], fg=DS["text_dim"], width=5).pack(side=tk.LEFT, padx=(0, 5))
        tk.Label(row, text=recorded_label, font=("Segoe UI", 10, "bold"), bg=DS["card"], fg=DS["text"], width=30, anchor=tk.W).pack(side=tk.LEFT, padx=(0, 5))
        tk.Label(row, text=fmt_ms(split_dur), font=("Consolas", 10), bg=DS["card"], fg=DS["warning"], width=14).pack(side=tk.LEFT, padx=(0, 5))
        tk.Label(row, text=fmt_ms(current_total), font=("Consolas", 10), bg=DS["card"], fg=DS["text_muted"], width=14).pack(side=tk.LEFT, padx=(0, 5))

        rep_var = tk.StringVar()
        if is_work_set:
            entry = tk.Entry(row, textvariable=rep_var, width=10, font=("Segoe UI", 10), justify=tk.CENTER, bd=1, relief=tk.SOLID, bg=DS["surface"], fg=DS["text"], highlightthickness=1, highlightcolor=DS["primary"], highlightbackground=DS["card_border"])
            entry.pack(side=tk.LEFT)
            self.rep_entries[c.split_counter] = rep_var
        else: tk.Label(row, text="—", font=("Segoe UI", 10), bg=DS["card"], fg=DS["text_dim"], width=10).pack(side=tk.LEFT)

        self.split_rows.insert(0, row)
        c.recorded_splits.append({"id": c.split_counter, "label": recorded_label, "duration": fmt_ms(split_dur), "total": fmt_ms(current_total), "isWorkSet": is_work_set, "reps": ""})

        self.splits_canvas.update_idletasks()
        self.splits_canvas.yview_moveto(1.0)

        if not c.is_resting:
            c.is_resting = True
            play_chime("SystemAsterisk")
        else:
            c.is_resting = False
            c.current_ex_index += 1
            max_sets = max(ex["sets"] for ex in c.exercises)
            all_done = True
            while c.current_set <= max_sets:
                if c.current_ex_index >= len(c.exercises):
                    c.current_ex_index = 0
                    c.current_set += 1
                if c.current_set > max_sets: break
                if c.current_set <= c.exercises[c.current_ex_index]["sets"]:
                    all_done = False
                    break
                else: c.current_ex_index += 1
            if all_done:
                c.workout_active = False
                self.split_enabled = False
                self.toggle_timer()
                play_chime("SystemExclamation")
            else:
                play_chime("SystemQuestion")

        self.update_status()
        c.last_split_total = current_total

    def clear_splits(self):
        for row in self.split_rows: row.destroy()
        self.split_rows = []
        self.rep_entries = {}

    def reset_timer(self):
        c = self.controller
        if c.is_running: self.after_cancel(c.timer_interval)
        c.is_running = False
        c.elapsed_time = 0
        c.last_split_total = 0
        c.split_counter = 0
        c.workout_active = False
        self.time_label.config(text="00:00:00.0")
        self.lap_label.config(text="00:00:00.000")
        self.status_label.config(text="Ready to Start")
        self.clear_splits()
        self.start_btn.set_text("Start", DS["success"], DS["success_dark"], 12)
        self.split_enabled = False
        self.save_enabled = False

    def save_workout(self):
        if not self.save_enabled: return
        c = self.controller
        if not c.recorded_splits and c.elapsed_time == 0: return
        if c.is_running: self.toggle_timer()

        for split in c.recorded_splits:
            if split["isWorkSet"]:
                var = self.rep_entries.get(split["id"])
                split["reps"] = var.get() if var else ""
            else: split["reps"] = ""

        history = c.data.get("history", [])
        summary = "  |  ".join(f"{ex['sets']}× {ex['name']}" for ex in c.exercises)
        final_total = fmt_ms(c.elapsed_time)
        now = datetime.now()
        date_display = now.strftime("%b %d, %Y  %H:%M")
        iso_date = now.strftime("%Y-%m-%d")

        history.insert(0, {"isoDate": iso_date, "dateDisplay": date_display, "totalTime": final_total, "summary": summary, "splits": list(c.recorded_splits)})
        c.data["history"] = history
        save_data(c.data)
        self.reset_timer()
        c.show_page("history")

    def on_show(self): pass
    def on_hide(self): pass

# ═══════════════════════════════════════════════════════════════════════════
# HISTORY PAGE
# ═══════════════════════════════════════════════════════════════════════════
class HistoryPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=DS["bg"])
        self.controller = controller

        exp_wrapper = tk.Frame(self, bg=DS["bg"], width=940, height=100)
        exp_wrapper.pack(pady=(0, 20))
        exp_wrapper.pack_propagate(False)

        EliteCard(exp_wrapper, 940, 100, 16).place(x=0, y=0)
        ef = tk.Frame(exp_wrapper, bg=DS["card"])
        ef.place(x=20, y=20, width=900, height=60)

        tk.Label(ef, text="From:", font=("Segoe UI", 11, "bold"), bg=DS["card"], fg=DS["text_muted"]).pack(side=tk.LEFT)
        self.start_date = EliteEntry(ef, width=14, font=("Segoe UI", 11))
        self.start_date.pack(side=tk.LEFT, padx=(8, 20))
        self.start_date.insert(0, "YYYY-MM-DD")

        tk.Label(ef, text="To:", font=("Segoe UI", 11, "bold"), bg=DS["card"], fg=DS["text_muted"]).pack(side=tk.LEFT)
        self.end_date = EliteEntry(ef, width=14, font=("Segoe UI", 11))
        self.end_date.pack(side=tk.LEFT, padx=(8, 20))
        self.end_date.insert(0, "YYYY-MM-DD")

        self.setup_placeholder(self.start_date, "YYYY-MM-DD")
        self.setup_placeholder(self.end_date, "YYYY-MM-DD")

        export_btn = EliteButton(ef, "⬇  Download CSV", DS["success"], DS["success_dark"], width=180, height=40, command=self.export_csv)
        export_btn.pack(side=tk.RIGHT)

        filter_btn = EliteButton(ef, "🔍 Filter", DS["primary"], DS["primary_dark"], width=120, height=40, command=self.render_history)
        filter_btn.pack(side=tk.RIGHT, padx=(0, 10))

        self.canvas = tk.Canvas(self, bg=DS["bg"], highlightthickness=0)
        self.scrollbar = ttk.Scrollbar(self, orient=tk.VERTICAL, command=self.canvas.yview)
        self.list_container = tk.Frame(self.canvas, bg=DS["bg"])
        self.canvas_window = self.canvas.create_window((0, 0), window=self.list_container, anchor="nw")
        
        self.list_container.bind("<Configure>", lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))
        self.canvas.bind("<Configure>", lambda e: self.canvas.itemconfig(self.canvas_window, width=e.width))
        
        self.canvas.configure(yscrollcommand=self.scrollbar.set)
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

    def setup_placeholder(self, entry, placeholder):
        def on_focus_in(e):
            if entry.get() == placeholder:
                entry.delete(0, tk.END)
                entry.config(fg=DS["text"])
        def on_focus_out(e):
            if not entry.get():
                entry.insert(0, placeholder)
                entry.config(fg=DS["text_muted"])
        entry.bind("<FocusIn>", on_focus_in)
        entry.bind("<FocusOut>", on_focus_out)
        entry.config(fg=DS["text_muted"])

    def on_show(self):
        self.render_history()

    def on_hide(self): pass

    def render_history(self):
        for w in self.list_container.winfo_children(): w.destroy()

        history = list(self.controller.data.get("history", []))
        
        start = self.start_date.get().strip()
        end = self.end_date.get().strip()
        
        if start and start != "YYYY-MM-DD":
            history = [s for s in history if s["isoDate"] >= start]
        if end and end != "YYYY-MM-DD":
            history = [s for s in history if s["isoDate"] <= end]

        if not history:
            tk.Label(self.list_container, text="No saved workouts found.\nTry adjusting your filters or complete a workout!", font=("Segoe UI", 13), fg=DS["text_dim"], bg=DS["bg"], justify=tk.CENTER).pack(pady=60)
            return

        for session in history:
            card_wrapper = tk.Frame(self.list_container, bg=DS["bg"], width=880, height=130)
            card_wrapper.pack(pady=10, padx=(10, 10))
            card_wrapper.pack_propagate(False)

            EliteCard(card_wrapper, 880, 130, 16).place(x=0, y=0)
            top = tk.Frame(card_wrapper, bg=DS["card"])
            top.place(x=20, y=15, width=840, height=30)

            tk.Label(top, text=session["dateDisplay"], font=("Segoe UI", 13, "bold"), bg=DS["card"], fg=DS["text"]).pack(side=tk.LEFT)
            tk.Label(top, text=session["totalTime"], font=("Segoe UI", 13, "bold"), bg=DS["card"], fg=DS["warning"]).pack(side=tk.RIGHT)

            completed = len([s for s in session["splits"] if s["isWorkSet"]])
            info = tk.Frame(card_wrapper, bg=DS["card"])
            info.place(x=20, y=50, width=700, height=60)
            tk.Label(info, text=f"Routine: {session['summary']}", font=("Segoe UI", 10), bg=DS["card"], fg=DS["text_muted"], wraplength=650, justify=tk.LEFT).pack(anchor=tk.W)
            tk.Label(info, text=f"Completed Working Sets: {completed}", font=("Segoe UI", 10), bg=DS["card"], fg=DS["text_muted"]).pack(anchor=tk.W, pady=(4, 0))

            del_btn = tk.Label(card_wrapper, text="Delete", bg=DS["danger"], fg="white", font=("Segoe UI", 9, "bold"), padx=12, pady=5, cursor="hand2")
            del_btn.place(relx=1.0, x=-20, y=15, anchor=tk.NE)
            del_btn.bind("<Button-1>", lambda e, s=session: self.delete_workout(s))
            del_btn.bind("<Enter>", lambda e, l=del_btn: l.config(bg=DS["danger_dark"]))
            del_btn.bind("<Leave>", lambda e, l=del_btn: l.config(bg=DS["danger"]))

    def delete_workout(self, session):
        if messagebox.askyesno("Confirm Delete", "Delete this workout permanently?"):
            try:
                self.controller.data["history"].remove(session)
                save_data(self.controller.data)
                self.render_history()
            except ValueError:
                pass

    def export_csv(self):
        history = list(self.controller.data.get("history", []))
        if not history:
            messagebox.showinfo("No Data", "No workout history available to export.")
            return

        start = self.start_date.get().strip()
        end = self.end_date.get().strip()
        if start and start != "YYYY-MM-DD": history = [s for s in history if s["isoDate"] >= start]
        if end and end != "YYYY-MM-DD": history = [s for s in history if s["isoDate"] <= end]
        if not history:
            messagebox.showinfo("No Data", "No workouts found in that date range.")
            return

        filepath = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")],
            initialfile="workout_data.csv"
        )
        if not filepath: return

        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["Date", "Name of Set", "Time Taken", "Reps"])
            for session in history:
                for split in session["splits"]:
                    writer.writerow([session["dateDisplay"], split["label"], split["duration"], split.get("reps", "")])

        messagebox.showinfo("Export Complete", f"CSV saved to:\n{filepath}")

# ═══════════════════════════════════════════════════════════════════════════
# ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    app = WorkoutTrackerApp()
    app.mainloop()
