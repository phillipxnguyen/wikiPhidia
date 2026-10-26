# wikiPhidia Reader

A browser extension for reading on the web (news, articles, any page) that picks up new words and sends them straight into wikiPhidia's Vocabulary, with their meaning, the sentence they came from and the page's title, and that turns any YouTube video into a lesson with one click.

## Install (Chrome, Edge, Brave, Arc)

1. Download this repository (Code → Download ZIP) and unzip it, or pull it.
2. Open `chrome://extensions` (`edge://extensions` in Edge) and turn on **Developer mode**.
3. Click **Load unpacked** and pick the `extension` folder.
4. Pin the green 字 icon to the toolbar.
5. Open wikiPhidia once (https://phillipxnguyen.github.io/wikiPhidia/) so the extension connects and learns your lessons and words.

## Updating

The extension checks GitHub for a newer version every time you open its popup (and when the browser starts). When there is one, the icon shows a blue **↑** and the popup a banner: **Download** gets the new files, unzip them over your `extension` folder, then press **Reload** right there (no need to open `chrome://extensions`). **Settings** shows the version you have and has a **Reload extension** button too.

A browser only updates an extension fully by itself when it comes from the Chrome Web Store; loaded unpacked, as here, the files have to be replaced by hand.

## Reading

- **Select a word or phrase** on any page, then press **Shift** (the same key that adds a word inside wikiPhidia) or click the round green **字** button that appears next to the selection. Right-click → **Add “…” to wikiPhidia** works too.
- A card opens next to the word:
  - the word (you can edit it), its **pinyin** for Chinese, and 🔊 to hear it;
  - **Meaning**, translated already into your language (Vietnamese by default), with other meanings as chips to pick from; type over it freely;
  - **Sentence**, the sentence around the word taken from the page, with the word marked in it; click it to change it, and **Translate the sentence** if you need it;
  - the **lesson** the word goes into: by default a lesson named after the article you are reading (made for you in Vocabulary the first time, then reused for every word from that article), or any of your lessons, or **New lesson…**. In Settings, **Words go into** can instead send every word to one lesson of your choice.
  - **Enter** or **Add** saves the word, and a short note says `word: meaning`; anything else (Esc, ✕, a click outside the card) closes it without saving.
- A word you already have says so on the card (which lesson, what it means) instead of adding it twice.

## Words you already have

Every page marks the words that are already in wikiPhidia, the way the app does: green for words in the app, grey for words waiting to be sent. Point at one to see its pinyin, meaning and, under them, the lesson it is in. Turn this off in Settings if you prefer a clean page.

## Getting the words into wikiPhidia

Words wait in the extension (the number on the icon) until wikiPhidia is open in a tab; then they go in by themselves, at once if the app is already open. **Open app** in the popup opens it or brings its tab forward. Each word becomes a Vocabulary card in its lesson: the word on the front; on the back the sentence it came from with the word marked in it (as on every other card), the meaning, and the article's title when the lesson has another name. Words already in the app are skipped.

## Lessons from YouTube

On any YouTube video, click the green **字 Make a lesson** button in the bottom-left corner (or **Make a lesson from this video** at the top of the popup, or right-click → **Make a wikiPhidia lesson from this video**). The extension reads the video's subtitles, opens wikiPhidia (or brings its tab forward), and the app shows its usual box: pick the subtitles, then **Subtitles only** or **With translation**. This replaces the *YouTube subtitles* bookmark; the bookmark still works where the extension is not installed. The button can be turned off in Settings.

## The popup

- **To send**: the words waiting, with their meaning editable and ✕ to drop one.
- **Recent**: the last words sent, marked *Added* or *Already there*.
- **Settings**: the language of the meanings, the lesson new words go into, marking known words on pages, the 字 button, Shift, the YouTube button, and the app's address (change it if you run wikiPhidia somewhere else; local copies on `localhost`, `127.0.0.1` or a file whose path contains `wikiPhidia` connect too).

## Privacy

Words, settings and the list of your vocabulary stay in the browser's extension storage. The only things sent anywhere are the word or sentence being translated, to Google Translate (with MyMemory as a fallback).

Pinyin comes from [pinyin-pro](https://github.com/zh-lx/pinyin-pro) (MIT), bundled in `vendor/`.
