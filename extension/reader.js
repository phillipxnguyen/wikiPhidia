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
*{box-sizing:border-box;}
.wrap{--sel:#b9d4fb;--green:#1e9466;--green-soft:rgba(30,148,102,.12);--ink:#1d2330;--ink-2:#5e6878;--line:#dfe4ec;--bg:#fff;--bg-2:#f4f6fa;--answer:#1b6b44;font:14px/20px Inter, system-ui, -apple-system, "Segoe UI", sans-serif;color:var(--ink);}
@media (prefers-color-scheme: dark){.wrap{--sel:#2a4f80;--green:#3cc48d;--green-soft:rgba(60,196,141,.16);--ink:#e8ecf3;--ink-2:#9aa4b4;--line:#323a48;--bg:#1b2029;--bg-2:#242a35;--answer:#6fd3a0;}}
.pick{position:fixed;display:flex;align-items:center;justify-content:center;width:32px;height:32px;padding:0;border:0;border-radius:16px;background:var(--green);color:#fff;font:700 16px/20px system-ui, sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.25);cursor:pointer;}
.pick:hover{filter:brightness(1.08);}
.card{position:fixed;width:360px;max-width:calc(100vw - 24px);padding:20px;border:1px solid var(--line);border-radius:12px;background:var(--bg);box-shadow:0 16px 40px rgba(10,20,40,.22);}
.head{display:flow-root;}
.icons{float:right;display:flex;margin-left:8px;}
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
.foot{display:flex;align-items:center;gap:10px;}
.foot select{flex:1;min-width:0;padding:7px 28px 7px 10px;border:1px solid var(--line);border-radius:8px;background:var(--bg) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%235e6878' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 10px center;color:var(--ink);font:inherit;font-size:14px;line-height:20px;-webkit-appearance:none;appearance:none;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;cursor:pointer;}
.btn{flex:none;padding:8px 16px;border:0;border-radius:8px;background:var(--green);color:#fff;font:inherit;font-weight:700;cursor:pointer;}
.btn:hover{filter:brightness(1.08);}
.btn[disabled]{opacity:.5;cursor:default;filter:none;}
.ghost{background:none;color:var(--ink-2);font-weight:600;}
.ghost:hover{background:var(--bg-2);color:var(--ink);filter:none;}
.tip{position:fixed;max-width:280px;padding:8px 12px;border-radius:8px;background:#1d2330;color:#fff;font-size:13px;line-height:18px;box-shadow:0 6px 18px rgba(0,0,0,.25);pointer-events:none;}
.tip b{font-weight:700;}
.tip .tip-m{margin-top:4px;}
.tip small{display:block;margin-top:6px;color:#aab3c2;font-size:12px;line-height:16px;font-style:italic;}
.yt{position:fixed;left:16px;bottom:16px;display:flex;align-items:center;gap:8px;height:40px;padding:0 16px 0 6px;border:0;border-radius:20px;background:var(--green);color:#fff;font:700 14px/20px Inter, system-ui, sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.3);cursor:pointer;}
.yt:hover{filter:brightness(1.08);}
.yt span{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:14px;background:rgba(255,255,255,.2);font-size:16px;line-height:20px;}
.yt[disabled]{opacity:.7;cursor:default;}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);padding:10px 16px;border-radius:10px;background:#1d2330;color:#fff;font-size:14px;line-height:20px;box-shadow:0 8px 24px rgba(0,0,0,.3);}
</style><div class="wrap"></div>`;
  const wrap = root.querySelector(".wrap");
  const mount = () => {
    if (!host.isConnected) document.documentElement.appendChild(host);
  };

  const hlStyle = document.createElement("style");
  hlStyle.textContent = "wkp-hl{all:unset;display:inline;border-radius:3px;cursor:help;background:rgba(30,148,102,.18);}wkp-hl[data-state=pending]{background:rgba(120,130,150,.2);}";

  function rebuildKnown() {
    known = new Map();
    app.words.forEach(w => known.set(norm(w.term), { term: w.term, meaning: w.meaning, lesson: w.lesson, state: "app" }));
    pending.forEach(w => {
      if (!known.has(norm(w.term))) known.set(norm(w.term), { term: w.term, meaning: w.meaning, lesson: w.lessonName || "", state: "pending" });
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

  let tip = null;
  document.addEventListener("mouseover", e => {
    if (gone()) return;
    const mark = e.target.closest && e.target.closest("wkp-hl");
    if (!mark) {
      if (tip) tip.remove(), tip = null;
      return;
    }
    const k = known.get(norm(mark.textContent));
    if (!k) return;
    mount();
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "tip";
      wrap.appendChild(tip);
    }
    const reading = langOf(k.term) === "zh" && window.pinyinPro ? pinyinPro.pinyin(k.term) : "";
    tip.innerHTML = `<b>${esc(k.term)}</b>${reading ? " · " + esc(reading) : ""}<div class="tip-m">${esc(k.meaning || "—")}</div>${k.lesson ? `<small>${esc(k.lesson)}</small>` : ""}`;
    const r = mark.getBoundingClientRect();
    const w = Math.min(280, tip.offsetWidth);
    tip.style.left = Math.round(Math.max(8, Math.min(innerWidth - w - 8, r.left))) + "px";
    tip.style.top = Math.round(r.top - tip.offsetHeight - 8 > 8 ? r.top - tip.offsetHeight - 8 : r.bottom + 8) + "px";
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

  function closeCard() {
    if (card) card.remove();
    card = null;
    cardTranslate = null;
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

  const same = (a, b) => (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase();

  function lessonOptions() {
    const list = app.lessons.slice().sort((a, b) => (b.words ? 1 : 0) - (a.words ? 1 : 0) || a.name.localeCompare(b.name));
    const fixed = settings.lessonId && list.find(l => l.id === settings.lessonId) || settings.lessonName && list.find(l => same(l.name, settings.lessonName));
    const wanted = fixed ? fixed.name : settings.lessonName || articleTitle();
    const there = list.find(l => same(l.name, wanted));
    let html = there ? "" : `<option value="name:${esc(wanted)}" selected>🆕 ${esc(wanted)}</option>`;
    html += list.map(l => `<option value="id:${esc(l.id)}"${l === there ? " selected" : ""}>${esc(l.name)}</option>`).join("");
    html += `<option value="new">New lesson…</option>`;
    return html;
  }

  function place(el, range) {
    const r = range && range.getBoundingClientRect ? range.getBoundingClientRect() : null;
    const w = el.offsetWidth, h = el.offsetHeight;
    let left = r ? r.left : (innerWidth - w) / 2;
    let top = r ? r.bottom + 10 : 80;
    if (top + h > innerHeight - 12 && r) top = r.top - h - 10;
    left = Math.max(12, Math.min(innerWidth - w - 12, left));
    top = Math.max(12, Math.min(innerHeight - h - 12, top));
    el.style.left = Math.round(left) + "px";
    el.style.top = Math.round(top) + "px";
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
    card.innerHTML = `<div class="head"><span class="icons"><button class="icon say" title="Listen" aria-label="Listen">🔊</button><button class="icon tr-btn" title="Translate the sentence" aria-label="Translate the sentence"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 5h8M7 3v2M5 5c0 3 2 5 5 6M9 5c0 3-2 5-5 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 17l3-7 3 7M12 15h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="icon close" title="Close (Esc)" aria-label="Close">✕</button></span><div class="term" contenteditable="plaintext-only" spellcheck="false" role="textbox" aria-label="Word"></div></div>
<div class="reading"></div>
<div class="body"><div class="field meaning" contenteditable="plaintext-only" role="textbox" data-placeholder="Translating…" aria-label="Meaning"></div><div class="alts"></div>
<div class="sent-view"></div><textarea class="field sentence" rows="1" aria-label="Sentence" hidden></textarea><div class="sub sent-tr"></div>
<div class="note"></div>
<div class="foot"><select class="lesson" aria-label="Lesson">${lessonOptions()}</select><button class="btn add">Add</button></div></div>`;
    wrap.appendChild(card);
    const $ = s => card.querySelector(s);
    const termEl = $(".term"), meaningEl = $(".meaning"), sentEl = $(".sentence"), readingEl = $(".reading"), note = $(".note");
    // The word and the meaning wrap instead of being cut off; they are still read and set as values.
    [termEl, meaningEl].forEach(el => {
      Object.defineProperty(el, "value", { get() { return this.textContent; }, set(v) { this.textContent = v; } });
      el.addEventListener("keydown", e => {
        if (e.key === "Enter") e.preventDefault();
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
    const lookUp = () => {
      const t = termEl.value.trim();
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
    $(".say").addEventListener("click", () => speak(termEl.value.trim()));
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
    $(".lesson").addEventListener("change", e => {
      if (e.target.value !== "new") return;
      const name = (prompt("Name of the new lesson", "") || "").trim();
      if (!name) {
        e.target.value = e.target.options[0].value;
        return;
      }
      const opt = document.createElement("option");
      opt.value = "name:" + name;
      opt.textContent = "🆕 " + name;
      e.target.insertBefore(opt, e.target.lastElementChild);
      e.target.value = opt.value;
    });
    $(".add").addEventListener("click", () => save());
    card.addEventListener("keydown", e => {
      e.stopPropagation();
      if (e.key === "Escape") closeCard();
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing && e.target !== sentEl) {
        e.preventDefault();
        save();
      }
    });
    ["keyup", "keypress", "mousedown", "mouseup", "click"].forEach(t => card.addEventListener(t, e => e.stopPropagation()));
    meaningEl.focus();

    async function save() {
      const t = termEl.value.replace(/\s+/g, " ").trim();
      if (!t || $(".add").disabled) return;
      const pick = $(".lesson").value;
      const word = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        term: t,
        meaning: meaningEl.value.replace(/\s+/g, " ").trim(),
        sentence: sentEl.value.replace(/\s+/g, " ").trim(),
        url: cardWord.url,
        title: cardWord.title,
        lessonId: pick.startsWith("id:") ? pick.slice(3) : "",
        lessonName: pick.startsWith("name:") ? pick.slice(5) : (app.lessons.find(l => "id:" + l.id === pick) || {}).name || articleTitle(),
        at: Date.now()
      };
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
  document.addEventListener("keydown", e => {
    shiftAlone = e.key === "Shift" && !e.ctrlKey && !e.metaKey && !e.altKey;
  }, true);
  document.addEventListener("keyup", e => {
    if (gone()) return;
    if (e.key !== "Shift" || !shiftAlone || !settings.shift || !on()) return;
    shiftAlone = false;
    if (card) {
      if (cardTranslate) cardTranslate();
      return;
    }
    const found = selectedText();
    if (found) openCard(found.text, found.range);
  }, true);

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
    if (tip) tip.remove(), tip = null;
  }, { passive: true, capture: true });

  let ytBtn = null;
  const ytVideo = () => /(^|\.)youtube\.com$/.test(location.hostname) && (new URL(location.href).searchParams.get("v") || /\/(shorts|live)\/[\w-]{11}/.test(location.pathname));
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
    ytBtn.innerHTML = "<span>字</span>Make a lesson";
    ytBtn.title = "Make a wikiPhidia lesson from this video's subtitles";
    ytBtn.addEventListener("click", () => {
      ytBtn.disabled = true;
      setTimeout(() => ytBtn && (ytBtn.disabled = false), 4e3);
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

  chrome.runtime.onMessage.addListener(msg => {
    if (msg && msg.type === "toast") toast(msg.text);
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
