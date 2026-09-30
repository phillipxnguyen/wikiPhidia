# wikiPhidia

Flashcards for learning Chinese and Japanese, with spaced repetition, YouTube clips, dictionaries and a vocabulary deck built from your notes.

The whole app is one file, `index.html`. There is no build step and nothing to install: open it in a browser, or host it anywhere that serves static files. On a phone it can be added to the home screen and runs full screen.

## Lessons and cards

- Paste cards into a lesson, one per line, as `question : answer` or tab-separated. The separator is detected and a preview shows what will be imported.
- Start a line with a timestamp (`1:23 question : answer`) and set the lesson's YouTube link to tie each card to a moment in the video.
- Each card has rich-text notes. Lines written as `word: meaning` become words in the vocabulary deck.
- Lessons can be saved as `.json` files and opened again, one at a time or all at once.

## Studying

| Mode | What it does |
| --- | --- |
| ☰ Full | The whole lesson as a list, for browsing and editing. No spaced repetition. |
| Group | Due cards five at a time. |
| Listening | One card at a time, playing its video clip first. Shown when the lesson has video cards. |

Group and Listening share one queue: a card studied in one mode leaves the others until it is due again.

**Sound.** The ▶ button (or ↑) plays the cards' video clips, at the speed beside it. Cards without a clip are read aloud in their turn, so clips and reading alternate; in a lesson without a video the button becomes 🔊 and reads the questions aloud. Showing a group, or flipping a word to its Question side in Vocabulary, plays it automatically; revealing an Answer never does.

**Scheduling.** *Again* brings a card back in 10 minutes. Each *Good* counts towards a streak; until the fifth Good in a row the card returns the next day. After five it is **done**, and the gaps grow to 1, 3 and then 7 days.

**Done is done.** When nothing is left to study, the study modes are hidden and the lesson goes back to ☰ Full: 🎉 with the New, Due and Done counts sits above the list, with confetti. There is no button to study ahead; the modes come back when cards are due again. (**Reset** makes a whole lesson New again, if you want to start it over.)

### Keyboard

| Key | Action |
| --- | --- |
| ← or Shift + Return | Again |
| → or Return | Good |
| ↑ | Play or pause the sound |
| ↓ | In a group, copy the questions; one card at a time (Flashcards, Listening), edit the card |
| 1 – 5 | In a group, play just that row over and over: its video clip, or read aloud when it has none (press again to stop) |
| Space | Reveal / flip |
| ⌘/Ctrl + Z | Undo, including grades (add Shift to redo) |
| Delete | Delete the card |
| Esc | Close a popup |

The same keys work in every study mode, in Lessons and in Vocabulary. In a Lesson group, pointing at a row, or at the dictionary panel under the table that belongs to it, makes the grading keys grade just that card.

On a phone, swipe a card right for Good and left for Again. In a Lesson group, swiping one row or its dictionary panel grades just that card; swiping anywhere else grades the whole group.

## Vocabulary

Switch from **Lessons** to **Vocabulary** with the 字 button at the top. Words come from the `word: meaning` lines in your notes, or can be pasted in directly. They have their own review sessions and scheduling, one lesson at a time or all words together.

| Mode | What it does |
| --- | --- |
| ☰ Flashcards | One word at a time; tap the card to flip it. The whole word list, for browsing and editing, sits below, folded away so it does not give answers away: click **Words (n)** to open or close it (it folds again as soon as you flip, show or grade), and the ＋ bar it sits on adds a word; and point at a word (or tap it on a phone) to see its pinyin or reading |
| 📝 Group | Due words five at a time, like Group mode in Lessons: click a word to edit it, tap a row (phone) or point at it (computer) to grade just that word, ▶ plays the group's words in turn, the ▶ or 🔊 before each word plays just that word, and while the Question side is showing, the stroke order of the group's words sits under the table |

Group and Flashcards share one queue, and a word marked Again comes back after 10 minutes. The 🌐 button picks the language; ⇄ picks which side is shown first and hides the other side again (the card gives a short squash, and the side it starts on is labelled and coloured Question or Answer). On a phone, Undo, Redo, Show, Again and Good sit in a bar fixed to the bottom of the screen, as in Lessons; on a computer the keys do the same.

As in Lessons, pointing at a word (or tapping its row on a phone) shows its pinyin or reading. Editing a flashcard (↓ or ✎) shows the word's stroke order and its dictionary together, in one panel under the editor.

When every word is studied, ☰, 📝 and ⇄ are hidden: only 🌐, the counts, 🎉 and the word list remain until words are due again.

Words already in your vocabulary are highlighted in questions and in the sentence above each dictionary; click one to see its notes.

## Language help

- Pinyin on hover for Chinese
- Stroke-order animations: every dictionary panel in Group and Listening shows how to write the card's characters, animated when the card is shown. The panels are laid out before Show and only become visible when it is pressed, so revealing a card never moves the page
- A dictionary panel under each card, in every language: chinesedictionary.mobi for Chinese; Bing Translator into English for Japanese, Korean and Vietnamese, and into Vietnamese for English. Chinese and Japanese sentences above it show pinyin or readings
- Reading aloud with the browser's own voices
- Study languages: Chinese (Simplified and Traditional), Japanese, Korean, English, Vietnamese

## Progress and sync

- **Stats** shows your daily streak, a review heatmap, progress per lesson, and your hardest cards. **🎯 Practise all** studies the hard cards from every lesson together (only the ones that are due).
- Everything is stored in the browser; no account is needed.
- Sign in with Google or email to sync lessons and reviews across devices through Firebase.
- Light and dark themes.

## Libraries

Loaded from CDNs at runtime: [pinyin-pro](https://github.com/zh-lx/pinyin-pro), [Hanzi Writer](https://hanziwriter.org), the YouTube IFrame API, and the Firebase SDK (only when you sign in).
