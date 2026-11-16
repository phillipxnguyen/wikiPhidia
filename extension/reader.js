(() => {
  if (window.top !== window) return;
  if (document.getElementById("vocabStage") && document.getElementById("cardTable")) return;
  if (!document.dispatchEvent(new CustomEvent("wkp-reader", { cancelable: true }))) return;

  const DEFAULTS = {
    lang: "vi",
    lessonId: "",
    lessonName: "",
    highlight: true,
    shift: true,
    youtube: true,
    pick: "button",
    enabled: true
  };
  const CJK = /[㐀-鿿豈-﫿]/;
  const KANA = /[぀-ヿ]/;
  const HANGUL = /[가-힯]/;
  const SKIP = new Set([ "SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE", "SVG", "CANVAS", "IFRAME", "BUTTON" ]);

  let settings = Object.assign({}, DEFAULTS);
  let app = { lessons: [], words: [], at: 0 };
  let pending = [];
  let known = new Map();
  let matcher = null;

  const norm = s => (s || "").replace(/\s+/g, " ").trim().toLowerCase();
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[c]);
  const on = () => settings.enabled !== false;
  const marking = () => on() && settings.highlight;
  const langOf = s => KANA.test(s) ? "ja" : CJK.test(s) ? "zh" : HANGUL.test(s) ? "ko" : "";
  const alive = () => {
    try {
      return !!chrome.runtime.id;
    } catch {
      return false;
    }
  };
  let dead = false;
  const gone = () => {
    if (dead || alive()) return dead;
    dead = true;
    clearInterval(hrefTimer);
    observer.disconnect();
    host.remove();
    return true;
  };
  document.addEventListener("wkp-reader", e => {
    if (!gone()) e.preventDefault();
  });

  const host = document.createElement("wkp-reader");
  host.style.cssText = "all:initial;position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647;";
  const root = host.attachShadow({ mode: "closed" });
  root.innerHTML = `<style>
:host{all:initial;}
.sents{position:fixed;right:16px;bottom:16px;display:flex;flex-direction:column;width:400px;max-width:calc(100vw - 32px);max-height:min(520px, calc(100vh - 32px));border:1px solid var(--line);border-radius:12px;background:var(--bg);box-shadow:0 16px 40px rgba(10,20,40,.22);overflow:hidden;}
.sents-list{flex:1;min-height:0;margin:0;padding:0;overflow-y:auto;overscroll-behavior:contain;list-style:none;}
.sents-list li{display:flex;align-items:flex-start;gap:12px;padding:12px 16px;}
.sents-list li + li{border-top:1px solid var(--line);}
.sents-list .st{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;font-size:14px;line-height:20px;overflow-wrap:anywhere;}
.sents-list mark{border-radius:3px;background:var(--mark);color:inherit;}
.sents-list .hd{display:flex;flex-wrap:wrap;align-items:baseline;column-gap:8px;}
.sents-list .st b{font-size:14px;line-height:20px;font-weight:700;color:var(--green);}
.sents-list .st small{font-size:13px;line-height:20px;color:var(--ink-2);}
.sents-list .ed{min-width:24px;margin:0 -4px;padding:0 4px;border-radius:4px;outline:none;cursor:text;}
.sents-list .ed:hover{box-shadow:inset 0 0 0 1px var(--line);}
.sents-list .ed:focus{background:var(--bg);box-shadow:inset 0 0 0 2px var(--green);}
.sents-list .ed:empty::before{content:attr(data-ph);color:var(--ink-2);opacity:.6;}
.sents-list .sx{flex:none;display:flex;align-items:center;justify-content:center;width:20px;height:20px;padding:0;border:0;border-radius:10px;background:none;color:var(--ink-2);font-size:12px;line-height:16px;cursor:pointer;}
.sents-list .sx:hover{background:var(--bg-2);color:var(--ink);}
.sents-foot{display:flex;align-items:center;gap:0;padding:12px 16px 12px 6px;border-top:1px solid var(--line);background:var(--bg);}
.sents.small .sents-list{display:none;}
.sents.small .sents-foot{border-top:0;}
.sents-foot .icon{width:36px;height:36px;padding:0;border-radius:8px;}
.sents-foot .gap{flex:1;}
.sents-foot .ghost{margin-right:8px;}
.sents-foot .btn, .sents-foot .ghost{height:36px;padding:0 16px;line-height:20px;}
.ghost{flex:none;padding:8px 12px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink);font:inherit;cursor:pointer;}
.ghost:hover{border-color:var(--green);color:var(--green);}
*{box-sizing:border-box;}
.wrap{--sel:#b9d4fb;--green:#1e9466;--green-soft:rgba(30,148,102,.12);--ink:#1d2330;--ink-2:#5e6878;--line:#dfe4ec;--bg:#fff;--bg-2:#f4f6fa;--answer:#1b6b44;--mark:rgba(255,206,40,.55);font:14px/20px Inter, system-ui, -apple-system, "Segoe UI", sans-serif;color:var(--ink);}
@media (prefers-color-scheme: dark){.wrap{--sel:#2a4f80;--green:#3cc48d;--green-soft:rgba(60,196,141,.16);--ink:#e8ecf3;--ink-2:#9aa4b4;--line:#323a48;--bg:#1b2029;--bg-2:#242a35;--answer:#6fd3a0;--mark:rgba(240,190,40,.38);}}
.pick{position:fixed;display:flex;align-items:center;justify-content:center;width:32px;height:32px;padding:0;border:0;border-radius:16px;background:var(--green);color:#fff;font:700 16px/20px system-ui, sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.25);cursor:pointer;}
.pick:hover{filter:brightness(1.08);}
.card{position:fixed;width:460px;max-width:calc(100vw - 24px);padding:20px;border:1px solid var(--line);border-radius:12px;background:var(--bg);box-shadow:0 16px 40px rgba(10,20,40,.22);}
.head{display:flow-root;}
.icons{float:right;display:flex;align-items:center;margin-left:8px;}
.icons .lv{margin-right:6px;}
.term{display:block;min-height:30px;padding:0;margin:0;border:0;border-radius:0;font-size:22px;line-height:30px;font-weight:700;color:var(--ink);background:none;outline:none;cursor:text;overflow-wrap:anywhere;}
.icon{flex:none;display:flex;align-items:center;justify-content:center;height:30px;padding:0 6px;border:0;border-radius:8px;background:none;color:var(--ink-2);font-size:16px;line-height:20px;cursor:pointer;}
.icon:hover{background:var(--bg-2);color:var(--ink);}
.reading{margin-top:4px;font-size:14px;line-height:20px;color:var(--green);}
.reading:empty{display:none;}
.body{display:flex;flex-direction:column;gap:16px;margin-top:16px;}
.field{width:100%;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink);font:inherit;font-size:16px;line-height:22px;outline:none;resize:none;}
.field:focus{border-color:var(--green);box-shadow:0 0 0 3px var(--green-soft);}
.field.meaning{padding:4px 0 4px 12px;border:0;border-left:4px solid color-mix(in srgb, var(--green) 45%, transparent);border-radius:0;background:none;color:var(--answer);font-size:18px;line-height:26px;}
.field.meaning:focus{border-left-color:var(--green);box-shadow:none;}
.field.meaning{overflow-wrap:anywhere;cursor:text;}
.field.meaning:empty::before{content:attr(data-placeholder);color:var(--ink-2);}
textarea.field{display:block;padding:9px 11px;border-color:var(--green);background:var(--green-soft);font-size:16px;line-height:24px;overflow:hidden;}
.alts{display:flex;flex-wrap:wrap;gap:6px;}
.alts:empty{display:none;}
.alt{padding:2px 10px;border:1px solid var(--line);border-radius:12px;background:var(--bg-2);color:var(--ink);font:inherit;font-size:13px;line-height:20px;cursor:pointer;}
.alt:hover{border-color:var(--green);color:var(--green);}
.sent-view{padding:10px 12px;border-radius:8px;background:var(--green-soft);font-size:16px;line-height:24px;color:var(--ink);cursor:text;}
.sent-view mark, textarea.sentence::selection{padding:0;border-radius:0;background:var(--sel);color:inherit;}
textarea[hidden], .sent-view[hidden]{display:none;}
.sub{font-size:13px;line-height:18px;color:var(--ink-2);}
.sub:empty{display:none;}
.link{align-self:flex-start;padding:0;border:0;background:none;color:var(--green);font:inherit;font-size:13px;line-height:18px;cursor:pointer;}
.note{padding:8px 10px;border-radius:8px;background:var(--green-soft);color:var(--ink);font-size:13px;line-height:18px;}
.note:empty{display:none;}
.foot{display:flex;align-items:center;justify-content:flex-end;gap:10px;}
.btn{flex:none;padding:8px 16px;border:0;border-radius:8px;background:var(--green);color:#fff;font:inherit;font-weight:700;cursor:pointer;}
.btn:hover{filter:brightness(1.08);}
.btn[disabled]{opacity:.5;cursor:default;filter:none;}
.icon.on{background:var(--green-soft);color:var(--green);}
.ghost{background:none;color:var(--ink-2);font-weight:600;}
.ghost:hover{background:var(--bg-2);color:var(--ink);filter:none;}
.tip{position:fixed;display:flex;flex-direction:column;gap:16px;width:460px;max-width:calc(100vw - 16px);padding:24px 16px 16px;border:1px solid var(--line);border-radius:16px;background:var(--bg);color:var(--ink);box-shadow:0 16px 40px rgba(10,20,40,.22);}
.tip-top{display:flex;align-items:center;justify-content:space-between;gap:12px;}
.tip-top b{min-width:0;font-size:28px;line-height:36px;font-weight:700;overflow-wrap:anywhere;}
.tip-say{flex:none;display:flex;align-items:center;justify-content:center;width:40px;height:40px;padding:0;border:0;border-radius:20px;background:var(--bg-2);color:var(--ink-2);cursor:pointer;transition:background-color .4s ease, color .4s ease;}
.tip-say:hover{color:var(--ink);}
.tip-say.on{background:var(--green);color:#fff;}
.tip-say svg{width:20px;height:20px;}
.tip-say path{fill:currentColor;}
.tip-say path + path{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;}
.tip-r{font-size:16px;line-height:22px;color:var(--green);}
.tip-m{font-size:18px;line-height:26px;font-weight:700;color:var(--answer);overflow-wrap:anywhere;}
.tip-ex{margin:8px 0 0;font-size:18px;line-height:26px;color:var(--ink);overflow-wrap:anywhere;}
.tip-ex mark{padding:0 2px;border-radius:4px;background:var(--mark);color:inherit;font-weight:700;}
.tip-l{display:flex;justify-content:space-between;gap:12px;margin-top:8px;font-size:13px;line-height:18px;color:var(--ink-2);}
.tip{max-height:calc(100vh - 16px);overflow-y:auto;overscroll-behavior:contain;}
.tip :is(.tip-top b, .tip-r, .tip-m, .exs p, .tnotes, .tip-l span, .dnote){text-box:trim-both cap alphabetic;}
.tip .tip-say{margin-block:-10px;}
.tip :is(.defs, .exs, .srcs, .tnotes, .tip-l){margin-top:0;}
.tip .exs{gap:16px;}
.tip-word{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0;}
.lv{flex:none;padding:2px 8px;border-radius:6px;background:var(--green-soft);color:var(--green);font-size:13px;line-height:18px;font-weight:700;white-space:nowrap;cursor:default;}
.defs{display:flex;flex-direction:column;gap:6px;margin-top:8px;}
.defs:empty{display:none;}
.dg{display:grid;grid-template-columns:auto minmax(0,1fr);gap:6px 8px;align-items:start;}
.dg.one .dpos{align-self:center;}
.dg:not(:has(.dpos)){grid-template-columns:minmax(0,1fr);}
.dg .dpos{grid-row:1;grid-column:1;}
.dg .dds{display:contents;}
.dg .dd{grid-column:-2;}
.dpos{flex:none;min-width:44px;padding:2px 6px;border-radius:6px;background:var(--bg-2);color:var(--ink-2);font-size:14px;line-height:20px;font-weight:700;text-align:center;}
.dds{flex:1;display:flex;flex-direction:column;align-items:stretch;gap:6px;min-width:0;}
.dd{padding:8px 12px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);font:inherit;font-size:16px;line-height:24px;text-align:left;overflow-wrap:anywhere;}
button.dd{cursor:pointer;}
button.dd:hover{border-color:var(--green);color:var(--green);}
.exs{display:flex;flex-direction:column;gap:8px;margin-top:8px;}
.exs:empty{display:none;}
.exs p{margin:0;font-size:16px;line-height:24px;color:var(--ink);overflow-wrap:anywhere;}
.exs p:first-child.own{font-size:18px;line-height:26px;}
.exs mark{padding:0 2px;border-radius:4px;background:var(--mark);color:inherit;font-weight:700;}
.exs small{display:block;font-size:13px;line-height:18px;color:var(--ink-2);}
.tnotes{margin-top:8px;padding:2px 0 2px 12px;border-left:4px solid color-mix(in srgb, var(--green) 45%, transparent);font-size:16px;line-height:24px;color:var(--ink);white-space:pre-line;overflow-wrap:anywhere;}
.loading{font-size:13px;line-height:18px;color:var(--ink-2);}
.srcs{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
.srcs:empty{display:none;}
.sp{padding:2px 10px;border:1px solid var(--line);border-radius:12px;background:var(--bg);color:var(--ink-2);font:inherit;font-size:13px;line-height:20px;font-weight:600;cursor:pointer;}
.sp:hover{border-color:var(--green);color:var(--green);}
.sp.on{border-color:var(--green);background:var(--green);color:#fff;}
.dd em{display:block;margin-bottom:2px;font-style:normal;font-size:12px;line-height:16px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--green);}
.dnote{margin:0;font-size:14px;line-height:20px;color:var(--ink-2);font-style:italic;}
.card .defs, .card .exs, .card .srcs{margin-top:0;}
.card .foot{position:sticky;bottom:-20px;z-index:1;margin:0 -20px -20px;padding:12px 20px 20px;background:var(--bg);}
.card{max-height:calc(100vh - 16px);overflow-y:auto;overscroll-behavior:contain;}
.yt{position:fixed;left:16px;bottom:16px;display:flex;align-items:center;gap:8px;height:40px;padding:0 16px 0 6px;border:0;border-radius:20px;background:var(--green);color:#fff;font:700 14px/20px Inter, system-ui, sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.3);cursor:pointer;}
.yt:hover{filter:brightness(1.08);}
.yt span{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:14px;background:rgba(255,255,255,.2);font-size:16px;line-height:20px;}
.yt[disabled]{cursor:default;}
.yt.busy span{border:3px solid rgba(255,255,255,.3);border-top-color:#fff;box-sizing:border-box;font-size:0;animation:ytspin .8s linear infinite;}
@keyframes ytspin{to{transform:rotate(360deg);}}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);padding:10px 16px;border-radius:10px;background:#1d2330;color:#fff;font-size:14px;line-height:20px;box-shadow:0 8px 24px rgba(0,0,0,.3);}
</style><div class="wrap"></div>`;
  const wrap = root.querySelector(".wrap");
  const mount = () => {
    if (!host.isConnected) document.documentElement.appendChild(host);
  };

  const hlStyle = document.createElement("style");
  hlStyle.textContent = "wkp-hl{all:unset;display:inline;cursor:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cg%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%226%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%225%22%2F%3E%3Cpath%20d%3D%22M14.5%2014.5L21%2021%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%226%22%2F%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%226%22%20stroke%3D%22%231f2633%22%20stroke-width%3D%222%22%2F%3E%3Cpath%20d%3D%22M14.5%2014.5L21%2021%22%20stroke%3D%22%231f2633%22%20stroke-width%3D%223%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\") 10 10, zoom-in;color:#1e9466 !important;}wkp-hl[data-state=pending]{color:#8a919e !important;}";

  function rebuildKnown() {
    known = new Map();
    app.words.forEach(w => known.set(norm(w.term), { term: w.term, meaning: w.meaning, sentence: w.sentence || "", notes: w.notes || "", lesson: w.lesson, state: "app" }));
    pending.forEach(w => {
      if (w.kind !== "sentence" && !known.has(norm(w.term))) known.set(norm(w.term), { term: w.term, meaning: w.meaning, sentence: w.sentence || "", lesson: w.lessonName || "", state: "pending" });
    });
    matcher = matcherFor([ ...known.values() ].map(k => k.term));
  }

  function matcherFor(list) {
    const terms = list.filter(t => t && t.trim().length > 0).sort((a, b) => b.length - a.length).slice(0, 6000);
    if (!terms.length) return null;
    const part = t => {
      const e = t.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
      return CJK.test(t) || KANA.test(t) ? e : "(?<![\\p{L}\\p{N}])" + e + "(?![\\p{L}\\p{N}])";
    };
    try {
      return new RegExp(terms.map(part).join("|"), "giu");
    } catch {
      return null;
    }
  }

  function unwrapAll() {
    document.querySelectorAll("wkp-hl").forEach(el => el.replaceWith(document.createTextNode(el.textContent)));
    document.body && document.body.normalize();
  }

  function skipNode(el) {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (SKIP.has(n.tagName) || n.isContentEditable || n.tagName === "WKP-HL" || n.tagName === "WKP-READER") return true;
    }
    return false;
  }

  function highlightIn(scope, re = matcher, now = false) {
    if (!re || !marking() || !scope) return;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.nodeValue.trim().length && n.parentElement && !skipNode(n.parentElement) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let i = 0;
    const step = deadline => {
      while (i < nodes.length && (now || !deadline || deadline.timeRemaining() > 2)) {
        const node = nodes[i++];
        const text = node.nodeValue;
        re.lastIndex = 0;
        if (!re.test(text)) continue;
        re.lastIndex = 0;
        const frag = document.createDocumentFragment();
        let at = 0, m;
        while ((m = re.exec(text))) {
          if (!m[0]) {
            re.lastIndex++;
            continue;
          }
          const k = known.get(norm(m[0]));
          if (!k) continue;
          if (m.index > at) frag.appendChild(document.createTextNode(text.slice(at, m.index)));
          const mark = document.createElement("wkp-hl");
          mark.dataset.state = k.state;
          mark.textContent = m[0];
          frag.appendChild(mark);
          at = m.index + m[0].length;
        }
        if (!at) continue;
        if (at < text.length) frag.appendChild(document.createTextNode(text.slice(at)));
        if (node.parentNode) node.parentNode.replaceChild(frag, node);
      }
      if (i < nodes.length) schedule(step);
    };
    if (now) step(null); else schedule(step);
  }

  const schedule = fn => window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 600 }) : setTimeout(() => fn(null), 30);

  let rescanTimer = 0;
  let markedKeys = null;
  function refresh() {
    observer.disconnect();
    rebuildKnown();
    if (!marking()) unwrapAll(); else document.querySelectorAll("wkp-hl").forEach(el => {
      const k = known.get(norm(el.textContent));
      if (!k) el.replaceWith(document.createTextNode(el.textContent)); else if (el.dataset.state !== k.state) el.dataset.state = k.state;
    });
    if (marking() && matcher) {
      if (!hlStyle.isConnected) (document.head || document.documentElement).appendChild(hlStyle);
      if (!markedKeys) highlightIn(document.body); else {
        const fresh = [ ...known.entries() ].filter(([ key ]) => !markedKeys.has(key)).map(([ , k ]) => k.term);
        if (fresh.length) highlightIn(document.body, matcherFor(fresh), true);
      }
      markedKeys = new Set(known.keys());
    } else markedKeys = null;
    watch();
  }
  function rescan() {
    clearTimeout(rescanTimer);
    rescanTimer = setTimeout(refresh, 0);
  }

  let added = [];
  let addTimer = 0;
  const observer = new MutationObserver(list => {
    list.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType === 1 && n.tagName !== "WKP-HL" && n !== host) added.push(n); else if (n.nodeType === 3 && n.parentElement && n.parentElement.tagName !== "WKP-HL") added.push(n.parentElement);
    }));
    if (!added.length) return;
    clearTimeout(addTimer);
    addTimer = setTimeout(() => {
      const scopes = added.filter(n => n.isConnected);
      added = [];
      observer.disconnect();
      scopes.forEach(n => highlightIn(n));
      watch();
    }, 700);
  });
  const watch = () => {
    if (document.body && marking()) observer.observe(document.body, { childList: true, subtree: true });
  };

  let tip = null, tipMark = null, tipHide = 0, tipAudio = null;
  const SPEAK_ICON = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 8v4h3l4 3V5L7 8z"/><path d="M14 7.5a3.5 3.5 0 0 1 0 5M16 5.5a6.5 6.5 0 0 1 0 9"/></svg>';
  function stopTipSound() {
    if (tipAudio) {
      tipAudio.onended = tipAudio.onerror = null;
      try {
        tipAudio.pause();
      } catch {}
      tipAudio = null;
    }
    if (window.speechSynthesis) speechSynthesis.cancel();
    const b = tip && tip.querySelector(".tip-say");
    if (b) b.classList.remove("on");
  }
  function hideTip() {
    clearTimeout(tipHide);
    stopTipSound();
    if (tip) tip.remove();
    tip = tipMark = null;
  }
  function audioUrl(term) {
    const w = term.trim(), l = langOf(w) || (/^[a-z' -]+$/i.test(w) ? "en" : "");
    if (!w || w.length > 24) return "";
    if (l === "en") return "https://dict.youdao.com/dictvoice?type=2&audio=" + encodeURIComponent(w.toLowerCase());
    const le = { zh: "zh", ja: "jap", ko: "ko" }[l];
    return le ? "https://dict.youdao.com/dictvoice?le=" + le + "&audio=" + encodeURIComponent(w) : "";
  }
  function sayTip(term, url, btn) {
    btn = btn || (tip && tip.querySelector(".tip-say"));
    if (btn && btn.classList.contains("on")) return stopTipSound();
    stopTipSound();
    if (btn) btn.classList.add("on");
    const done = () => btn && btn.classList.remove("on");
    const fallback = () => {
      tipAudio = null;
      if (!window.speechSynthesis) return done();
      speak(term);
      const check = setInterval(() => {
        if (speechSynthesis.speaking) return;
        clearInterval(check);
        done();
      }, 200);
    };
    url = url || audioUrl(term);
    if (!url) return fallback();
    const a = new Audio(url);
    tipAudio = a;
    a.onended = () => {
      tipAudio = null;
      done();
    };
    a.onerror = () => tipAudio === a && fallback();
    const p = a.play();
    if (p && p.catch) p.catch(() => tipAudio === a && fallback());
  }
  function markedSentence(sentence, term) {
    const s = sentence || "";
    if (!s) return "";
    let at = -1, len = term.length;
    if (CJK.test(term) || KANA.test(term) || HANGUL.test(term)) at = s.indexOf(term); else {
      const m = new RegExp("(?<![\\p{L}\\p{N}])" + term.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+") + "\\w*", "iu").exec(s);
      if (m) at = m.index, len = m[0].length;
    }
    return at < 0 ? esc(s) : esc(s.slice(0, at)) + "<mark>" + esc(s.slice(at, at + len)) + "</mark>" + esc(s.slice(at + len));
  }
  const dict = window.wkpDict;
  const posFit = typeof ResizeObserver === "function" ? new ResizeObserver(list => list.forEach(e => {
    const box = e.target, g = box.closest(".dg");
    if (!g) return posFit.unobserve(box);
    const cs = getComputedStyle(box), inner = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    g.classList.toggle("one", inner <= parseFloat(cs.lineHeight) * 1.5);
  })) : null;
  function defsHtml(r, pick) {
    return (r && r.defs || []).map(g => `<div class="dg">${g.pos ? `<span class="dpos">${esc(g.pos)}</span>` : ""}<div class="dds">${g.d.map(x => {
      const t = typeof x === "string" ? x : x.t, h = typeof x === "string" ? "" : x.h || "";
      const inner = `${h ? `<em>${esc(h)}</em>` : ""}${esc(t)}`;
      return pick ? `<button type="button" class="dd" data-m="${esc(t)}" title="Use this as the meaning">${inner}</button>` : `<span class="dd">${inner}</span>`;
    }).join("")}</div></div>`).join("") + (r && r.note ? `<p class="dnote">${esc(r.note)}</p>` : "");
  }
  function exsHtml(list, term, own, n) {
    return (list || []).filter(x => x.t !== own).slice(0, n).map(x => `<p>${markedSentence(x.t, term)}${x.tr ? `<small>${esc(x.tr)}</small>` : ""}</p>`).join("");
  }
  function fillDict(box, term, opts) {
    if (!dict) return;
    const lang = dict.langOf(term), defsEl = box.querySelector(".defs"), srcsEl = box.querySelector(".srcs"), live = opts.live || (() => true);
    const exsEl = box.querySelector(".exs"), ownHtml = exsEl ? exsEl.innerHTML : "";
    let all = [], pick = "", lvSet = false;
    const setLv = (t, tip) => {
      const el = box.querySelector(".lv");
      if (!el || !t || lvSet) return;
      lvSet = true;
      el.textContent = t;
      el.title = tip || t;
      el.hidden = false;
    };
    const paint = () => {
      if (!live()) return;
      const cur = all.find(r => r.src === pick) || all[0];
      if (srcsEl) srcsEl.innerHTML = all.length > 1 ? all.map(r => `<button type="button" class="sp${r === cur ? " on" : ""}" data-src="${esc(r.src)}">${esc(r.src)}</button>`).join("") : "";
      if (defsEl) defsEl.innerHTML = cur ? defsHtml(cur, opts.pick) : all.length || !pendingNow ? "" : '<div class="loading">Looking it up…</div>';
      if (defsEl && posFit) defsEl.querySelectorAll(".dg > .dds > .dd:first-child").forEach(b => posFit.observe(b));
      const voiced = all.find(r => r.say.some(x => x.k === "UK") && r.say.some(x => x.k === "US")) || all.find(r => r.say.length);
      if (exsEl) {
        const exSrc = cur && cur.ex.length ? cur : all.find(r => r.ex.length);
        exsEl.innerHTML = ownHtml + exsHtml(exSrc && exSrc.ex, term, opts.own || "", opts.own ? 2 : 3);
      }
      const src = box.querySelector(".src");
      if (src) src.textContent = cur ? cur.src : "";
      const lvd = all.find(r => /^([ABC][12]|N[1-5])$/.test(r.lv || ""));
      if (lvd) setLv(lvd.lv, /^N/.test(lvd.lv) ? "JLPT " + lvd.lv : "CEFR " + lvd.lv);
      const rd = box.querySelector(".tip-r, .reading"), rr = all.find(r => r.reading);
      if (rd && rr && !rd.textContent) rd.textContent = rr.reading;
      const au = voiced && (voiced.say.find(x => x.k === "US" && x.audio) || voiced.say.find(x => x.audio));
      box.dataset.audio = au ? au.audio : "";
      opts.after && opts.after();
    };
    let pendingNow = [ "en", "zh", "ja", "ko" ].includes(lang) && !dict.isLong(term);
    if (srcsEl) srcsEl.onclick = e => {
      const b = e.target.closest(".sp");
      if (!b) return;
      e.stopPropagation();
      pick = b.dataset.src;
      paint();
    };
    paint();
    dict.level(lang, term).then(lv => {
      if (!live() || !lv) return;
      setLv(lv.t, lv.tip);
      opts.after && opts.after();
    });
    dict.lookup(lang, term, (r, list) => {
      all = list.slice();
      paint();
    }).then(list => {
      pendingNow = false;
      all = list.slice();
      paint();
    });
  }
  function placeTip() {
    if (tip && tipMark) anchorBox(tip, tipMark.getBoundingClientRect(), 8, true);
  }
  function showTip(mark) {
    const k = known.get(norm(mark.textContent));
    if (!k) return;
    clearTimeout(tipHide);
    if (tipMark === mark && tip) return;
    stopTipSound();
    mount();
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "tip";
      tip.addEventListener("click", e => {
        const b = e.target.closest(".tip-say");
        if (b) sayTip(b.dataset.say, tip.dataset.audio, b);
      });
      wrap.appendChild(tip);
    }
    tipMark = mark;
    tip.dataset.audio = "";
    delete tip.dataset.side;
    const reading = langOf(k.term) === "zh" && window.pinyinPro ? pinyinPro.pinyin(k.term).replace(/\s+([，。？！、；：,.?!;:])/g, "$1") : "";
    const own = k.sentence || "";
    tip.innerHTML = `<div class="tip-top"><div class="tip-word"><b>${esc(k.term)}</b><span class="lv" hidden></span></div><button type="button" class="tip-say" data-say="${esc(k.term)}" aria-label="Listen" title="Listen">${SPEAK_ICON}</button></div><div class="tip-r">${esc(reading)}</div>${k.meaning ? `<div class="tip-m">${esc(k.meaning)}</div>` : ""}<div class="srcs"></div><div class="defs"></div><div class="exs">${own ? `<p class="own">${markedSentence(own, mark.textContent.trim() || k.term)}</p>` : ""}</div>${(n => n ? `<div class="tnotes">${esc(n)}</div>` : "")((k.notes || "").split("\n").filter(t => norm(t) !== norm(own) && norm(t) !== norm(k.lesson)).join("\n"))}<div class="tip-l"><span>${esc(k.lesson || "")}</span><span class="src"></span></div>`;
    if (!reading) tip.querySelector(".tip-r").remove();
    placeTip();
    const me = mark;
    fillDict(tip, k.term, { own, live: () => tip && tipMark === me, after: placeTip });
  }
  document.addEventListener("mouseover", e => {
    if (gone()) return;
    if (e.target === host) return clearTimeout(tipHide);
    const mark = e.target.closest && e.target.closest("wkp-hl");
    if (mark) return showTip(mark);
    if (!tip) return;
    clearTimeout(tipHide);
    tipHide = setTimeout(hideTip, 250);
  }, true);

  function selectedText() {
    const sel = getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
    const node = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement);
    if (!node || node.closest("input, textarea, [contenteditable=''], [contenteditable='true']")) return null;
    const text = sel.toString().replace(/\s+/g, " ").trim();
    if (!text || text.length > 80) return null;
    return { text, range: sel.getRangeAt(0).cloneRange() };
  }

  function sentenceAround(range, text) {
    let block = range.commonAncestorContainer;
    if (block.nodeType !== 1) block = block.parentElement;
    while (block && block !== document.body && getComputedStyle(block).display.startsWith("inline")) block = block.parentElement;
    if (!block) return text;
    const all = (block.innerText || block.textContent || "").replace(/\s+/g, " ");
    let start;
    try {
      const pre = document.createRange();
      pre.setStart(block, 0);
      pre.setEnd(range.startContainer, range.startOffset);
      start = pre.toString().replace(/\s+/g, " ").length;
    } catch {
      start = all.indexOf(text);
    }
    const near = all.indexOf(text, Math.max(0, start - 40));
    if (near !== -1) start = near;
    if (start < 0) return text;
    const stops = /[.!?。！？；;…]/;
    let a = start;
    while (a > 0 && !(stops.test(all[a - 1]) && (!/[.]/.test(all[a - 1]) || /\s/.test(all[a] || " ")))) a--;
    let b = start + text.length;
    while (b < all.length && !stops.test(all[b])) b++;
    if (b < all.length) b++;
    let out = all.slice(a, b).trim();
    if (out.length > 320) {
      const from = Math.max(0, start - a - 140);
      out = (from ? "…" : "") + out.slice(from, from + 300).trim() + "…";
    }
    return out || text;
  }

  let pickBtn = null;
  let pickFor = null;
  function hidePick() {
    if (pickBtn) pickBtn.remove();
    pickBtn = null;
    pickFor = null;
  }
  function showPick(found) {
    if (card) return;
    mount();
    hidePick();
    const rects = found.range.getClientRects();
    const r = rects[rects.length - 1] || found.range.getBoundingClientRect();
    if (!r || !r.width && !r.height) return;
    pickBtn = document.createElement("button");
    pickBtn.className = "pick";
    pickBtn.textContent = "字";
    pickBtn.title = "Add to wikiPhidia (Shift)";
    pickBtn.style.left = Math.round(Math.min(innerWidth - 40, r.right + 4)) + "px";
    pickBtn.style.top = Math.round(Math.max(8, r.top - 36)) + "px";
    pickFor = found;
    pickBtn.addEventListener("mousedown", e => e.preventDefault());
    pickBtn.addEventListener("click", () => {
      const f = pickFor;
      hidePick();
      if (f) openCard(f.text, f.range);
    });
    wrap.appendChild(pickBtn);
  }

  let card = null;
  let cardWord = null;
  let translateToken = 0;

  let cardTranslate = null;
  let cardKeyDown = null;

  function closeCard() {
    stopTipSound();
    if (card) card.remove();
    card = null;
    cardTranslate = null;
    cardKeyDown = null;
    cardWord = null;
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const l = langOf(text);
    u.lang = l === "zh" ? "zh-CN" : l === "ja" ? "ja-JP" : l === "ko" ? "ko-KR" : document.documentElement.lang || "en-US";
    u.rate = .9;
    speechSynthesis.speak(u);
  }

  function articleTitle() {
    const meta = document.querySelector("meta[property='og:title'], meta[name='twitter:title']");
    const raw = (meta && meta.content || document.title || location.hostname).replace(/\s+/g, " ").trim();
    const parts = raw.split(/\s+[|\-–—·]\s+/).filter(Boolean);
    const best = parts.sort((a, b) => b.length - a.length)[0] || raw;
    return best.length > 120 ? best.slice(0, 117).trim() + "…" : best;
  }


  // The lesson last picked on this website: the next words from it go there too, until another is picked.
  function anchorBox(el, r, gap, above, cover) {
    el.style.maxHeight = "";
    const w = el.offsetWidth, full = el.offsetHeight, edge = 8;
    if (!r) {
      el.style.left = Math.round((innerWidth - w) / 2) + "px";
      el.style.top = "80px";
      return;
    }
    const up = Math.floor(r.top - gap - edge), down = Math.floor(innerHeight - r.bottom - gap - edge);
    let side = el.dataset.side || (above ? up >= full ? "up" : down >= full ? "down" : "" : down >= full ? "down" : up >= full ? "up" : "");
    if (!side) side = up > down ? "up" : "down";
    if (el.dataset.side && full > (side === "up" ? up : down) && (side === "up" ? down : up) > (side === "up" ? up : down)) side = side === "up" ? "down" : "up";
    el.dataset.side = side;
    if (cover && full > Math.max(up, down)) {
      const hh = Math.min(full, innerHeight - 2 * edge);
      if (hh < full) el.style.maxHeight = hh + "px";
      el.style.left = Math.round(Math.max(edge, Math.min(innerWidth - w - edge, r.left))) + "px";
      el.style.top = Math.round(Math.max(edge, Math.min(innerHeight - hh - edge, side === "up" ? r.top - gap - hh : r.bottom + gap))) + "px";
      return;
    }
    const room = side === "up" ? up : down, h = Math.min(full, room);
    if (h < full) el.style.maxHeight = Math.max(120, room) + "px";
    el.style.left = Math.round(Math.max(edge, Math.min(innerWidth - w - edge, r.left))) + "px";
    el.style.top = Math.round(side === "up" ? r.top - gap - h : r.bottom + gap) + "px";
  }

  function place(el, range) {
    const r = range && range.getBoundingClientRect ? range.getBoundingClientRect() : null;
    el.anchor = r;
    anchorBox(el, r, 10, false, true);
  }

  function openCard(text, range) {
    if (!alive()) return;
    mount();
    hidePick();
    closeCard();
    const term = text.replace(/\s+/g, " ").trim();
    const sentence = range ? sentenceAround(range, term) : term;
    const k = known.get(norm(term));
    card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<div class="head"><span class="icons"><span class="lv" hidden></span><button class="icon say" title="Listen" aria-label="Listen">🔊</button><button class="icon tr-btn" title="Translate the sentence" aria-label="Translate the sentence"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 5h8M7 3v2M5 5c0 3 2 5 5 6M9 5c0 3-2 5-5 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 17l3-7 3 7M12 15h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="icon close" title="Close (Esc)" aria-label="Close">✕</button></span><div class="term" contenteditable="plaintext-only" spellcheck="false" role="textbox" aria-label="Word"></div></div>
<div class="reading"></div>
<div class="body"><div class="field meaning" contenteditable="plaintext-only" role="textbox" data-placeholder="Translating…" aria-label="Meaning"></div><div class="alts"></div><div class="srcs"></div><div class="defs"></div>
<div class="sent-view"></div><textarea class="field sentence" rows="1" aria-label="Sentence" hidden></textarea><div class="sub sent-tr"></div><div class="exs"></div><div class="sub src"></div>
<div class="note"></div>
<div class="foot"><button class="btn add">Add</button></div></div>`;
    wrap.appendChild(card);
    const $ = s => card.querySelector(s);
    const termEl = $(".term"), meaningEl = $(".meaning"), sentEl = $(".sentence"), readingEl = $(".reading"), note = $(".note");
    // The word and the meaning wrap instead of being cut off; they are still read and set as values.
    [termEl, meaningEl].forEach(el => {
      Object.defineProperty(el, "value", { get() { return this.textContent; }, set(v) { this.textContent = v; } });
      el.addEventListener("input", () => {
        if (!el.textContent && el.innerHTML) el.innerHTML = "";
      });
    });
    Object.defineProperty(meaningEl, "placeholder", { get() { return this.dataset.placeholder; }, set(v) { this.dataset.placeholder = v; } });
    termEl.value = term;
    sentEl.value = sentence;
    const sentView = $(".sent-view");
    const paintSentence = () => {
      const text = sentEl.value.replace(/\s+/g, " ").trim();
      const t = termEl.value.trim();
      const at = t ? text.toLowerCase().indexOf(t.toLowerCase()) : -1;
      sentView.innerHTML = at === -1 ? esc(text) : esc(text.slice(0, at)) + "<mark>" + esc(text.slice(at, at + t.length)) + "</mark>" + esc(text.slice(at + t.length));
    };
    const fitSentence = () => {
      sentEl.style.height = "auto";
      sentEl.style.height = sentEl.scrollHeight + 2 + "px";
    };
    const editSentence = () => {
      sentView.hidden = true;
      sentEl.hidden = false;
      fitSentence();
      sentEl.focus();
      const t = termEl.value.trim();
      const at = t ? sentEl.value.toLowerCase().indexOf(t.toLowerCase()) : -1;
      if (at !== -1) sentEl.setSelectionRange(at, at + t.length);
    };
    sentEl.addEventListener("input", fitSentence);
    paintSentence();
    sentView.addEventListener("click", editSentence);
    sentEl.addEventListener("blur", () => {
      // Leaving the window (to look something up in another tab) keeps the sentence box open as it is.
      if (!document.hasFocus()) return;
      paintSentence();
      sentEl.hidden = true;
      sentView.hidden = false;
    });
    cardWord = { term, url: location.href, title: articleTitle() };
    const showReading = () => {
      const t = termEl.value.trim();
      readingEl.textContent = langOf(t) === "zh" && window.pinyinPro ? pinyinPro.pinyin(t) : "";
    };
    const showKnown = () => {
      const kk = known.get(norm(termEl.value));
      const add = $(".add");
      if (kk && kk.state === "app") {
        note.innerHTML = `Already in wikiPhidia · <i>${esc(kk.lesson)}</i><br>${esc(kk.meaning || "")}`;
        add.disabled = true;
        add.textContent = "Saved";
      } else if (kk && kk.state === "pending") {
        note.innerHTML = `Already waiting to be sent · ${esc(kk.meaning || "")}`;
        add.disabled = true;
        add.textContent = "Waiting";
      } else {
        note.textContent = "";
        add.disabled = false;
        add.textContent = "Add";
      }
    };
    let dictToken = 0;
    const lookDict = () => {
      const t = termEl.value.trim(), token = ++dictToken;
      [ ".defs", ".exs", ".src", ".srcs" ].forEach(sel => $(sel).innerHTML = "");
      const lv = $(".lv");
      lv.textContent = "";
      lv.hidden = true;
      card.dataset.audio = "";
      if (t) fillDict(card, t, { pick: true, live: () => card && token === dictToken, after: () => card && anchorBox(card, card.anchor, 10, false, true) });
    };
    const lookUp = () => {
      const t = termEl.value.trim();
      lookDict();
      if (!t) return;
      const token = ++translateToken;
      meaningEl.placeholder = "Translating…";
      chrome.runtime.sendMessage({ type: "translate", text: t, to: settings.lang }, res => {
        if (token !== translateToken || !card) return;
        if (chrome.runtime.lastError || !res || !res.ok) {
          meaningEl.placeholder = "Type the meaning";
          return;
        }
        if (!meaningEl.dataset.typed) meaningEl.value = res.text || "";
        meaningEl.placeholder = "Type the meaning";
        $(".alts").innerHTML = (res.alts || []).map(a => `<button class="alt">${esc(a)}</button>`).join("");
      });
    };
    showReading();
    showKnown();
    if (k && k.meaning) meaningEl.value = k.meaning;
    lookUp();
    place(card, range);
    let retype = 0;
    termEl.addEventListener("input", () => {
      showReading();
      paintSentence();
      showKnown();
      clearTimeout(retype);
      retype = setTimeout(lookUp, 400);
    });
    meaningEl.addEventListener("input", () => {
      meaningEl.dataset.typed = meaningEl.value ? "1" : "";
    });
    $(".alts").addEventListener("click", e => {
      const b = e.target.closest(".alt");
      if (!b) return;
      meaningEl.value = b.textContent;
      meaningEl.dataset.typed = "1";
      meaningEl.focus();
    });
    $(".say").addEventListener("click", e => sayTip(termEl.value.trim(), card.dataset.audio, e.currentTarget));
    card.addEventListener("click", e => {
      const dd = e.target.closest("button.dd");
      if (!dd) return;
      meaningEl.value = dd.dataset.m;
      meaningEl.dataset.typed = "1";
      meaningEl.focus();
    });
    $(".close").addEventListener("click", closeCard);
    cardTranslate = () => {
      const out = $(".sent-tr");
      if (out.textContent) return out.textContent = "";
      out.textContent = "Translating…";
      chrome.runtime.sendMessage({ type: "translate", text: sentEl.value.trim(), to: settings.lang }, res => {
        if (!card) return;
        out.textContent = !chrome.runtime.lastError && res && res.ok ? res.text : "Couldn't translate it now";
      });
    };
    $(".tr-btn").addEventListener("click", cardTranslate);
    $(".add").addEventListener("click", () => save());
    // Enter saves (a new line only in the sentence), Esc closes. Also called from guard.js, which takes the card's keys
    // away from the page before the page sees them; the target is then the card's focused box.
    cardKeyDown = (e, target) => {
      if (e.key === "Escape") closeCard();
      if (e.key === "Enter" && target !== sentEl) {
        e.preventDefault();
        if (!e.shiftKey && !e.isComposing) save();
      }
    };
    card.addEventListener("keydown", e => {
      e.stopPropagation();
      cardKeyDown(e, e.target);
    });
    ["keyup", "keypress", "mousedown", "mouseup", "click"].forEach(t => card.addEventListener(t, e => e.stopPropagation()));
    meaningEl.focus();

    async function save() {
      const t = termEl.value.replace(/\s+/g, " ").trim();
      if (!t || $(".add").disabled) return;
      const word = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        term: t,
        meaning: meaningEl.value.replace(/\s+/g, " ").trim(),
        sentence: sentEl.value.replace(/\s+/g, " ").trim(),
        url: cardWord.url,
        title: cardWord.title,
        lessonId: settings.lessonId || "",
        lessonName: settings.lessonName || articleTitle(),
        at: Date.now()
      };
      if (dict) word.dict = await Promise.race([ dict.lookup(dict.langOf(t), t), new Promise(res => setTimeout(() => res(null), 4e3)) ]).catch(() => null) || undefined;
      const { pending: now } = await chrome.storage.local.get("pending");
      const list = now || [];
      if (list.some(w => norm(w.term) === norm(t))) return closeCard();
      list.push(word);
      pending = list;
      refresh();
      await chrome.storage.local.set({ pending: list });
      closeCard();
      toast(word.meaning ? `${t}: ${word.meaning}` : t);
    }
  }

  let toastEl = null, toastTimer = 0;
  function toast(text) {
    mount();
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
    }
    toastEl.textContent = text;
    wrap.appendChild(toastEl);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl && toastEl.remove(), 2600);
  }

  let shiftAlone = false;
  const docKeyDown = e => {
    shiftAlone = e.key === "Shift" && !e.ctrlKey && !e.metaKey && !e.altKey;
  };
  const docKeyUp = e => {
    if (gone()) return;
    if (e.key !== "Shift" || !shiftAlone || !settings.shift || !on()) return;
    shiftAlone = false;
    if (card) {
      if (cardTranslate) cardTranslate();
      return;
    }
    const found = selectedText();
    if (found) openCard(found.text, found.range);
  };
  document.addEventListener("keydown", docKeyDown, true);
  document.addEventListener("keyup", docKeyUp, true);
  // Typing in the card is the card's alone: guard.js, listening before the page's own scripts, stops these keys from
  // ever reaching the page (sites such as ChatGPT otherwise pull every key into their own box) and hands them here.
  globalThis.wkpGuard = {
    host,
    keydown: e => {
      if (gone()) return;
      docKeyDown(e);
      if (cardKeyDown) cardKeyDown(e, root.activeElement);
    },
    keyup: e => gone() || docKeyUp(e)
  };

  document.addEventListener("mouseup", e => {
    if (gone() || e.composedPath().includes(host)) return;
    setTimeout(() => {
      const found = selectedText();
      if (!found || !on()) hidePick(); else if (settings.pick === "open") openCard(found.text, found.range); else showPick(found);
    }, 10);
  }, true);

  document.addEventListener("mousedown", e => {
    if (gone() || e.composedPath().includes(host)) return;
    hidePick();
    if (card) closeCard();
  }, true);

  addEventListener("scroll", () => {
    if (gone()) return;
    hidePick();
    if (tip) hideTip();
  }, { passive: true, capture: true });

  let ytBtn = null, ytWait = null, ytWaitTimer = 0, ytShown = null;
  const ytVideo = () => /(^|\.)youtube\.com$/.test(location.hostname) && (new URL(location.href).searchParams.get("v") || (location.pathname.match(/\/(?:shorts|live)\/([\w-]{11})/) || [])[1]);
  function ytLabel(state, text) {
    if (!ytBtn) return;
    ytBtn.classList.toggle("busy", state === "busy");
    ytBtn.disabled = state !== "idle";
    ytBtn.innerHTML = state === "busy" ? "<span>字</span>Making the lesson…" : state === "done" ? "<span>✓</span>" + text : "<span>字</span>Make a lesson";
  }
  function ytFinish(ok, text) {
    if (!ytWait) return;
    ytWait = null;
    clearTimeout(ytWaitTimer);
    if (!ok) {
      ytLabel("idle");
      return toast(text || "Couldn't make the lesson");
    }
    ytLabel("done", text || "Lesson created");
    ytWaitTimer = setTimeout(() => ytLabel("idle"), 3e3);
  }
  function syncYouTube() {
    if (gone()) return;
    const show = ytVideo() && settings.youtube !== false && on();
    if (!show) {
      if (ytBtn) ytBtn.remove();
      ytBtn = null;
      return;
    }
    if (ytBtn && ytBtn.isConnected) return;
    mount();
    ytBtn = document.createElement("button");
    ytBtn.className = "yt";
    ytBtn.title = "Make a wikiPhidia lesson from this video's subtitles";
    ytLabel(ytWait ? "busy" : "idle");
    ytBtn.addEventListener("click", () => {
      if (ytWait) return;
      ytWait = ytVideo();
      ytLabel("busy");
      clearTimeout(ytWaitTimer);
      ytWaitTimer = setTimeout(() => ytFinish(false, "wikiPhidia didn't answer: open it and try again"), 12e4);
      chrome.runtime.sendMessage({ type: "youtube" });
    });
    wrap.appendChild(ytBtn);
  }
  let lastHref = location.href;
  const hrefTimer = setInterval(() => {
    if (gone() || location.href === lastHref) return;
    lastHref = location.href;
    syncYouTube();
  }, 800);
  document.addEventListener("yt-navigate-finish", syncYouTube);

  let sents = [], sentsEl = null, sentsSmall = false;
  const draftKey = () => location.origin + location.pathname + location.search;
  const VI = /[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i;
  const sentenceParts = text => (text.replace(/\s+/g, " ").match(/[^.!?。！？]+(?:[.!?。！？]+["'”’)\]]*|$)/g) || []).map(t => t.trim()).filter(t => t.length >= 12 && t.length <= 320 && /[\p{L}]{2}/u.test(t));
  const itemKey = x => x.kind === "word" ? "w|" + norm(x.term) : "s|" + norm(x.word) + "|" + norm(x.t);
  function saveDraft() {
    chrome.storage.local.get("sentDrafts").then(({ sentDrafts }) => {
      const all = Object.assign({}, sentDrafts);
      if (sents.length) all[draftKey()] = { items: sents, at: Date.now() }; else delete all[draftKey()];
      const keep = Object.entries(all).sort((a, b) => b[1].at - a[1].at).slice(0, 20);
      chrome.storage.local.set({ sentDrafts: Object.fromEntries(keep) });
    });
  }
  function wordsIn(t) {
    const out = [];
    if (!matcher) return out;
    matcher.lastIndex = 0;
    let m;
    while ((m = matcher.exec(t))) {
      if (!m[0]) {
        matcher.lastIndex++;
        continue;
      }
      const k = known.get(norm(m[0]));
      if (k && k.meaning && !out.some(x => x.term === k.term) && norm(k.sentence) !== norm(t)) out.push(k);
    }
    return out;
  }
  function addItems(list) {
    let n = 0;
    list.forEach(x => {
      if (!sents.some(y => itemKey(y) === itemKey(x))) sents.push(x), n++;
    });
    saveDraft();
    paintSents(true);
    return n;
  }
  function collect() {
    const n = addItems(pageItems());
    toast(n ? `${n} card${n === 1 ? "" : "s"} found` : "Nothing new to make cards from on this page");
  }
  function paintSents(open) {
    if (open) sentsSmall = false;
    if (!sents.length && !open && !sentsEl) return;
    mount();
    if (!sentsEl) {
      sentsEl = document.createElement("div");
      sentsEl.className = "sents";
      sentsEl.addEventListener("click", e => {
        const b = e.target.closest("button");
        if (!b) return;
        if (b.classList.contains("sx")) {
          const list = sentsEl.querySelector(".sents-list"), top = list ? list.scrollTop : 0;
          sents.splice(Number(b.dataset.i), 1);
          saveDraft();
          paintSents();
          const again = sentsEl && sentsEl.querySelector(".sents-list");
          if (again) again.scrollTop = top;
          return;
        }
        if (b.dataset.act === "all") return collect();
        if (b.dataset.act === "send") return sendSents();
        if (b.dataset.act === "min") {
          sentsSmall = !sentsSmall;
          return paintSents();
        }
        if (b.dataset.act === "close") {
          sents = [];
          saveDraft();
          sentsEl.remove();
          sentsEl = null;
        }
      });
      sentsEl.addEventListener("input", e => {
        const el = e.target.closest(".ed"), x = el && sents[Number(el.dataset.i)];
        if (!x) return;
        x[el.dataset.f] = el.textContent.replace(/\s+/g, " ").trim();
        saveDraft();
      });
      sentsEl.addEventListener("keydown", e => {
        if (e.key === "Enter" && e.target.closest && e.target.closest(".ed")) {
          e.preventDefault();
          e.target.blur();
        }
      });
      ["keydown", "keyup", "keypress", "mousedown", "mouseup"].forEach(t => sentsEl.addEventListener(t, e => e.stopPropagation()));
    }
    sentsEl.classList.toggle("small", sentsSmall);
    const marked = (t, w) => {
      const e = esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), edge = !(CJK.test(w) || KANA.test(w));
      return esc(t).replace(new RegExp((edge ? "(?<![\\p{L}\\p{N}])" : "") + e + (edge ? "(?![\\p{L}\\p{N}])" : ""), "giu"), "<mark>$&</mark>");
    };
    const ed = (i, f, tag, html, ph) => `<${tag} class="ed" contenteditable="plaintext-only" spellcheck="false" data-i="${i}" data-f="${f}" data-ph="${ph}">${html}</${tag}>`;
    const row = (x, i) => x.kind === "word" ? ed(i, "term", "b", esc(x.term), "Word or phrase") + ed(i, "meaning", "small", esc(x.meaning), "Meaning") : `<span class="hd">${ed(i, "word", "b", esc(x.word), "Word")}${ed(i, "meaning", "small", esc(x.meaning), "Meaning")}</span>` + ed(i, "t", "span", marked(x.t, x.word), "Sentence") + ed(i, "tr", "small", esc(x.tr || ""), "Translation");
    sentsEl.innerHTML = `${sents.length ? `<ul class="sents-list">${sents.map((x, i) => `<li><span class="st">${row(x, i)}</span><button type="button" class="sx" data-i="${i}" title="Leave this one out">✕</button></li>`).join("")}</ul>` : ""}<div class="sents-foot"><button type="button" class="icon" data-act="close" title="Clear and close" aria-label="Clear and close">✕</button><button type="button" class="icon" data-act="min" title="${sentsSmall ? "Show" : "Hide"} the cards" aria-label="${sentsSmall ? "Show" : "Hide"} the cards">${sentsSmall ? "▴" : "▾"}</button><span class="gap"></span><button type="button" class="ghost" data-act="all" title="Read the page again for new cards">Read again</button><button type="button" class="btn" data-act="send"${sents.length ? "" : " disabled"}>Add ${sents.length === 1 ? "1 card" : (sents.length || "") + " cards"}</button></div>`;
    wrap.appendChild(sentsEl);
  }
  function pageItems() {
    const scope = document.querySelector("article, main, [role=main]") || document.body, out = [];
    const blocks = [ ...scope.querySelectorAll("p, li, h1, h2, h3, h4, h5, h6, blockquote, tr, dd, figcaption") ].filter(el => !el.closest("nav, header, footer, aside, form, wkp-reader") && !el.querySelector("p, li, tr") && el.getClientRects().length);
    const textOf = el => (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
    const bare = t => t.replace(/^\s*(?:\d+[.)]|[-•–])\s+/, "").trim();
    const isWordLike = t => t && t.length <= 60 && t.split(/\s+/).length <= 6 && !VI.test(t) && /\p{L}/u.test(t);
    const pushWord = (term, meaning) => {
      term = bare(term).replace(/[.:;,]+$/, "");
      meaning = meaning.replace(/\s+/g, " ").trim().replace(/[.:;]+$/, "");
      const plain = norm(term).replace(/^(a|an|the)\s+/, "");
      if (isWordLike(term) && meaning && !known.has(plain)) out.push({ kind: "word", term, meaning });
    };
    blocks.forEach((el, i) => {
      if (/^H\d$/.test(el.tagName)) return;
      if (el.tagName === "TR") {
        const cells = [ ...el.querySelectorAll("td") ].map(textOf).filter(Boolean);
        if (cells.length >= 2) pushWord(cells[0], cells[1]);
        return;
      }
      const text = bare(textOf(el));
      if (!text || VI.test(text.split(/[:：]/)[0])) return;
      const colon = text.match(/^([^:：]{1,60})[:：]\s*(.+)$/);
      if (colon && isWordLike(colon[1]) && VI.test(colon[2])) return pushWord(colon[1], colon[2]);
      const next = blocks[i + 1] && blocks[i + 1].tagName !== "TR" ? bare(textOf(blocks[i + 1])) : "";
      const parts = sentenceParts(text), tr = parts.length === 1 && next && VI.test(next) && next.length <= 400 ? next : "";
      parts.forEach(t => wordsIn(t).forEach(k => out.push({ kind: "sent", t, tr, word: k.term, meaning: k.meaning })));
    });
    return out;
  }
  async function sendSents() {
    if (!sents.length) return;
    const at = Date.now(), title = settings.lessonName || articleTitle();
    const { pending: now } = await chrome.storage.local.get("pending");
    const next = (now || []).concat(sents.map((x, i) => Object.assign({
      id: at.toString(36) + i.toString(36) + Math.random().toString(36).slice(2, 6),
      url: location.href,
      title: document.title,
      lessonId: settings.lessonId || "",
      lessonName: title,
      at
    }, x.kind === "word" ? { term: x.term, meaning: x.meaning, sentence: "" } : { kind: "wsent", term: x.word, meaning: x.meaning, sentence: x.t, translation: x.tr })));
    const n = sents.length;
    pending = next;
    await chrome.storage.local.set({ pending: next });
    sents = [];
    saveDraft();
    if (sentsEl) sentsEl.remove();
    sentsEl = null;
    toast(`${n} card${n === 1 ? "" : "s"} sent to wikiPhidia`);
  }
  chrome.storage.local.get("sentDrafts").then(({ sentDrafts }) => {
    const d = sentDrafts && sentDrafts[draftKey()];
    const items = d && Array.isArray(d.items) ? d.items.filter(x => x && (x.kind === "word" ? x.term : x.t && x.word)) : [];
    if (items.length && !gone()) {
      sents = items;
      sentsSmall = true;
      paintSents();
    }
  });

  chrome.runtime.onMessage.addListener(msg => {
    if (msg && msg.type === "collectAll" && on()) collect();
    if (msg && msg.type === "collectOpen" && on()) paintSents(true);
    if (msg && msg.type === "toast") toast(msg.text);
    if (msg && msg.type === "ytFail") ytFinish(false, msg.text);
    if (msg && msg.type === "open" && on()) {
      const found = selectedText();
      openCard(found ? found.text : msg.text, found ? found.range : null);
    }
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || gone()) return;
    if (changes.settings) settings = Object.assign({}, DEFAULTS, changes.settings.newValue || {});
    if (changes.app) app = Object.assign({ lessons: [], words: [] }, changes.app.newValue || {});
    if (changes.pending) pending = changes.pending.newValue || [];
    const done = changes.ytDone && changes.ytDone.newValue, taken = changes.ytPending && !changes.ytPending.newValue && changes.ytPending.oldValue;
    if (done && ytWait && done.id === ytWait) ytFinish(done.ok, done.text);
    if (taken && ytWait && taken.id === ytWait) {
      ytWait = null;
      ytLabel("done", "Opened in wikiPhidia");
      clearTimeout(ytWaitTimer);
      ytWaitTimer = setTimeout(() => ytLabel("idle"), 4e3);
      ytShown = taken.id;
    }
    if (done && !ytWait && done.id === ytShown) {
      ytShown = null;
      ytLabel("done", done.ok ? done.text : "Not made: " + done.text);
      clearTimeout(ytWaitTimer);
      ytWaitTimer = setTimeout(() => ytLabel("idle"), 3e3);
    }
    if (changes.settings || changes.app || changes.pending) rescan();
    if (changes.settings) syncYouTube();
    if (changes.settings && !on()) {
      hidePick();
      if (card) closeCard();
    }
  });

  chrome.storage.local.get([ "settings", "app", "pending" ]).then(data => {
    settings = Object.assign({}, DEFAULTS, data.settings || {});
    app = Object.assign({ lessons: [], words: [] }, data.app || {});
    pending = data.pending || [];
    rescan();
    syncYouTube();
  });
})();
