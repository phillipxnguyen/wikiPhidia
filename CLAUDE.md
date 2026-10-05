# wikiPhidia

The whole app is `index.html`; `README.md` documents what users see. The user runs it from GitHub Pages, built from `main`.

## Rules

- **Push to `main` only.** Commit and push every finished change straight to `main` (GitHub Pages builds from it); never push to other branches.
- **Lessons and Vocabulary stay in step.** Anything added or changed on one side (import options, column delimiters, shortcuts, buttons, editing, study behaviour) is made on the other side in the same change. If something cannot work the same way on the other side, ask the user how it should behave there; do not quietly leave it out.
- Keep `README.md` in step with every user-visible change.
- **Pixels: 0 or 5 first, then even, never decimals.** Apply this everywhere without asking, and keep matching parts (outlines, rings, radii of the same kind) on the same value. Every size, spacing, radius and font size is a whole number of pixels. Prefer a number ending in 0 or 5; when that would be more than 1px off the size wanted, use an even number instead (no other odd numbers). Pick values so that anything halved or added up to line things up stays whole (no .5px), and round sizes and positions computed in code. Exceptions: 1px hairlines (borders, rule lines, outlines, 1px nudges), media-query breakpoints, sums written out in `calc()` (such as `45px + 6px`), and sizes taken from outside the app (the YouTube player).
