// Runs before the page's own scripts, so these listeners come first: a key typed in the wikiPhidia card (the word, the
// meaning, the sentence) is stopped here and handed to the card, so the page never sees it. Sites such as ChatGPT
// otherwise catch every key on the page and move it into their own box.
(() => {
  if (window.top !== window) return;
  const own = e => {
    const g = globalThis.wkpGuard;
    return g && e.composedPath().includes(g.host) ? g : null;
  };
  [ "keydown", "keyup", "keypress", "beforeinput", "paste", "cut", "copy" ].forEach(type => addEventListener(type, e => {
    const g = own(e);
    if (!g) return;
    e.stopImmediatePropagation();
    if (g[type]) g[type](e);
  }, true));
})();
