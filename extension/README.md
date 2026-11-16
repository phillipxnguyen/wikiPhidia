# wikiPhidia (browser extension)

A browser extension for reading on the web (news, articles, any page) that picks up new words and sends them straight into wikiPhidia's Vocabulary, with their meaning, the sentence they came from and the page's title, and that turns any YouTube video into a lesson with one click.

## Install from the Edge Add-ons store

Once the store has approved it, wikiPhidia is installed from its Microsoft Edge Add-ons page with one click (Get), with nothing to download or unzip, and the store keeps it up to date by itself (the ↑ badge and the update banner below never show for it). Its listing, screenshots and package are in `store/`; `privacy.html` is its privacy policy.

## Install by hand (Chrome, Edge, Brave, Arc)

1. Download [Extension.zip](https://github.com/phillipxnguyen/wikiPhidia/raw/main/Extension.zip) and unzip it: it gives a folder named `Extension` (or pull this repository and use its `extension` folder).
2. Open `chrome://extensions` (`edge://extensions` in Edge) and turn on **Developer mode**.
3. Click **Load unpacked** and pick the `Extension` folder.
4. Pin the green 字 icon to the toolbar.
5. Open wikiPhidia once (https://phillipxnguyen.github.io/wikiPhidia/) so the extension connects and learns your lessons and words.

## Updating

A copy installed by hand checks GitHub for a newer version every time you open its popup (and when the browser starts). When there is one, the icon shows a blue **↑** and the popup a banner: **Download** gets Extension.zip, which unzips to a folder named `Extension`; put its files in place of those in the folder you loaded, then press **Reload** right there (no need to open `chrome://extensions`). **Settings** shows the version you have and has a **Reload extension** button too.

After an update or a reload, pages that are already open pick up the new version by themselves (no need to reload them): saving words and marking them keep working at once.

A browser only updates an extension fully by itself when it comes from the Chrome Web Store; loaded unpacked, as here, the files have to be replaced by hand.

## Reading

- **Select a word or phrase** on any page. In the popup's header, beside the name, you choose what happens then with two small icons side by side: **字** (the default: a round green 字 appears next to the selection; click it, or press **Shift**, the same key that adds a word inside wikiPhidia) or **⚡** (the card opens as soon as you let go of the mouse, nothing else to click). Right-click → **Add “…” to wikiPhidia** works too.
- A card opens next to the word, its parts evenly spaced (16 px apart, 20 px from the card's edges):
  - the word (click it to edit it in place, with no box or line around it), its **pinyin** for Chinese, and beside it 🔊 to hear it, the translate button to translate the sentence (again to hide it; **Shift** while the card is open does the same), and ✕, the three evenly spaced in the top right corner; a long word or phrase wraps onto more lines, flowing under them, instead of being cut off;
  - the meaning, in green with only a bar down its left (no box), wrapping onto more lines when it is long, translated already into your language (Vietnamese by default), with other meanings as chips to pick from; type over it freely;
  - the sentence around the word taken from the page, on a light green background like a flashcard's, with the word shown as if selected; click it to change it in place (the box keeps the same size and type, grows with the text, and starts with the word selected, so it looks the same);
  - the **lesson** the word goes into: by default a lesson named after the article you are reading (with 🆕 in front of its name while it does not exist yet; made for you in Vocabulary the first time, then reused for every word from that article), or any of your lessons, or **New lesson…**. In Settings, **Words go into** can instead send every word to one lesson of your choice. The card remembers the lesson you pick on each website: pick lesson B once and the next words from that site go to B too, until you pick another one there.
  - **Enter** or **Add** saves the word, and a short note says `word: meaning`; anything else (Esc, ✕, a click outside the card) closes it without saving.
- What you type in the card stays in the card, on every site: pages that catch every key and pull it into their own box (ChatGPT's chat box, for one) never see the keys typed in the word, the meaning or the sentence, nor a paste there.
- A word you already have says so on the card (which lesson, what it means) instead of adding it twice.

## Collecting sentences

**📝 Collect sentences on this page** in the popup (or the page's right-click menu) takes every line of the page's text (more rather than fewer, for you to sort out: each sentence of a paragraph, each list item whole, each table row as its cells joined with a colon; menus, headers and footers are left out). They wait in a small **Collected** box in the bottom right corner, with the words you already have marked: ✕ leaves one out (the list stays where it was), ▾ folds the box away, ✕ at the top clears it, **Collect all** takes them again after the page has grown, and the box remembers what you collected on that page until you send it. **Paste into wikiPhidia** opens the app on its Add page, in the lesson named after the page (a new one if there is none), with the lines in the **Paste here!** box: the app reads them exactly as if you had pasted them yourself, shows what card each line becomes, and nothing is added until you press Import, so you can still change or leave out lines there. No new kind of card and no new rule: they are ordinary cards.

## Words you already have

Every page marks the words that are already in wikiPhidia, the way the app does: a plain green background for words in the app, grey for words waiting to be sent. Point at one (or tap it on a phone) and the pointer becomes a magnifying glass and a full dictionary card (460 px wide, as tall as the window allows) opens beside it, the same card as the app's word popup, light or dark with the page's theme: the word large and bold (28 px) with its level (CEFR A1–C2, HSK, JLPT or TOPIK) and a round 🔊; the pronunciations, UK and US with their IPA for English, each its own button that plays the dictionary's real recording (the browser's voice only when there is none); pinyin for Chinese (the reading for Japanese); your meaning in bold green; the dictionary's definitions grouped by part of speech (verb, noun, adj…), each with its own heading when the dictionary gives one (Cambridge's guide words such as ADMIT, Oxford's and Longman's signposts), from many dictionaries at once, shown as a row of their names to switch between (English: Cambridge, Oxford Learner's, Longman, Collins, Merriam-Webster, Vocabulary.com, Free Dictionary and Wiktionary; Chinese: Youdao, MDBG and Wiktionary; Japanese: Jisho · Weblio and Wiktionary; Korean: krdict and Wiktionary; the extension fetches them itself, so they work even where the app's own look-ups are blocked; a dictionary that has nothing for the word simply does not appear); your own sentence with the word marked in yellow, then two of the dictionary's example sentences, marked the same way, with their translation under them when it has one; your Notes for the word, behind a green bar as in the app; and at the bottom the lesson's name and the dictionary it came from. It is spaced exactly like the app's word popup: 16 px between every part (the word, its meaning, the dictionaries, each sentence, the notes and the lesson's name), measured on the letters themselves rather than their line boxes, so every gap looks the same whatever the size of the text; 24 px above the word, 16 px at the sides and bottom, 16 px corners. Everything looked up is kept, so a word opens at once the second time. The card opens on the side of the word with room for it (above first), never over the word; when neither side has room it scrolls inside. You can move the pointer onto it to press a 🔊; it closes once the pointer leaves both the word and the card, or when the page scrolls.

The card for a new word (Shift or the green 字), 460 px wide like the other, opens below the selection (above it when there is more room there) and grows to show everything as the dictionaries arrive, moving to the roomier side as it grows; when neither side has room for all of it, it may cover the selected words (the sentence is in the card anyway) and is as tall as the window, never shrunk to a small scrolling box. It has the same dictionary: level and the UK/US pronunciations under the word, the definitions under the suggested meanings (click one to make it the meaning), the dictionary's examples under your sentence, its 🔊 plays the real recording and Add stays at the bottom of the card however long it gets. There is no lesson to pick on the card: the word goes with the page it came from (the default lesson can still be set once in Settings). A word you save is marked at once, everywhere it appears on the page. Turn this off in Settings if you prefer a clean page.

## Getting the words into wikiPhidia

The page a word was read on goes along with it: the lesson keeps it in its list of links under the link box, once, with the page's title, so you can always open the article again from the lesson. Words wait in the extension (the number on the icon) until wikiPhidia is open in a tab; then they go in by themselves, at once if the app is already open. **Open app** in the popup opens it or brings its tab forward. Each word becomes a Vocabulary card in its lesson: the word on the front; on the back the sentence it came from with the word marked in it (as on every other card), the meaning, and the article's title when the lesson has another name. Words already in the app are skipped.

## Lessons from YouTube

On any YouTube video, click the green **字 Make a lesson** button in the bottom-left corner (or **Make a lesson from this video** at the top of the popup, or right-click → **Make a wikiPhidia lesson from this video**). After a click the button spins and reads Making the lesson… until wikiPhidia has the video (however long the subtitles or the connection take), then reads ✓ Opened in wikiPhidia, and ✓ Lesson created (or ✓ Already in your lessons) once you have picked how to make it there; if something goes wrong it comes back and says why, and it never keeps spinning for more than two minutes. The extension reads the video's subtitles, opens wikiPhidia (or brings its tab forward), and the app shows its usual box: pick the subtitles to learn, then **Subtitles only**, or **With translation ▾** and where the translation comes from (the video's own Vietnamese or English subtitles, or an automatic translation). This replaces the *YouTube subtitles* bookmark; the bookmark still works where the extension is not installed. The button can be turned off in Settings.

## The popup

- **On / Off**, the small switch in the header, between the 字 ⚡ icons and Open app: Off turns the extension off on every page at once (no 字 button, no card, no Shift, no marked words, no YouTube button; the icon shows a grey *off*, and the popup's 字 logo turns grey), and On brings it all back. Words already waiting still go into wikiPhidia either way.
Each word sits in its own box, and the hint under the list in a tinted box, so the words are easy to tell apart.

- The 字 logo shows the connection to the app, like the cloud button in wikiPhidia: a small cloud with a tick in its corner once the app has been opened and connected, a crossed-out grey cloud before that. Pointing at the logo or the name shows, after a fifth of a second, how many words and lessons it knows.
- **To send**: the words waiting, with their meaning editable and ✕ to drop one.
- **Recent**: the last words sent, marked *Added* or *Already there*.
- **Settings**: the language of the meanings, the lesson new words go into (🆕 New lesson, named after each article, or one of yours), marking known words on pages, Shift, the YouTube button, and the app's address (change it if you run wikiPhidia somewhere else; local copies on `localhost`, `127.0.0.1` or a file whose path contains `wikiPhidia` connect too).

Before a word or sentence is translated, stray marks (quotation marks of every kind, brackets, asterisks, bullets, music notes) are taken out, so the translation is not thrown off by them.

## Dictionaries for the app

While the extension is installed, wikiPhidia asks it for dictionary pages a web page cannot load itself: Cambridge (English), Youdao (Chinese, with its Oxford and other example sentences), Jisho and Weblio (Japanese) and the Korean Basic Dictionary (krdict, Korean). The extension only fetches pages from those sites, only for the app, and hands the page back; the app reads the definitions, example sentences and recordings out of it.

## Privacy

Words, settings and the list of your vocabulary stay in the browser's extension storage. The only things sent anywhere are the word or sentence being translated, to Google Translate (with MyMemory as a fallback), and the words the app looks up, to the dictionaries above.

Pinyin comes from [pinyin-pro](https://github.com/zh-lx/pinyin-pro) (MIT), bundled in `vendor/`.
