(() => {
  if (window.top !== window || window.wkpDict) return;
  const CJK = /[㐀-鿿豈-﫿]/, KANA = /[぀-ヿ]/, HANGUL = /[가-힯]/;
  const POS = { noun: "noun", verb: "verb", adjective: "adj", adverb: "adv", pronoun: "pron", preposition: "prep", conjunction: "conj", interjection: "interj", abbreviation: "abbr", particle: "part", phrase: "phrase", prefix: "prefix", suffix: "suffix", "phrasal verb": "phrasal verb", idiom: "idiom", determiner: "det", exclamation: "excl", numeral: "num", "proper noun": "noun", n: "noun", v: "verb", adj: "adj", adv: "adv", "명사": "noun", "동사": "verb", "형용사": "adj", "부사": "adv" };
  const MAX = 600, KEY = "dictCache5";
  const mem = new Map(), pending = new Map();
  let store = null, storeJob = null;

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
  const getJson = async url => {
    const t = await getText(url);
    try {
      return t ? JSON.parse(t) : null;
    } catch {
      return null;
    }
  };
  const doc = text => new DOMParser().parseFromString(text, "text/html");
  const line = (el, drop) => {
    if (!el) return "";
    const c = el.cloneNode(true);
    c.querySelectorAll("style, script").forEach(n => n.remove());
    if (drop) c.querySelectorAll(drop).forEach(n => n.remove());
    return c.textContent.replace(/\s+/g, " ").trim();
  };
  const plain = html => line(doc("<div>" + (html || "") + "</div>").body);
  const pos = p => {
    p = (p || "").toLowerCase().replace(/[「」.]/g, "").trim();
    return POS[p] || p;
  };
  const guessPos = d => /^\s*to\s/i.test(d || "") ? "verb" : /^\s*(\(of|of|having|being|very|too|quite)\b/i.test(d || "") ? "adj" : "noun";
  const head = h => (h || "").replace(/^[\s(]+|[\s)]+$/g, "").trim();
  const pushDef = (defs, p, d, h) => {
    d = (d || "").replace(/^[:\s]+/, "").replace(/\s*:\s*$/, "").trim();
    if (!d || d.length > 260) return;
    let g = defs.find(x => x.pos === p);
    if (!g) {
      if (defs.length >= 6) return;
      g = { pos: p, d: [] };
      defs.push(g);
    }
    const had = g.d.find(x => x.t === d);
    if (had || g.d.length >= 5) return had || null;
    const it = h ? { t: d, h: head(h) } : { t: d };
    g.d.push(it);
    return it;
  };
  const tie = (it, t, tr) => {
    t = (t || "").replace(/\s+/g, " ").trim();
    if (!it || !t || t.length > 220) return;
    const x = tr ? { t, tr } : { t };
    if (!it.x) it.x = x;
    it.xs = it.xs || [];
    if (it.xs.length < 5 && !it.xs.some(y => y.t === t)) it.xs.push(x);
  };
  const pushEx = (ex, t, tr) => {
    t = (t || "").replace(/\s+/g, " ").trim();
    if (t && t.length <= 220 && ex.length < 10 && !ex.some(x => x.t === t)) ex.push(tr ? { t, tr } : { t });
  };
  const abs = (u, base) => {
    try {
      return u ? new URL(u, base).href : "";
    } catch {
      return "";
    }
  };
  const slug = w => encodeURIComponent(w.toLowerCase().replace(/\s+/g, "-"));

  async function cambridge(w) {
    const text = await getText("https://dictionary.cambridge.org/dictionary/english/" + slug(w));
    if (!text) return null;
    const d = doc(text), defs = [], ex = [];
    d.querySelectorAll(".pr.entry-body__el, .pr.idiom-block").forEach(en => {
      const p = pos(line(en.querySelector(".pos-header .pos, .dpos")));
      en.querySelectorAll(".def-block").forEach(b => {
        const sense = b.closest(".dsense");
        const it = pushDef(defs, p, line(b.querySelector(".def")), sense && line(sense.querySelector(".dsense_gw")));
        b.querySelectorAll(".examp .eg").forEach(e => (pushEx(ex, line(e)), tie(it, line(e))));
      });
    });
    d.querySelectorAll(".degs .deg").forEach(e => pushEx(ex, line(e)));
    const src = sel => {
      const a = d.querySelector(sel + ' source[type="audio/mpeg"]');
      return a ? abs(a.getAttribute("src"), "https://dictionary.cambridge.org/") : "";
    };
    const lv = d.querySelector(".epp-xref");
    return {
      defs, ex,
      say: [ { k: "UK", ipa: line(d.querySelector(".uk.dpron-i .ipa")), audio: src(".uk") }, { k: "US", ipa: line(d.querySelector(".us.dpron-i .ipa")), audio: src(".us") } ].filter(x => x.ipa || x.audio),
      lv: lv ? lv.textContent.trim() : ""
    };
  }

  async function oxford(w) {
    const text = await getText("https://www.oxfordlearnersdictionaries.com/definition/english/" + slug(w));
    if (!text) return null;
    const d = doc(text), defs = [], ex = [];
    const entry = d.querySelector(".entry");
    if (!entry) return null;
    const p = pos(line(entry.querySelector(".webtop .pos")));
    entry.querySelectorAll("li.sense").forEach(s => {
      const g = s.closest(".shcut-g");
      const it = pushDef(defs, p, line(s.querySelector(".def")), g && line(g.querySelector(".shcut")) || line(s.querySelector(".cf")));
      s.querySelectorAll(".examples .x").forEach(e => (pushEx(ex, line(e)), tie(it, line(e))));
    });
    const phon = sel => line(entry.querySelector(sel + " .phon")).replace(/^\/|\/$/g, "");
    const snd = sel => abs((entry.querySelector(sel + " .sound") || { getAttribute: () => "" }).getAttribute("data-src-mp3"), "https://www.oxfordlearnersdictionaries.com/");
    const sym = entry.querySelector('.symbols [class*="sym_"]');
    const lvm = sym && sym.className.match(/sym_([abc][12])/i);
    return {
      defs, ex,
      say: [ { k: "UK", ipa: phon(".phons_br"), audio: snd(".phons_br") }, { k: "US", ipa: phon(".phons_n_am"), audio: snd(".phons_n_am") } ].filter(x => x.ipa || x.audio),
      lv: lvm ? lvm[1].toUpperCase() : ""
    };
  }

  async function longman(w) {
    const text = await getText("https://www.ldoceonline.com/dictionary/" + slug(w));
    if (!text) return null;
    const d = doc(text), defs = [], ex = [];
    const entries = [ ...d.querySelectorAll(".ldoceEntry") ];
    if (!entries.length) return null;
    entries.forEach(en => {
      const p = pos(line(en.querySelector(".Head .POS")));
      en.querySelectorAll(".Sense").forEach(s => {
        const it = pushDef(defs, p, line(s.querySelector(".DEF")), line(s.querySelector(".SIGNPOST")));
        s.querySelectorAll(".EXAMPLE").forEach(e => (pushEx(ex, line(e)), tie(it, line(e))));
      });
    });
    const first = entries[0], a = sel => (first.querySelector(".Head " + sel) || { getAttribute: () => "" }).getAttribute("data-src-mp3") || "";
    const ipa = line(first.querySelector(".Head .PRON"));
    return { defs, ex, say: [ { k: "UK", ipa, audio: a(".brefile") }, { k: "US", ipa: "", audio: a(".amefile") } ].filter(x => x.ipa || x.audio) };
  }

  async function collins(w) {
    const text = await getText("https://www.collinsdictionary.com/dictionary/english/" + slug(w));
    if (!text) return null;
    const d = doc(text), defs = [], ex = [];
    d.querySelectorAll(".dictionary.Cob_Adv_Brit .hom, .dictionary .hom").forEach(h => {
      const p = pos(line(h.querySelector(".gramGrp .pos, .pos")));
      h.querySelectorAll(".sense").forEach(s => {
        const it = pushDef(defs, p, line(s.querySelector(".def")), line(s.querySelector(".lbl.type-subj, .lbl.type-syntax")));
        s.querySelectorAll(".cit.type-example .quote").forEach(e => (pushEx(ex, line(e)), tie(it, line(e))));
      });
    });
    return defs.length ? { defs, ex, say: [] } : null;
  }

  async function webster(w) {
    const text = await getText("https://www.merriam-webster.com/dictionary/" + encodeURIComponent(w.toLowerCase()));
    if (!text) return null;
    const d = doc(text), defs = [], ex = [];
    d.querySelectorAll('[id^="dictionary-entry"]').forEach(en => {
      const p = pos(line(en.querySelector(".parts-of-speech, .fl")));
      en.querySelectorAll(".sense").forEach(s => {
        const it = pushDef(defs, p, line(s.querySelector(".dtText"), ".ex-sent, .wi"), line(s.querySelector(".sl, .sgram")));
        s.querySelectorAll(".ex-sent").forEach(e => (pushEx(ex, line(e)), tie(it, line(e))));
      });
    });
    const pr = d.querySelector(".prons-entries-list-inline a[data-file]");
    let audio = "";
    if (pr) {
      const f = pr.getAttribute("data-file"), dir = pr.getAttribute("data-dir") || (/^bix/.test(f) ? "bix" : /^gg/.test(f) ? "gg" : /^[0-9_]/.test(f) ? "number" : f[0]);
      audio = "https://media.merriam-webster.com/audio/prons/en/us/mp3/" + dir + "/" + f + ".mp3";
    }
    const ipa = line(d.querySelector(".prons-entries-list-inline .pr, .prons-entries-list-inline a"));
    return defs.length ? { defs, ex, say: audio || ipa ? [ { k: "US", ipa: "", audio } ] : [] } : null;
  }

  async function vocabularyCom(w) {
    const text = await getText("https://www.vocabulary.com/dictionary/" + encodeURIComponent(w.toLowerCase()));
    if (!text) return null;
    const d = doc(text), defs = [], ex = [];
    const blurb = line(d.querySelector(".word-area .short"));
    d.querySelectorAll(".word-definitions li").forEach(li => {
      const def = li.querySelector(".definition");
      if (!def) return;
      const p = pos(line(def.querySelector(".pos-icon")));
      const it = pushDef(defs, p, line(def, ".pos-icon"));
      li.querySelectorAll(".example").forEach(e => (pushEx(ex, line(e).replace(/^["“]|["”]$/g, "")), tie(it, line(e).replace(/^["“]|["”]$/g, ""))));
    });
    return defs.length ? { defs, ex, say: [], note: blurb.slice(0, 400) } : null;
  }

  async function freeDict(w) {
    const j = await getJson("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(w.toLowerCase()));
    if (!Array.isArray(j)) return null;
    const defs = [], ex = [], say = [];
    j.forEach(en => {
      (en.phonetics || []).forEach(ph => {
        const k = /-uk\./.test(ph.audio || "") ? "UK" : /-us\./.test(ph.audio || "") ? "US" : "";
        if ((ph.text || ph.audio) && !say.some(x => x.k === k)) say.push({ k, ipa: (ph.text || "").replace(/^\/|\/$/g, ""), audio: ph.audio || "" });
      });
      (en.meanings || []).forEach(m => (m.definitions || []).forEach(x => {
        const it = pushDef(defs, pos(m.partOfSpeech), x.definition);
        if (x.example) pushEx(ex, x.example), tie(it, x.example);
      }));
    });
    return defs.length ? { defs, ex, say: say.filter(x => x.ipa || x.audio).slice(0, 2) } : null;
  }

  async function wiktionary(w, lang) {
    const j = await getJson("https://en.wiktionary.org/api/rest_v1/page/definition/" + encodeURIComponent(w));
    const list = j && j[lang];
    if (!Array.isArray(list)) return null;
    const defs = [], ex = [];
    list.forEach(en => (en.definitions || []).forEach(x => {
      const t = plain(x.definition);
      const m = t.match(/^\(([^)]{1,40})\)\s*(.+)$/);
      const it = pushDef(defs, pos(en.partOfSpeech), m ? m[2] : t, m ? m[1] : "");
      (x.parsedExamples || []).forEach(e => (pushEx(ex, plain(e.example), plain(e.translation)), tie(it, plain(e.example), plain(e.translation))));
      if (!x.parsedExamples) (x.examples || []).forEach(e => (pushEx(ex, plain(e)), tie(it, plain(e))));
    }));
    return defs.length ? { defs, ex, say: [] } : null;
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
      return /^\s*to\s/i.test(def) ? "verb" : first || "";
    };
    d.querySelectorAll(".basic .trans-ce").forEach(el => {
      const t = line(el);
      pushDef(defs, posOf(t), t);
    });
    d.querySelectorAll(".blng_sents_part li").forEach(li => pushEx(ex, line(li.querySelector(".sen-eng")), line(li.querySelector(".sen-ch"))));
    return defs.length || ex.length ? { defs, ex, say: [] } : null;
  }

  async function mdbg(w) {
    const text = await getText("https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=" + encodeURIComponent(w));
    if (!text) return null;
    const d = doc(text), defs = [];
    let reading = "";
    d.querySelectorAll("tr.row").forEach(tr => {
      const hz = line(tr.querySelector(".hanzi"));
      if (hz.replace(/\s+/g, "") !== w && !hz.split(/\s+/).includes(w)) return;
      if (!reading) reading = line(tr.querySelector(".pinyin"));
      line(tr.querySelector(".defs")).split(/\s*\/\s*/).forEach(t => pushDef(defs, "", t));
    });
    return defs.length ? { defs, ex: [], say: [], reading } : null;
  }

  async function japanese(w) {
    const [j, text] = await Promise.all([ getJson("https://jisho.org/api/v1/search/words?keyword=" + encodeURIComponent(w)), getText("https://ejje.weblio.jp/sentence/content/" + encodeURIComponent(w)) ]);
    const defs = [], ex = [];
    const hit = j && (j.data || []).find(x => (x.japanese || []).some(y => y.word === w || y.reading === w));
    if (hit) hit.senses.forEach(sn => pushDef(defs, pos((sn.parts_of_speech || [])[0] || ""), (sn.english_definitions || []).join("; "), (sn.tags || [])[0] || (sn.info || [])[0] || ""));
    if (text) doc(text).querySelectorAll(".qotC").forEach(q => pushEx(ex, line(q.querySelector(".qotCJJ"), ".addToSlBtnCntner"), line(q.querySelector(".qotCJE"), "span, i, audio")));
    const reading = hit && (hit.japanese || []).map(y => y.reading).find(r => r && r !== w) || "";
    const lv = hit && (hit.jlpt || [])[0] || "";
    return defs.length || ex.length ? { defs, ex, say: [], reading, lv: lv ? lv.replace(/^jlpt-n/i, "N") : "" } : null;
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
    const out = { defs, ex: ex.filter(x => x.t.includes(w)), say: /^https:\/\//.test(audio) ? [ { k: "", ipa: "", audio } ] : [] };
    return out.defs.length || out.ex.length ? out : null;
  }

  const SOURCES = {
    en: [ [ "Cambridge", cambridge ], [ "Oxford", oxford ], [ "Longman", longman ], [ "Collins", collins ], [ "Merriam-Webster", webster ], [ "Vocabulary.com", vocabularyCom ], [ "Free Dictionary", freeDict ], [ "Wiktionary", w => wiktionary(w, "en") ] ],
    zh: [ [ "Youdao", youdao ], [ "MDBG", mdbg ], [ "Wiktionary", w => wiktionary(w, "zh") ] ],
    ja: [ [ "Jisho · Weblio", japanese ], [ "Wiktionary", w => wiktionary(w, "ja") ] ],
    ko: [ [ "krdict", korean ], [ "Wiktionary", w => wiktionary(w, "ko") ] ]
  };

  function loadStore() {
    if (store) return Promise.resolve(store);
    if (!storeJob) storeJob = new Promise(res => {
      try {
        chrome.storage.local.get(KEY).then(d => res(store = d[KEY] || {}), () => res(store = {}));
        chrome.storage.local.remove([ "dictCache", "dictCache2", "dictCache3", "dictCache4" ]);
      } catch {
        res(store = {});
      }
    });
    return storeJob;
  }

  let saveTimer = 0;
  function saveStore() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const keys = Object.keys(store);
      if (keys.length > MAX) keys.sort((a, b) => (store[a].at || 0) - (store[b].at || 0)).slice(0, keys.length - MAX).forEach(k => delete store[k]);
      try {
        chrome.storage.local.set({ [KEY]: store });
      } catch {}
    }, 300);
  }

  function enBases(k) {
    const out = [];
    if (/[^aeiou]ie[sd]$/.test(k)) out.push(k.slice(0, -3) + "y");
    if (/ies$/.test(k)) out.push(k.slice(0, -3) + "y");
    if (/([^aeiou])\1(ed|ing)$/.test(k)) out.push(k.replace(/([^aeiou])\1(ed|ing)$/, "$1"));
    if (/ed$/.test(k)) out.push(k.slice(0, -2), k.slice(0, -1));
    if (/ing$/.test(k)) out.push(k.slice(0, -3), k.slice(0, -3) + "e");
    if (/es$/.test(k)) out.push(k.slice(0, -2));
    if (/s$/.test(k) && !/ss$/.test(k)) out.push(k.slice(0, -1));
    return [ ...new Set(out) ].filter(x => x.length > 1 && x !== k).slice(0, 3);
  }

  function lookup(lang, w, onEach, base) {
    w = (w || "").replace(/\s+/g, " ").trim();
    lang = lang || langOf(w);
    const list = SOURCES[lang];
    if (!w || isLong(w) || !list) return Promise.resolve([]);
    const key = lang + "|" + w.toLowerCase();
    if (mem.has(key)) {
      const have = mem.get(key);
      if (onEach) have.forEach(r => onEach(r, have));
      return Promise.resolve(have);
    }
    if (pending.has(key)) {
      const job = pending.get(key);
      if (onEach) job.listeners.push(onEach);
      return job;
    }
    const got = [], listeners = onEach ? [ onEach ] : [];
    const order = name => list.findIndex(x => x[0] === name);
    const add = r => {
      got.push(r);
      got.sort((a, b) => order(a.src) - order(b.src));
      listeners.forEach(f => f(r, got));
    };
    const job = loadStore().then(st => {
      const saved = st[key];
      if (saved && saved.list.length && Date.now() - (saved.at || 0) < (saved.full ? 30 : 1) * 864e5) {
        saved.list.forEach(add);
        return got;
      }
      return Promise.all(list.map(([ name, fn ]) => Promise.resolve().then(() => fn(w)).catch(() => null).then(r => {
        if (!r || !(r.defs.length || r.ex.length || r.say.length)) return;
        r.src = name;
        add(r);
      }))).then(() => {
        if (got.length) {
          st[key] = { at: Date.now(), full: got.length === list.length, list: got };
          saveStore();
        }
        return got;
      });
    }).then(async r => {
      if (!r.length && lang === "en" && !base) {
        for (const b of enBases(w.toLowerCase())) {
          const via = await lookup(lang, b, null, true);
          if (via.length) {
            via.forEach(x => add(x));
            return got;
          }
        }
      }
      return r;
    }).then(r => {
      if (r.length) mem.set(key, r);
      return r;
    }).finally(() => pending.delete(key));
    job.listeners = listeners;
    pending.set(key, job);
    return job;
  }

  const levels = new Map();
  function level(lang, w) {
    const key = lang + "|" + w;
    if (!levels.has(key)) levels.set(key, send({ type: "level", lang, w }));
    return levels.get(key);
  }

  window.wkpDict = { lookup, level, langOf, isLong, guessPos, sources: lang => (SOURCES[lang] || []).map(x => x[0]) };
})();
