import { useState, useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Workout data — standard 6-day Push/Pull/Legs cycle, repeated twice weekly
// (Edit exercises/sets freely below.)
// ---------------------------------------------------------------------------
const DAYS = [
  {
    id: "push-a",
    label: "PUSH A",
    sub: "Chest focus",
    type: "push",
    exercises: [
      { id: "p1", name: "Barbell Bench Press", sets: 4, reps: "6-8", bodyPart: "Chest" },
      { id: "p2", name: "Incline DB Press", sets: 3, reps: "8-10", bodyPart: "Chest" },
      { id: "p3", name: "Overhead Press", sets: 3, reps: "8", bodyPart: "Shoulders" },
      { id: "p4", name: "Cable Fly", sets: 3, reps: "12", bodyPart: "Chest" },
      { id: "p5", name: "Triceps Pushdown", sets: 3, reps: "12", bodyPart: "Triceps" },
      { id: "p6", name: "Lateral Raise", sets: 3, reps: "15", bodyPart: "Shoulders" },
    ],
  },
  {
    id: "pull-a",
    label: "PULL A",
    sub: "Back width",
    type: "pull",
    exercises: [
      { id: "pl1", name: "Deadlift", sets: 3, reps: "5", bodyPart: "Back" },
      { id: "pl2", name: "Pull-ups", sets: 4, reps: "AMRAP", bodyPart: "Back" },
      { id: "pl3", name: "Barbell Row", sets: 3, reps: "8", bodyPart: "Back" },
      { id: "pl4", name: "Face Pull", sets: 3, reps: "15", bodyPart: "Rear Delts" },
      { id: "pl5", name: "Barbell Curl", sets: 3, reps: "10", bodyPart: "Biceps" },
      { id: "pl6", name: "Hammer Curl", sets: 3, reps: "12", bodyPart: "Biceps" },
    ],
  },
  {
    id: "legs-a",
    label: "LEGS A",
    sub: "Quad focus",
    type: "legs",
    exercises: [
      { id: "l1", name: "Back Squat", sets: 4, reps: "6", bodyPart: "Quads" },
      { id: "l2", name: "Leg Press", sets: 3, reps: "10", bodyPart: "Quads" },
      { id: "l3", name: "Walking Lunge", sets: 3, reps: "12/leg", bodyPart: "Quads/Glutes" },
      { id: "l4", name: "Leg Extension", sets: 3, reps: "15", bodyPart: "Quads" },
      { id: "l5", name: "Standing Calf Raise", sets: 4, reps: "15", bodyPart: "Calves" },
      { id: "l6", name: "Plank", sets: 3, reps: "45s", bodyPart: "Core" },
    ],
  },
  {
    id: "push-b",
    label: "PUSH B",
    sub: "Shoulder focus",
    type: "push",
    exercises: [
      { id: "p7", name: "Overhead Press", sets: 4, reps: "6", bodyPart: "Shoulders" },
      { id: "p8", name: "Incline Barbell Press", sets: 3, reps: "8", bodyPart: "Chest" },
      { id: "p9", name: "DB Shoulder Press", sets: 3, reps: "10", bodyPart: "Shoulders" },
      { id: "p10", name: "Cable Crossover", sets: 3, reps: "12", bodyPart: "Chest" },
      { id: "p11", name: "Skullcrusher", sets: 3, reps: "10", bodyPart: "Triceps" },
      { id: "p12", name: "Lateral Raise", sets: 3, reps: "15", bodyPart: "Shoulders" },
    ],
  },
  {
    id: "pull-b",
    label: "PULL B",
    sub: "Back thickness",
    type: "pull",
    exercises: [
      { id: "pl7", name: "Barbell Row", sets: 4, reps: "6", bodyPart: "Back" },
      { id: "pl8", name: "Lat Pulldown", sets: 3, reps: "10", bodyPart: "Back" },
      { id: "pl9", name: "Seated Cable Row", sets: 3, reps: "10", bodyPart: "Back" },
      { id: "pl10", name: "Rear Delt Fly", sets: 3, reps: "15", bodyPart: "Rear Delts" },
      { id: "pl11", name: "Preacher Curl", sets: 3, reps: "10", bodyPart: "Biceps" },
      { id: "pl12", name: "EZ Bar Curl", sets: 3, reps: "12", bodyPart: "Biceps" },
    ],
  },
  {
    id: "legs-b",
    label: "LEGS B",
    sub: "Posterior focus",
    type: "legs",
    exercises: [
      { id: "l7", name: "Romanian Deadlift", sets: 4, reps: "8", bodyPart: "Hamstrings" },
      { id: "l8", name: "Front Squat", sets: 3, reps: "8", bodyPart: "Quads" },
      { id: "l9", name: "Leg Curl", sets: 3, reps: "12", bodyPart: "Hamstrings" },
      { id: "l10", name: "Bulgarian Split Squat", sets: 3, reps: "10/leg", bodyPart: "Glutes" },
      { id: "l11", name: "Seated Calf Raise", sets: 4, reps: "15", bodyPart: "Calves" },
      { id: "l12", name: "Hanging Leg Raise", sets: 3, reps: "12", bodyPart: "Core" },
    ],
  },
  {
    id: "rest",
    label: "REST",
    sub: "Recovery day",
    type: "rest",
    exercises: [],
  },
];

const TYPE_COLORS = {
  push: "var(--push)",
  pull: "var(--pull)",
  legs: "var(--legs)",
  rest: "var(--rest)",
};

const DAY_BY_ID = Object.fromEntries(DAYS.map((d) => [d.id, d]));
const STORAGE_KEY = "ppl-logs-v2";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

// ---------------------------------------------------------------------------

function PlateStack({ total, done, color }) {
  const plates = Array.from({ length: total });
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {plates.map((_, i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 22,
            borderRadius: 3,
            background: i < done ? color : "var(--surface-2)",
            border: `1.5px solid ${i < done ? color : "var(--line)"}`,
            transition: "background 150ms ease, border-color 150ms ease",
          }}
        />
      ))}
    </div>
  );
}

function ExerciseCard({ exercise, log, onSetChange, color }) {
  const setsArr = log?.sets || Array.from({ length: exercise.sets }, () => ({ weight: "", done: false }));
  const doneCount = setsArr.filter((s) => s.done).length;

  return (
    <div className="ex-card">
      <div className="ex-head">
        <div>
          <div className="ex-name">{exercise.name}</div>
          <div className="ex-meta">
            {exercise.sets} × {exercise.reps}
            <span className="body-tag" style={{ borderColor: color, color }}>{exercise.bodyPart}</span>
          </div>
        </div>
        <PlateStack total={exercise.sets} done={doneCount} color={color} />
      </div>
      <div className="set-row">
        {setsArr.map((s, i) => (
          <div key={i} className="set-cell">
            <span className="set-label">SET {i + 1}</span>
            <input
              className="weight-input"
              type="text"
              inputMode="decimal"
              placeholder="kg"
              value={s.weight}
              onChange={(e) => onSetChange(exercise.id, i, { ...s, weight: e.target.value })}
            />
            <button
              className={`done-btn ${s.done ? "done" : ""}`}
              style={s.done ? { background: color, borderColor: color } : {}}
              onClick={() => onSetChange(exercise.id, i, { ...s, done: !s.done })}
              aria-label={s.done ? "Mark set not done" : "Mark set done"}
            >
              {s.done ? "✓" : ""}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecordView({ logs }) {
  const dates = Object.keys(logs).sort((a, b) => (a < b ? 1 : -1));
  const [openDate, setOpenDate] = useState(null);

  const sessions = dates
    .map((date) => {
      const dayEntries = Object.entries(logs[date] || {});
      const perDay = dayEntries
        .map(([dayId, exLogs]) => {
          const dayMeta = DAY_BY_ID[dayId];
          if (!dayMeta) return null;
          let doneSets = 0;
          let totalSets = 0;
          let topWeight = 0;
          Object.values(exLogs).forEach((exLog) => {
            (exLog.sets || []).forEach((s) => {
              totalSets += 1;
              if (s.done) doneSets += 1;
              const w = parseFloat(s.weight);
              if (!isNaN(w) && w > topWeight) topWeight = w;
            });
          });
          return { dayId, dayMeta, exLogs, doneSets, totalSets, topWeight };
        })
        .filter((d) => d && d.doneSets > 0);
      return perDay.length ? { date, perDay } : null;
    })
    .filter(Boolean);

  if (!sessions.length) {
    return (
      <div className="rest-panel">
        <div className="big">No sessions logged yet.</div>
        Check off sets on a training day and they'll show up here.
      </div>
    );
  }

  return (
    <div>
      {sessions.map(({ date, perDay }) => (
        <div key={date} style={{ marginBottom: 14 }}>
          <div className="record-date">{formatDate(date)}</div>
          {perDay.map(({ dayId, dayMeta, exLogs, doneSets, totalSets, topWeight }) => {
            const key = date + dayId;
            const isOpen = openDate === key;
            return (
              <div key={key} className="record-card">
                <button className="record-summary" onClick={() => setOpenDate(isOpen ? null : key)}>
                  <span className="record-dot" style={{ background: TYPE_COLORS[dayMeta.type] }} />
                  <span className="record-label">{dayMeta.label}</span>
                  <span className="record-stats">
                    {doneSets}/{totalSets} sets{topWeight ? ` · top ${topWeight}kg` : ""}
                  </span>
                  <span className="record-chevron">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="record-detail">
                    {dayMeta.exercises.map((ex) => {
                      const exLog = exLogs[ex.id];
                      if (!exLog) return null;
                      const doneList = exLog.sets.filter((s) => s.done);
                      if (!doneList.length) return null;
                      return (
                        <div key={ex.id} className="record-ex-row">
                          <span className="record-ex-name">
                            {ex.name}
                            <span className="record-ex-part">{ex.bodyPart}</span>
                          </span>
                          <span className="record-ex-weights">
                            {exLog.sets.map((s) => (s.done ? (s.weight || "—") : null)).filter(Boolean).join(" / ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ChatDrawer({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Coach chat isn't connected yet. It will be switched on in a later step." },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "assistant", text: "Coach chat is not connected yet." },
    ]);
    setInput("");
  }

  return (
    <div className={`drawer ${open ? "open" : ""}`}>
      <div className="drawer-head">
        <span>COACH</span>
        <button className="close-btn" onClick={onClose} aria-label="Close chat">✕</button>
      </div>
      <div className="drawer-body" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="drawer-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask your coach…"
        />
        <button onClick={send}>→</button>
      </div>
    </div>
  );
}

export default function GymCoachApp() {
  const [dayIndex, setDayIndex] = useState(0);
  const [logs, setLogs] = useState({}); // { [date]: { [dayId]: { [exId]: { sets: [...] } } } }
  const [chatOpen, setChatOpen] = useState(false);
  const [view, setView] = useState("log"); // "log" | "record"
  const [loaded, setLoaded] = useState(false);
  const day = DAYS[dayIndex];
  const date = todayStr();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLogs(JSON.parse(saved));
    } catch (e) {
      // no saved logs yet
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      // storage unavailable
    }
  }, [logs, loaded]);

  function handleSetChange(exerciseId, setIndex, newSet) {
    setLogs((prev) => {
      const dateLog = { ...(prev[date] || {}) };
      const dayLog = { ...(dateLog[day.id] || {}) };
      const exLog = dayLog[exerciseId] || {
        sets: Array.from({ length: day.exercises.find((e) => e.id === exerciseId).sets }, () => ({ weight: "", done: false })),
      };
      const sets = [...exLog.sets];
      sets[setIndex] = newSet;
      dayLog[exerciseId] = { sets };
      dateLog[day.id] = dayLog;
      return { ...prev, [date]: dateLog };
    });
  }

  const totalSets = day.exercises.reduce((n, e) => n + e.sets, 0);
  const doneSets = day.exercises.reduce((n, e) => {
    const l = logs[date]?.[day.id]?.[e.id]?.sets || [];
    return n + l.filter((s) => s.done).length;
  }, 0);

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');

        :root {
          --bg: #131110;
          --surface: #1D1917;
          --surface-2: #262019;
          --line: #35291f;
          --chalk: #F3EEE4;
          --muted: #948B7E;
          --push: #FF5A36;
          --pull: #3FA9F5;
          --legs: #F0BE3D;
          --rest: #6B6259;
        }
        html, body, #root { margin: 0; padding: 0; background: #131110; min-height: 100vh; }
        * { box-sizing: border-box; }
        .app-root {
          background: var(--bg);
          color: var(--chalk);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          position: relative;
          padding: 20px 16px 100px;
          overflow-x: hidden;
        }
        .top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }
        .brand {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 22px;
          letter-spacing: 1px;
        }
        .brand span { color: var(--push); }
        .view-toggle {
          display: flex;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 8px;
          overflow: hidden;
        }
        .view-toggle button {
          background: transparent;
          border: none;
          color: var(--muted);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.5px;
          padding: 7px 12px;
          cursor: pointer;
        }
        .view-toggle button.active {
          background: var(--surface-2);
          color: var(--chalk);
        }
        .tagline {
          color: var(--muted);
          font-size: 12px;
          margin-bottom: 18px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.5px;
        }
        .day-tabs {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 10px;
          margin-bottom: 18px;
          border-bottom: 1px solid var(--line);
        }
        .day-tab {
          flex: 0 0 auto;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          font-family: 'Oswald', sans-serif;
          font-size: 13px;
          letter-spacing: 0.5px;
          color: var(--muted);
          transition: all 150ms ease;
        }
        .day-tab.active {
          color: var(--bg);
          border-color: transparent;
        }
        .day-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 16px;
        }
        .day-title {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 28px;
          letter-spacing: 0.5px;
        }
        .day-sub {
          color: var(--muted);
          font-size: 13px;
          margin-top: 2px;
        }
        .progress-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 6px 12px;
          color: var(--chalk);
        }
        .ex-card {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 12px;
        }
        .ex-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .ex-name {
          font-family: 'Oswald', sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .ex-meta {
          font-family: 'JetBrains Mono', monospace;
          color: var(--muted);
          font-size: 12px;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .body-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.3px;
          border: 1px solid;
          border-radius: 999px;
          padding: 2px 8px;
        }
        .set-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .set-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: var(--surface-2);
          border-radius: 8px;
          padding: 8px;
          min-width: 66px;
        }
        .set-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: var(--muted);
          letter-spacing: 0.5px;
        }
        .weight-input {
          width: 50px;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--line);
          color: var(--chalk);
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          text-align: center;
          padding: 2px 0;
          outline: none;
        }
        .weight-input:focus { border-color: var(--muted); }
        .done-btn {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: 1.5px solid var(--line);
          background: transparent;
          color: var(--bg);
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rest-panel {
          text-align: center;
          padding: 60px 20px;
          color: var(--muted);
        }
        .rest-panel .big {
          font-family: 'Oswald', sans-serif;
          font-size: 24px;
          color: var(--chalk);
          margin-bottom: 8px;
        }
        .record-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.5px;
          color: var(--muted);
          margin-bottom: 6px;
        }
        .record-card {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 10px;
          margin-bottom: 8px;
          overflow: hidden;
        }
        .record-summary {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          padding: 12px 14px;
          cursor: pointer;
          color: var(--chalk);
          text-align: left;
        }
        .record-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          flex: 0 0 auto;
        }
        .record-label {
          font-family: 'Oswald', sans-serif;
          font-size: 13px;
          letter-spacing: 0.5px;
        }
        .record-stats {
          margin-left: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--muted);
        }
        .record-chevron {
          color: var(--muted);
          font-size: 15px;
          width: 14px;
          text-align: center;
        }
        .record-detail {
          padding: 0 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .record-ex-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 12.5px;
          border-top: 1px solid var(--line);
          padding-top: 6px;
        }
        .record-ex-name { color: var(--chalk); }
        .record-ex-part {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--muted);
          margin-left: 8px;
        }
        .record-ex-weights {
          font-family: 'JetBrains Mono', monospace;
          color: var(--muted);
          white-space: nowrap;
        }
        .fab {
          position: fixed;
          bottom: 22px;
          right: 22px;
          background: var(--push);
          color: var(--bg);
          border: none;
          border-radius: 999px;
          padding: 13px 20px;
          font-family: 'Oswald', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.5px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(255,90,54,0.35);
          z-index: 20;
        }
        .drawer {
          position: fixed;
          top: 0;
          right: -100%;
          width: min(380px, 100%);
          height: 100%;
          background: var(--surface);
          border-left: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          transition: right 220ms ease;
          z-index: 30;
        }
        .drawer.open { right: 0; }
        .drawer-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--line);
          font-family: 'Oswald', sans-serif;
          letter-spacing: 1px;
          font-size: 13px;
          color: var(--muted);
        }
        .close-btn {
          background: none;
          border: none;
          color: var(--muted);
          font-size: 16px;
          cursor: pointer;
        }
        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .bubble {
          max-width: 85%;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          line-height: 1.45;
        }
        .bubble.user {
          align-self: flex-end;
          background: var(--push);
          color: var(--bg);
        }
        .bubble.assistant {
          align-self: flex-start;
          background: var(--surface-2);
          color: var(--chalk);
          border: 1px solid var(--line);
        }
        .drawer-input {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid var(--line);
        }
        .drawer-input input {
          flex: 1;
          background: var(--surface-2);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 9px 12px;
          color: var(--chalk);
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          outline: none;
        }
        .drawer-input button {
          background: var(--push);
          border: none;
          color: var(--bg);
          border-radius: 8px;
          width: 38px;
          font-size: 15px;
          cursor: pointer;
        }
        @media (max-width: 480px) {
          .day-title { font-size: 22px; }
        }
      `}</style>

      <div className="top-row">
        <div>
          <div className="brand">IRON<span>LOG</span></div>
          <div className="tagline">6-DAY PUSH / PULL / LEGS · REPEAT</div>
        </div>
        <div className="view-toggle">
          <button className={view === "log" ? "active" : ""} onClick={() => setView("log")}>TODAY</button>
          <button className={view === "record" ? "active" : ""} onClick={() => setView("record")}>RECORD</button>
        </div>
      </div>

      {view === "log" ? (
        <>
          <div className="day-tabs">
            {DAYS.map((d, i) => (
              <button
                key={d.id}
                className={`day-tab ${i === dayIndex ? "active" : ""}`}
                style={i === dayIndex ? { background: TYPE_COLORS[d.type] } : {}}
                onClick={() => setDayIndex(i)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="day-header">
            <div>
              <div className="day-title">{day.label}</div>
              <div className="day-sub">{day.sub}</div>
            </div>
            {day.type !== "rest" && (
              <div className="progress-pill">{doneSets}/{totalSets} SETS</div>
            )}
          </div>

          {day.type === "rest" ? (
            <div className="rest-panel">
              <div className="big">No lifts today.</div>
              Sleep, protein, and light walking do the work now.
            </div>
          ) : (
            day.exercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                log={logs[date]?.[day.id]?.[ex.id]}
                onSetChange={handleSetChange}
                color={TYPE_COLORS[day.type]}
              />
            ))
          )}
        </>
      ) : (
        <RecordView logs={logs} />
      )}

      <button className="fab" onClick={() => setChatOpen(true)}>ASK COACH</button>
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
