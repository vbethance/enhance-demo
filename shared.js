/* ═══════════════════════════════════════════════════════
   ENHANCE — SHARED UTILITIES
   Central authentication, user management, and helpers
═══════════════════════════════════════════════════════ */

// ── USER STORE ──────────────────────────────────────────
function getUsers() {
  try { return JSON.parse(localStorage.getItem("enhance_users") || "{}"); }
  catch(e) { return {}; }
}

function saveUsers(u) {
  localStorage.setItem("enhance_users", JSON.stringify(u));
}

function getCurrentUser() {
  const username = localStorage.getItem("enhance_current_user");
  if (!username) return null;
  const users = getUsers();
  return users[username.toLowerCase()] || null;
}

function setCurrentUser(username) {
  localStorage.setItem("enhance_current_user", username);
  // Keep legacy "username" key for display name compatibility
  const users = getUsers();
  const user = users[username.toLowerCase()];
  if (user) localStorage.setItem("username", user.displayName || user.username);
}

function logout() {
  localStorage.removeItem("enhance_current_user");
  localStorage.removeItem("username");
}

function isAdmin() {
  const u = getCurrentUser();
  return u && u.role === "admin";
}

function isModerator() {
  const u = getCurrentUser();
  return u && (u.role === "admin" || u.role === "moderator");
}

// Seed admin account if none exists
(function seedAdmin() {
  const users = getUsers();
  if (!users["admin"]) {
    users["admin"] = {
      displayName: "Admin",
      username: "admin",
      email: "admin@enhance.com",
      password: "Admin1234!",
      role: "admin",
      country: "Mongolia",
      level: "International olympiad level",
      interests: [],
      joined: new Date().toISOString(),
      avatar: "A"
    };
    saveUsers(users);
  }
})();

// ── THREAD STORE ──────────────────────────────────────
function getThreads() {
  try { return JSON.parse(localStorage.getItem("enhance_threads") || "[]"); }
  catch(e) { return []; }
}
function saveThreads(t) { localStorage.setItem("enhance_threads", JSON.stringify(t)); }

// ── CONTEST STORE ─────────────────────────────────────
function getContests() {
  try { return JSON.parse(localStorage.getItem("enhance_contests") || "[]"); }
  catch(e) { return []; }
}
function saveContests(c) { localStorage.setItem("enhance_contests", JSON.stringify(c)); }

// ── HELPERS ────────────────────────────────────────────
function timeAgo(ts) {
  const d = (Date.now() - ts) / 1000;
  if (d < 60)    return "just now";
  if (d < 3600)  return Math.floor(d/60)  + "m ago";
  if (d < 86400) return Math.floor(d/3600) + "h ago";
  if (d < 604800) return Math.floor(d/86400) + "d ago";
  return new Date(ts).toLocaleDateString("en-US",{month:"short",day:"numeric"});
}

function escHtml(s) {
  return String(s||"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

function renderMd(raw) {
  return escHtml(raw)
    .replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.*?)\*/g,"<em>$1</em>")
    .replace(/`(.*?)`/g,"<code>$1</code>");
}

function initial(n) { return String(n||"?").charAt(0).toUpperCase(); }

const DIFFICULTY_CONFIG = {
  "Easy":            { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", label: "Easy" },
  "Medium":          { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", label: "Medium" },
  "Hard":            { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", label: "Hard" },
  "Extreme":         { color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", label: "Extreme" },
  "Extremely Hard":  { color: "#1e1b4b", bg: "#eef2ff", border: "#c7d2fe", label: "Extremely Hard" }
};

function difficultyBadge(d) {
  const c = DIFFICULTY_CONFIG[d];
  if (!c) return "";
  return `<span style="background:${c.bg};color:${c.color};border:1px solid ${c.border};font-size:11px;font-weight:700;padding:2px 9px;border-radius:20px;">${c.label}</span>`;
}

// ── HEADER INJECTION ──────────────────────────────────
function injectHeaderStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .sh-header{background:#fff;box-shadow:0 2px 8px rgba(30,41,100,.07);position:sticky;top:0;z-index:200;}
    .sh-topbar{display:flex;justify-content:flex-end;align-items:center;padding:5px 36px;border-bottom:1px solid #e2e8f4;font-size:13px;gap:4px;}
    .sh-topbar a,.sh-topbar span{margin-left:14px;text-decoration:none;color:#1f4fd8;font-weight:600;cursor:pointer;transition:color .15s;}
    .sh-topbar a:hover,.sh-topbar span:hover{color:#0d9488;}
    .sh-navbar{display:flex;justify-content:space-between;align-items:center;padding:12px 36px;}
    .sh-logo{font-family:'Playfair Display',serif;font-size:32px;color:#0a2a66;text-decoration:none;letter-spacing:-.5px;}
    .sh-logo span{color:#0d9488;}
    .sh-nav{display:flex;gap:26px;align-items:center;}
    .sh-nav a,.sh-nav span{text-decoration:none;color:#1e293b;font-weight:600;font-size:15px;transition:color .15s;cursor:pointer;}
    .sh-nav a:hover,.sh-nav span:hover{color:#1f4fd8;}
    .sh-account-dropdown{position:relative;display:inline-block;}
    .sh-dropdown{display:none;position:absolute;right:0;top:calc(100% + 6px);background:#fff;min-width:160px;box-shadow:0 4px 20px rgba(30,41,100,.13);border-radius:10px;border:1px solid #e2e8f4;z-index:300;overflow:hidden;}
    .sh-dropdown a{color:#1e293b!important;padding:10px 16px;display:block;font-size:14px;font-weight:500;text-decoration:none;}
    .sh-dropdown a:hover{background:#e8efff;color:#1f4fd8!important;}
    .sh-dropdown.open{display:block;}
    .sh-math-panel{display:none;position:absolute;top:calc(100% + 2px);left:50%;transform:translateX(-50%);background:#fff;border:1px solid #e2e8f4;border-radius:14px;box-shadow:0 12px 48px rgba(30,41,100,.18);padding:20px;gap:14px;z-index:300;width:480px;}
    .sh-math-panel.open{display:flex;}
    .sh-math-wrap{position:relative;}
    .sh-math-card{flex:1;background:#f8faff;border:1px solid #e2e8f4;border-radius:10px;padding:16px;text-decoration:none;color:#1e293b;transition:all .2s;}
    .sh-math-card:hover{background:#e8efff;border-color:#1f4fd8;transform:translateY(-2px);}
    .sh-math-card h4{font-size:14px;font-weight:700;color:#0a2a66;margin:6px 0 4px;}
    .sh-math-card p{font-size:12px;color:#64748b;}
  `;
  document.head.appendChild(style);
}

function injectHeader(activePage) {
  const user = getCurrentUser();
  const displayName = localStorage.getItem("username") || "";

  let accountHtml = "";
  if (user) {
    const adminLink = isModerator() ? `<a href="admin.html">🛡 Admin Panel</a>` : "";
    accountHtml = `
      <div class="sh-account-dropdown">
        <span onclick="document.getElementById('sh-dd').classList.toggle('open');event.stopPropagation()">
          👤 ${escHtml(displayName)} ▾
        </span>
        <div class="sh-dropdown" id="sh-dd">
          <a href="#">Profile</a>
          ${adminLink}
          <a href="#" onclick="logout();location.href='index.html';">Log Out</a>
        </div>
      </div>`;
  } else {
    accountHtml = `<a href="login.html">Log in</a><a href="registration.html">Sign up</a>`;
  }

  const headerHtml = `
    <header class="sh-header">
      <div class="sh-topbar"><div id="sh-account-area">${accountHtml}</div></div>
      <div class="sh-navbar">
        <a href="index.html" class="sh-logo">Enhance<span>.</span></a>
        <nav class="sh-nav">
          <a href="index.html">Home</a>
          <a href="#">About</a>
          <div class="sh-math-wrap">
            <span id="sh-math-trigger">Math ▾</span>
            <div id="sh-math-panel" class="sh-math-panel">
              <a href="forum.html" class="sh-math-card">
                <div style="font-size:22px">💬</div>
                <h4>Forum</h4><p>Post problems & solutions</p>
              </a>
              <a href="contest.html" class="sh-math-card">
                <div style="font-size:22px">🏆</div>
                <h4>Contests</h4><p>Official & community contests</p>
              </a>
              <a href="materials.html" class="sh-math-card">
                <div style="font-size:22px">📚</div>
                <h4>Materials</h4><p>Olympiad theory & notes</p>
              </a>
            </div>
          </div>
          <a href="#">Competitive Programming</a>
        </nav>
      </div>
    </header>`;

  document.body.insertAdjacentHTML("afterbegin", headerHtml);

  // Math dropdown toggle
  document.getElementById("sh-math-trigger").addEventListener("click", e => {
    e.stopPropagation();
    document.getElementById("sh-math-panel").classList.toggle("open");
  });
  window.addEventListener("click", () => {
    document.getElementById("sh-math-panel")?.classList.remove("open");
    document.getElementById("sh-dd")?.classList.remove("open");
  });
}