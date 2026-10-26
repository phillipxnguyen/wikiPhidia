# wikiPhidia Reader

A browser extension for reading on the web (news, articles, any page) that picks up new words and sends them straight into wikiPhidia's Vocabulary, with their meaning, the sentence they came from and the page's title.

## Install (Chrome, Edge, Brave, Arc)

1. Download this repository (Code → Download ZIP) and unzip it, or pull it.
2. Open `chrome://extensions` (`edge://extensions` in Edge) and turn on **Developer mode**.
3. Click **Load unpacked** and pick the `extension` folder.
4. Pin the green 字 icon to the toolbar.
5. Open wikiPhidia once (https://phillipxnguyen.github.io/wikiPhidia/) so the extension connects and learns your lessons and words.

After pulling a newer version, click the ↻ on the extension's card in `chrome://extensions`.

## Reading

- **Select a word or phrase** on any page, then press **Shift** (the same key that adds a word inside wikiPhidia) or click the round green **字** button that appears next to the selection. Right-click → **Add “…” to wikiPhidia** works too.
- A card opens next to the word:
  - the word (you can edit it), its **pinyin** for Chinese, and 🔊 to hear it;
  - **Meaning**, translated already into your language (Vietnamese by default), with other meanings as chips to pick from; type over it freely;
  - **Sentence**, the sentence around the word taken from the page, ready to edit, with **Translate the sentence** if you need it;
  - the **lesson** the word goes into: *Reading* by default (made for you in Vocabulary the first time), any of your lessons, or **New lesson…**.
  - **Enter** adds the word, **Esc** closes.
- A word you already have says so on the card (which lesson, what it means) instead of adding it twice.

## Words you already have

Every page marks the words that are already in wikiPhidia, the way the app does: green for words in the app, grey for words waiting to be sent. Point at one to see its pinyin, meaning and lesson. Turn this off in Settings if you prefer a clean page.

## Getting the words into wikiPhidia

Words wait in the extension (the number on the icon) until wikiPhidia is open in a tab; then they go in by themselves, at once if the app is already open. **Open app** in the popup opens it or brings its tab forward. Each word becomes a Vocabulary card in its lesson: the word on the front, the meaning on the back, and the sentence and the page's title as the card's notes. Words already in the app are skipped.

## The popup

- **To send**: the words waiting, with their meaning editable and ✕ to drop one.
- **Recent**: the last words sent, marked *Added* or *Already there*.
- **Settings**: the language of the meanings, the lesson new words go into, marking known words on pages, the 字 button, Shift, and the app's address (change it if you run wikiPhidia somewhere else; local copies on `localhost`, `127.0.0.1` or a file whose path contains `wikiPhidia` connect too).

## Privacy

Words, settings and the list of your vocabulary stay in the browser's extension storage. The only things sent anywhere are the word or sentence being translated, to Google Translate (with MyMemory as a fallback).

Pinyin comes from [pinyin-pro](https://github.com/zh-lx/pinyin-pro) (MIT), bundled in `vendor/`.
