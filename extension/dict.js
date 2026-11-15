(() => {
  if (window.top !== window || window.wkpDict) return;
  const CJK = /[㐀-鿿豈-﫿]/, KANA = /[぀-ヿ]/, HANGUL = /[가-힯]/;
  const POS = { noun: "noun", verb: "verb", adjective: "adj", adverb: "adv", pronoun: "pron", preposition: "prep", conjunction: "conj", interjection: "interj", abbreviation: "abbr", particle: "part", phrase: "phrase", prefix: "prefix", suffix: "suffix", "phrasal verb": "phrasal verb", idiom: "idiom", determiner: "det", exclamation: "excl", n: "noun", v: "verb", adj: "adj", adv: "adv", "명사": "noun", "동사": "verb", "형용사": "adj", "부사": "adv" };
  const MAX = 300;
  const mem = new Map(), pending = new Map(), miss = new Set();
  let store = null, storeJob = null, queue = Promise.resolve();

  const langOf = s => KANA.test(s) ? "ja" : CJK.test(s) ? "zh" : HANGUL.test(s) ? "ko" : /^[a-z][a-z' -]*$/i.test((s || "").trim()) ? "en" : "";
  const isLong = w => (w || "").trim().length > 30 || /[.!?,;:。！？，；]/.test(w || "");
  const send = msg => new Promise(res => {
    try {
      chrome.runtime.sendMessage(msg, r => res(chrome.runtime.lastError ? null : r));
    } catch {
      res(null);
    }
  });
  const getText = async url => {
    const r = await send({ type: "dictFetch", url });
    return r && r.ok ? r.text : "";
  };
  const doc = text => new DOMParser().parseFromString(text, "text/html");
  const line = (el, drop) => {
    if (!el) return "";
    const c = el.cloneNode(true);
    if (drop) c.querySelectorAll(drop).forEach(n => n.remove());
    return c.textContent.replace(/\s+/g, " ").trim();
  };
  const pos = p => {
    p = (p || "").toLowerCase().replace(/[「」.]/g, "").trim();
    return POS[p] || p;
  };
  const guessPos = d => /^\s*to\s/i.test(d || "") ? "verb" : /^\s*(\(of|of|having|being|very|too|quite)\b/i.test(d || "") ? "adj" : "noun";
  const pushDef = (defs, p, d) => {
    d = (d || "").replace(/\s*:\s*$/, "").trim();
    if (!d || d.length > 220) return;
    let g = defs.find(x => x.pos === p);
    if (!g) {
      if (defs.length >= 4) return;
      g = { pos: p, d: [] };
      defs.push(g);
    }
    if (g.d.length < 3 && !g.d.includes(d)) g.d.push(d);
  };
  const pushEx = (ex, t, tr) => {
    t = (t || "").replace(/\s+/g, " ").trim();
    if (t && t.length <= 200 && ex.length < 8 && !ex.some(x => x.t === t)) ex.push(tr ? { t, tr } : { t });
  };

  async function cambridge(w) {
    const text = await getText("https://dictionary.cambridge.org/dictionary/english/" + encodeURIComponent(w.toLowerCase().replace(/\s+/g, "-")));
    if (!text) return null;
    const d = doc(text), defs = [], ex = [];
    d.querySelectorAll(".pr.entry-body__el, .pr.idiom-block").forEach(en => {
      const p = pos(line(en.querySelector(".pos-header .pos, .dpos")));
      en.querySelectorAll(".def-block").forEach(b => {
        pushDef(defs, p, line(b.querySelector(".def")));
        b.querySelectorAll(".examp .eg").forEach(e => pushEx(ex, line(e)));
      });
    });
    d.querySelectorAll(".degs .deg").forEach(e => pushEx(ex, line(e)));
    const src = sel => {
      const a = d.querySelector(sel + ' source[type="audio/mpeg"]');
      return a ? new URL(a.getAttribute("src"), "https://dictionary.cambridge.org/").href : "";
    };
    const ipa = sel => line(d.querySelector(sel + " .ipa"));
    const lv = d.querySelector(".epp-xref");
    return {
      src: "Cambridge",
      defs,
      ex,
      say: [ { k: "UK", ipa: ipa(".uk.dpron-i"), audio: src(".uk") }, { k: "US", ipa: ipa(".us.dpron-i"), audio: src(".us") } ].filter(x => x.ipa || x.audio),
      lv: lv ? lv.textContent.trim() : ""
    };
  }

  async function youdao(w) {
    const [text, gd] = await Promise.all([ getText("https://dict.youdao.com/result?lang=en&word=" + encodeURIComponent(w)), send({ type: "gdict", text: w }) ]);
    if (!text) return null;
    const d = doc(text), defs = [], ex = [], terms = new Map();
    let first = "";
    ((gd && gd.dict) || []).forEach(g => {
      const p = POS[g.pos] || g.pos;
      if (!first) first = p;
      g.terms.forEach(t => terms.has(t.toLowerCase()) || terms.set(t.toLowerCase(), p));
    });
    const posOf = def => {
      const key = def.toLowerCase();
      for (const [t, p] of terms) if (key === t || key.split(/[;,]\s*/).includes(t)) return p;
      return /^\s*to\s/i.test(def) ? "verb" : first || guessPos(def);
    };
    d.querySelectorAll(".basic .trans-ce").forEach(el => {
      const t = line(el);
      pushDef(defs, posOf(t), t);
    });
    d.querySelectorAll(".blng_sents_part li").forEach(li => pushEx(ex, line(li.querySelector(".sen-eng")), line(li.querySelector(".sen-ch"))));
    return { src: "Youdao", defs, ex, say: [] };
  }

  async function japanese(w) {
    const [jt, text] = await Promise.all([ getText("https://jisho.org/api/v1/search/words?keyword=" + encodeURIComponent(w)), getText("https://ejje.weblio.jp/sentence/content/" + encodeURIComponent(w)) ]);
    const defs = [], ex = [];
    let j = null;
    try {
      j = jt && JSON.parse(jt);
    } catch {}
    const hit = j && (j.data || []).find(x => (x.japanese || []).some(y => y.word === w || y.reading === w));
    if (hit) hit.senses.forEach(sn => pushDef(defs, pos((sn.parts_of_speech || [])[0] || ""), (sn.english_definitions || []).join("; ")));
    if (text) doc(text).querySelectorAll(".qotC").forEach(q => pushEx(ex, line(q.querySelector(".qotCJJ"), ".addToSlBtnCntner"), line(q.querySelector(".qotCJE"), "span, i, audio")));
    const reading = hit && (hit.japanese || []).map(y => y.reading).find(r => r && r !== w) || "";
    return hit || text ? { src: "Jisho · Weblio", defs, ex, say: [], reading } : null;
  }

  async function korean(w) {
    const base = "https://krdict.korean.go.kr/eng/dicMarinerSearch/search?nation=eng&nationCode=6&mainSearchWord=" + encodeURIComponent(w);
    const [tw, te] = await Promise.all([ getText(base), getText(base + "&searchType=E&blockCount=30") ]);
    if (!tw && !te) return null;
    const defs = [], ex = [];
    let audio = "";
    if (tw) doc(tw).querySelectorAll(".search_result dl").forEach(dl => {
      if (line(dl.querySelector("dt .word_type1_17"), "sup") !== w) return;
      const p = pos(line(dl.querySelector(".word_att_type1"), ".manyLang6"));
      dl.querySelectorAll("dd.manyLang6:not(.ml20)").forEach(dd => pushDef(defs, p, line(dd, "strong").replace(/^\.\s*/, "")));
      const snd = !audio && dl.querySelector("a.sound[href*='fnSoundPlay']");
      const m = snd && snd.getAttribute("href").match(/fnSoundPlay\('([^']+)'/);
      if (m) try {
        audio = atob(m[1]);
      } catch {}
    });
    if (te) doc(te).querySelectorAll(".search_result li a").forEach(a => pushEx(ex, line(a).replace(/\((Word|단어)\s*:[^)]*\)\s*$/, "").trim()));
    return { src: "krdict", defs, ex: ex.filter(x => x.t.includes(w)), say: /^https:\/\//.test(audio) ? [ { k: "", ipa: "", audio } ] : [] };
  }

  function loadStore() {
    if (store) return Promise.resolve(store);
    if (!storeJob) storeJob = new Promise(res => {
      try {
        chrome.storage.local.get("dictCache").then(d => res(store = d.dictCache || {}), () => res(store = {}));
      } catch {
        res(store = {});
      }
    });
    return storeJob;
  }

  function saveStore() {
    const keys = Object.keys(store);
    if (keys.length > MAX) keys.sort((a, b) => (store[a].at || 0) - (store[b].at || 0)).slice(0, keys.length - MAX).forEach(k => delete store[k]);
    try {
      chrome.storage.local.set({ dictCache: store });
    } catch {}
  }

  function lookup(lang, w) {
    w = (w || "").replace(/\s+/g, " ").trim();
    lang = lang || langOf(w);
    const key = lang + "|" + w.toLowerCase();
    if (mem.has(key)) return Promise.resolve(mem.get(key));
    if (!w || isLong(w) || miss.has(key) || ![ "en", "zh", "ja", "ko" ].includes(lang)) return Promise.resolve(null);
    if (pending.has(key)) return pending.get(key);
    const run = () => (lang === "en" ? cambridge(w) : lang === "zh" ? youdao(w) : lang === "ja" ? japanese(w) : korean(w)).catch(() => null);
    const job = loadStore().then(st => {
      if (st[key]) return st[key];
      const next = queue.then(run, run);
      queue = next.catch(() => null);
      return next.then(r => {
        if (!r || !(r.defs.length || r.ex.length || r.say.length)) return null;
        r.at = Date.now();
        st[key] = r;
        saveStore();
        return r;
      });
    }).then(r => {
      if (r) mem.set(key, r); else miss.add(key);
      return r;
    }).finally(() => pending.delete(key));
    pending.set(key, job);
    return job;
  }

  const levels = new Map();
  function level(lang, w) {
    const key = lang + "|" + w;
    if (!levels.has(key)) levels.set(key, send({ type: "level", lang, w }));
    return levels.get(key);
  }

  window.wkpDict = { lookup, level, langOf, isLong, guessPos };
})();
