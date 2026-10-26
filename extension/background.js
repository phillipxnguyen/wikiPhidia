const DEFAULTS = {
  lang: "vi",
  lessonId: "",
  lessonName: "Reading",
  highlight: true,
  button: true,
  shift: true,
  appUrl: "https://phillipxnguyen.github.io/wikiPhidia/"
};

async function settings() {
  const { settings: saved } = await chrome.storage.local.get("settings");
  return Object.assign({}, DEFAULTS, saved || {});
}

async function translate(text, to) {
  const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&dt=t&dt=bd&dj=1&tl=" + encodeURIComponent(to) + "&q=" + encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  const main = (data.sentences || []).map(s => s.trans || "").join("").trim();
  const alts = [];
  (data.dict || []).forEach(d => (d.terms || []).forEach(t => {
    if (t && !alts.includes(t) && t.toLowerCase() !== main.toLowerCase()) alts.push(t);
  }));
  return {
    text: main,
    alts: alts.slice(0, 8),
    src: data.src || ""
  };
}

async function translateBackup(text, to) {
  const from = /[\u3040-\u30ff]/.test(text) ? "ja" : /[\u3400-\u9fff]/.test(text) ? "zh-CN" : /[\uac00-\ud7af]/.test(text) ? "ko" : "en";
  if (from === to) return { text: text, alts: [], src: from };
  const res = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=" + encodeURIComponent(from + "|" + to));
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  const main = (data.responseData && data.responseData.translatedText || "").trim();
  const alts = [];
  (data.matches || []).forEach(m => {
    const t = (m.translation || "").trim();
    if (t && t.length < 60 && t.toLowerCase() !== main.toLowerCase() && !alts.includes(t)) alts.push(t);
  });
  return { text: main, alts: alts.slice(0, 6), src: from };
}

function sameApp(tabUrl, appUrl) {
  if (!tabUrl) return false;
  try {
    const a = new URL(appUrl), t = new URL(tabUrl);
    return a.origin === t.origin && t.pathname.toLowerCase().startsWith(a.pathname.toLowerCase().replace(/index\.html$/, ""));
  } catch (e) {
    return false;
  }
}

async function openApp() {
  const { appUrl } = await settings();
  const tabs = await chrome.tabs.query({});
  const tab = tabs.find(t => sameApp(t.url, appUrl));
  if (tab) {
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
    chrome.tabs.sendMessage(tab.id, { type: "flush" }).catch(() => {});
    return;
  }
  await chrome.tabs.create({ url: appUrl });
}

async function paintBadge() {
  const { pending } = await chrome.storage.local.get("pending");
  const n = (pending || []).length;
  await chrome.action.setBadgeBackgroundColor({ color: "#1e9466" });
  await chrome.action.setBadgeText({ text: n ? String(n) : "" });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "wkp-add",
    title: "Add “%s” to wikiPhidia",
    contexts: [ "selection" ]
  });
  paintBadge();
});

chrome.runtime.onStartup.addListener(paintBadge);

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "wkp-add" && tab && tab.id != null) chrome.tabs.sendMessage(tab.id, { type: "open", text: info.selectionText || "" }).catch(() => {});
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.pending) paintBadge();
});

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg && msg.type === "translate") {
    translate(msg.text, msg.to).catch(() => translateBackup(msg.text, msg.to)).then(r => reply({ ok: true, ...r }), e => reply({ ok: false, error: String(e && e.message || e) }));
    return true;
  }
  if (msg && msg.type === "openApp") {
    openApp().then(() => reply({ ok: true }), e => reply({ ok: false, error: String(e) }));
    return true;
  }
  return false;
});
