# wikiPhidia

Flashcards for learning Chinese and Japanese, with spaced repetition, YouTube clips, dictionaries and a vocabulary deck built from your notes.

The whole app is one file, `index.html`. There is no build step and nothing to install: open it in a browser, or host it anywhere that serves static files. On a phone it can be added to the home screen and runs full screen.

## Lessons and cards

- Paste cards into a lesson, one per line, as `question : answer` or tab-separated. The separator is detected and a preview shows what will be imported. Column delimiter can also be set to a period (. or 。), an ellipsis (… or ...), a comma (, ，or 、), a semicolon, a dash ( - , – or —), =, | or /, for cards and for pasted vocabulary alike. These split each line once, at the first one, into question and answer; a period or comma between two digits (3.5, 1,000) and one at the very end of the line do not count. Only Tab also takes a time column and a notes column. **Auto-detect**, the first choice and the default on both sides, reads a whole study text in one paste, in Lessons or in Vocabulary alike: a question line just above a paragraph (ending in ?, starting with Q: or Question:, or a short heading such as `Day 1 — A Busy Morning`) becomes one card with the whole paragraph as its answer (an A: or Answer: in front is dropped; following paragraphs belong to the same answer), any other paragraph becomes one question-only card per sentence, each `word = meaning` or `word: meaning` line (with or without a `*`, `-`, `•` or `1.` in front) becomes a word, and a short line just above a word list (such as `🔥 Phrasal verbs to conquer today`) is left out. Each word is filed under the card whose question or answer uses it, also in another form (`headed out` for head out, `got up` for get up, `gave up` for give up), so clicking it there shows that sentence, and the back of its flashcard shows the sentence with that form highlighted (the back always uses a sentence of the lesson that contains the word, even if the word was filed under another card); a word no sentence uses goes to the lesson's own word list. A short first line without sentence punctuation (such as `Day 1 — A Busy Morning`) becomes the lesson title when the lesson is empty, and stays the question of its card when a paragraph follows it. On the Vocabulary side, other short lines become words without a meaning, which can be filled in later. From Auto-detect, pasted cards or words still switch to Tab or colon by themselves when more than half the lines use it and no line holds several sentences (a colon after a finished sentence does not count); from any other choice, Auto-detect is picked when no line has a Tab or colon. English or Vietnamese under Translate to splits sentences the same way and fills in a translation as the answer. Bullets in front of a line are dropped with every delimiter.
- Start a line with a timestamp (`1:23 question : answer`) and set the lesson's YouTube link to tie each card to a moment in the video.
- Each card has rich-text notes. Lines written as `word: meaning` become words in the vocabulary deck. The word part can be up to 100 characters: when you type a word, a counter appears near the limit, and past it the box turns red, says so and won't save. Pasted words over the limit are listed as too long and left out.
- Questions, answers and notes keep only basic formatting: bold, italic, underline, strikethrough, line breaks and bullet or numbered lists. Anything else pasted in (font sizes, colours, fonts, headings, links, images) is dropped, so a paste from a web page, Word or Google Docs cannot change how a card looks.
- Lessons can be saved as `.json` files and opened again, one at a time or all at once.

## Studying

| Mode | What it does |
| --- | --- |
| ☰ Full | The whole lesson as a list, for browsing and editing. No spaced repetition. |
| Group | Due cards five at a time. |
| Listening | One card at a time, playing its video clip first. Shown when the lesson has video cards. |
| 🎤 IELTS | One question at a time, for long answers such as IELTS Speaking: say or think your answer, then Space shows the model answer with the lesson's words highlighted in it and a Vocabulary box listing those words with their meanings (Space again hides it). ← or → grades, as everywhere. Shown when the lesson has cards with answers; it shares Group's spaced repetition, so a card studied in one leaves the other until it is due again. |

Group and Listening share one queue: a card studied in one mode leaves the others until it is due again.

**Sound.** The YouTube button (or S) plays the cards' video clips, at the speed beside it. Cards without a clip are read aloud in their turn, so clips and reading alternate; in a lesson without a video the button becomes 🔊 and reads the questions aloud. While sound plays, the button shows a pause mark (the YouTube mark with ⏸ bars for clips, ⏸ for reading) and is filled with the mode's colour; press it again to stop. Showing a group, or showing or flipping a word in Vocabulary, plays it automatically.

**Back to the card.** Revealing or flipping a card, and moving on to the next one, jumps in one step to the top of the study area, in Lessons and in Vocabulary.

**Scheduling.** *Again* brings a card back in 10 minutes. Each *Good* counts towards a streak; until the fifth Good in a row the card returns the next day. After five it is **done**, and the gaps grow to 1, 3 and then 7 days.

**Done is done.** When nothing is left to study, the study modes are hidden and the lesson goes back to ☰ Full: 🎉 with the New, Due and Done counts sits above the list, with confetti. There is no button to study ahead; the modes come back when cards are due again. (**Reset** makes a whole lesson New again, if you want to start it over.)

### Keyboard

| Key | Action |
| --- | --- |
| ← or Shift + Return | Again |
| → or Return | Good |
| S | Play or pause the sound (Speaker) |
| C | Copy the questions being studied: the whole group, or the one card |
| E | Edit a card: the one being studied, or in a table the row you point at or have selected |
| D | In Vocabulary, show or hide the word list (Group) or the dictionary (Flashcards) |
| 1 – 5 | In a group, play just that row over and over: its video clip, or read aloud when it has none (press again to stop) |
| Space | Reveal / flip; in Listening, once the card is shown, play or pause the sound (like S). The phone's Show button does the same and names what it will do: Show, or Hide once the group is shown; ⟲ in Flashcards, where flipping goes both ways; ▶ or ⏸ in Listening. In Vocabulary, Again and Good read ✕ and ✓, on the buttons and on the card that flies off when you grade or swipe |
| ⌘/Ctrl + Z | Undo, including grades (add Shift to redo) |
| Delete or Backspace | Delete the card. Nothing happens while a card is open for editing, or when a Vietnamese typing tool (Telex, VNI) sends Backspace to turn a letter into ê, đ, é and so on |
| Shift (with text selected above a dictionary) | Select part of the question to add it as a word; select the whole question or the whole answer to edit it right there. On a computer the answer also opens by clicking it, as in the table. On a phone, tap the ✎ just before the first word of the question or the answer; it hides while you edit. Return saves, Esc cancels |
| Esc | Close a popup |

The same keys work in every study mode, in Lessons and in Vocabulary. In a Lesson group, pointing at a row, or at the dictionary panel under the table that belongs to it, makes the grading keys grade just that card.

On a phone, swipe a card right for Good and left for Again. In a Lesson group, swiping one row or its dictionary panel grades just that card; swiping anywhere else grades the whole group.

## Vocabulary

Switch from **Lessons** to **Vocabulary** with the 字 button at the top. Words come from the `word: meaning` lines in your notes, or can be pasted in directly. They have their own review sessions and scheduling, one lesson at a time or all words together.

| Mode | What it does |
| --- | --- |
| ☰ Group | Due words five at a time, like Group mode in Lessons: click a word to edit it, tap a row (phone) or point at it (computer) to grade just that word, the YouTube or 🔊 button plays the group's words in turn, the YouTube or 🔊 mark before each word plays just that (and turns into ⏸ while it plays) word, and 📖 beside 🔊 (or D) shows or hides the whole word list under the table, for browsing and editing. It starts hidden so it does not give answers away and hides again as soon as you show or grade; the bar at the top of the list shows the number of words and, with ＋, adds a word; point at a word (or tap it on a phone) to see its pinyin or reading |
| 📝 Flashcards | One word at a time; tap the card to flip it. 📖 beside 🔊 (or D) shows or hides the word's stroke order and, under the card, the dictionary for the whole sentence the word comes from; it turns off again when you grade. |

Group and Flashcards share one queue, and a word marked Again comes back after 10 minutes. The toolbar stays pinned to the top of the screen as you scroll, in both modes, as in Lessons. The 🌐 button picks the language; ⇄ picks which side is shown first and hides the other side again (the card gives a short squash, and the side it starts on is labelled and coloured Question or Answer). On a phone, Undo, Redo, Show, Again and Good sit in a bar fixed to the bottom of the screen, as in Lessons; on a computer the keys do the same.

As in Lessons, pointing at a word (or tapping its row on a phone) shows its pinyin or reading.

When every word is studied, ☰, 📝 and ⇄ are hidden: only 🌐, the counts, 🎉 and the word list, always open, remain until words are due again.

Words already in your vocabulary (the `word: meaning` lines in notes, in any lesson) are highlighted in questions and in the sentence above each dictionary. Green means another card, in this lesson or another one, also has the word: click it to see that card's sentence and note, with the lesson's name when it comes from another lesson. Grey means only this card has it. Every word is highlighted, even inside or across another one, with the colours layered where they share characters; pointing at a word lights up all of it, and clicking a shared character steps through every word on it. Only highlighted words can be looked up; selecting other text does nothing. Cards from the lesson you are in come first.

Words are found by the kind of writing at their edges, with no language setting and no lists of words to skip:

- Chinese, Japanese, Thai, Lao, Khmer and Burmese, written without spaces, match anywhere.
- Korean must start a spaced chunk but may end inside it, so 학교 matches 학교에서 but not 대학교.
- Languages written with spaces (English, Vietnamese, Russian…) must match whole words, so "cat" does not match "concatenate".
- Japanese verbs and adjectives also match in any form: 食べる highlights 食べました and 食べない. A word that covers part of a kanji compound highlights the whole compound, so its furigana stays in one piece.
- English words also match their other forms: -s, -es, -ies, -ed, -ied and -ing (cats, watches, studied, stopped, running, making), common irregular verbs, plurals and comparisons (went for go, children for child, better for good), and each word of a phrase (gave up for give up). In a phrase, a, an and the stand for each other and may be left out (a travel pass highlights the travel pass and travel passes, issue a travel pass highlights issued travel passes), sb, sth, someone and something stand for one to three words (give sb a hand highlights gave my brother a hand), one's, your, his… stand for any of them (make up one's mind highlights made up her mind), oneself for myself, himself…, and a hyphen counts as a space (well-known and well known). A highlight means the text holds a real form of the word, and you decide whether the meaning fits (left is a form of leave even in turn left). Look-alikes that are not forms are never matched: -er, -est and -ly are left out (corner, forest, only), and evening, thing or seed are not read as forms of even, the or see.
- Korean verbs and adjectives written with -다 match their usual conjugations: 먹다 highlights 먹어요 and 먹었어요, 가다 highlights 가요, 갔어요 and 갑니다, 보다 highlights 봐요, and 공부하다 highlights 공부해요 and 공부했어요. The common irregular verbs match too: 덥다 → 더워요, 돕다 → 도와요, 듣다 → 들어요, 낫다 → 나아요, 모르다 → 몰라요, 그렇다 → 그래요, 바쁘다 → 바빠요. A form can belong to more than one word (가요 is also a noun, 들어요 also comes from 들다); it is highlighted for each, and you decide which fits.
- Full-width and half-width forms count as the same (ｶﾀｶﾅ and カタカナ, ＡＢＣ and ABC), katakana and hiragana count as the same (ネコ and ねこ), Vietnamese tone marks may sit on either vowel (hòa and hoà, khỏe and khoẻ, thúy and thuý), case does not matter, and line breaks count as spaces.

## Language help

- Pinyin on hover for Chinese
- Stroke-order animations: every dictionary panel in Group and Listening shows how to write the card's characters, animated when the card is shown; tap a character to draw it again.
- A dictionary panel under each card, in every language: chinesedictionary.mobi for Chinese; Bing Translator into English for Japanese, Korean and Vietnamese, and into Vietnamese for English. In a Lesson group each panel starts with the question, then its answer, then the stroke order and the dictionary. Chinese and Japanese sentences above it show pinyin or readings
- Reading aloud with the browser's own voices
- Study languages: Chinese (Simplified and Traditional), Japanese, Korean, English, Vietnamese

## Progress and sync

- **Stats** shows your daily streak, a review heatmap, progress per lesson, and your hardest cards. **🎯 Practise all** studies the hard cards from every lesson together (only the ones that are due).
- Everything is stored in the browser; no account is needed.
- Sign in with Google or email to sync lessons and reviews across devices through Firebase.
- Light and dark themes.

## Libraries

Loaded from CDNs at runtime: [pinyin-pro](https://github.com/zh-lx/pinyin-pro), [Hanzi Writer](https://hanziwriter.org), the YouTube IFrame API, and the Firebase SDK (only when you sign in).
