import { useState, useEffect, useRef, useCallback } from "react";

// ─── FONTS ───────────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');

    :root {
      --bg: #0a0a0f;
      --bg2: #0d0d16;
      --bg3: #111120;
      --blue: #00d4ff;
      --blue-dim: #0097b8;
      --violet: #7c3aed;
      --violet-light: #a855f7;
      --gold: #f59e0b;
      --red: #ef4444;
      --green: #10b981;
      --panel: rgba(13,13,22,0.9);
      --border: rgba(0,212,255,0.15);
      --border-v: rgba(124,58,237,0.2);
      --glow-b: 0 0 20px rgba(0,212,255,0.3);
      --glow-v: 0 0 20px rgba(124,58,237,0.4);
      --glow-g: 0 0 20px rgba(245,158,11,0.4);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: #c9d1e8;
      font-family: 'Rajdhani', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .mono { font-family: 'Share Tech Mono', monospace; }
    .orb { font-family: 'Orbitron', monospace; }

    /* Scanline overlay */
    body::before {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.03) 2px,
        rgba(0,0,0,0.03) 4px
      );
      pointer-events: none;
      z-index: 9999;
    }

    @keyframes pulse-blue {
      0%,100% { box-shadow: 0 0 10px rgba(0,212,255,0.3); }
      50% { box-shadow: 0 0 30px rgba(0,212,255,0.7), 0 0 60px rgba(0,212,255,0.2); }
    }
    @keyframes pulse-violet {
      0%,100% { box-shadow: 0 0 10px rgba(124,58,237,0.3); }
      50% { box-shadow: 0 0 30px rgba(124,58,237,0.7), 0 0 60px rgba(124,58,237,0.2); }
    }
    @keyframes pulse-gold {
      0%,100% { box-shadow: 0 0 10px rgba(245,158,11,0.3); }
      50% { box-shadow: 0 0 40px rgba(245,158,11,0.8), 0 0 80px rgba(245,158,11,0.3); }
    }
    @keyframes glitch {
      0% { clip-path: inset(0 0 95% 0); transform: translate(-2px,0); }
      10% { clip-path: inset(40% 0 50% 0); transform: translate(2px,0); }
      20% { clip-path: inset(80% 0 5% 0); transform: translate(-1px,0); }
      30% { clip-path: inset(10% 0 85% 0); transform: translate(0,0); }
      40% { clip-path: inset(60% 0 30% 0); transform: translate(2px,0); }
      100% { clip-path: inset(0 0 100% 0); transform: translate(0,0); }
    }
    @keyframes xp-fly {
      0% { opacity:1; transform: translateY(0) scale(1); }
      100% { opacity:0; transform: translateY(-80px) scale(1.5); }
    }
    @keyframes notification-in {
      0% { transform: translateX(120%); opacity:0; }
      15% { transform: translateX(-8px); opacity:1; }
      20% { transform: translateX(0); }
      80% { transform: translateX(0); opacity:1; }
      100% { transform: translateX(120%); opacity:0; }
    }
    @keyframes rank-badge-spin {
      0% { transform: rotateY(0deg); }
      100% { transform: rotateY(360deg); }
    }
    @keyframes float {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes bars {
      from { width: 0; }
    }
    @keyframes flicker {
      0%,100% { opacity:1; } 92% { opacity:1; } 93% { opacity:0.4; } 94% { opacity:1; } 96% { opacity:0.8; } 97% { opacity:1; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes dash-move {
      to { stroke-dashoffset: -20; }
    }
    @keyframes node-unlock {
      0% { transform: scale(0.5); opacity:0; }
      60% { transform: scale(1.2); }
      100% { transform: scale(1); opacity:1; }
    }
    @keyframes particle {
      0% { transform: translate(0,0) scale(1); opacity:1; }
      100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity:0; }
    }

    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 4px;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }
    .panel::before {
      content:'';
      position:absolute;
      top:0;left:0;right:0;height:1px;
      background: linear-gradient(90deg, transparent, var(--blue), transparent);
      opacity:0.6;
    }
    .panel-v::before {
      background: linear-gradient(90deg, transparent, var(--violet-light), transparent);
    }

    .xp-bar-fill {
      background: linear-gradient(90deg, var(--violet), var(--blue));
      background-size: 200% 100%;
      animation: shimmer 3s linear infinite, bars 1s ease-out;
      box-shadow: 0 0 10px var(--blue);
    }

    .stat-bar-fill {
      animation: bars 1.2s ease-out;
    }

    .nav-item {
      transition: all 0.2s;
      cursor: pointer;
      border-radius: 4px;
      position: relative;
    }
    .nav-item.active {
      color: var(--blue);
    }
    .nav-item.active::after {
      content:'';
      position:absolute;
      bottom:-2px; left:50%; transform:translateX(-50%);
      width:60%; height:2px;
      background: var(--blue);
      box-shadow: var(--glow-b);
    }

    .quest-card {
      transition: all 0.25s;
      border: 1px solid var(--border);
    }
    .quest-card:hover {
      border-color: rgba(0,212,255,0.4);
      transform: translateX(4px);
      box-shadow: -4px 0 0 var(--blue), var(--glow-b);
    }
    .quest-card.done {
      border-color: rgba(16,185,129,0.3);
      background: rgba(16,185,129,0.05);
    }

    .system-notification {
      position: fixed;
      top: 80px; right: 16px;
      z-index: 10000;
      animation: notification-in 4s ease forwards;
      min-width: 280px;
      max-width: 340px;
    }

    .dungeon-node {
      transition: all 0.3s;
      cursor: pointer;
    }
    .dungeon-node:hover:not(.locked) {
      transform: scale(1.1);
      filter: brightness(1.2);
    }
    .dungeon-node.unlocking {
      animation: node-unlock 0.5s ease forwards;
    }

    .leaderboard-row {
      transition: all 0.2s;
    }
    .leaderboard-row:hover {
      background: rgba(0,212,255,0.05);
      border-color: rgba(0,212,255,0.3);
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--violet), var(--blue-dim));
      border: 1px solid var(--blue);
      color: white;
      cursor: pointer;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      letter-spacing: 0.1em;
      transition: all 0.2s;
      border-radius: 3px;
    }
    .btn-primary:hover {
      box-shadow: var(--glow-b);
      transform: translateY(-1px);
    }
    .btn-gold {
      background: linear-gradient(135deg, #92400e, #b45309);
      border: 1px solid var(--gold);
      color: var(--gold);
    }
    .btn-gold:hover { box-shadow: var(--glow-g); }

    .glow-text-blue { color: var(--blue); text-shadow: 0 0 10px var(--blue); }
    .glow-text-violet { color: var(--violet-light); text-shadow: 0 0 10px var(--violet); }
    .glow-text-gold { color: var(--gold); text-shadow: 0 0 10px var(--gold); }
    .glow-text-red { color: var(--red); text-shadow: 0 0 10px var(--red); }
    .glow-text-green { color: var(--green); text-shadow: 0 0 10px var(--green); }

    .rank-e { color: #a855f7; text-shadow: 0 0 10px #a855f7; }
    .rank-d { color: #6366f1; text-shadow: 0 0 10px #6366f1; }
    .rank-c { color: #3b82f6; text-shadow: 0 0 10px #3b82f6; }
    .rank-b { color: #10b981; text-shadow: 0 0 10px #10b981; }
    .rank-a { color: #f59e0b; text-shadow: 0 0 10px #f59e0b; }
    .rank-s { color: #ef4444; text-shadow: 0 0 15px #ef4444; }

    .flicker { animation: flicker 8s infinite; }
    .float { animation: float 3s ease-in-out infinite; }

    .heatmap-cell {
      transition: all 0.2s;
      cursor: pointer;
    }
    .heatmap-cell:hover { transform: scale(1.3); }

    /* Mobile nav */
    .bottom-nav {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: rgba(10,10,15,0.97);
      border-top: 1px solid var(--border);
      backdrop-filter: blur(20px);
      z-index: 1000;
      padding-bottom: env(safe-area-inset-bottom, 0);
    }
    .scrollable-content {
      padding-bottom: 80px;
    }
  `}</style>
);

// ─── DATA ────────────────────────────────────────────────────────────────────
const RANKS = ["E", "D", "C", "B", "A", "S", "NATIONAL"];
const RANK_COLORS = {
  E: "#a855f7", D: "#6366f1", C: "#3b82f6", B: "#10b981", A: "#f59e0b", S: "#ef4444", NATIONAL: "#f59e0b"
};
const RANK_GLOW = {
  E: "0 0 20px #a855f7", D: "0 0 20px #6366f1", C: "0 0 20px #3b82f6",
  B: "0 0 20px #10b981", A: "0 0 30px #f59e0b", S: "0 0 40px #ef4444",
  NATIONAL: "0 0 60px #f59e0b, 0 0 30px #f59e0b"
};
const TITLES = {
  E: "Shadow Initiate", D: "Iron Crawler", C: "Steel Hunter", B: "Dungeon Breaker",
  A: "Shadow Monarch", S: "Sovereign of Darkness", NATIONAL: "The One Who Stands Above All"
};

const INITIAL_QUESTS = [
  { id: 1, name: "Code for 1 Hour", cat: "💻", xp: 50, streak: 3, done: false, penalty: false },
  { id: 2, name: "Morning Run (30 min)", cat: "🏃", xp: 40, streak: 7, done: false, penalty: false },
  { id: 3, name: "Read Tech Article", cat: "📚", xp: 30, streak: 1, done: false, penalty: false },
  { id: 4, name: "Deep Focus Session", cat: "🧠", xp: 60, streak: 0, done: true, penalty: false },
  { id: 5, name: "LeetCode Problem", cat: "💻", xp: 45, streak: 2, done: false, penalty: false },
  { id: 6, name: "Drink 2L Water", cat: "🏃", xp: 20, streak: 5, done: false, penalty: false },
  { id: 7, name: "Watch Tutorial", cat: "📚", xp: 35, streak: 0, done: false, penalty: true },
];

const DUNGEON_PATHS = [
  {
    id: "fullstack", icon: "🗡️", name: "Full Stack Developer", color: "#00d4ff",
    floors: [
      { name: "HTML/CSS Fundamentals", nodes: ["HTML5", "CSS3", "Flexbox", "Grid", "Responsive"] },
      { name: "JavaScript Realm", nodes: ["JS Core", "ES6+", "DOM", "Fetch API", "Async/Await"] },
      { name: "Frontend Citadel", nodes: ["React", "State Mgmt", "Testing", "Build Tools", "TypeScript"] },
      { name: "Backend Dungeon", nodes: ["Node.js", "Express", "REST API", "Auth", "MVC"] },
      { name: "Data Vaults", nodes: ["SQL", "PostgreSQL", "MongoDB", "Redis", "ORMs"] },
      { name: "Cloud Summit", nodes: ["Git", "Docker", "CI/CD", "AWS/GCP", "Nginx"] },
    ]
  },
  {
    id: "devops", icon: "⚙️", name: "DevOps Engineer", color: "#7c3aed",
    floors: [
      { name: "Linux Caverns", nodes: ["Shell", "File System", "Process Mgmt", "Networking", "Security"] },
      { name: "Container Realm", nodes: ["Docker", "Docker Compose", "Images", "Volumes", "Networks"] },
      { name: "Automation Keep", nodes: ["CI/CD", "GitHub Actions", "Jenkins", "Testing", "Artifacts"] },
      { name: "Orchestration Tower", nodes: ["Kubernetes", "Pods", "Services", "Helm", "Monitoring"] },
      { name: "Cloud Citadel", nodes: ["AWS", "Terraform", "IAM", "VPC", "Cost Opt"] },
    ]
  },
  {
    id: "aiml", icon: "🤖", name: "AI/ML Engineer", color: "#10b981",
    floors: [
      { name: "Python Forge", nodes: ["Python", "NumPy", "Pandas", "Matplotlib", "Jupyter"] },
      { name: "Math Sanctum", nodes: ["Linear Algebra", "Calculus", "Stats", "Probability", "Optimization"] },
      { name: "ML Arena", nodes: ["Scikit-learn", "Regression", "Classification", "Clustering", "CV/NLP"] },
      { name: "Deep Learning Abyss", nodes: ["PyTorch", "CNNs", "RNNs", "Transformers", "Fine-tuning"] },
      { name: "MLOps Nexus", nodes: ["MLflow", "Feature Store", "Model Serving", "Monitoring", "LLMOps"] },
    ]
  },
  {
    id: "cyber", icon: "🔒", name: "Cybersecurity Analyst", color: "#ef4444",
    floors: [
      { name: "Network Labyrinth", nodes: ["TCP/IP", "Protocols", "Wireshark", "Firewalls", "VPN"] },
      { name: "Linux Stronghold", nodes: ["Kali Linux", "Bash", "Permissions", "Logs", "Hardening"] },
      { name: "Exploit Dungeon", nodes: ["OWASP", "Burp Suite", "SQLi", "XSS", "Metasploit"] },
      { name: "Cert Trials", nodes: ["CompTIA+", "CEH", "OSCP", "CISSP", "Bug Bounty"] },
    ]
  },
  {
    id: "mobile", icon: "📱", name: "Mobile Developer", color: "#f59e0b",
    floors: [
      { name: "Foundation Gate", nodes: ["Flutter/RN", "Dart/JS", "Widgets/Components", "Navigation", "State"] },
      { name: "API Bridges", nodes: ["REST", "GraphQL", "Auth", "Local Storage", "Push Notifs"] },
      { name: "Store Ascension", nodes: ["App Store", "Play Store", "ASO", "Analytics", "Monetization"] },
    ]
  },
];

const GUILD_MEMBERS = [
  { id: 1, name: "Sung Jin-Woo", rank: "S", xp: 98500, quests: 7, avatar: "⚔️" },
  { id: 2, name: "Cha Hae-In", rank: "A", xp: 72300, quests: 6, avatar: "🗡️" },
  { id: 3, name: "Go Gun-Hee", rank: "B", xp: 45100, quests: 5, avatar: "🛡️" },
  { id: 4, name: "Yoo Jin-Ho", rank: "C", xp: 22800, quests: 4, avatar: "🧪" },
  { id: 5, name: "You", rank: "D", xp: 8200, quests: 3, avatar: "👤", isMe: true },
  { id: 6, name: "Kim Chul", rank: "E", xp: 3100, quests: 2, avatar: "🔰" },
];

const DUELS = [
  { id: 1, challenger: "Cha Hae-In", rank: "A", days: 7, yourStreak: 3, theirStreak: 5, active: true },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Particles() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: Math.random() > 0.7 ? "3px" : "1px",
          height: Math.random() > 0.7 ? "3px" : "1px",
          borderRadius: "50%",
          background: Math.random() > 0.5 ? "#00d4ff" : "#7c3aed",
          opacity: Math.random() * 0.6 + 0.1,
          animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 4}s`,
          boxShadow: Math.random() > 0.5 ? "0 0 4px #00d4ff" : "0 0 4px #7c3aed",
        }} />
      ))}
    </div>
  );
}

function SystemNotification({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="system-notification panel" style={{
      background: "rgba(10,10,25,0.97)",
      border: "1px solid rgba(0,212,255,0.5)",
      boxShadow: "0 0 30px rgba(0,212,255,0.3)",
      padding: "16px",
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 22, flexShrink: 0 }}>{msg.icon || "⚡"}</div>
        <div>
          <div className="orb glow-text-blue" style={{ fontSize: 10, letterSpacing: "0.15em", marginBottom: 4 }}>
            SYSTEM NOTIFICATION
          </div>
          <div className="orb" style={{ fontSize: 12, color: "white", marginBottom: 6 }}>{msg.title}</div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>{msg.body}</div>
          {msg.xp && (
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                background: "linear-gradient(135deg,#7c3aed,#00d4ff)",
                padding: "2px 10px", borderRadius: 2,
                fontSize: 12, fontWeight: 700, color: "white",
                fontFamily: "'Share Tech Mono',monospace",
              }}>+{msg.xp} XP</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function XPBar({ xp, maxXp }) {
  const pct = Math.min((xp / maxXp) * 100, 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span className="mono glow-text-blue" style={{ fontSize: 11 }}>EXP</span>
        <span className="mono" style={{ fontSize: 11, color: "#64748b" }}>{xp.toLocaleString()} / {maxXp.toLocaleString()}</span>
      </div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden", border: "1px solid rgba(0,212,255,0.1)" }}>
        <div className="xp-bar-fill" style={{ height: "100%", width: `${pct}%`, borderRadius: 4, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function StatBar({ label, val, color = "#00d4ff" }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span className="mono" style={{ fontSize: 11, color: "#64748b" }}>{label}</span>
        <span className="mono" style={{ fontSize: 11, color }}>{val}</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
        <div className="stat-bar-fill" style={{
          height: "100%", width: `${val}%`, borderRadius: 2,
          background: `linear-gradient(90deg, ${color}44, ${color})`,
          boxShadow: `0 0 6px ${color}`,
          transition: "width 1.2s ease",
        }} />
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ stats, quests, onAddXP }) {
  const rank = stats.rank;
  const doneToday = quests.filter(q => q.done).length;
  const totalQuests = quests.length;
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const weekData = [3, 5, 7, 4, 6, 7, 3];

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hero Card */}
      <div className="panel" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {/* Avatar */}
          <div className="float" style={{
            width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg,#1a1a2e,#0d0d20)",
            border: `2px solid ${RANK_COLORS[rank]}`,
            boxShadow: RANK_GLOW[rank],
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, position: "relative",
          }}>
            👤
            <div style={{
              position: "absolute", bottom: -4, right: -4,
              background: RANK_COLORS[rank],
              borderRadius: 3, padding: "1px 5px",
              fontFamily: "'Orbitron',monospace", fontSize: 9,
              color: "white", fontWeight: 700,
              boxShadow: RANK_GLOW[rank],
            }}>{rank}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="orb glow-text-blue flicker" style={{ fontSize: 9, letterSpacing: "0.2em", marginBottom: 4 }}>HUNTER PROFILE</div>
            <div className="orb" style={{ fontSize: 18, fontWeight: 900, color: "white", lineHeight: 1.1 }}>
              {stats.name}
            </div>
            <div style={{ fontSize: 13, color: "#7c3aed", marginTop: 2 }}>
              Level {stats.level} — {TITLES[rank]}
            </div>
            <div style={{ marginTop: 10 }}>
              <XPBar xp={stats.xp} maxXp={stats.maxXp} />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "QUESTS TODAY", val: `${doneToday}/${totalQuests}`, icon: "⚔️", color: "var(--blue)" },
          { label: "TOTAL LEVEL", val: stats.level, icon: "🏆", color: "var(--gold)" },
          { label: "ACTIVE STREAK", val: `${stats.streak}d`, icon: "🔥", color: "#f97316" },
          { label: "GUILD RANK", val: `#${stats.guildRank}`, icon: "🛡️", color: "var(--violet-light)" },
        ].map(s => (
          <div key={s.label} className="panel" style={{ padding: "12px 14px" }}>
            <div style={{ fontSize: 18 }}>{s.icon}</div>
            <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.val}</div>
            <div className="mono" style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.1em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Stat Panel */}
      <div className="panel panel-v" style={{ padding: 16 }}>
        <div className="orb glow-text-violet" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 14 }}>
          ◆ HUNTER STATS ◆
        </div>
        <StatBar label="STR — Consistency" val={stats.str} color="#ef4444" />
        <StatBar label="INT — Learning Hours" val={stats.int} color="#00d4ff" />
        <StatBar label="AGI — Task Speed" val={stats.agi} color="#10b981" />
        <StatBar label="VIT — Streak Count" val={stats.vit} color="#f59e0b" />
        <StatBar label="SEN — Focus Sessions" val={stats.sen} color="#a855f7" />
      </div>

      {/* Weekly Dungeon Map */}
      <div className="panel" style={{ padding: 16 }}>
        <div className="orb glow-text-blue" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 12 }}>
          ◆ WEEKLY QUEST MAP ◆
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {days.map((d, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div className="mono" style={{ fontSize: 9, color: "#475569", marginBottom: 4 }}>{d}</div>
              <div className="heatmap-cell" style={{
                height: 32, borderRadius: 3,
                background: weekData[i] >= 6
                  ? "rgba(0,212,255,0.7)"
                  : weekData[i] >= 4
                    ? "rgba(124,58,237,0.6)"
                    : weekData[i] >= 2
                      ? "rgba(124,58,237,0.25)"
                      : "rgba(255,255,255,0.05)",
                border: "1px solid rgba(0,212,255,0.1)",
                boxShadow: weekData[i] >= 6 ? "0 0 8px rgba(0,212,255,0.4)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{weekData[i]}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 12, fontSize: 10, color: "#475569" }}>
          <span>🟦 Peak</span><span style={{ color: "#7c3aed" }}>🟣 Active</span><span>⬛ Low</span>
        </div>
      </div>

      {/* Daily message */}
      <div className="panel" style={{
        padding: 16,
        background: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(0,212,255,0.05))",
        borderColor: "rgba(124,58,237,0.3)",
        textAlign: "center",
      }}>
        <div className="orb" style={{ fontSize: 11, color: "#7c3aed", marginBottom: 8, letterSpacing: "0.15em" }}>
          ✦ SYSTEM MESSAGE ✦
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "white", lineHeight: 1.5 }}>
          "A new day begins. Will you rise,<br />Hunter?"
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
          {doneToday} of {totalQuests} daily quests completed
        </div>
      </div>
    </div>
  );
}

// ─── QUEST BOARD ─────────────────────────────────────────────────────────────
function QuestBoard({ quests, setQuests, onQuestComplete }) {
  const [filter, setFilter] = useState("ALL");
  const cats = ["ALL", "💻", "🏃", "📚", "🧠"];

  const filtered = filter === "ALL" ? quests : quests.filter(q => q.cat === filter);

  const completeQuest = (id) => {
    setQuests(prev => prev.map(q =>
      q.id === id && !q.done ? { ...q, done: true, streak: q.streak + 1 } : q
    ));
    const q = quests.find(q => q.id === id);
    if (q && !q.done) onQuestComplete(q);
  };

  const doneCount = quests.filter(q => q.done).length;
  const totalXP = quests.filter(q => q.done).reduce((a, q) => a + q.xp, 0);

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div className="panel" style={{ padding: "14px 16px" }}>
        <div className="orb glow-text-blue" style={{ fontSize: 12, letterSpacing: "0.2em", marginBottom: 6 }}>
          ⚔ DAILY QUEST BOARD
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
          <span>Completed: <span className="glow-text-green">{doneCount}/{quests.length}</span></span>
          <span>XP Earned: <span className="glow-text-blue">{totalXP}</span></span>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "6px 14px", borderRadius: 3,
            background: filter === c ? "linear-gradient(135deg,#7c3aed,#00d4ff44)" : "rgba(255,255,255,0.03)",
            border: filter === c ? "1px solid var(--blue)" : "1px solid rgba(255,255,255,0.08)",
            color: filter === c ? "white" : "#64748b",
            cursor: "pointer", fontSize: 13, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600,
            whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s",
          }}>{c === "ALL" ? "ALL" : c}</button>
        ))}
      </div>

      {/* Quest list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(q => (
          <div key={q.id} className={`quest-card panel ${q.done ? "done" : ""}`}
            style={{ padding: "14px 16px", cursor: "pointer" }}
            onClick={() => completeQuest(q.id)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Check */}
              <div style={{
                width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                background: q.done ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.04)",
                border: q.done ? "2px solid var(--green)" : "2px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: q.done ? "0 0 10px rgba(16,185,129,0.4)" : "none",
                transition: "all 0.3s",
              }}>
                {q.done && <span style={{ color: "var(--green)", fontSize: 16 }}>✓</span>}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 14, fontWeight: 600, color: q.done ? "#64748b" : "white",
                    textDecoration: q.done ? "line-through" : "none"
                  }}>{q.name}</span>
                  <span style={{ fontSize: 11 }}>{q.cat}</span>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 4, alignItems: "center", flexWrap: "wrap" }}>
                  <span className="mono glow-text-blue" style={{ fontSize: 11 }}>+{q.xp} XP</span>
                  {q.streak > 0 && (
                    <span className="mono" style={{
                      fontSize: 11,
                      color: q.streak >= 7 ? "var(--gold)" : "#f97316",
                      textShadow: q.streak >= 7 ? "0 0 8px var(--gold)" : "none",
                    }}>
                      {q.streak >= 7 ? "🔥" : "🔥"}{q.streak}d streak
                    </span>
                  )}
                  {q.penalty && !q.done && (
                    <span className="mono glow-text-red" style={{ fontSize: 10 }}>⚠ PENALTY</span>
                  )}
                </div>
              </div>

              {/* Status badge */}
              <div style={{
                padding: "3px 8px", borderRadius: 2, fontSize: 10, fontWeight: 700,
                fontFamily: "'Share Tech Mono',monospace",
                background: q.done ? "rgba(16,185,129,0.15)" : q.penalty ? "rgba(239,68,68,0.15)" : "rgba(0,212,255,0.08)",
                border: `1px solid ${q.done ? "rgba(16,185,129,0.4)" : q.penalty ? "rgba(239,68,68,0.4)" : "rgba(0,212,255,0.2)"}`,
                color: q.done ? "var(--green)" : q.penalty ? "var(--red)" : "var(--blue)",
                flexShrink: 0,
              }}>
                {q.done ? "CLEAR" : q.penalty ? "FAIL" : "ACTIVE"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>⚔️</div>
          No quests in this category
        </div>
      )}
    </div>
  );
}

// ─── DUNGEON PATHS ────────────────────────────────────────────────────────────
function DungeonPaths() {
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);

  const getNodeKey = (pathId, fi, ni) => `${pathId}-${fi}-${ni}`;

  const isUnlocked = (pathId, fi, ni, prog) => {
    if (fi === 0 && ni === 0) return true;
    if (ni > 0) return !!prog[getNodeKey(pathId, fi, ni - 1)];
    if (fi > 0) {
      const prevFloor = selected?.floors[fi - 1];
      return prevFloor && !!prog[getNodeKey(pathId, fi - 1, prevFloor.nodes.length - 1)];
    }
    return false;
  };

  const toggleNode = (pathId, fi, ni) => {
    const key = getNodeKey(pathId, fi, ni);
    setProgress(p => ({ ...p, [key]: !p[key] }));
  };

  const getPathProgress = (path) => {
    let total = 0, done = 0;
    path.floors.forEach((f, fi) => f.nodes.forEach((_, ni) => {
      total++;
      if (progress[getNodeKey(path.id, fi, ni)]) done++;
    }));
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  if (selected) {
    const pct = getPathProgress(selected);
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <button onClick={() => setSelected(null)} style={{
            background: "rgba(0,212,255,0.1)", border: "1px solid var(--border)",
            color: "var(--blue)", padding: "6px 12px", borderRadius: 3, cursor: "pointer",
            fontFamily: "'Rajdhani',sans-serif", fontWeight: 600,
          }}>← BACK</button>
          <div>
            <div className="orb" style={{ color: "white", fontSize: 16 }}>{selected.icon} {selected.name}</div>
          </div>
        </div>

        <div className="panel" style={{
          padding: 14, marginBottom: 14,
          borderColor: `${selected.color}44`
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: selected.color }}>DUNGEON CLEARED</span>
            <span className="mono" style={{ fontSize: 14, color: selected.color, fontWeight: 700 }}>{pct}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${pct}%`, borderRadius: 3,
              background: `linear-gradient(90deg,${selected.color}88,${selected.color})`,
              boxShadow: `0 0 10px ${selected.color}`,
              transition: "width 0.8s ease",
            }} />
          </div>
        </div>

        {selected.floors.map((floor, fi) => (
          <div key={fi} className="panel" style={{
            marginBottom: 12, padding: 14,
            borderColor: fi === selected.floors.length - 1 ? "rgba(245,158,11,0.3)" : "var(--border)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              {fi === selected.floors.length - 1
                ? <span style={{ fontSize: 16 }}>👑</span>
                : <span className="mono" style={{ color: "#475569", fontSize: 12 }}>F{fi + 1}</span>
              }
              <span className="orb" style={{
                fontSize: 12,
                color: fi === selected.floors.length - 1 ? "var(--gold)" : "white",
              }}>{floor.name}</span>
              {fi === selected.floors.length - 1 && (
                <span className="mono glow-text-gold" style={{ fontSize: 9, marginLeft: "auto" }}>BOSS STAGE</span>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {floor.nodes.map((node, ni) => {
                const key = getNodeKey(selected.id, fi, ni);
                const done = !!progress[key];
                const unlocked = isUnlocked(selected.id, fi, ni, progress);
                return (
                  <button key={ni}
                    className={`dungeon-node ${!unlocked ? "locked" : ""}`}
                    onClick={() => unlocked && toggleNode(selected.id, fi, ni)}
                    style={{
                      padding: "7px 12px", borderRadius: 3, fontSize: 12, fontWeight: 600,
                      fontFamily: "'Rajdhani',sans-serif",
                      background: done
                        ? `${selected.color}22`
                        : !unlocked
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(255,255,255,0.06)",
                      border: done
                        ? `1px solid ${selected.color}`
                        : !unlocked
                          ? "1px solid rgba(255,255,255,0.06)"
                          : `1px solid ${selected.color}44`,
                      color: done
                        ? selected.color
                        : !unlocked
                          ? "#374151"
                          : "#9ca3af",
                      cursor: unlocked ? "pointer" : "not-allowed",
                      boxShadow: done ? `0 0 8px ${selected.color}44` : "none",
                      transition: "all 0.2s",
                    }}>
                    {!unlocked ? "🔒 " : done ? "✅ " : ""}{node}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div className="orb glow-text-blue" style={{ fontSize: 12, letterSpacing: "0.2em", marginBottom: 16 }}>
        ◆ DUNGEON PATHS ◆
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {DUNGEON_PATHS.map(path => {
          const pct = getPathProgress(path);
          return (
            <div key={path.id} className="panel" style={{
              padding: 16, cursor: "pointer",
              border: `1px solid ${path.color}33`,
              transition: "all 0.25s",
            }}
              onClick={() => setSelected(path)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = path.color + "88"; e.currentTarget.style.boxShadow = `0 0 20px ${path.color}22` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = path.color + "33"; e.currentTarget.style.boxShadow = "none" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 4, flexShrink: 0,
                  background: `${path.color}11`, border: `1px solid ${path.color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>{path.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "white" }}>{path.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {path.floors.length} Floors · {path.floors.reduce((a, f) => a + f.nodes.length, 0)} Skills
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span className="mono" style={{ fontSize: 10, color: path.color }}>CLEARED</span>
                      <span className="mono" style={{ fontSize: 10, color: path.color }}>{pct}%</span>
                    </div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${pct}%`, borderRadius: 2,
                        background: path.color, boxShadow: `0 0 6px ${path.color}`,
                      }} />
                    </div>
                  </div>
                </div>
                <div style={{ color: "#475569", fontSize: 18, flexShrink: 0 }}>›</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SHADOW ARMY ──────────────────────────────────────────────────────────────
function ShadowArmy() {
  const [tab, setTab] = useState("leaderboard");
  const [duelActive, setDuelActive] = useState(false);

  return (
    <div style={{ padding: 16 }}>
      <div className="orb glow-text-violet" style={{ fontSize: 12, letterSpacing: "0.2em", marginBottom: 14 }}>
        ◆ SHADOW ARMY ◆
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 14, background: "rgba(255,255,255,0.03)", borderRadius: 4, padding: 3 }}>
        {["leaderboard", "duels"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "8px", borderRadius: 3,
            background: tab === t ? "linear-gradient(135deg,#7c3aed,#00d4ff22)" : "transparent",
            border: tab === t ? "1px solid rgba(0,212,255,0.3)" : "1px solid transparent",
            color: tab === t ? "white" : "#64748b", cursor: "pointer",
            fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: 13,
            textTransform: "uppercase", letterSpacing: "0.05em",
            transition: "all 0.2s",
          }}>
            {t === "leaderboard" ? "🏆 Guild Rank" : "⚔️ Duels"}
          </button>
        ))}
      </div>

      {tab === "leaderboard" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {GUILD_MEMBERS.map((m, i) => (
            <div key={m.id} className="leaderboard-row panel" style={{
              padding: "12px 14px",
              border: m.isMe ? "1px solid rgba(0,212,255,0.4)" : "1px solid var(--border)",
              background: m.isMe ? "rgba(0,212,255,0.04)" : "var(--panel)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="mono" style={{
                  width: 24, textAlign: "center",
                  color: i === 0 ? "var(--gold)" : i === 1 ? "#94a3b8" : i === 2 ? "#b45309" : "#475569",
                  fontSize: 14, fontWeight: 700,
                }}>
                  {i === 0 ? "👑" : i + 1}
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: `${RANK_COLORS[m.rank]}22`,
                  border: `1px solid ${RANK_COLORS[m.rank]}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                  boxShadow: m.rank === "S" ? RANK_GLOW.S : m.rank === "A" ? RANK_GLOW.A : "none",
                }}>{m.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 600,
                    color: m.isMe ? "var(--blue)" : "white",
                  }}>{m.name}{m.isMe && " (You)"}</div>
                  <div className="mono" style={{ fontSize: 10, color: "#64748b" }}>
                    {m.xp.toLocaleString()} XP · {m.quests}/7 quests
                  </div>
                </div>
                <div style={{
                  padding: "3px 8px", borderRadius: 2,
                  background: `${RANK_COLORS[m.rank]}22`,
                  border: `1px solid ${RANK_COLORS[m.rank]}44`,
                  color: RANK_COLORS[m.rank],
                  fontFamily: "'Orbitron',monospace", fontSize: 10, fontWeight: 700,
                  boxShadow: m.rank === "S" ? "0 0 8px rgba(239,68,68,0.5)" : "none",
                }}>{m.rank}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "duels" && (
        <div>
          {DUELS.map(d => (
            <div key={d.id} className="panel" style={{
              padding: 16, border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.03)", marginBottom: 10,
            }}>
              <div className="orb glow-text-red" style={{ fontSize: 10, letterSpacing: "0.15em", marginBottom: 10 }}>
                ⚔ ACTIVE DUEL — {d.days}-DAY CHALLENGE
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>YOU</div>
                  <div className="orb" style={{ fontSize: 28, color: "var(--blue)", margin: "4px 0" }}>
                    {d.yourStreak}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "#64748b" }}>DAY STREAK</div>
                </div>
                <div style={{
                  padding: "8px 14px",
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  borderRadius: 3, color: "#ef4444", fontWeight: 700, fontSize: 12,
                  fontFamily: "'Orbitron',monospace",
                }}>VS</div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>{d.challenger}</div>
                  <div className="orb" style={{ fontSize: 28, color: "var(--gold)", margin: "4px 0" }}>
                    {d.theirStreak}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "#64748b" }}>DAY STREAK</div>
                </div>
              </div>
              <div style={{ marginTop: 12, textAlign: "center", fontSize: 12, color: "#64748b" }}>
                {d.theirStreak > d.yourStreak
                  ? <span className="glow-text-red">⚠ You are falling behind! Complete your quests!</span>
                  : <span className="glow-text-green">✓ You are winning! Maintain the lead!</span>
                }
              </div>
            </div>
          ))}
          <button className="btn-primary" style={{
            width: "100%", padding: "12px", fontSize: 14,
            letterSpacing: "0.1em", marginTop: 4,
          }}>
            ⚔️ CHALLENGE A GUILD MEMBER
          </button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [notifications, setNotifications] = useState([]);
  const [notifId, setNotifId] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [stats, setStats] = useState({
    name: "Hunter", rank: "D", level: 12,
    xp: 8200, maxXp: 15000, streak: 3, guildRank: 5,
    str: 42, int: 67, agi: 38, vit: 55, sen: 71,
  });

  const pushNotif = useCallback((msg) => {
    const id = Date.now();
    setNotifications(n => [...n, { ...msg, id }]);
  }, []);

  const removeNotif = (id) => setNotifications(n => n.filter(x => x.id !== id));

  const handleQuestComplete = (q) => {
    pushNotif({
      icon: "⚔️",
      title: "QUEST COMPLETE",
      body: `"${q.name}" has been cleared!`,
      xp: q.xp,
    });
    setStats(s => ({
      ...s,
      xp: Math.min(s.xp + q.xp, s.maxXp),
      str: Math.min(s.str + 2, 100),
      int: Math.min(s.int + 1, 100),
    }));
  };

  useEffect(() => {
    if (showWelcome) {
      const t = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showWelcome]);

  const NAV = [
    { id: "dashboard", icon: "🏠", label: "HOME" },
    { id: "quests", icon: "⚔️", label: "QUESTS" },
    { id: "dungeons", icon: "🗺️", label: "DUNGEON" },
    { id: "guild", icon: "🛡️", label: "GUILD" },
  ];

  return (
    <>
      <FontLoader />
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#0a0a0f 0%,#0c0c18 100%)",
        position: "relative",
      }}>
        <Particles />

        {/* Top bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(10,10,15,0.97)",
          borderBottom: "1px solid rgba(0,212,255,0.1)",
          backdropFilter: "blur(20px)",
          padding: "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div className="orb" style={{
            fontSize: 14, fontWeight: 900,
            background: "linear-gradient(90deg,#7c3aed,#00d4ff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "0.1em",
          }}>SYSTEM // AWAKENED</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="mono" style={{
              fontSize: 10, color: "var(--blue)",
              padding: "3px 8px", border: "1px solid rgba(0,212,255,0.2)",
              borderRadius: 2, background: "rgba(0,212,255,0.05)",
            }}>LV.{stats.level}</div>
            <div style={{
              padding: "3px 8px", borderRadius: 2, fontSize: 10,
              fontFamily: "'Orbitron',monospace", fontWeight: 700,
              color: RANK_COLORS[stats.rank],
              background: `${RANK_COLORS[stats.rank]}22`,
              border: `1px solid ${RANK_COLORS[stats.rank]}44`,
            }}>{stats.rank}-RANK</div>
          </div>
        </div>

        {/* Welcome modal */}
        {showWelcome && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 5000,
            background: "rgba(0,0,0,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }} onClick={() => setShowWelcome(false)}>
            <div className="panel float" style={{
              maxWidth: 320, width: "100%", padding: 28, textAlign: "center",
              border: "1px solid rgba(124,58,237,0.5)",
              background: "rgba(10,10,20,0.97)",
              boxShadow: "0 0 60px rgba(124,58,237,0.3)",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
              <div className="orb glow-text-violet" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 }}>
                ✦ SYSTEM AWAKENED ✦
              </div>
              <div className="orb" style={{ fontSize: 22, color: "white", marginBottom: 12 }}>
                A new day begins.
              </div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>
                Will you rise, Hunter?<br />
                Your quests await you in the void.
              </div>
              <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}
                onClick={() => setShowWelcome(false)}>
                I WILL RISE ⚔
              </button>
            </div>
          </div>
        )}

        {/* Notifications */}
        <div style={{ position: "fixed", top: 70, right: 0, zIndex: 9000, display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map(n => (
            <SystemNotification key={n.id} msg={n} onDone={() => removeNotif(n.id)} />
          ))}
        </div>

        {/* Content */}
        <div className="scrollable-content" style={{ position: "relative", zIndex: 1 }}>
          {tab === "dashboard" && <Dashboard stats={stats} quests={quests} onAddXP={handleQuestComplete} />}
          {tab === "quests" && <QuestBoard quests={quests} setQuests={setQuests} onQuestComplete={handleQuestComplete} />}
          {tab === "dungeons" && <DungeonPaths />}
          {tab === "guild" && <ShadowArmy />}
        </div>

        {/* Bottom navigation */}
        <nav className="bottom-nav">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)}
                className={`nav-item ${tab === n.id ? "active" : ""}`}
                style={{
                  padding: "10px 4px 8px",
                  background: "transparent", border: "none",
                  color: tab === n.id ? "var(--blue)" : "#475569",
                  cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                }}>
                <span style={{ fontSize: 20 }}>{n.icon}</span>
                <span className="mono" style={{ fontSize: 8, letterSpacing: "0.1em" }}>{n.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
