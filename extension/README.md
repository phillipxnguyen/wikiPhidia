# wikiPhidia (browser extension)

A browser extension for reading on the web (news, articles, any page) that picks up new words and sends them straight into wikiPhidia's Vocabulary, with their meaning, the sentence they came from and the page's title, and that turns any YouTube video into a lesson with one click.

## Install (Chrome, Edge, Brave, Arc)

1. Download this repository (Code → Download ZIP) and unzip it, or pull it.
2. Open `chrome://extensions` (`edge://extensions` in Edge) and turn on **Developer mode**.
3. Click **Load unpacked** and pick the `extension` folder.
4. Pin the green 字 icon to the toolbar.
5. Open wikiPhidia once (https://phillipxnguyen.github.io/wikiPhidia/) so the extension connects and learns your lessons and words.

## Updating

The extension checks GitHub for a newer version every time you open its popup (and when the browser starts). When there is one, the icon shows a blue **↑** and the popup a banner: **Download** gets the new files, unzip them over your `extension` folder, then press **Reload** right there (no need to open `chrome://extensions`). **Settings** shows the version you have and has a **Reload extension** button too.

After an update or a reload, pages that are already open pick up the new version by themselves (no need to reload them): saving words and marking them keep working at once.

A browser only updates an extension fully by itself when it comes from the Chrome Web Store; loaded unpacked, as here, the files have to be replaced by hand.

## Reading

- **Select a word or phrase** on any page. In the popup's header, beside the name, you choose what happens then with two small icons side by side: **字** (the default: a round green 字 appears next to the selection; click it, or press **Shift**, the same key that adds a word inside wikiPhidia) or **⚡** (the card opens as soon as you let go of the mouse, nothing else to click). Right-click → **Add “…” to wikiPhidia** works too.
- A card opens next to the word:
  - the word (you can edit it), its **pinyin** for Chinese, and beside it 🔊 to hear it, the translate button to translate the sentence (again to hide it; **Shift** while the card is open does the same), and ✕;
  - the meaning, translated already into your language (Vietnamese by default), with other meanings as chips to pick from; type over it freely;
  - the sentence around the word taken from the page, with the word shown as if selected; click it to change it in place (the box keeps the same size and type, grows with the text, and starts with the word selected, so it looks the same);
  - the **lesson** the word goes into: by default a lesson named after the article you are reading (with 🆕 in front of its name while it does not exist yet; made for you in Vocabulary the first time, then reused for every word from that article), or any of your lessons, or **New lesson…**. In Settings, **Words go into** can instead send every word to one lesson of your choice.
  - **Enter** or **Add** saves the word, and a short note says `word: meaning`; anything else (Esc, ✕, a click outside the card) closes it without saving.
- A word you already have says so on the card (which lesson, what it means) instead of adding it twice.

## Words you already have

Every page marks the words that are already in wikiPhidia, the way the app does: a plain green background for words in the app, grey for words waiting to be sent. Point at one to see its pinyin, meaning and, under them, the lesson it is in. A word you save is marked at once, everywhere it appears on the page. Turn this off in Settings if you prefer a clean page.

## Getting the words into wikiPhidia

Words wait in the extension (the number on the icon) until wikiPhidia is open in a tab; then they go in by themselves, at once if the app is already open. **Open app** in the popup opens it or brings its tab forward. Each word becomes a Vocabulary card in its lesson: the word on the front; on the back the sentence it came from with the word marked in it (as on every other card), the meaning, and the article's title when the lesson has another name. Words already in the app are skipped.

## Lessons from YouTube

On any YouTube video, click the green **字 Make a lesson** button in the bottom-left corner (or **Make a lesson from this video** at the top of the popup, or right-click → **Make a wikiPhidia lesson from this video**). The extension reads the video's subtitles, opens wikiPhidia (or brings its tab forward), and the app shows its usual box: pick the subtitles, then **Subtitles only** or **With translation**. This replaces the *YouTube subtitles* bookmark; the bookmark still works where the extension is not installed. The button can be turned off in Settings.

## The popup

- **On / Off**, the small switch in the header, between the 字 ⚡ icons and Open app: Off turns the extension off on every page at once (no 字 button, no card, no Shift, no marked words, no YouTube button; the icon shows a grey *off*, and the popup's 字 logo turns grey), and On brings it all back. Words already waiting still go into wikiPhidia either way.
Each word sits in its own box, and the hint under the list in a tinted box, so the words are easy to tell apart.

- Pointing at the 字 logo or the name shows whether the app is connected (how many words and lessons it knows, and when it last synced).
- **To send**: the words waiting, with their meaning editable and ✕ to drop one.
- **Recent**: the last words sent, marked *Added* or *Already there*.
- **Settings**: the language of the meanings, the lesson new words go into (🆕 New lesson, named after each article, or one of yours), marking known words on pages, Shift, the YouTube button, and the app's address (change it if you run wikiPhidia somewhere else; local copies on `localhost`, `127.0.0.1` or a file whose path contains `wikiPhidia` connect too).

## Privacy

Words, settings and the list of your vocabulary stay in the browser's extension storage. The only things sent anywhere are the word or sentence being translated, to Google Translate (with MyMemory as a fallback).

Pinyin comes from [pinyin-pro](https://github.com/zh-lx/pinyin-pro) (MIT), bundled in `vendor/`.
