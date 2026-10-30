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

async function settings() {
  const { settings: saved } = await chrome.storage.local.get("settings");
  return Object.assign({}, DEFAULTS, saved || {});
}

const JUNK_PUNCT_RE = /["“”„‟«»‹›<>「」『』【】〔〕〈〉《》〖〗\[\]{}`´˝*^|\\♪♫♬♩•●▪■□◆◇★☆※＊＾｜＂＜＞［］｛｝]+/g;

const cleanPunct = text => String(text || "").replace(/[‘’‛′]/g, "'").replace(JUNK_PUNCT_RE, "").replace(/\s{2,}/g, " ").replace(/ +([,.!?;:])/g, "$1").trim();

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
  } catch {
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

async function grabTracks() {
  const id = new URL(location.href).searchParams.get("v") || (location.pathname.match(/\/(?:shorts|live)\/([\w-]{11})/) || [])[1];
  if (!id) return { error: "Open a YouTube video first" };
  const player = document.getElementById("movie_player") || document.getElementById("shorts-player");
  let resp = player && player.getPlayerResponse ? player.getPlayerResponse() : window.ytInitialPlayerResponse;
  if (!resp || !resp.videoDetails || resp.videoDetails.videoId !== id) {
    try {
      const m = (await (await fetch("/watch?v=" + id)).text()).match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});\s*(?:var|<\/script)/s);
      resp = m ? JSON.parse(m[1]) : null;
    } catch {
      resp = null;
    }
  }
  const tracks = resp && resp.captions && resp.captions.playerCaptionsTracklistRenderer && resp.captions.playerCaptionsTracklistRenderer.captionTracks || [];
  const base = t => t.languageCode.split("-")[0];
  const title = resp && resp.videoDetails && resp.videoDetails.title || document.title.replace(/ - YouTube$/, "");
  const script = /[぀-ヿ]/.test(title) ? "ja" : /[가-힯]/.test(title) ? "ko" : /[一-鿿]/.test(title) ? "zh" : /\bkorean\b/i.test(title) ? "ko" : /\bjapanese\b/i.test(title) ? "ja" : /\b(chinese|mandarin)\b/i.test(title) ? "zh" : "";
  const inLang = l => {
    const list = tracks.filter(t => base(t) === l);
    return list.find(t => t.kind !== "asr") || list[0];
  };
  const spoken = tracks.find(t => t.kind === "asr");
  const audio = tracks.length && resp.captions.playerCaptionsTracklistRenderer.audioTracks;
  const guess = script && inLang(script) || spoken && inLang(base(spoken)) || audio && audio[0] && tracks[audio[0].defaultCaptionTrackIndex] || tracks[0];
  const load = async url => {
    try {
      const j = await (await fetch(url + "&fmt=json3")).json();
      return (j.events || []).filter(e => e.segs).map(e => ({
        t: e.tStartMs / 1e3,
        s: e.segs.map(x => x.utf8).join("").replace(/\s+/g, " ").trim()
      })).filter(e => e.s);
    } catch {
      return [];
    }
  };
  const signed = () => performance.getEntriesByType("resource").map(e => e.name).reverse().find(u => u.includes("/api/timedtext") && u.includes("pot="));
  let extra = "";
  const loadAll = () => Promise.all(tracks.map(async t => ({
    name: t.name && (t.name.simpleText || (t.name.runs || []).map(r => r.text).join("")) || t.languageCode,
    lang: t.languageCode,
    guess: t === guess,
    lines: await load(t.baseUrl + extra),
    target: /^en/.test(t.languageCode) ? "vi" : "en",
    track: t
  })));
  let found = (await loadAll()).filter(t => t.lines.length);
  if (!found.length && tracks.length) {
    let url = signed();
    if (!url && player && player.setOption) {
      const was = player.getOption ? player.getOption("captions", "track") : null;
      try {
        player.loadModule("captions");
        player.setOption("captions", "track", { languageCode: (guess || tracks[0]).languageCode });
      } catch {}
      for (let n = 0; n < 30 && !url; n++) {
        await new Promise(r => setTimeout(r, 200));
        url = signed();
      }
      try {
        player.setOption("captions", "track", was && was.languageCode ? was : {});
      } catch {}
    }
    if (url) {
      const q = new URL(url, location.href).searchParams;
      extra = [ "pot", "potc", "c", "cver" ].filter(k => q.has(k)).map(k => "&" + k + "=" + encodeURIComponent(q.get(k))).join("");
      found = (await loadAll()).filter(t => t.lines.length);
    }
  }
  const best = found.find(t => t.guess) || found[0];
  if (best && base(best.track) !== best.target) best.translated = await load(best.track.baseUrl + extra + "&tlang=" + best.target);
  if (!found.length) {
    const find = () => document.querySelectorAll("ytd-transcript-segment-renderer");
    if (!find().length) {
      const open = document.querySelector("ytd-video-description-transcript-section-renderer button");
      if (open) open.click();
      for (let n = 0; n < 40 && !find().length; n++) await new Promise(r => setTimeout(r, 200));
    }
    const lines = [ ...find() ].map(el => ({
      t: ((el.querySelector(".segment-timestamp") || {}).textContent || "").trim().split(":").map(Number).reduce((a, b) => a * 60 + b, 0),
      s: ((el.querySelector(".segment-text") || {}).textContent || "").replace(/\s+/g, " ").trim()
    })).filter(e => e.s);
    if (lines.length) found.push({ name: "Transcript panel", lang: "", lines: lines });
  }
  if (!found.length) return { error: "This video has no subtitles to use" };
  return {
    id: id,
    title: title,
    best: found.indexOf(best),
    tracks: found.map(t => ({
      name: t.name,
      lang: t.lang,
      target: t.lang ? t.target : "",
      lines: t.lines,
      translated: t.translated || []
    }))
  };
}

async function importYouTube(tabId) {
  const say = text => chrome.tabs.sendMessage(tabId, { type: "toast", text: text }).catch(() => {});
  say("Getting the subtitles…");
  let result;
  try {
    [ { result } ] = await chrome.scripting.executeScript({ target: { tabId: tabId }, world: "MAIN", func: grabTracks });
  } catch (e) {
    return say("Couldn't read this page: " + (e && e.message || e));
  }
  if (!result || result.error) return say(result && result.error || "Couldn't get the subtitles");
  await chrome.storage.local.set({ ytPending: Object.assign({ at: Date.now() }, result) });
  say("Opening wikiPhidia…");
  await openApp();
}

const MANIFEST_URL = "https://raw.githubusercontent.com/phillipxnguyen/wikiPhidia/main/extension/manifest.json";

const newer = (a, b) => {
  const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  return false;
};

async function checkUpdate() {
  try {
    const res = await fetch(MANIFEST_URL + "?t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) return;
    const latest = (await res.json()).version;
    const mine = chrome.runtime.getManifest().version;
    await chrome.storage.local.set({ update: newer(latest, mine) ? { version: latest, at: Date.now() } : null });
  } catch {}
  paintBadge();
}

async function paintBadge() {
  const { pending, update } = await chrome.storage.local.get([ "pending", "update" ]);
  const off = (await settings()).enabled === false;
  const n = (pending || []).length;
  await chrome.action.setBadgeBackgroundColor({ color: off ? "#8792a2" : n || !update ? "#1e9466" : "#2f6fd6" });
  await chrome.action.setBadgeText({ text: off ? "off" : n ? String(n) : update ? "↑" : "" });
}

async function injectOpenTabs() {
  const tabs = await chrome.tabs.query({});
  const inject = (tabId, files) => chrome.scripting.executeScript({ target: { tabId: tabId }, files: files }).catch(() => {});
  tabs.filter(t => t.id != null && /^(https?|file):/.test(t.url || "")).forEach(t => {
    if (!/^https:\/\/phillipxnguyen\.github\.io\//.test(t.url)) inject(t.id, [ "guard.js", "vendor/pinyin-pro.js", "reader.js" ]);
    if (/^(https:\/\/phillipxnguyen\.github\.io\/|file:).*wikiphidia|^http:\/\/(localhost|127\.0\.0\.1)[:/]/i.test(t.url)) inject(t.id, [ "bridge.js" ]);
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "wkp-add",
    title: "Add “%s” to wikiPhidia",
    contexts: [ "selection" ]
  });
  chrome.contextMenus.create({
    id: "wkp-yt",
    title: "Make a wikiPhidia lesson from this video",
    contexts: [ "page", "video" ],
    documentUrlPatterns: [ "https://www.youtube.com/*", "https://m.youtube.com/*" ]
  });
  checkUpdate();
  injectOpenTabs();
});

chrome.runtime.onStartup.addListener(checkUpdate);


chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "wkp-yt" && tab && tab.id != null) importYouTube(tab.id);
  if (info.menuItemId === "wkp-add" && tab && tab.id != null) chrome.tabs.sendMessage(tab.id, { type: "open", text: info.selectionText || "" }).catch(() => {});
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && (changes.pending || changes.update || changes.settings)) paintBadge();
});

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg && msg.type === "translate") {
    const text = cleanPunct(msg.text) || msg.text;
    translate(text, msg.to).catch(() => translateBackup(text, msg.to)).then(r => reply({ ok: true, ...r }), e => reply({ ok: false, error: String(e && e.message || e) }));
    return true;
  }
  if (msg && msg.type === "youtube") {
    const tabId = msg.tabId != null ? msg.tabId : sender.tab && sender.tab.id;
    if (tabId != null) importYouTube(tabId);
    reply({ ok: tabId != null });
    return false;
  }
  if (msg && msg.type === "checkUpdate") {
    checkUpdate().then(() => reply({ ok: true }));
    return true;
  }
  if (msg && msg.type === "openApp") {
    openApp().then(() => reply({ ok: true }), e => reply({ ok: false, error: String(e) }));
    return true;
  }
  return false;
});
