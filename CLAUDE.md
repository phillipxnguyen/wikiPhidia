# wikiPhidia

The whole app is `index.html`; `README.md` documents what users see. The user runs it from GitHub Pages, built from `main`.

## Rules

- **Push to `main` only.** Commit and push every finished change straight to `main` (GitHub Pages builds from it); never push to other branches.
- **Lessons and Vocabulary stay in step.** Anything added or changed on one side (import options, column delimiters, shortcuts, buttons, editing, study behaviour) is made on the other side in the same change. If something cannot work the same way on the other side, ask the user how it should behave there; do not quietly leave it out.
- Keep `README.md` in step with every user-visible change.
- After any change under `extension/`, bump its version in `extension/manifest.json` and rebuild `Extension.zip` (`python3 extension/make-zip.py`), the download that unzips to a folder named `Extension`.
- **Fix reported bugs everywhere.** When the user points out a bug or an odd behaviour, fix its cause, then check the same behaviour and similar situations across every mode, Lessons and Vocabulary, computer and phone, and fix those too in the same change; say what else was checked or fixed.
- **Pixels: whole numbers, never decimals; otherwise free.** Every size, spacing, radius, font size and line height is a whole number of pixels (no .5px), whatever looks right and lines things up; there is no other rule on which numbers to use. Keep matching parts (outlines, rings, radii of the same kind) on the same value, pick values so that anything halved or added up stays whole, and round sizes and positions computed in code. Exceptions: media-query breakpoints, sums written out in `calc()`, and sizes taken from outside the app (the YouTube player).
