import React, { useState, useEffect, useRef, useMemo } from "react";
const x = (id, name, sets, reps, bodyPart, alt) => ({ id, name, sets, reps, bodyPart, alt });
const DAYS = [
  { id: "push-a", label: "PUSH A", sub: "Chest, Shoulders, Triceps", type: "push", exercises: [
    x("p1", "Bench Press", 4, "8", "Chest", "Machine Chest Press"),
    x("p2", "Overhead Shoulder Press", 3, "10", "Shoulders", "Seated Dumbbell Shoulder Press"),
    x("p3", "Incline Dumbbell Press", 3, "10", "Chest", "Incline Machine Press"),
    x("p4", "Lateral Raise", 3, "15", "Shoulders", "Seated Dumbbell Lateral Raise"),
    x("p5", "Tricep Pushdown", 3, "12", "Triceps", "Dumbbell Kickback"),
    x("p6", "Skull Crushers", 3, "12", "Triceps", "Floor Dumbbell Triceps Extension"),
    x("a1", "Cable Crunch", 3, "12-15", "Abs", "Machine Crunch"),
    x("a2", "Plank", 3, "30-45s", "Abs", "Knee Plank")
  ] },
  { id: "pull-a", label: "PULL A", sub: "Back, Biceps, Forearms", type: "pull", exercises: [
    x("pl1", "Lat Pulldown", 4, "10", "Back", "Neutral-Grip (V-Handle) Pulldown"),
    x("pl2", "Seated Cable Row", 4, "10", "Back", "Chest-Supported Dumbbell Row"),
    x("pl3", "Pull-ups / Assisted", 3, "8", "Back", "Inverted Row (Smith Bar)"),
    x("pl4", "Face Pulls", 3, "15", "Rear Delts", "Reverse Pec Deck"),
    x("pl5", "Bicep Curls", 3, "12", "Biceps", "Seated Dumbbell Curl"),
    x("pl6", "Hammer Curls", 3, "12", "Biceps", "Cable Rope Hammer Curl"),
    x("pl7", "Wrist Curls", 3, "15", "Forearms", "Seated Barbell Wrist Curl"),
    x("pl8", "Reverse Wrist Curls", 3, "15", "Forearms", "Reverse EZ-Bar Curl"),
    x("a3", "Hanging Knee Raise", 3, "10-12", "Abs", "Captain's Chair Knee Raise"),
    x("a4", "Russian Twist", 3, "20 total", "Abs", "Pallof Press")
  ] },
  { id: "legs-a", label: "LEGS A", sub: "Quads, Hamstrings, Calves", type: "legs", exercises: [
    x("l1", "Squats", 4, "8", "Quads", "Goblet Squat"),
    x("l2", "Romanian Deadlift", 4, "10", "Hamstrings", "Cable Pull-Through"),
    x("l3", "Leg Press", 3, "12", "Quads", "Hack Squat Machine"),
    x("l4", "Leg Curl", 3, "12", "Hamstrings", "Standing Single-Leg Curl Machine"),
    x("l5", "Standing Calf Raise", 4, "15", "Calves", "Leg Press Calf Raise"),
    x("l6", "Plank", 3, "30-45s", "Core", "Incline Plank"),
    x("a5", "Ab Wheel Rollout", 3, "8-10", "Abs", "Swiss Ball Rollout")
  ] },
  { id: "push-b", label: "PUSH B", sub: "Chest, Shoulders, Triceps", type: "push", exercises: [
    x("p7", "Incline Barbell Press", 4, "8", "Chest", "Incline Smith Machine Press"),
    x("p8", "Arnold Press", 3, "10", "Shoulders", "Machine Shoulder Press"),
    x("p9", "Chest Fly", 3, "12", "Chest", "Pec Deck Machine"),
    x("p10", "Rear Delt Fly", 3, "15", "Rear Delts", "Chest-Supported Dumbbell Rear Delt Fly"),
    x("p11", "Overhead Tricep Extension", 3, "12", "Triceps", "Cable Rope Overhead Extension"),
    x("p12", "Dips", 3, "10", "Chest/Triceps", "Assisted Dip Machine"),
    x("a6", "Decline Sit-up", 3, "12-15", "Abs", "Floor Crunch"),
    x("a7", "Reverse Crunch", 3, "12-15", "Abs", "Lying Knee Tuck")
  ] },
  { id: "pull-b", label: "PULL B", sub: "Back, Biceps, Forearms", type: "pull", exercises: [
    x("pl17", "Chest-Supported Machine Row", 4, "10", "Back", "Seated Cable Row (Close Grip)"),
    x("pl19", "Straight-Arm Cable Pulldown", 4, "12", "Back", "Lying Dumbbell Pullover"),
    x("pl11", "Single-Arm DB Row", 3, "10", "Back", "Seated Single-Arm Cable Row"),
    x("pl12", "Cable Curl", 3, "12", "Biceps", "Preacher Curl Machine"),
    x("pl13", "Concentration Curl", 3, "12", "Biceps", "Incline Dumbbell Curl"),
    x("pl14", "Shrugs", 3, "15", "Traps", "Smith Machine Shrug"),
    x("pl15", "Farmer's Walk", 3, "30-40m", "Forearms", "Dead Hang"),
    x("pl16", "Plate Pinch Hold", 3, "20-30s", "Forearms", "Standing Dumbbell Hold"),
    x("a8", "Cable Woodchopper", 3, "12/side", "Abs", "Side Plank (Knees)"),
    x("a9", "Dead Bug", 3, "10/side", "Abs", "Bird Dog")
  ] },
  { id: "legs-b", label: "LEGS B", sub: "Glutes, Quads, Hamstrings, Calves", type: "legs", exercises: [
    x("l7", "Bulgarian Split Squat", 4, "10/leg", "Glutes", "Smith Machine Split Squat"),
    x("l8", "Hip Thrust", 4, "10", "Glutes", "Floor Glute Bridge"),
    x("l9", "Leg Extension", 3, "12", "Quads", "Low Box Step-up"),
    x("l10", "Lying Leg Curl", 3, "12", "Hamstrings", "Seated Leg Curl"),
    x("l11", "Seated Calf Raise", 4, "15", "Calves", "Single-Leg Calf Raise on Step"),
    x("l12", "Hanging Leg Raise", 3, "12", "Core", "Lying Leg Raise"),
    x("a10", "Bicycle Crunch", 3, "20 total", "Abs", "Heel Taps")
  ] },
  { id: "rest", label: "REST", sub: "Sunday: recovery day", type: "rest", exercises: [] }
];
const COLORS = { push: "#FF5A36", pull: "#3FA9F5", legs: "#F0BE3D", rest: "#6B6259" };
const DAY_BY_ID = Object.fromEntries(DAYS.map((d) => [d.id, d]));
const EX_TYPE = {};
DAYS.forEach((d) => d.exercises.forEach((e) => {
  EX_TYPE[e.name] = d.type;
  EX_TYPE[e.alt] = d.type;
}));
const effName = (ex, l) => l && l.alt ? ex.alt : ex.name;
const pad2 = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = /* @__PURE__ */ new Date();
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
};
const fmt = (s) => (/* @__PURE__ */ new Date(s + "T00:00:00")).toLocaleDateString(void 0, { weekday: "short", month: "short", day: "numeric" });
const shortDate = (s) => (/* @__PURE__ */ new Date(s + "T00:00:00")).toLocaleDateString(void 0, { month: "short", day: "numeric" });
const blank = (n) => Array.from({ length: n }, () => ({ weight: "", done: false }));
const kg = (v) => String(Math.round(v * 100) / 100);
const mmss = (s) => {
  s = Math.max(0, Math.round(s));
  return Math.floor(s / 60) + ":" + pad2(s % 60);
};
const todayIndex = () => ((/* @__PURE__ */ new Date()).getDay() + 6) % 7;
const LS_KEY = "ppl-logs-v2";
function lsRead() {
  try {
    const v = localStorage.getItem(LS_KEY);
    return v ? JSON.parse(v) : {};
  } catch (e) {
    return {};
  }
}
function lsWrite(logs) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(logs));
  } catch (e) {
  }
}
async function openStore() {
  try {
    const c = window.claude;
    if (!c || !c.use) return { kind: "local" };
    const [db, user] = await Promise.all([c.use("db"), c.use("user")]);
    const uid = user ? await user.id() : null;
    if (db && uid) return { kind: "account", col: db.collection("data/users/" + uid) };
  } catch (e) {
  }
  return { kind: "local" };
}
const PREF_KEY = "ppl-prefs-v1";
const DEFAULT_PREFS = { setRest: 90, exRest: 120 };
function loadPrefs() {
  try {
    const v = JSON.parse(localStorage.getItem(PREF_KEY) || "null");
    if (v && typeof v === "object") return { ...DEFAULT_PREFS, ...v };
  } catch (e) {
  }
  return { ...DEFAULT_PREFS };
}
function savePrefs(p) {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(p));
  } catch (e) {
  }
}
function buzz(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (e) {
  }
}
let wakeLock = null;
async function holdScreen() {
  try {
    if (navigator.wakeLock && !wakeLock) {
      const lock = await navigator.wakeLock.request("screen");
      wakeLock = lock;
      lock.addEventListener("release", () => {
        if (wakeLock === lock) wakeLock = null;
      });
    }
  } catch (e) {
  }
}
function releaseScreen() {
  try {
    if (wakeLock) wakeLock.release();
  } catch (e) {
  }
  wakeLock = null;
}
function buildHistory(logs) {
  const byName = {};
  Object.keys(logs).sort().forEach((date) => {
    Object.entries(logs[date] || {}).forEach(([dayId, exLogs]) => {
      const meta = DAY_BY_ID[dayId];
      if (!meta) return;
      meta.exercises.forEach((ex) => {
        const l = exLogs[ex.id];
        if (!l || !l.sets) return;
        const ws = l.sets.filter((s) => s.done).map((s) => parseFloat(s.weight)).filter((w) => !isNaN(w) && w > 0);
        if (!ws.length) return;
        const name = effName(ex, l);
        const rec = byName[name] = byName[name] || {};
        const cur = rec[date] || { date, top: 0, weights: [] };
        cur.top = Math.max(cur.top, ...ws);
        cur.weights = cur.weights.concat(ws);
        rec[date] = cur;
      });
    });
  });
  const out = {};
  const prs = [];
  Object.entries(byName).forEach(([name, rec]) => {
    const sessions = Object.values(rec).sort((a, b) => a.date < b.date ? -1 : 1);
    let best = 0;
    sessions.forEach((s, i) => {
      s.pr = i > 0 && s.top > best;
      s.delta = s.top - best;
      if (s.pr) prs.push({ name, date: s.date, top: s.top, delta: s.delta });
      if (s.top > best) best = s.top;
    });
    out[name] = { sessions, best, bestDate: sessions.find((s) => s.top === best).date };
  });
  prs.sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : a.name.localeCompare(b.name));
  return { byName: out, prs };
}
function ExerciseCard({ exercise, log, onSetChange, onToggleAlt, color, isPR }) {
  const sets = log?.sets || blank(exercise.sets);
  const swapped = !!log?.alt;
  const name = swapped ? exercise.alt : exercise.name;
  const done = sets.filter((s) => s.done).length;
  return /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "ex-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "ex-name" }, name), /* @__PURE__ */ React.createElement("div", { className: "ex-meta" }, exercise.sets, " \xD7 ", exercise.reps, /* @__PURE__ */ React.createElement("span", { className: "tag", style: { borderColor: color, color } }, exercise.bodyPart), swapped && /* @__PURE__ */ React.createElement("span", { className: "tag", style: { borderColor: color, color } }, "EASIER OPTION"), isPR && /* @__PURE__ */ React.createElement("span", { className: "tag pr", style: { background: color, borderColor: color } }, "NEW PR"))), /* @__PURE__ */ React.createElement("div", { className: "plates" }, sets.map((_, i) => /* @__PURE__ */ React.createElement("i", { key: i, style: i < done ? { background: color, borderColor: color } : {} })))), /* @__PURE__ */ React.createElement("div", { className: "altrow" }, /* @__PURE__ */ React.createElement("span", { className: "mini" }, swapped ? "INSTEAD OF" : "EASIER OPTION"), /* @__PURE__ */ React.createElement("button", { className: "chip", "aria-pressed": swapped, onClick: () => onToggleAlt(exercise.id) }, swapped ? "Back to " + exercise.name : "Use " + exercise.alt)), /* @__PURE__ */ React.createElement("div", { className: "sets" }, sets.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "set" }, /* @__PURE__ */ React.createElement("span", { className: "mini" }, "SET ", i + 1), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "w",
      inputMode: "decimal",
      placeholder: "kg",
      value: s.weight,
      "aria-label": name + " set " + (i + 1) + " weight in kg",
      onChange: (e) => onSetChange(exercise.id, i, { ...s, weight: e.target.value })
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "ok",
      style: s.done ? { background: color, borderColor: color } : {},
      "aria-label": s.done ? "Mark set not done" : "Mark set done",
      onClick: () => onSetChange(exercise.id, i, { ...s, done: !s.done })
    },
    s.done ? "\u2713" : ""
  )))));
}
function Stepper({ label, value, onChange, onStart }) {
  const set = (d) => onChange(Math.min(600, Math.max(15, value + d)));
  return /* @__PURE__ */ React.createElement("div", { className: "step" }, /* @__PURE__ */ React.createElement("span", { className: "mini" }, label), /* @__PURE__ */ React.createElement("button", { "aria-label": "Shorten " + label.toLowerCase() + " rest", onClick: () => set(-15) }, "\u2212"), /* @__PURE__ */ React.createElement("b", null, mmss(value)), /* @__PURE__ */ React.createElement("button", { "aria-label": "Lengthen " + label.toLowerCase() + " rest", onClick: () => set(15) }, "+"), /* @__PURE__ */ React.createElement("button", { className: "go", "aria-label": "Start " + label.toLowerCase() + " rest now", onClick: onStart }, "Start"));
}
function RestConfig({ prefs, onChange, onStart }) {
  return /* @__PURE__ */ React.createElement("div", { className: "cfg" }, /* @__PURE__ */ React.createElement("span", { className: "mini" }, "REST TIMER. STARTS WHEN YOU CHECK OFF A SET"), /* @__PURE__ */ React.createElement(Stepper, { label: "BETWEEN SETS", value: prefs.setRest, onChange: (v) => onChange({ ...prefs, setRest: v }), onStart: () => onStart("set") }), /* @__PURE__ */ React.createElement(Stepper, { label: "BETWEEN EXERCISES", value: prefs.exRest, onChange: (v) => onChange({ ...prefs, exRest: v }), onStart: () => onStart("exercise") }));
}
function RestBar({ rest, color, onAdjust, onClose }) {
  const [now, setNow] = useState(Date.now());
  const firedRef = useRef(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [rest.id]);
  useEffect(() => {
    holdScreen();
    const onVis = () => {
      if (document.visibilityState === "visible") {
        setNow(Date.now());
        holdScreen();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      releaseScreen();
    };
  }, []);
  const left = Math.max(0, (rest.endsAt - now) / 1e3);
  const over = left <= 0;
  useEffect(() => {
    if (!over) {
      firedRef.current = null;
      return;
    }
    if (firedRef.current === rest.id) return;
    firedRef.current = rest.id;
    const pattern = [500, 150, 500];
    buzz(pattern);
    const iv = setInterval(() => buzz(pattern), 1500);
    const cap = setTimeout(() => clearInterval(iv), 5 * 60 * 1e3);
    return () => {
      clearInterval(iv);
      clearTimeout(cap);
      buzz(0);
    };
  }, [over, rest.id]);
  const pct = over ? 100 : Math.min(100, Math.max(0, 100 - left / rest.total * 100));
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `rpill ${over ? "over" : ""}`,
      role: "timer",
      "aria-label": over ? "Rest over. " + rest.label : "Rest, " + mmss(Math.ceil(left)) + " left. " + rest.label
    },
    /* @__PURE__ */ React.createElement("i", { className: "rfill", style: { width: pct + "%", background: color } }),
    /* @__PURE__ */ React.createElement("span", { className: "rtime" }, mmss(Math.ceil(left))),
    /* @__PURE__ */ React.createElement("span", { className: "rinfo" }, /* @__PURE__ */ React.createElement("span", { className: "mini" }, over ? "REST OVER" : "REST"), /* @__PURE__ */ React.createElement("span", { className: "rnext" }, rest.label)),
    /* @__PURE__ */ React.createElement("span", { className: "rbtns" }, !over && /* @__PURE__ */ React.createElement("button", { onClick: () => onAdjust(-15), "aria-label": "Subtract 15 seconds" }, "\u221215", /* @__PURE__ */ React.createElement("span", { className: "u" }, "s")), !over && /* @__PURE__ */ React.createElement("button", { onClick: () => onAdjust(15), "aria-label": "Add 15 seconds" }, "+15", /* @__PURE__ */ React.createElement("span", { className: "u" }, "s")), /* @__PURE__ */ React.createElement("button", { className: "skip", onClick: onClose, "aria-label": over ? "Dismiss timer" : "Skip rest" }, over ? "OK" : "\u2715"))
  );
}
function RecordView({ logs }) {
  const [open, setOpen] = useState(null);
  const sessions = Object.keys(logs).sort().reverse().map((date) => {
    const perDay = Object.entries(logs[date] || {}).map(([dayId, exLogs]) => {
      const meta = DAY_BY_ID[dayId];
      if (!meta) return null;
      let done = 0, total = 0, top = 0;
      Object.values(exLogs).forEach((l) => l.sets.forEach((s) => {
        total++;
        if (s.done) done++;
        const w = parseFloat(s.weight);
        if (!isNaN(w) && w > top) top = w;
      }));
      return done ? { dayId, meta, exLogs, done, total, top } : null;
    }).filter(Boolean);
    return perDay.length ? { date, perDay } : null;
  }).filter(Boolean);
  if (!sessions.length) return /* @__PURE__ */ React.createElement("div", { className: "rest" }, /* @__PURE__ */ React.createElement("div", { className: "big" }, "No sessions yet."), "Check off sets on a training day and they appear here.");
  return sessions.map(({ date, perDay }) => /* @__PURE__ */ React.createElement("div", { key: date, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "rdate" }, fmt(date)), perDay.map(({ dayId, meta, exLogs, done, total, top }) => {
    const key = date + dayId, isOpen = open === key;
    return /* @__PURE__ */ React.createElement("div", { key, className: "card", style: { padding: 0 } }, /* @__PURE__ */ React.createElement("button", { className: "rsum", onClick: () => setOpen(isOpen ? null : key), "aria-expanded": isOpen }, /* @__PURE__ */ React.createElement("span", { className: "dot", style: { background: COLORS[meta.type] } }), /* @__PURE__ */ React.createElement("b", { className: "rlabel" }, meta.label), /* @__PURE__ */ React.createElement("span", { className: "rstats" }, done, "/", total, " sets", top ? `, top ${top}kg` : ""), /* @__PURE__ */ React.createElement("span", null, isOpen ? "\u2212" : "+")), isOpen && /* @__PURE__ */ React.createElement("div", { className: "rdetail" }, meta.exercises.map((ex) => {
      const l = exLogs[ex.id];
      const w = l?.sets.filter((s) => s.done).map((s) => s.weight || "\u2014");
      return w?.length ? /* @__PURE__ */ React.createElement("div", { key: ex.id, className: "rrow" }, /* @__PURE__ */ React.createElement("span", null, effName(ex, l)), /* @__PURE__ */ React.createElement("span", { className: "rw" }, w.join(" / "))) : null;
    })));
  })));
}
function niceTicks(lo, hi, n) {
  if (hi === lo) {
    lo -= 5;
    hi += 5;
  }
  const raw = (hi - lo) / n;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const start = Math.floor(lo / step + 1e-9) * step, end = Math.ceil(hi / step - 1e-9) * step;
  const ticks = [];
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Math.round(v * 1e3) / 1e3);
  return ticks;
}
function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(640);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => setW(Math.max(260, Math.floor(el.clientWidth)));
    set();
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(set);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  return [ref, w];
}
function LineChart({ name, points, color }) {
  const [wrapRef, W] = useWidth();
  const [hover, setHover] = useState(null);
  const [pin, setPin] = useState(null);
  const H = 220, m = { t: 16, r: 22, b: 30, l: 40 };
  const n = points.length;
  const tops = points.map((p) => p.top);
  let lo = Math.min(...tops), hi = Math.max(...tops);
  if (hi === lo) {
    lo -= 5;
    hi += 5;
  } else {
    const pad = (hi - lo) * 0.12;
    lo -= pad;
    hi += pad;
  }
  lo = Math.max(0, lo);
  const ticks = niceTicks(lo, hi, 4);
  const y0 = ticks[0], y1 = ticks[ticks.length - 1];
  const ts = points.map((p) => (/* @__PURE__ */ new Date(p.date + "T00:00:00")).getTime());
  const pw = W - m.l - m.r, ph = H - m.t - m.b;
  const X = (i) => n === 1 || ts[n - 1] === ts[0] ? m.l + pw / 2 : m.l + (ts[i] - ts[0]) / (ts[n - 1] - ts[0]) * pw;
  const Y = (v) => m.t + ph - (v - y0) / (y1 - y0) * ph;
  const ai = hover != null ? hover : pin != null ? pin : n - 1;
  const a = points[ai];
  const line = points.map((p, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(p.top).toFixed(1)).join(" ");
  const area = line + " L" + X(n - 1).toFixed(1) + " " + (m.t + ph) + " L" + X(0).toFixed(1) + " " + (m.t + ph) + " Z";
  const last = points[n - 1];
  const nearest = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    let best = 0, bd = Infinity;
    for (let i = 0; i < n; i++) {
      const d = Math.abs(X(i) - px);
      if (d < bd) {
        bd = d;
        best = i;
      }
    }
    return best;
  };
  const onKey = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const cur = pin != null ? pin : n - 1;
    setPin(Math.min(n - 1, Math.max(0, cur + (e.key === "ArrowRight" ? 1 : -1))));
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "readout", "aria-live": "polite" }, /* @__PURE__ */ React.createElement("b", null, fmt(a.date)), /* @__PURE__ */ React.createElement("span", { className: "rv" }, kg(a.top), " kg"), a.pr && /* @__PURE__ */ React.createElement("span", { className: "tag", style: { borderColor: color } }, "PR +", kg(a.delta)), /* @__PURE__ */ React.createElement("span", { className: "rsets" }, a.weights.map(kg).join(" / "))), /* @__PURE__ */ React.createElement("div", { ref: wrapRef }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: { width: "100%", display: "block", touchAction: "pan-y" },
      role: "img",
      tabIndex: 0,
      onKeyDown: onKey,
      "aria-label": `${name}, heaviest set per session in kilograms. ${n} session${n > 1 ? "s" : ""}, from ${kg(points[0].top)} on ${shortDate(points[0].date)} to ${kg(last.top)} on ${shortDate(last.date)}. Use left and right arrow keys to step through sessions.`
    },
    ticks.map((v) => /* @__PURE__ */ React.createElement("g", { key: v }, /* @__PURE__ */ React.createElement("line", { className: "gl", x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v) }), /* @__PURE__ */ React.createElement("text", { className: "axt", x: m.l - 8, y: Y(v) + 3.5, textAnchor: "end" }, kg(v)))),
    n > 1 && /* @__PURE__ */ React.createElement("path", { d: area, fill: color, fillOpacity: "0.1" }),
    n > 1 && /* @__PURE__ */ React.createElement("path", { d: line, fill: "none", stroke: color, strokeWidth: "2", strokeLinejoin: "round", strokeLinecap: "round" }),
    hover != null && /* @__PURE__ */ React.createElement("line", { className: "xh", x1: X(ai), x2: X(ai), y1: m.t, y2: m.t + ph }),
    points.map((p, i) => /* @__PURE__ */ React.createElement("g", { key: p.date }, i === ai && /* @__PURE__ */ React.createElement("circle", { cx: X(i), cy: Y(p.top), r: (p.pr ? 6 : 4) + 5, fill: "none", stroke: color, strokeOpacity: "0.45", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("circle", { className: "ring", cx: X(i), cy: Y(p.top), r: p.pr ? 6 : 4, fill: color }))),
    /* @__PURE__ */ React.createElement("text", { className: "endlbl", x: X(n - 1), y: Math.max(12, Y(last.top) - 14), textAnchor: n === 1 ? "middle" : "end" }, kg(last.top), " kg"),
    n === 1 ? /* @__PURE__ */ React.createElement("text", { className: "axt", x: X(0), y: H - 8, textAnchor: "middle" }, shortDate(points[0].date)) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { className: "axt", x: X(0), y: H - 8, textAnchor: "start" }, shortDate(points[0].date)), /* @__PURE__ */ React.createElement("text", { className: "axt", x: X(n - 1), y: H - 8, textAnchor: "end" }, shortDate(last.date))),
    /* @__PURE__ */ React.createElement(
      "rect",
      {
        x: "0",
        y: "0",
        width: W,
        height: H,
        fill: "transparent",
        style: { cursor: "crosshair" },
        onPointerMove: (e) => setHover(nearest(e)),
        onPointerDown: (e) => {
          const i = nearest(e);
          setHover(i);
          setPin(i);
        },
        onPointerLeave: () => setHover(null)
      }
    )
  )));
}
function ProgressView({ history, prs }) {
  const names = Object.keys(history).sort((a, b) => {
    const la = history[a].sessions[history[a].sessions.length - 1].date;
    const lb = history[b].sessions[history[b].sessions.length - 1].date;
    return la < lb ? 1 : la > lb ? -1 : a.localeCompare(b);
  });
  const [sel, setSel] = useState(null);
  if (!names.length) return /* @__PURE__ */ React.createElement("div", { className: "rest" }, /* @__PURE__ */ React.createElement("div", { className: "big" }, "No lifts logged yet."), "Add a weight and check off a set. Your progress and PRs show up here.");
  const name = sel && history[sel] ? sel : names[0];
  const h = history[name];
  const ss = h.sessions;
  const first = ss[0], last = ss[ss.length - 1];
  const color = COLORS[EX_TYPE[name]] || COLORS.push;
  const change = last.top - first.top;
  const rows = ss.slice().reverse().slice(0, 12);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "filters" }, /* @__PURE__ */ React.createElement("label", { className: "mini", htmlFor: "lift-select" }, "LIFT"), /* @__PURE__ */ React.createElement("select", { id: "lift-select", className: "sel", value: name, onChange: (e) => setSel(e.target.value) }, names.map((nm) => /* @__PURE__ */ React.createElement("option", { key: nm, value: nm }, nm)))), /* @__PURE__ */ React.createElement("div", { className: "stats" }, /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("span", { className: "mini" }, "HEAVIEST SET"), /* @__PURE__ */ React.createElement("span", { className: "sv" }, kg(h.best), " kg"), /* @__PURE__ */ React.createElement("span", { className: "ss" }, shortDate(h.bestDate))), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("span", { className: "mini" }, "LAST SESSION"), /* @__PURE__ */ React.createElement("span", { className: "sv" }, kg(last.top), " kg"), /* @__PURE__ */ React.createElement("span", { className: "ss" }, shortDate(last.date))), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("span", { className: "mini" }, "SINCE FIRST"), /* @__PURE__ */ React.createElement("span", { className: "sv" }, ss.length > 1 ? (change > 0 ? "+" : "") + kg(change) + " kg" : "\u2014"), /* @__PURE__ */ React.createElement("span", { className: "ss" }, ss.length > 1 ? `over ${ss.length} sessions` : "1 session so far"))), /* @__PURE__ */ React.createElement("div", { className: "card chartcard" }, /* @__PURE__ */ React.createElement("div", { className: "ctitle" }, name, /* @__PURE__ */ React.createElement("span", null, "Heaviest set per session, kg")), /* @__PURE__ */ React.createElement(LineChart, { key: name, name, points: ss, color }), ss.some((s) => s.pr) && /* @__PURE__ */ React.createElement("div", { className: "cnote" }, "Larger dots mark personal records.")), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("table", { className: "stbl" }, /* @__PURE__ */ React.createElement("caption", { className: "sr" }, "Sessions for ", name, ", newest first"), /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { scope: "col" }, "Date"), /* @__PURE__ */ React.createElement("th", { scope: "col" }, "Top"), /* @__PURE__ */ React.createElement("th", { scope: "col" }, "Sets (kg)"), /* @__PURE__ */ React.createElement("th", { scope: "col" }, /* @__PURE__ */ React.createElement("span", { className: "sr" }, "Record")))), /* @__PURE__ */ React.createElement("tbody", null, rows.map((s) => /* @__PURE__ */ React.createElement("tr", { key: s.date }, /* @__PURE__ */ React.createElement("td", null, fmt(s.date)), /* @__PURE__ */ React.createElement("td", { className: "num" }, kg(s.top)), /* @__PURE__ */ React.createElement("td", { className: "num" }, s.weights.map(kg).join(" / ")), /* @__PURE__ */ React.createElement("td", null, s.pr ? /* @__PURE__ */ React.createElement("span", { className: "tag", style: { borderColor: color } }, "PR") : null)))))), /* @__PURE__ */ React.createElement("div", { className: "sechead" }, "RECENT PERSONAL RECORDS"), prs.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "rest" }, "No PRs yet. One shows when a lift beats your previous best.") : /* @__PURE__ */ React.createElement("div", { className: "card prlist" }, prs.slice(0, 8).map((p) => /* @__PURE__ */ React.createElement("button", { key: p.name + p.date, className: "prrow", onClick: () => setSel(p.name) }, /* @__PURE__ */ React.createElement("span", { className: "dot", style: { background: COLORS[EX_TYPE[p.name]] || COLORS.push } }), /* @__PURE__ */ React.createElement("span", { className: "prn" }, p.name), /* @__PURE__ */ React.createElement("span", { className: "prd" }, "+", kg(p.delta)), /* @__PURE__ */ React.createElement("span", { className: "prv" }, kg(p.top), " kg"), /* @__PURE__ */ React.createElement("span", { className: "prt" }, shortDate(p.date))))));
}
const GREETING = "I'm your coach. Ask about form, load, soreness, or swapping a lift.";
const CHAT_ERRORS = {
  not_granted: "Coach is switched off for this page. Reload and allow it to use Claude.",
  sampling_disabled: "Claude isn't available on this account.",
  rate_limited: "Too many questions in a row. Wait a minute, then ask again.",
  session_expired: "Your session expired. Sign in again and retry.",
  refused: "Coach couldn't answer that. Try wording it differently."
};
function ChatDrawer({ open, onClose, day, todayLog, sample }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const abortRef = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [msgs, loading, open]);
  function rulesFor() {
    const session = day.exercises.map((e) => {
      const l = todayLog?.[e.id];
      return `${effName(e, l)}: ${e.sets}x${e.reps}` + (l?.alt ? ` (easier option used instead of ${e.name})` : "");
    }).join("\n") || "Rest day.";
    const logged = day.exercises.map((e) => {
      const l = todayLog?.[e.id];
      const w = l?.sets?.filter((s) => s.done).map((s) => s.weight || "?");
      return w && w.length ? `${effName(e, l)}: ${w.join(", ")} kg` : null;
    }).filter(Boolean).join("\n");
    return `You are a blunt, competent strength coach inside a gym-log app. Today's session (${day.label}, ${day.sub}):
${session}
` + (logged ? `Sets the lifter has logged so far today:
${logged}
` : "") + `Give direct, specific advice in a few sentences, plain text, no markdown. If something sounds like an injury, say to see a doctor. The lifter's conversation follows.`;
  }
  async function send() {
    const text = input.trim();
    if (!text || loading || !sample) return;
    const history = msgs.slice(1).filter((m) => !m.error && !m.pending).map(({ role, content }) => ({ role, content })).slice(-20);
    const turns = [...history, { role: "user", content: text }];
    setMsgs((p) => [...p, { role: "user", content: text }, { role: "assistant", content: "", pending: true }]);
    setInput("");
    setLoading(true);
    const ctl = new AbortController();
    abortRef.current = ctl;
    const setLast = (m) => setMsgs((p) => {
      const c = p.slice();
      c[c.length - 1] = m;
      return c;
    });
    try {
      const res = await sample([{ role: "user", content: rulesFor() }, ...turns], {
        cache: false,
        modelTier: "quick",
        signal: ctl.signal,
        onText: ({ text: t }) => setLast({ role: "assistant", content: t, pending: true })
      });
      setLast({ role: "assistant", content: res.text.trim() });
    } catch (e) {
      if (e.code === "cancelled") setLast(e.text ? { role: "assistant", content: e.text } : { role: "assistant", content: "Stopped.", error: true });
      else if (e.text) setLast({ role: "assistant", content: e.text + "\n\n(Interrupted.)", error: true });
      else setLast({ role: "assistant", content: CHAT_ERRORS[e.code] || "Connection dropped. Try again.", error: true });
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }
  return /* @__PURE__ */ React.createElement("div", { className: `drawer ${open ? "open" : ""}`, "aria-hidden": !open }, /* @__PURE__ */ React.createElement("div", { className: "dhead" }, /* @__PURE__ */ React.createElement("b", null, "COACH"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, "aria-label": "Close chat" }, "\u2715")), /* @__PURE__ */ React.createElement("div", { className: "dbody", ref }, msgs.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: `bub ${m.role}` }, m.content || "\u2026"))), /* @__PURE__ */ React.createElement("div", { className: "din" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "coach-input",
      value: input,
      onChange: (e) => setInput(e.target.value),
      onKeyDown: (e) => e.key === "Enter" && send(),
      placeholder: "Ask your coach",
      "aria-label": "Message to coach"
    }
  ), loading ? /* @__PURE__ */ React.createElement("button", { onClick: () => abortRef.current && abortRef.current.abort() }, "Stop") : /* @__PURE__ */ React.createElement("button", { onClick: send }, "Send")));
}
const STATUS_LABEL = {
  loading: "LOADING",
  saving: "SAVING",
  account: "SAVED TO YOUR ACCOUNT",
  local: "SAVED ON THIS DEVICE"
};
export default function GymCoachApp() {
  const [dayIndex, setDayIndex] = useState(todayIndex);
  const [logs, setLogs] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [view, setView] = useState("log");
  const [sample, setSample] = useState(void 0);
  const [saveState, setSaveState] = useState("loading");
  const [storeKind, setStoreKind] = useState(null);
  const [prefs, setPrefs] = useState(loadPrefs);
  const [rest, setRest] = useState(null);
  const day = DAYS[dayIndex];
  const date = todayStr();
  const logsRef = useRef({});
  const storeRef = useRef(null);
  const pending = useRef(/* @__PURE__ */ new Set());
  const timer = useRef(null);
  const flushing = useRef(false);
  async function flush() {
    const st = storeRef.current;
    if (!st || flushing.current) return;
    flushing.current = true;
    try {
      while (pending.current.size) {
        const dates = [...pending.current];
        pending.current.clear();
        if (storeRef.current.kind === "account") {
          try {
            for (const d of dates) await storeRef.current.col.doc("d-" + d).set({ date: d, days: logsRef.current[d] || {} });
          } catch (e) {
            storeRef.current = { kind: "local" };
            setStoreKind("local");
            lsWrite(logsRef.current);
          }
        } else {
          lsWrite(logsRef.current);
        }
      }
      setSaveState("idle");
    } finally {
      flushing.current = false;
    }
  }
  function scheduleSave(d) {
    pending.current.add(d);
    setSaveState("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, 600);
  }
  useEffect(() => {
    let dead = false;
    (async () => {
      let st = await openStore();
      let loaded = {};
      try {
        if (st.kind === "account") {
          const snap = await st.col.limit(1e3).get();
          snap.docs.forEach((d) => {
            const b = d.data();
            if (b && b.date) loaded[b.date] = b.days || {};
          });
        } else loaded = lsRead();
      } catch (e) {
        st = { kind: "local" };
        loaded = lsRead();
      }
      if (dead) return;
      storeRef.current = st;
      setStoreKind(st.kind);
      const next = { ...loaded, ...logsRef.current };
      logsRef.current = next;
      setLogs(next);
      if (pending.current.size) flush();
      else setSaveState("idle");
    })();
    return () => {
      dead = true;
    };
  }, []);
  useEffect(() => {
    let dead = false;
    (async () => {
      let s = null;
      try {
        s = window.claude && window.claude.use ? await window.claude.use("sample") : null;
      } catch (e) {
      }
      if (!dead) setSample(s || null);
    })();
    return () => {
      dead = true;
    };
  }, []);
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        clearTimeout(timer.current);
        flush();
      }
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);
  useEffect(() => {
    if (view !== "log") return;
    const el = document.querySelector(".tab.on");
    if (el && el.scrollIntoView) el.scrollIntoView({ inline: "center", block: "nearest" });
  }, [dayIndex, view]);
  function changePrefs(p) {
    setPrefs(p);
    savePrefs(p);
  }
  function startRest(kind, label, secs) {
    buzz(60);
    setRest({ id: Date.now(), kind, label, total: secs, endsAt: Date.now() + secs * 1e3 });
  }
  function adjustRest(d) {
    setRest((r) => r ? { ...r, total: Math.max(5, r.total + d), endsAt: r.endsAt + d * 1e3 } : r);
  }
  function handleSetChange(exId, i, newSet) {
    const prev = logsRef.current;
    const wasDone = !!prev[date]?.[day.id]?.[exId]?.sets?.[i]?.done;
    const dateLog = { ...prev[date] || {} };
    const dayLog = { ...dateLog[day.id] || {} };
    const sets = [...dayLog[exId]?.sets || blank(day.exercises.find((e) => e.id === exId).sets)];
    sets[i] = newSet;
    dayLog[exId] = { ...dayLog[exId] || {}, sets };
    dateLog[day.id] = dayLog;
    const next = { ...prev, [date]: dateLog };
    logsRef.current = next;
    setLogs(next);
    scheduleSave(date);
    if (newSet.done && !wasDone) {
      if (sets.every((s) => s.done)) {
        const nextEx = day.exercises[day.exercises.findIndex((e) => e.id === exId) + 1];
        if (nextEx) startRest("exercise", "Next: " + effName(nextEx, dayLog[nextEx.id]), prefs.exRest);
        else setRest(null);
      } else {
        const nextSet = sets.findIndex((s) => !s.done);
        startRest("set", "Next: set " + (nextSet + 1) + " of " + sets.length, prefs.setRest);
      }
    }
  }
  function handleToggleAlt(exId) {
    const prev = logsRef.current;
    const ex = day.exercises.find((e) => e.id === exId);
    const dateLog = { ...prev[date] || {} };
    const dayLog = { ...dateLog[day.id] || {} };
    const cur = dayLog[exId] || { sets: blank(ex.sets) };
    dayLog[exId] = { ...cur, alt: !cur.alt };
    dateLog[day.id] = dayLog;
    const next = { ...prev, [date]: dateLog };
    logsRef.current = next;
    setLogs(next);
    scheduleSave(date);
  }
  const history = useMemo(() => buildHistory(logs), [logs]);
  const total = day.exercises.reduce((n, e) => n + e.sets, 0);
  const done = day.exercises.reduce((n, e) => n + (logs[date]?.[day.id]?.[e.id]?.sets || []).filter((s) => s.done).length, 0);
  const statusKey = saveState === "idle" ? storeKind : saveState;
  return /* @__PURE__ */ React.createElement("div", { className: "root" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement("div", { className: "top" }, /* @__PURE__ */ React.createElement("div", { className: "brand" }, "PPL", /* @__PURE__ */ React.createElement("span", null, "."), "LOG"), /* @__PURE__ */ React.createElement("div", { className: "toggle" }, /* @__PURE__ */ React.createElement("button", { className: view === "log" ? "on" : "", onClick: () => setView("log") }, "LOG"), /* @__PURE__ */ React.createElement("button", { className: view === "progress" ? "on" : "", onClick: () => setView("progress") }, "PROGRESS"), /* @__PURE__ */ React.createElement("button", { className: view === "record" ? "on" : "", onClick: () => setView("record") }, "RECORD"))), /* @__PURE__ */ React.createElement("div", { className: "datebar" }, /* @__PURE__ */ React.createElement("span", { className: "date" }, fmt(date)), /* @__PURE__ */ React.createElement("span", { className: "save", "aria-live": "polite" }, STATUS_LABEL[statusKey] || "")), view === "log" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tabs" }, DAYS.map((d, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: d.id,
      className: `tab ${i === dayIndex ? "on" : ""}`,
      style: i === dayIndex ? { background: COLORS[d.type] } : {},
      onClick: () => setDayIndex(i)
    },
    d.label
  ))), /* @__PURE__ */ React.createElement("div", { className: "dh" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "dt" }, day.label), /* @__PURE__ */ React.createElement("div", { className: "ds" }, day.sub)), total > 0 && /* @__PURE__ */ React.createElement("div", { className: "pill" }, done, "/", total, " sets")), day.exercises.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "rest" }, /* @__PURE__ */ React.createElement("div", { className: "big" }, "Rest day."), "Sleep, eat, walk. Muscle grows while you recover.") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    RestConfig,
    {
      prefs,
      onChange: changePrefs,
      onStart: (kind) => startRest(kind, kind === "set" ? "Get back to your next set" : "Get ready for your next exercise", kind === "set" ? prefs.setRest : prefs.exRest)
    }
  ), day.exercises.map((ex) => {
    const l = logs[date]?.[day.id]?.[ex.id];
    const hs = history.byName[effName(ex, l)]?.sessions || [];
    const prev = hs.filter((s) => s.date < date).reduce((mx, s) => Math.max(mx, s.top), 0);
    const today = hs.find((s) => s.date === date);
    const isPR = prev > 0 && !!today && today.top > prev;
    return /* @__PURE__ */ React.createElement(
      ExerciseCard,
      {
        key: ex.id,
        exercise: ex,
        log: l,
        isPR,
        onSetChange: handleSetChange,
        onToggleAlt: handleToggleAlt,
        color: COLORS[day.type]
      }
    );
  }))), view === "progress" && /* @__PURE__ */ React.createElement(ProgressView, { history: history.byName, prs: history.prs }), view === "record" && /* @__PURE__ */ React.createElement(RecordView, { logs })), (rest || sample !== null) && /* @__PURE__ */ React.createElement("div", { className: "dock" }, rest && /* @__PURE__ */ React.createElement(RestBar, { rest, color: COLORS[day.type], onAdjust: adjustRest, onClose: () => setRest(null) }), sample !== null && /* @__PURE__ */ React.createElement("button", { className: "fab", onClick: () => setChatOpen(true) }, "ASK COACH")), sample !== null && /* @__PURE__ */ React.createElement(
    ChatDrawer,
    {
      open: chatOpen,
      onClose: () => setChatOpen(false),
      day,
      todayLog: logs[date]?.[day.id],
      sample
    }
  ));
}
