const DEFAULTS = {
  lang: "vi",
  lessonId: "",
  lessonName: "",
  highlight: true,
  shift: true,
  youtube: true,
  pick: "button",
  enabled: true,
  appUrl: "https://phillipxnguyen.github.io/wikiPhidia/"
};

const CLOUD = "M11 18h-4.343c-2.572 0 -4.657 -2.011 -4.657 -4.487c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.388 0 2.585 .82 3.138 2.007";
const CLOUD_OFF = "M3 3l18 18|M18 18h-11c-2.598 0 -4.705 -2.015 -4.705 -4.5s2.107 -4.5 4.705 -4.5c.112 -.5 .305 -.973 .568 -1.408m2.094 -1.948c.329 -.174 .68 -.319 1.05 -.43c1.9 -.576 4 -.194 5.5 1c1.503 1.192 2.185 3.017 1.788 4.786h1a3.5 3.5 0 0 1 2.212 6.212";
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[c]);
const reading = t => /[㐀-鿿]/.test(t) && !/[぀-ヿ]/.test(t) && window.pinyinPro ? pinyinPro.pinyin(t) : "";

let state = { settings: DEFAULTS, app: { lessons: [], words: [], at: 0 }, pending: [], history: [] };

function ago(ts) {
  if (!ts) return "";
  const s = Math.round((Date.now() - ts) / 1e3);
  if (s < 60) return "just now";
  if (s < 3600) return Math.round(s / 60) + " min ago";
  if (s < 86400) return Math.round(s / 3600) + " h ago";
  return Math.round(s / 86400) + " d ago";
}

function paintStatus() {
  const a = state.app;
  const paths = (a.at ? CLOUD + "|M15 19l2 2l4 -4" : CLOUD_OFF).split("|").map(d => `<path d="${d}"/>`).join("");
  $("link").innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  $("link").classList.toggle("on", !!a.at);
  $("brand").dataset.tip = a.at ? `${a.words.length} words in ${a.lessons.length} lessons` : "Open wikiPhidia once to connect";
  $("brand").setAttribute("aria-label", a.at ? "Connected: " + $("brand").dataset.tip : "Not connected");
  $("pendingN").textContent = state.pending.length || "";
}

function paintPending() {
  const list = $("pendingList");
  list.dataset.empty = "Nothing waiting. Select a word on a page and press Shift.";
  list.innerHTML = state.pending.map(w => `<div class="item" data-id="${esc(w.id)}">
<div class="term">${esc(w.term)}<span class="reading">${esc(reading(w.term))}</span></div>
<input class="edit meaning" value="${esc(w.meaning)}" placeholder="Meaning" aria-label="Meaning">
${w.sentence ? `<div class="sentence">${esc(w.sentence)}</div>` : ""}
<div class="meta">${esc(w.lessonName || "")}${w.title && w.title !== w.lessonName ? " · " + esc(w.title) : ""}</div>
<button class="del" title="Remove" aria-label="Remove">✕</button></div>`).join("");
}

function paintRecent() {
  const list = $("recentList");
  list.dataset.empty = "Words you send to wikiPhidia show up here.";
  list.innerHTML = state.history.map(w => `<div class="item">
<div class="term">${esc(w.term)}<span class="reading">${esc(reading(w.term))}</span><span class="tag ${w.status === "added" ? "added" : "exists"}">${w.status === "added" ? "Added" : "Already there"}</span></div>
<div class="meaning">${esc(w.meaning)}</div>
<div class="meta">${esc(w.status === "added" ? w.lessonName || "" : w.lesson || "")} · ${ago(w.sentAt)}</div></div>`).join("");
}

function paintSettings() {
  const s = state.settings;
  $("lang").value = s.lang;
  $("highlight").checked = !!s.highlight;
  $("enabled").checked = s.enabled !== false;
  document.body.classList.toggle("off", s.enabled === false);
  document.querySelectorAll(".pick-mode").forEach(b => {
    b.classList.toggle("on", b.dataset.pick === s.pick);
    b.setAttribute("aria-checked", b.dataset.pick === s.pick);
  });
  $("shift").checked = !!s.shift;
  $("youtube").checked = s.youtube !== false;
  $("appUrl").value = s.appUrl;
  const lessons = state.app.lessons.slice().sort((a, b) => (b.words ? 1 : 0) - (a.words ? 1 : 0) || a.name.localeCompare(b.name));
  $("lesson").innerHTML = `<option value="article">🆕 New lesson</option>` + lessons.map(l => `<option value="id:${esc(l.id)}">${esc(l.name)}</option>`).join("");
  $("lesson").value = s.lessonId && lessons.some(l => l.id === s.lessonId) ? "id:" + s.lessonId : "article";
}

function paint() {
  paintStatus();
  paintPending();
  paintRecent();
  paintSettings();
}

async function load() {
  const data = await chrome.storage.local.get([ "settings", "app", "pending", "history" ]);
  state = {
    settings: Object.assign({}, DEFAULTS, data.settings || {}),
    app: Object.assign({ lessons: [], words: [], at: 0 }, data.app || {}),
    pending: data.pending || [],
    history: data.history || []
  };
  paint();
}

function saveSettings(patch) {
  state.settings = Object.assign({}, state.settings, patch);
  return chrome.storage.local.set({ settings: state.settings });
}

document.querySelectorAll(".tabs button").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".tabs button").forEach(x => x.classList.toggle("on", x === b));
  document.querySelectorAll(".tab").forEach(t => t.hidden = t.id !== "tab-" + b.dataset.tab);
}));

$("openApp").addEventListener("click", () => chrome.runtime.sendMessage({ type: "openApp" }, () => window.close()));

$("pendingList").addEventListener("click", async e => {
  const del = e.target.closest(".del");
  if (!del) return;
  const id = del.closest(".item").dataset.id;
  state.pending = state.pending.filter(w => w.id !== id);
  await chrome.storage.local.set({ pending: state.pending });
});

$("pendingList").addEventListener("change", async e => {
  if (!e.target.classList.contains("meaning")) return;
  const id = e.target.closest(".item").dataset.id;
  const { pending } = await chrome.storage.local.get("pending");
  state.pending = (pending || []).map(w => w.id === id ? Object.assign({}, w, { meaning: e.target.value.trim() }) : w);
  await chrome.storage.local.set({ pending: state.pending });
});

$("enabled").addEventListener("change", e => saveSettings({ enabled: e.target.checked }).then(paintSettings));
[ "highlight", "shift", "youtube" ].forEach(id => $(id).addEventListener("change", e => saveSettings({ [id]: e.target.checked })));
document.querySelectorAll(".pick-mode").forEach(b => b.addEventListener("click", () => saveSettings({ pick: b.dataset.pick }).then(paintSettings)));
$("lang").addEventListener("change", e => saveSettings({ lang: e.target.value }));
$("appUrl").addEventListener("change", e => saveSettings({ appUrl: e.target.value.trim() || DEFAULTS.appUrl }));
$("lesson").addEventListener("change", e => {
  const v = e.target.value;
  const l = v.startsWith("id:") && state.app.lessons.find(x => x.id === v.slice(3));
  saveSettings(l ? { lessonId: l.id, lessonName: l.name } : { lessonId: "", lessonName: "" });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes.pending) state.pending = changes.pending.newValue || [];
  if (changes.history) state.history = changes.history.newValue || [];
  if (changes.app) state.app = Object.assign({ lessons: [], words: [], at: 0 }, changes.app.newValue || {});
  paintStatus();
  if (changes.pending && !document.activeElement.classList.contains("meaning")) paintPending();
  if (changes.history) paintRecent();
  if (changes.app) paintSettings();
});

chrome.tabs.query({ active: true, currentWindow: true }).then(([ tab ]) => {
  if (!tab || !tab.url) return;
  let video = false;
  try {
    const u = new URL(tab.url);
    video = /(^|\.)youtube\.com$/.test(u.hostname) && (!!u.searchParams.get("v") || /\/(shorts|live)\/[\w-]{11}/.test(u.pathname));
  } catch {}
  if (!video) return;
  $("ytTitle").textContent = (tab.title || "").replace(/ - YouTube$/, "");
  $("ytLesson").hidden = false;
  $("ytLesson").onclick = () => chrome.runtime.sendMessage({ type: "youtube", tabId: tab.id }, () => window.close());
});

async function paintUpdate() {
  const { update } = await chrome.storage.local.get("update");
  $("update").hidden = !update;
  if (update) $("updateVersion").textContent = update.version;
}

$("versionNow").textContent = "Version " + chrome.runtime.getManifest().version;
[ "updateReload", "reloadExt" ].forEach(id => $(id).addEventListener("click", () => chrome.runtime.reload()));
chrome.runtime.sendMessage({ type: "checkUpdate" }, paintUpdate);
paintUpdate();

load();
