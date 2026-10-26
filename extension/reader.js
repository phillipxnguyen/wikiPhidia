(() => {
  if (window.__wkpReader || window.top !== window) return;
  if (document.getElementById("vocabStage") && document.getElementById("cardTable")) return;
  window.__wkpReader = true;

  const DEFAULTS = {
    lang: "vi",
    lessonId: "",
    lessonName: "Reading",
    highlight: true,
    button: true,
    shift: true
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
  const langOf = s => KANA.test(s) ? "ja" : CJK.test(s) ? "zh" : HANGUL.test(s) ? "ko" : "";
  const alive = () => {
    try {
      return !!chrome.runtime.id;
    } catch (e) {
      return false;
    }
  };

  const host = document.createElement("wkp-reader");
  host.style.cssText = "all:initial;position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647;";
  const root = host.attachShadow({ mode: "closed" });
  root.innerHTML = `<style>
:host{all:initial;}
*{box-sizing:border-box;}
.wrap{--green:#1e9466;--green-soft:rgba(30,148,102,.12);--ink:#1d2330;--ink-2:#5e6878;--line:#dfe4ec;--bg:#fff;--bg-2:#f4f6fa;font:14px/20px Inter, system-ui, -apple-system, "Segoe UI", sans-serif;color:var(--ink);}
@media (prefers-color-scheme: dark){.wrap{--green:#3cc48d;--green-soft:rgba(60,196,141,.16);--ink:#e8ecf3;--ink-2:#9aa4b4;--line:#323a48;--bg:#1b2029;--bg-2:#242a35;}}
.pick{position:fixed;display:flex;align-items:center;justify-content:center;width:32px;height:32px;padding:0;border:0;border-radius:16px;background:var(--green);color:#fff;font:700 16px/20px system-ui, sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.25);cursor:pointer;}
.pick:hover{filter:brightness(1.08);}
.card{position:fixed;width:360px;max-width:calc(100vw - 24px);padding:16px;border:1px solid var(--line);border-radius:12px;background:var(--bg);box-shadow:0 16px 40px rgba(10,20,40,.22);}
.head{display:flex;align-items:flex-start;gap:8px;}
.term{flex:1;min-width:0;padding:2px 6px;margin:-2px -6px;border:1px solid transparent;border-radius:6px;font-size:22px;line-height:30px;font-weight:700;color:var(--ink);background:none;outline:none;}
.term:focus{border-color:var(--green);background:var(--bg-2);}
.icon{flex:none;display:flex;align-items:center;justify-content:center;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:none;color:var(--ink-2);font-size:16px;line-height:20px;cursor:pointer;}
.icon:hover{background:var(--bg-2);color:var(--ink);}
.reading{margin-top:2px;font-size:14px;line-height:20px;color:var(--green);}
.reading:empty{display:none;}
label{display:block;margin:12px 0 4px;font-size:12px;line-height:16px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);}
.field{width:100%;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink);font:inherit;font-size:16px;line-height:22px;outline:none;resize:none;}
.field:focus{border-color:var(--green);box-shadow:0 0 0 3px var(--green-soft);}
textarea.field{font-size:14px;line-height:20px;}
.alts{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}
.alts:empty{display:none;}
.alt{padding:2px 10px;border:1px solid var(--line);border-radius:12px;background:var(--bg-2);color:var(--ink);font:inherit;font-size:13px;line-height:20px;cursor:pointer;}
.alt:hover{border-color:var(--green);color:var(--green);}
.sub{margin-top:4px;font-size:13px;line-height:18px;color:var(--ink-2);}
.sub:empty{display:none;}
.link{padding:0;border:0;background:none;color:var(--green);font:inherit;font-size:13px;line-height:18px;cursor:pointer;}
.note{margin-top:12px;padding:8px 10px;border-radius:8px;background:var(--green-soft);color:var(--ink);font-size:13px;line-height:18px;}
.note:empty{display:none;}
.foot{display:flex;align-items:center;gap:8px;margin-top:14px;}
.foot select{flex:1;min-width:0;padding:7px 8px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink);font:inherit;font-size:14px;line-height:20px;}
.btn{flex:none;padding:8px 16px;border:0;border-radius:8px;background:var(--green);color:#fff;font:inherit;font-weight:700;cursor:pointer;}
.btn:hover{filter:brightness(1.08);}
.btn[disabled]{opacity:.5;cursor:default;filter:none;}
.ghost{background:none;color:var(--ink-2);font-weight:600;}
.ghost:hover{background:var(--bg-2);color:var(--ink);filter:none;}
.keys{margin-top:8px;font-size:12px;line-height:16px;color:var(--ink-2);}
.tip{position:fixed;max-width:280px;padding:6px 10px;border-radius:8px;background:#1d2330;color:#fff;font-size:13px;line-height:18px;box-shadow:0 6px 18px rgba(0,0,0,.25);pointer-events:none;}
.tip b{font-weight:700;}
.tip small{display:block;color:#aab3c2;font-size:12px;line-height:16px;}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);padding:10px 16px;border-radius:10px;background:#1d2330;color:#fff;font-size:14px;line-height:20px;box-shadow:0 8px 24px rgba(0,0,0,.3);}
</style><div class="wrap"></div>`;
  const wrap = root.querySelector(".wrap");
  const mount = () => {
    if (!host.isConnected) document.documentElement.appendChild(host);
  };

  const hlStyle = document.createElement("style");
  hlStyle.textContent = "wkp-hl{all:unset;display:inline;border-radius:3px;cursor:help;background:rgba(30,148,102,.16);box-shadow:inset 0 -2px 0 rgba(30,148,102,.7);}wkp-hl[data-state=pending]{background:rgba(120,130,150,.18);box-shadow:inset 0 -2px 0 rgba(120,130,150,.7);}";

  function rebuildKnown() {
    known = new Map();
    app.words.forEach(w => known.set(norm(w.term), { term: w.term, meaning: w.meaning, lesson: w.lesson, state: "app" }));
    pending.forEach(w => {
      if (!known.has(norm(w.term))) known.set(norm(w.term), { term: w.term, meaning: w.meaning, lesson: w.lessonName || settings.lessonName, state: "pending" });
    });
    const terms = [ ...known.values() ].map(k => k.term).filter(t => t && t.trim().length > 0).sort((a, b) => b.length - a.length).slice(0, 6000);
    if (!terms.length) {
      matcher = null;
      return;
    }
    const part = t => {
      const e = t.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
      return CJK.test(t) || KANA.test(t) ? e : "(?<![\\p{L}\\p{N}])" + e + "(?![\\p{L}\\p{N}])";
    };
    try {
      matcher = new RegExp(terms.map(part).join("|"), "giu");
    } catch (e) {
      matcher = null;
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

  function highlightIn(scope) {
    if (!matcher || !settings.highlight || !scope) return;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.nodeValue.trim().length && n.parentElement && !skipNode(n.parentElement) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let i = 0;
    const step = deadline => {
      while (i < nodes.length && (!deadline || deadline.timeRemaining() > 2)) {
        const node = nodes[i++];
        const text = node.nodeValue;
        matcher.lastIndex = 0;
        if (!matcher.test(text)) continue;
        matcher.lastIndex = 0;
        const frag = document.createDocumentFragment();
        let at = 0, m;
        while ((m = matcher.exec(text))) {
          if (!m[0]) {
            matcher.lastIndex++;
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
    schedule(step);
  }

  const schedule = fn => window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 600 }) : setTimeout(() => fn(null), 30);

  let rescanTimer = 0;
  function rescan() {
    clearTimeout(rescanTimer);
    rescanTimer = setTimeout(() => {
      observer.disconnect();
      unwrapAll();
      rebuildKnown();
      if (settings.highlight && matcher) {
        if (!hlStyle.isConnected) (document.head || document.documentElement).appendChild(hlStyle);
        highlightIn(document.body);
      }
      watch();
    }, 120);
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
      scopes.forEach(highlightIn);
      watch();
    }, 700);
  });
  const watch = () => {
    if (document.body && settings.highlight) observer.observe(document.body, { childList: true, subtree: true });
  };

  let tip = null;
  document.addEventListener("mouseover", e => {
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
    tip.innerHTML = `<b>${esc(k.term)}</b>${reading ? " · " + esc(reading) : ""}<br>${esc(k.meaning || "—")}<small>${k.state === "pending" ? "Waiting to be sent to wikiPhidia" : "In wikiPhidia · " + esc(k.lesson)}</small>`;
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
    } catch (e) {
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
    if (!settings.button) return;
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

  function closeCard() {
    if (card) card.remove();
    card = null;
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

  function lessonOptions(selected) {
    const list = app.lessons.slice().sort((a, b) => (b.words ? 1 : 0) - (a.words ? 1 : 0) || a.name.localeCompare(b.name));
    const hasDefault = list.some(l => l.name.trim().toLowerCase() === (settings.lessonName || "Reading").trim().toLowerCase());
    let html = "";
    if (!hasDefault) html += `<option value="name:${esc(settings.lessonName || "Reading")}">${esc(settings.lessonName || "Reading")} (new)</option>`;
    html += list.map(l => `<option value="id:${esc(l.id)}"${l.id === selected ? " selected" : ""}>${esc(l.name)}</option>`).join("");
    html += `<option value="new">New lesson…</option>`;
    return html;
  }

  function defaultLesson() {
    if (settings.lessonId && app.lessons.some(l => l.id === settings.lessonId)) return settings.lessonId;
    const byName = app.lessons.find(l => l.name.trim().toLowerCase() === (settings.lessonName || "Reading").trim().toLowerCase());
    return byName ? byName.id : "";
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
    card.innerHTML = `<div class="head"><input class="term" spellcheck="false" aria-label="Word"><button class="icon say" title="Listen" aria-label="Listen">🔊</button><button class="icon close" title="Close (Esc)" aria-label="Close">✕</button></div>
<div class="reading"></div>
<label>Meaning</label><input class="field meaning" placeholder="Translating…" aria-label="Meaning"><div class="alts"></div>
<label>Sentence</label><textarea class="field sentence" rows="3" aria-label="Sentence"></textarea><div class="sub sent-tr"></div><button class="link tr-btn">Translate the sentence</button>
<div class="note"></div>
<div class="foot"><select class="lesson" aria-label="Lesson">${lessonOptions(defaultLesson())}</select><button class="btn ghost cancel">Cancel</button><button class="btn add">Add</button></div>
<div class="keys">Enter adds · Esc closes · words go into Vocabulary next time wikiPhidia is open</div>`;
    wrap.appendChild(card);
    const $ = s => card.querySelector(s);
    const termEl = $(".term"), meaningEl = $(".meaning"), sentEl = $(".sentence"), readingEl = $(".reading"), note = $(".note");
    termEl.value = term;
    sentEl.value = sentence;
    cardWord = { term, url: location.href, title: document.title };
    const showReading = () => {
      const t = termEl.value.trim();
      readingEl.textContent = langOf(t) === "zh" && window.pinyinPro ? pinyinPro.pinyin(t) : "";
    };
    const showKnown = () => {
      const kk = known.get(norm(termEl.value));
      const add = $(".add");
      if (kk && kk.state === "app") {
        note.innerHTML = `Already in wikiPhidia · <b>${esc(kk.lesson)}</b><br>${esc(kk.meaning || "")}`;
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
    $(".cancel").addEventListener("click", closeCard);
    $(".tr-btn").addEventListener("click", () => {
      const btn = $(".tr-btn");
      btn.textContent = "Translating…";
      chrome.runtime.sendMessage({ type: "translate", text: sentEl.value.trim(), to: settings.lang }, res => {
        if (!card) return;
        btn.remove();
        $(".sent-tr").textContent = !chrome.runtime.lastError && res && res.ok ? res.text : "Couldn't translate it now";
      });
    });
    $(".lesson").addEventListener("change", e => {
      if (e.target.value !== "new") return;
      const name = (prompt("Name of the new lesson", "") || "").trim();
      if (!name) {
        e.target.value = e.target.options[0].value;
        return;
      }
      const opt = document.createElement("option");
      opt.value = "name:" + name;
      opt.textContent = name + " (new)";
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
        lessonName: pick.startsWith("name:") ? pick.slice(5) : (app.lessons.find(l => "id:" + l.id === pick) || {}).name || settings.lessonName,
        at: Date.now()
      };
      const { pending: now } = await chrome.storage.local.get("pending");
      const list = now || [];
      if (list.some(w => norm(w.term) === norm(t))) return closeCard();
      list.push(word);
      await chrome.storage.local.set({ pending: list });
      if (word.lessonId) await chrome.storage.local.set({ settings: Object.assign({}, settings, { lessonId: word.lessonId }) });
      closeCard();
      toast(`“${t}” saved · it goes into ${word.lessonName} when wikiPhidia is open`);
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
    if (e.key !== "Shift" || !shiftAlone || !settings.shift || card) return;
    shiftAlone = false;
    const found = selectedText();
    if (found) openCard(found.text, found.range);
  }, true);

  document.addEventListener("mouseup", e => {
    if (e.composedPath().includes(host)) return;
    setTimeout(() => {
      const found = selectedText();
      if (found) showPick(found); else hidePick();
    }, 10);
  }, true);

  document.addEventListener("mousedown", e => {
    if (e.composedPath().includes(host)) return;
    hidePick();
    if (card) closeCard();
  }, true);

  addEventListener("scroll", () => {
    hidePick();
    if (tip) tip.remove(), tip = null;
  }, { passive: true, capture: true });

  chrome.runtime.onMessage.addListener(msg => {
    if (msg && msg.type === "open") {
      const found = selectedText();
      openCard(found ? found.text : msg.text, found ? found.range : null);
    }
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !alive()) return;
    if (changes.settings) settings = Object.assign({}, DEFAULTS, changes.settings.newValue || {});
    if (changes.app) app = Object.assign({ lessons: [], words: [] }, changes.app.newValue || {});
    if (changes.pending) pending = changes.pending.newValue || [];
    if (changes.settings || changes.app || changes.pending) rescan();
  });

  chrome.storage.local.get([ "settings", "app", "pending" ]).then(data => {
    settings = Object.assign({}, DEFAULTS, data.settings || {});
    app = Object.assign({ lessons: [], words: [] }, data.app || {});
    pending = data.pending || [];
    rescan();
  });
})();
