# Microsoft Edge Add-ons listing

Everything the store asks for when wikiPhidia's extension is submitted at partner.microsoft.com/dashboard/microsoftedge.

- **Package:** `store/Extension-store.zip` (built by `python3 extension/make-zip.py`; the files sit at the top of the zip, as the store wants).
- **Name:** wikiPhidia
- **Category:** Education
- **Logo:** `extension/icons/128.png`
- **Screenshots (1280 × 800):** `store/screenshot-1.png`, `store/screenshot-2.png`
- **Privacy policy:** https://phillipxnguyen.github.io/wikiPhidia/privacy.html
- **Website:** https://phillipxnguyen.github.io/wikiPhidia/

**Short description**

Read anything on the web, pick up new words with their meaning and sentence, and send them straight into wikiPhidia's Vocabulary.

**Description**

wikiPhidia's companion for reading on the web. Words you already study are marked on every page; point at one to see your meaning, its level and definitions from up to eight dictionaries. Select a new word or phrase and press Shift to add it with its meaning, its sentence and the dictionary's definitions and examples; it goes straight into wikiPhidia's Vocabulary, where every definition and example becomes a flashcard. Works for English, Chinese, Japanese and Korean. Nothing is collected: your words stay in your own browser.

**Permissions, why each is needed**

- Read and change all sites: to mark the words you study on any page you read and to show the word card there.
- Storage: to keep the words you pick up until the app takes them in, and to cache dictionary results.
- Tabs and scripting: to open the wikiPhidia app and hand it the new words.
- Context menus: the right-click item that adds a selected word.

**Updates**

After the first approval, each new version is sent to the store by the `Edge Add-ons` GitHub workflow when `extension/manifest.json` changes on `main`, once the repository has the secrets `EDGE_PRODUCT_ID`, `EDGE_CLIENT_ID` and `EDGE_API_KEY` (Partner Center → the extension → Publish API).
