# wikiPhidia

Flashcards for learning Chinese and Japanese, with spaced repetition, video clips, dictionaries and a vocabulary trainer. The whole app is one file, `index.html`: no build step, no server code.

## Run it

Open `index.html` in a browser, or host it on any static site. On a phone, add it to the home screen to use it like an app.

## Lessons and cards

- **New lesson**, then paste cards as `question : answer` (or tab-separated), one per line. A preview shows what will be imported.
- Put a YouTube link at the top and timestamps on the lines to tie each card to a clip of the video.
- Each card has a question, an answer and notes. Lines in the notes written as `word: meaning` become vocabulary words.
- **📥 Import file** opens lesson `.json` files or a full backup; **💾 Back up** saves every lesson and your review history.

## Study modes

| Mode | What it does |
| --- | --- |
| ☰ All cards | Every card in a list, for browsing and editing |
| Group | Due cards five at a time |
| Listen | One card at a time, playing its video clip (lessons with a video) |
| Write | Answer first, recall and write the character, then reveal |

Group, Listen and Write share one queue: a card studied in one mode leaves the others until it is due again.

## Scheduling

- **Good** adds one to a card's streak; it comes back in 1 day.
- **Again** resets the streak; it comes back in 10 minutes.
- After 5 Good in a row a card is **Done**, and comes back after 1, then 3, then every 7 days.

Only due cards are studied. When nothing is due, the session ends with a congratulation, with no button to study more: done is done.

## Vocabulary

Switch with the **字** button at the top. Words from your card notes are studied as their own cards with the same scheduling, per lesson or all together.

## Language help

- Pinyin on hover for Chinese
- Stroke-order animations in Write mode
- Dictionary panel under each card: chinesedictionary.mobi for Chinese, Bing Translator for Japanese
- Read aloud with the browser's voices
- Words already in your vocabulary are marked in questions and sentences; click one to look it up

## Keyboard

| Key | Action |
| --- | --- |
| Space | Show the hidden side |
| Enter | Good |
| Shift + Enter | Again |
| ⌘/Ctrl + Z | Undo (add Shift to redo) |
| ← / → | Again / Good in Vocabulary |
| Delete | Delete the card |
| Esc | Close a popup |

On a phone, swipe the card right for Good and left for Again.

## Saving and sync

Everything is saved in the browser (IndexedDB). Sign in with email or Google to sync lessons and review history across devices through Firebase. Stats show your daily streak, a review heatmap and your hardest cards; **🎯 Practise all** studies the due hard cards from every lesson together.
