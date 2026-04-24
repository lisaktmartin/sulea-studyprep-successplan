import { useState } from "react";

const EXAMS = {
  "2026-05-11": { subject: "Economie",       emoji: "📈", color: "#E8A838" },
  "2026-05-12": { subject: "Geschiedenis",   emoji: "📜", color: "#C0694A" },
  "2026-05-18": { subject: "Engels",         emoji: "🇬🇧", color: "#4A90C0" },
  "2026-05-19": { subject: "Wiskunde",       emoji: "📐", color: "#8B5CF6" },
  "2026-05-20": { subject: "Biologie",       emoji: "🌿", color: "#3DAA6E" },
  "2026-05-21": { subject: "Aardrijkskunde", emoji: "🌍", color: "#2E7BB5" },
};

const EXAM_TRAINING = {
  "2026-04-29": { subject: "Wiskunde training",   emoji: "📐", color: "#8B5CF6", day: 1 },
  "2026-04-30": { subject: "Wiskunde training",   emoji: "📐", color: "#8B5CF6", day: 2 },
  "2026-05-01": { subject: "Nederlands training", emoji: "🇳🇱", color: "#E8A838", day: 1 },
  "2026-05-02": { subject: "Nederlands training", emoji: "🇳🇱", color: "#E8A838", day: 2 },
};

const KONINGS_DAYS = {
  "2026-04-26": { label: "Koningsnacht", emoji: "🎉", color: "#E84B1A" },
  "2026-04-27": { label: "Koningsdag",   emoji: "👑", color: "#E84B1A" },
};

const ALL_SUBJECTS = [
  { name: "Economie",       emoji: "📈", color: "#E8A838" },
  { name: "Geschiedenis",   emoji: "📜", color: "#C0694A" },
  { name: "Engels",         emoji: "🇬🇧", color: "#4A90C0" },
  { name: "Wiskunde",       emoji: "📐", color: "#8B5CF6" },
  { name: "Biologie",       emoji: "🌿", color: "#3DAA6E" },
  { name: "Aardrijkskunde", emoji: "🌍", color: "#2E7BB5" },
  { name: "Nederlands",     emoji: "🇳🇱", color: "#E84B1A" },
];

const ALL_ACTIVITIES = [
  { name: "Hardlopen",   emoji: "🏃", color: "#3DAA6E" },
  { name: "Fietsen",     emoji: "🚴", color: "#3DAA6E" },
  { name: "Zwemmen",     emoji: "🏊", color: "#4A90C0" },
  { name: "Yoga",        emoji: "🧘", color: "#8B5CF6" },
  { name: "Wandelen",    emoji: "🚶", color: "#3DAA6E" },
  { name: "Gym",         emoji: "🏋️", color: "#C0694A" },
  { name: "Film kijken", emoji: "🎬", color: "#8B5CF6" },
  { name: "Vriendinnen", emoji: "👯", color: "#E8A838" },
  { name: "Uitslapen",   emoji: "😴", color: "#4A90C0" },
  { name: "Muziek",      emoji: "🎵", color: "#C0694A" },
];

const DAY_TYPES = {
  study: { label: "Studeren", color: "#3B4F7C", bg: "#EEF1FA", icon: "📚" },
  sport: { label: "Sport",    color: "#3DAA6E", bg: "#EBF7F1", icon: "🏃" },
  rest:  { label: "Rust",     color: "#C0694A", bg: "#FAF0EE", icon: "😴" },
  free:  { label: "Vrij",     color: "#8B5CF6", bg: "#F3EFFE", icon: "🎉" },
};

const DEFAULT_SCHEDULE = {
  "2026-04-24": { type: "study", subjects: ["Economie","Geschiedenis"],    activities: [] },
  "2026-04-25": { type: "sport", subjects: [],                             activities: ["Hardlopen"] },
  "2026-04-28": { type: "study", subjects: ["Engels","Biologie"],          activities: [] },
  "2026-05-03": { type: "rest",  subjects: [],                             activities: ["Uitslapen"] },
  "2026-05-04": { type: "study", subjects: ["Biologie","Aardrijkskunde"],  activities: [] },
  "2026-05-05": { type: "study", subjects: ["Aardrijkskunde","Economie"],  activities: [] },
  "2026-05-06": { type: "study", subjects: ["Economie","Geschiedenis"],    activities: [] },
  "2026-05-07": { type: "study", subjects: ["Geschiedenis","Engels"],      activities: [] },
  "2026-05-08": { type: "study", subjects: ["Engels","Biologie"],          activities: [] },
  "2026-05-09": { type: "sport", subjects: [],                             activities: ["Fietsen"] },
  "2026-05-10": { type: "study", subjects: ["Economie","Geschiedenis"],    activities: [] },
  "2026-05-13": { type: "study", subjects: ["Engels","Wiskunde"],          activities: [] },
  "2026-05-14": { type: "study", subjects: ["Wiskunde","Biologie"],        activities: [] },
  "2026-05-15": { type: "study", subjects: ["Biologie","Aardrijkskunde"],  activities: [] },
  "2026-05-16": { type: "sport", subjects: [],                             activities: ["Wandelen"] },
  "2026-05-17": { type: "study", subjects: ["Aardrijkskunde","Engels"],    activities: [] },
};

const STUDY_TIPS = [
  { icon: "🍅", title: "Pomodoro Techniek",  tip: "Studeer 25 min gefocust, rust dan 5 min. Na 4 rondjes: 20 min pauze." },
  { icon: "🧠", title: "Active Recall",      tip: "Test jezelf! Sluit je boek en schrijf op wat je weet." },
  { icon: "🔄", title: "Spaced Repetition",  tip: "Herhaal stof met toenemende tussenpozen. Gebruik Anki of kaartjes." },
  { icon: "✍️", title: "Mind Maps",          tip: "Visualiseer verbanden. Helpt bij aardrijkskunde en geschiedenis." },
  { icon: "😴", title: "Slaap is Cruciaal",  tip: "Plan 8 uur slaap — zeker na intensieve studiemomenten." },
  { icon: "🚶", title: "Beweeg Elke Dag",    tip: "20 min wandelen verhoogt concentratie en verlaagt stress." },
];

function getDatesInRange(start, end) {
  const dates = [];
  const cur = new Date(start);
  while (cur <= end) { dates.push(new Date(cur)); cur.setDate(cur.getDate() + 1); }
  return dates;
}
function fmt(date) { return date.toISOString().split("T")[0]; }
const NL_DAYS   = ["zo","ma","di","wo","do","vr","za"];
const NL_MONTHS = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];

function DayModal({ dateStr, plan, onSave, onClose }) {
  const date = new Date(dateStr);
  const [type,       setType]       = useState(plan?.type       ?? "study");
  const [subjects,   setSubjects]   = useState(plan?.subjects   ?? []);
  const [activities, setActivities] = useState(plan?.activities ?? []);

  function toggleSubject(name) {
    setSubjects(s => s.includes(name) ? s.filter(x => x !== name) : [...s, name]);
  }
  function toggleActivity(name) {
    setActivities(a => a.includes(name) ? a.filter(x => x !== name) : [...a, name]);
  }

  const dayLabel = `${NL_DAYS[date.getDay()]} ${date.getDate()} ${NL_MONTHS[date.getMonth()]}`;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "flex-end",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#F7F4EF", width: "100%", borderRadius: "22px 22px 0 0",
        maxHeight: "88vh", overflowY: "auto",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
      }}>
        {/* Handle bar */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 2px" }}>
          <div style={{ width: 44, height: 4, borderRadius: 2, background: "#DDD" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "10px 20px 16px", borderBottom: "1px solid #EEE", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: 2, marginBottom: 3 }}>Dag plannen</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{dayLabel}</div>
          </div>
          <button onClick={onClose} style={{
            background: "#EBEBEB", border: "none", borderRadius: "50%",
            width: 34, height: 34, cursor: "pointer", fontSize: 15,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        <div style={{ padding: "18px 20px 8px" }}>

          {/* Day type */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#AAA", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Type dag</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {Object.entries(DAY_TYPES).map(([key, dt]) => (
                <button key={key} onClick={() => setType(key)} style={{
                  padding: "11px 12px", borderRadius: 12, cursor: "pointer",
                  border: type === key ? `2px solid ${dt.color}` : "2px solid #E8E8E8",
                  background: type === key ? dt.bg : "#FFF",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
                  color: type === key ? dt.color : "#AAA",
                  display: "flex", alignItems: "center", gap: 7, transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 20 }}>{dt.icon}</span>{dt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#AAA", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
              📚 Vakken <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(meerdere mogelijk)</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALL_SUBJECTS.map(s => {
                const sel = subjects.includes(s.name);
                return (
                  <button key={s.name} onClick={() => toggleSubject(s.name)} style={{
                    padding: "8px 14px", borderRadius: 99, cursor: "pointer",
                    border: sel ? `2px solid ${s.color}` : "2px solid #E4E4E4",
                    background: sel ? `${s.color}18` : "#FFF",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                    color: sel ? s.color : "#999", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    {s.emoji} {s.name}
                    {sel && <span style={{ fontSize: 12, marginLeft: 2 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activities */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#AAA", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
              🎯 Activiteiten <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(meerdere mogelijk)</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALL_ACTIVITIES.map(a => {
                const sel = activities.includes(a.name);
                return (
                  <button key={a.name} onClick={() => toggleActivity(a.name)} style={{
                    padding: "8px 14px", borderRadius: 99, cursor: "pointer",
                    border: sel ? `2px solid ${a.color}` : "2px solid #E4E4E4",
                    background: sel ? `${a.color}18` : "#FFF",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                    color: sel ? a.color : "#999", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    {a.emoji} {a.name}
                    {sel && <span style={{ fontSize: 12, marginLeft: 2 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary of selection */}
          {(subjects.length > 0 || activities.length > 0) && (
            <div style={{
              background: "#FFF", borderRadius: 12, padding: "12px 14px",
              marginBottom: 16, border: "1px solid #E8E8E8",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#AAA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Jouw planning</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {subjects.map(name => {
                  const s = ALL_SUBJECTS.find(x => x.name === name);
                  return s ? (
                    <span key={name} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, background: `${s.color}18`, color: s.color, fontWeight: 600 }}>
                      {s.emoji} {s.name}
                    </span>
                  ) : null;
                })}
                {activities.map(name => {
                  const a = ALL_ACTIVITIES.find(x => x.name === name);
                  return a ? (
                    <span key={name} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, background: `${a.color}18`, color: a.color, fontWeight: 600 }}>
                      {a.emoji} {a.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Save button */}
          <button onClick={() => onSave(dateStr, { type, subjects, activities })} style={{
            width: "100%", padding: "15px", borderRadius: 14, cursor: "pointer",
            background: "linear-gradient(135deg, #2E3A6E, #3B4F9C)",
            color: "#FFF", border: "none",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15,
            boxShadow: "0 4px 20px rgba(46,58,110,0.3)",
            marginBottom: 8,
          }}>
            ✓ Dag opslaan
          </button>

          <button onClick={() => onSave(dateStr, null)} style={{
            width: "100%", padding: "11px", borderRadius: 14, cursor: "pointer",
            background: "transparent", color: "#AAA", border: "none",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
            marginBottom: 4,
          }}>
            Wissen
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudyCalendar() {
  const today     = new Date("2026-04-24");
  const endDate   = new Date("2026-05-21");
  const firstExam = new Date("2026-05-11");

  const [plans,     setPlans]     = useState(DEFAULT_SCHEDULE);
  const [activeTab, setActiveTab] = useState("calendar");
  const [modalDate, setModalDate] = useState(null);

  const allDates   = getDatesInRange(today, endDate);
  const daysToExam = Math.ceil((firstExam - today) / (1000 * 60 * 60 * 24));

  function openDay(ds) {
    if (EXAMS[ds] || EXAM_TRAINING[ds] || KONINGS_DAYS[ds]) return;
    setModalDate(ds);
  }

  function saveDay(ds, data) {
    setPlans(p => {
      const next = { ...p };
      if (data === null) delete next[ds]; else next[ds] = data;
      return next;
    });
    setModalDate(null);
  }

  const weeks = [];
  let week = [];
  allDates.forEach((d, i) => {
    if (i === 0) {
      const dow = d.getDay();
      const offset = dow === 0 ? 6 : dow - 1;
      for (let j = 0; j < offset; j++) week.push(null);
    }
    week.push(d);
    if (d.getDay() === 0 || i === allDates.length - 1) {
      while (week.length < 7) week.push(null);
      weeks.push(week); week = [];
    }
  });

  const studyCount = allDates.filter(d => plans[fmt(d)]?.type === "study").length;
  const sportCount = allDates.filter(d => plans[fmt(d)]?.type === "sport").length;
  const restCount  = allDates.filter(d => ["rest","free"].includes(plans[fmt(d)]?.type)).length;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7F4EF", minHeight: "100vh", color: "#1C1C2E" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />

      {modalDate && (
        <DayModal dateStr={modalDate} plan={plans[modalDate]} onSave={saveDay} onClose={() => setModalDate(null)} />
      )}

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1C1C2E 0%, #2E3A6E 60%, #3B4F9C 100%)",
        padding: "34px 20px 22px", color: "white", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, background:"rgba(255,255,255,0.04)", borderRadius:"50%" }} />
        <p style={{ margin:0, fontSize:10, letterSpacing:3, textTransform:"uppercase", opacity:0.6 }}>HAVO Eindexamen 2026</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, margin:"8px 0 4px", lineHeight:1.1 }}>Studiekalender 📖</h1>
        <p style={{ margin:0, opacity:0.7, fontSize:12 }}>Tik een dag aan om te plannen</p>

        <div style={{ marginTop:18, background:"rgba(255,255,255,0.1)", backdropFilter:"blur(8px)", borderRadius:14, padding:"13px 16px", display:"flex", alignItems:"center", gap:14, border:"1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:38, fontWeight:700, lineHeight:1, fontFamily:"'Playfair Display',serif" }}>{daysToExam}</div>
            <div style={{ fontSize:9, opacity:0.7, letterSpacing:1.5, textTransform:"uppercase", marginTop:2 }}>dagen</div>
          </div>
          <div style={{ width:1, height:40, background:"rgba(255,255,255,0.2)" }} />
          <div>
            <div style={{ fontSize:12, fontWeight:600 }}>🎯 Eerste examen: <strong>Economie</strong></div>
            <div style={{ fontSize:11, opacity:0.7, marginTop:3 }}>maandag 11 mei · 6 vakken</div>
          </div>
        </div>

        <div style={{ marginTop:12, padding:"11px 14px", borderLeft:"3px solid #E8A838", background:"rgba(232,168,56,0.1)", borderRadius:"0 12px 12px 0" }}>
          <p style={{ margin:0, fontSize:12, fontStyle:"italic", lineHeight:1.5 }}>"Success is the sum of small efforts, repeated day in and day out."</p>
          <p style={{ margin:"4px 0 0", fontSize:10, opacity:0.6 }}>— Robert Collier</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"2px solid #E5E0D8", background:"#FFF", padding:"0 12px", overflowX:"auto" }}>
        {[["calendar","📅 Kalender"],["tips","💡 Tips"],["food","🥗 Eten"]].map(([id,label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            background:"none", border:"none", cursor:"pointer",
            padding:"13px 14px", fontSize:13, fontWeight:600, whiteSpace:"nowrap",
            color: activeTab===id ? "#2E3A6E" : "#888",
            borderBottom: activeTab===id ? "2px solid #2E3A6E" : "2px solid transparent",
            marginBottom:-2, transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif",
          }}>{label}</button>
        ))}
      </div>

      {/* ── CALENDAR TAB ── */}
      {activeTab === "calendar" && (
        <div style={{ padding:"14px" }}>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:7, marginBottom:14 }}>
            {[["📚",studyCount,"studie","#3B4F7C"],["🏃",sportCount,"sport","#3DAA6E"],["😴",restCount,"rust/vrij","#C0694A"]].map(([icon,count,label,color]) => (
              <div key={label} style={{ background:"#FFF", borderRadius:12, padding:"10px 6px", textAlign:"center", border:"1px solid #EEE" }}>
                <div style={{ fontSize:17 }}>{icon}</div>
                <div style={{ fontSize:20, fontWeight:700, color }}>{count}</div>
                <div style={{ fontSize:9, color:"#AAA", textTransform:"uppercase", letterSpacing:0.8 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Hint */}
          <div style={{ background:"#EEF1FA", borderRadius:12, padding:"9px 13px", marginBottom:12, display:"flex", gap:9, alignItems:"center", border:"1px solid #C8D2F0" }}>
            <span style={{ fontSize:18 }}>👆</span>
            <p style={{ margin:0, fontSize:12, color:"#3B4F7C", lineHeight:1.4 }}>
              Tik op een dag om vakken en activiteiten te kiezen.
            </p>
          </div>

          {/* Week day labels */}
          <div style={{ display:"flex", marginBottom:5, padding:"0 1px" }}>
            {["Ma","Di","Wo","Do","Vr","Za","Zo"].map(d => (
              <div key={d} style={{ flex:1, textAlign:"center", fontSize:9, fontWeight:700, color:"#CCC", textTransform:"uppercase", letterSpacing:0.8 }}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display:"flex", gap:3, marginBottom:3 }}>
              {week.map((date, di) => {
                if (!date) return <div key={di} style={{ flex:1 }} />;
                const ds        = fmt(date);
                const isExam    = !!EXAMS[ds];
                const isTrain   = !!EXAM_TRAINING[ds];
                const isKonings = !!KONINGS_DAYS[ds];
                const isToday   = ds === fmt(today);
                const isPast    = date < today;
                const plan      = plans[ds];
                const dayType   = plan?.type ? DAY_TYPES[plan.type] : null;
                const exam      = EXAMS[ds];
                const train     = EXAM_TRAINING[ds];
                const konings   = KONINGS_DAYS[ds];
                const subs      = plan?.subjects   ?? [];
                const acts      = plan?.activities ?? [];
                const allTags   = [...subs, ...acts];
                const locked    = isExam || isTrain || isKonings;

                let bg = dayType ? dayType.bg : isPast ? "#F5F5F5" : "#FFF";
                let border = "1px solid #EEE";
                if (isExam)    { bg = "#FFF8E1"; border = `2px solid ${exam.color}`; }
                if (isTrain)   { bg = "#F0EAFF"; border = `2px solid ${train.color}`; }
                if (isKonings) { bg = "#FFF0EC"; border = `2px solid #E84B1A`; }
                if (isToday)   { border = "2px solid #2E3A6E"; }

                const cellH = allTags.length > 2 ? 88 : allTags.length > 0 ? 78 : 64;

                return (
                  <div key={di} onClick={() => openDay(ds)} style={{
                    flex:1, minHeight:cellH, borderRadius:10, padding:"5px 3px", textAlign:"center",
                    cursor: locked ? "default" : "pointer",
                    background:bg, border,
                    boxShadow: isToday ? "0 0 0 3px rgba(46,58,110,0.12)" : "0 1px 3px rgba(0,0,0,0.04)",
                    opacity: isPast ? 0.5 : 1, position:"relative",
                  }}>
                    <div style={{
                      fontSize:12, fontWeight: isToday ? 800 : 600,
                      color: isExam ? exam.color : isTrain ? train.color : isKonings ? "#E84B1A" : isToday ? "#2E3A6E" : isPast ? "#CCC" : "#1C1C2E",
                    }}>{date.getDate()}</div>

                    {isToday && <div style={{ fontSize:7, fontWeight:700, color:"#2E3A6E", textTransform:"uppercase", letterSpacing:0.5 }}>nu</div>}

                    {isExam && (<><div style={{ fontSize:14 }}>{exam.emoji}</div><div style={{ fontSize:7, fontWeight:700, color:exam.color, lineHeight:1.2 }}>{exam.subject}</div></>)}
                    {isTrain && (<><div style={{ fontSize:13 }}>🏋️</div><div style={{ fontSize:7, fontWeight:700, color:train.color, lineHeight:1.2 }}>{train.emoji} dag {train.day}</div></>)}
                    {isKonings && (<><div style={{ fontSize:13 }}>{konings.emoji}</div><div style={{ fontSize:7, fontWeight:700, color:"#E84B1A", lineHeight:1.2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{konings.label}</div></>)}

                    {!locked && allTags.length === 0 && dayType && <div style={{ fontSize:16, marginTop:2 }}>{dayType.icon}</div>}

                    {!locked && allTags.slice(0,3).map((tag, ti) => {
                      const item = ALL_SUBJECTS.find(s => s.name === tag) || ALL_ACTIVITIES.find(a => a.name === tag);
                      return item ? (
                        <div key={ti} style={{
                          marginTop:2, fontSize:7, fontWeight:700, color:item.color,
                          background:`${item.color}18`, borderRadius:4, padding:"1px 2px",
                          lineHeight:1.4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                        }}>{item.emoji} {item.name}</div>
                      ) : null;
                    })}
                    {!locked && allTags.length > 3 && <div style={{ fontSize:7, color:"#AAA", marginTop:1 }}>+{allTags.length - 3}</div>}

                    {!locked && plan && <div style={{ position:"absolute", top:3, right:4, fontSize:8, opacity:0.3 }}>✏️</div>}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div style={{ marginTop:14, background:"#FFF", borderRadius:12, padding:"11px 13px", border:"1px solid #EEE" }}>
            <p style={{ margin:"0 0 7px", fontSize:10, fontWeight:700, color:"#AAA", textTransform:"uppercase", letterSpacing:1 }}>Legenda</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {Object.entries(DAY_TYPES).map(([k,v]) => (
                <span key={k} style={{ fontSize:11, padding:"3px 8px", borderRadius:99, background:v.bg, color:v.color, fontWeight:600 }}>{v.icon} {v.label}</span>
              ))}
              <span style={{ fontSize:11, padding:"3px 8px", borderRadius:99, background:"#FFF8E1", color:"#B07B00", fontWeight:600, border:"1px solid #E8C940" }}>🎓 Examen</span>
              <span style={{ fontSize:11, padding:"3px 8px", borderRadius:99, background:"#F0EAFF", color:"#6B3FB5", fontWeight:600, border:"1px solid #C8A8F5" }}>🏋️ Training</span>
              <span style={{ fontSize:11, padding:"3px 8px", borderRadius:99, background:"#FFF0EC", color:"#E84B1A", fontWeight:600, border:"1px solid #F5B8A8" }}>👑 Koningsdag</span>
            </div>
          </div>

          {/* Examentraining */}
          <div style={{ marginTop:18 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, margin:"0 0 10px" }}>Examentraining 🏋️</h3>
            {[
              { dates:["2026-04-29","2026-04-30"], subject:"Wiskunde",  emoji:"📐", color:"#8B5CF6" },
              { dates:["2026-05-01","2026-05-02"], subject:"Nederlands",emoji:"🇳🇱", color:"#E8A838" },
            ].map(({ dates, subject, emoji, color }) => (
              <div key={subject} style={{ background:"#FFF", borderRadius:12, padding:"11px 14px", marginBottom:7, borderLeft:`4px solid ${color}`, border:`1px solid ${color}30` }}>
                <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                  <span style={{ fontSize:20 }}>{emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13 }}>{subject} — volledige dag</div>
                    <div style={{ fontSize:11, color:"#888", marginTop:1 }}>{dates.map((ds,i) => { const d=new Date(ds); return `${NL_DAYS[d.getDay()]} ${d.getDate()} ${NL_MONTHS[d.getMonth()]}${i<dates.length-1?" & ":""}`; })}</div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, background:`${color}18`, color, padding:"3px 9px", borderRadius:99 }}>2 dagen</span>
                </div>
              </div>
            ))}
          </div>

          {/* Exam list */}
          <div style={{ marginTop:18 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, margin:"0 0 10px" }}>Examenschema 🎓</h3>
            {Object.entries(EXAMS).map(([ds, exam]) => {
              const d = new Date(ds);
              const daysUntil = Math.ceil((d - today) / (1000*60*60*24));
              return (
                <div key={ds} style={{ display:"flex", alignItems:"center", gap:11, background:"#FFF", borderRadius:12, padding:"11px 14px", marginBottom:6, borderLeft:`4px solid ${exam.color}`, border:`1px solid ${exam.color}30` }}>
                  <span style={{ fontSize:20 }}>{exam.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13 }}>{exam.subject}</div>
                    <div style={{ fontSize:11, color:"#888" }}>{NL_DAYS[d.getDay()]} {d.getDate()} {NL_MONTHS[d.getMonth()]}</div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, background:`${exam.color}18`, color:exam.color, padding:"3px 9px", borderRadius:99 }}>
                    {daysUntil > 0 ? `over ${daysUntil}d` : daysUntil === 0 ? "vandaag!" : "✓ klaar"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TIPS TAB ── */}
      {activeTab === "tips" && (
        <div style={{ padding:"20px 16px" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, margin:"0 0 6px" }}>Studeer slimmer 🧠</h3>
          <p style={{ color:"#888", fontSize:13, margin:"0 0 18px", lineHeight:1.5 }}>Bewezen technieken om meer te onthouden in minder tijd.</p>
          {STUDY_TIPS.map((tip, i) => (
            <div key={i} style={{ background:"#FFF", borderRadius:14, padding:"14px 16px", marginBottom:10, border:"1px solid #EEE", display:"flex", gap:12 }}>
              <span style={{ fontSize:26 }}>{tip.icon}</span>
              <div><div style={{ fontWeight:700, fontSize:13, marginBottom:3 }}>{tip.title}</div><div style={{ fontSize:12, color:"#555", lineHeight:1.5 }}>{tip.tip}</div></div>
            </div>
          ))}
          <div style={{ background:"linear-gradient(135deg,#1C1C2E,#2E3A6E)", borderRadius:16, padding:"18px 16px", color:"white", marginTop:8 }}>
            <h4 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 12px", fontSize:16 }}>💡 Ideale weekindeling</h4>
            {[["Ma–Do","📚 Studeerdagen","Max 2 vakken per dag, wisselen na 2 uur."],["Vr","🔄 Herhaaldag","Alle stof van de week kort herhalen."],["Za","🏃 Sportdag","Bewegen = betere focus."],["Zo","😴 Rustdag","Opladen voor de volgende week."]].map(([day,label,desc]) => (
              <div key={day} style={{ display:"flex", gap:10, marginBottom:10, paddingBottom:10, borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ minWidth:34, fontSize:10, fontWeight:700, background:"rgba(255,255,255,0.15)", padding:"3px 5px", borderRadius:6, textAlign:"center" }}>{day}</span>
                <div><div style={{ fontSize:12, fontWeight:600 }}>{label}</div><div style={{ fontSize:11, opacity:0.65, marginTop:1 }}>{desc}</div></div>
              </div>
            ))}
            <p style={{ margin:0, fontSize:11, opacity:0.5, fontStyle:"italic" }}>De avond vóór een examen: licht herhalen, vroeg naar bed! 🌙</p>
          </div>
        </div>
      )}

      {/* ── FOOD TAB ── */}
      {activeTab === "food" && (
        <div style={{ padding:"20px 16px" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, margin:"0 0 6px" }}>Eten & Drinken 🥗</h3>
          <p style={{ color:"#888", fontSize:13, margin:"0 0 18px", lineHeight:1.5 }}>Wat je eet heeft direct invloed op concentratie, geheugen en energie.</p>

          <h4 style={{ fontSize:12, fontWeight:700, color:"#2E3A6E", margin:"0 0 10px", textTransform:"uppercase", letterSpacing:1 }}>💧 Dranken</h4>
          {[
            { emoji:"💧", name:"Water",                tag:"Nummer 1",   tagColor:"#4A90C0", desc:"Hersenen zijn voor 75% water. Al 2% uitdroging verlaagt concentratie. Drink 1,5–2L per dag." },
            { emoji:"🍵", name:"Groene thee",          tag:"Brein boost",tagColor:"#3DAA6E", desc:"Cafeïne + L-theanine = rustige langdurige focus zonder crash. Ideaal tijdens studeren." },
            { emoji:"☕", name:"Koffie (met mate)",    tag:"Met beleid", tagColor:"#E8A838", desc:"Max 1–2 kopjes, niet na 14:00. Helpt bij alertheid maar verstoort slaap." },
            { emoji:"🫐", name:"Bosvruchten smoothie", tag:"Geheugen",   tagColor:"#8B5CF6", desc:"Blauwe bessen bevatten flavonoïden die geheugenvorming ondersteunen." },
            { emoji:"🥛", name:"Warme melk + honing",  tag:"Avond",      tagColor:"#C0694A", desc:"Tryptofaan bevordert melatonine. Perfect avondritueel voor goede slaap." },
          ].map((item, i) => (
            <div key={i} style={{ background:"#FFF", borderRadius:12, padding:"12px 14px", marginBottom:8, border:"1px solid #EEE", display:"flex", gap:10 }}>
              <span style={{ fontSize:24, minWidth:28 }}>{item.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:7, alignItems:"center", marginBottom:3, flexWrap:"wrap" }}>
                  <span style={{ fontWeight:700, fontSize:13 }}>{item.name}</span>
                  <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99, background:`${item.tagColor}18`, color:item.tagColor }}>{item.tag}</span>
                </div>
                <p style={{ margin:0, fontSize:12, color:"#555", lineHeight:1.4 }}>{item.desc}</p>
              </div>
            </div>
          ))}

          <h4 style={{ fontSize:12, fontWeight:700, color:"#2E3A6E", margin:"18px 0 10px", textTransform:"uppercase", letterSpacing:1 }}>🍽️ Maaltijden</h4>
          {[
            { emoji:"☀️", moment:"Ontbijt",  tag:"Start de dag", tagColor:"#E8A838", foods:["Havermout met bessen en noten","Eieren — choline voor concentratie","Volkorenbrood met avocado"], tip:"Nooit overslaan! Glucose 's ochtends is brandstof voor je brein." },
            { emoji:"🌤️", moment:"Lunch",    tag:"Middagfocus",  tagColor:"#3DAA6E", foods:["Salade met kikkererwten + olijfolie","Volkoren wrap met kip en hummus","Griekse yoghurt met walnoten"], tip:"Vermijd zware lunches — die geven een dip om 15:00 uur." },
            { emoji:"🌙", moment:"Avondeten", tag:"Herstel",      tagColor:"#8B5CF6", foods:["Zalm of makreel — omega-3","Zoete aardappel — langzame koolhydraten","Broccoli of spinazie — magnesium"], tip:"Niet te laat, niet te zwaar — een volle maag kost focus." },
          ].map((meal, i) => (
            <div key={i} style={{ background:"#FFF", borderRadius:12, padding:"13px", marginBottom:8, border:"1px solid #EEE" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:20 }}>{meal.emoji}</span>
                <span style={{ fontWeight:700, fontSize:13 }}>{meal.moment}</span>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99, background:`${meal.tagColor}18`, color:meal.tagColor }}>{meal.tag}</span>
              </div>
              {meal.foods.map((f,fi) => (
                <div key={fi} style={{ display:"flex", gap:7, marginBottom:5 }}>
                  <span style={{ color:meal.tagColor, fontWeight:700 }}>✓</span>
                  <span style={{ fontSize:12, color:"#444", lineHeight:1.4 }}>{f}</span>
                </div>
              ))}
              <div style={{ marginTop:8, padding:"7px 10px", background:`${meal.tagColor}0D`, borderRadius:8, fontSize:11, color:"#666", fontStyle:"italic" }}>💡 {meal.tip}</div>
            </div>
          ))}

          <h4 style={{ fontSize:12, fontWeight:700, color:"#2E3A6E", margin:"18px 0 10px", textTransform:"uppercase", letterSpacing:1 }}>🍎 Tussendoortjes</h4>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:14 }}>
            {[{emoji:"🫐",name:"Blauwe bessen",why:"Geheugen"},{emoji:"🥜",name:"Walnoten",why:"Omega-3"},{emoji:"🍌",name:"Banaan",why:"Energie"},{emoji:"🍫",name:"Pure chocolade",why:"Dopamine"},{emoji:"🥚",name:"Hardgekookt ei",why:"Choline"},{emoji:"🍊",name:"Sinaasappel",why:"Vitamine C"}].map((s,i) => (
              <div key={i} style={{ background:"#FFF", borderRadius:10, padding:"9px 11px", border:"1px solid #EEE", display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ fontSize:18 }}>{s.emoji}</span>
                <div><div style={{ fontSize:12, fontWeight:700 }}>{s.name}</div><div style={{ fontSize:10, color:"#888" }}>{s.why}</div></div>
              </div>
            ))}
          </div>

          <div style={{ background:"#FFF5F5", borderRadius:12, padding:"13px", border:"1px solid #FECACA" }}>
            <h4 style={{ margin:"0 0 8px", fontSize:13, fontWeight:700, color:"#C0392B" }}>🚫 Vermijd tijdens examentijd</h4>
            {["Energiedrankjes — korte piek, lange crash","Veel suiker (snoep, koek) — bloedsuikerpiek + dipje","Fastfood & frituur — zware vertering","Cafeïne na 14:00 — verstoort slaap","Grote maaltijden vlak voor studeren"].map((item,i) => (
              <div key={i} style={{ display:"flex", gap:7, marginBottom:5 }}>
                <span style={{ color:"#C0392B", fontWeight:700 }}>✕</span>
                <span style={{ fontSize:12, color:"#555", lineHeight:1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
