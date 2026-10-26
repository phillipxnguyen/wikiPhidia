(() => {
  if (!document.dispatchEvent(new CustomEvent("wkp-bridge", { cancelable: true }))) return;
  const alive = () => {
    try {
      return !!chrome.runtime.id;
    } catch {
      return false;
    }
  };
  document.addEventListener("wkp-bridge", e => {
    if (alive()) e.preventDefault();
  });
  let ready = false;
  let sending = null;
  let ytSent = "";

  const post = msg => window.postMessage(Object.assign({ from: "wikiphidia-reader" }, msg), "*");

  async function send() {
    if (!ready || sending) return;
    const { pending, settings } = await chrome.storage.local.get([ "pending", "settings" ]);
    const list = (pending || []).slice(0, 200);
    if (!list.length) return;
    const fallback = settings && settings.lessonName || "Reading";
    sending = new Set(list.map(w => w.id));
    post({
      type: "add",
      words: list.map(w => ({
        id: w.id,
        term: w.term,
        meaning: w.meaning,
        sentence: w.sentence,
        title: w.title,
        url: w.url,
        lessonId: w.lessonId || "",
        lessonName: w.lessonName || fallback
      }))
    });
    setTimeout(() => {
      sending = null;
    }, 8e3);
  }

  async function sendYouTube() {
    if (!ready) return;
    const { ytPending } = await chrome.storage.local.get("ytPending");
    if (!ytPending || Date.now() - (ytPending.at || 0) > 36e5 || ytSent === ytPending.id + ":" + ytPending.at) return;
    ytSent = ytPending.id + ":" + ytPending.at;
    post({ type: "youtube", data: ytPending });
  }

  async function settle(result) {
    const done = new Map;
    (result.added || []).forEach(id => done.set(id, { status: "added" }));
    (result.skipped || []).forEach(s => done.set(s.id, { status: s.reason === "exists" ? "exists" : "skipped", lesson: s.lesson || "" }));
    const { pending, history } = await chrome.storage.local.get([ "pending", "history" ]);
    const left = [], sent = [];
    (pending || []).forEach(w => {
      if (done.has(w.id)) sent.push(Object.assign({}, w, done.get(w.id), { sentAt: Date.now() })); else left.push(w);
    });
    await chrome.storage.local.set({
      pending: left,
      history: sent.concat(history || []).slice(0, 100)
    });
    sending = null;
    if (left.length) send();
  }

  window.addEventListener("message", e => {
    if (e.source !== window || !alive() || !e.data || e.data.from !== "wikiphidia-app") return;
    if (e.data.type === "ready") post({ type: "hello" });
    if (e.data.type === "state") {
      ready = true;
      chrome.storage.local.set({
        app: {
          lessons: e.data.lessons || [],
          words: e.data.words || [],
          at: e.data.at || Date.now()
        }
      }).then(() => {
        send();
        sendYouTube();
      });
    }
    if (e.data.type === "added") settle(e.data);
    if (e.data.type === "ytTaken") chrome.storage.local.get("ytPending").then(({ ytPending }) => {
      if (ytPending && ytPending.id === e.data.id) chrome.storage.local.remove("ytPending");
    });
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.pending) send();
    if (area === "local" && changes.ytPending && changes.ytPending.newValue) sendYouTube();
  });

  chrome.runtime.onMessage.addListener(msg => {
    if (msg && msg.type === "flush") post({ type: "hello" });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") post({ type: "hello" });
  });

  post({ type: "hello" });
})();
