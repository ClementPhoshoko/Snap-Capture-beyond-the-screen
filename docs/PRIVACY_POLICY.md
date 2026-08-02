# Privacy Policy for AkovoLabs Snap

**Last updated:** July 2026

AkovoLabs Snap ("the Extension") is a browser extension that captures web pages as full-page screenshots and, on your request, analyzes a page's design and generates a downloadable React project using an AI service.

This policy explains what information the Extension handles, how it is used, and the choices you have. By installing and using the Extension, you agree to the practices described here.

---

## 1. Information we handle

### Data you provide
- **Gemini API key:** If you use the AI-powered Extract Design feature, you enter a Google AI Studio API key in Settings. It is stored locally in your browser's extension storage and is used only to authenticate requests to Google's Gemini API.

### Data collected while you use the Extension
- **Page URL and page title** of the tab you choose to capture or extract.
- **Page content and screenshots:** When you capture a page, the Extension reads the page's DOM, computed styles, fonts, images, layout, and full-page screenshots. When you use Extract Design, this design data is sent to Google's Gemini API so the AI can reconstruct the page as a React project.
- **Capture history metadata:** thumbnails, page titles, URLs, capture dates, and download details for entries you keep in the Extension's History screen.

### Data stored on your device
- Settings, capture history, and extracted design archives are stored locally in your browser using `chrome.storage` and IndexedDB.

---

## 2. How the information is used

- **Capturing and sharing screenshots:** All processing happens on your device. Screenshots are generated and saved or downloaded locally, or copied to your clipboard, entirely within your browser.
- **AI design extraction (Extract Design):** Only when you explicitly click **Extract Design**, the Extension sends the page's design data (structure, styles, fonts, layout, and screenshots) to Google's Gemini API to generate a React project. This does not happen automatically or in the background.
- **History:** Capture metadata is stored locally so you can find, search, download, copy, share, or delete previous captures.

The Extension does **not**:
- collect personal information such as your name or email,
- track your browsing activity outside of the pages you actively capture,
- sell or rent any data,
- serve advertisements, or
- share data with third parties except as described above for Gemini.

---

## 3. Sharing with third parties

- **Google / Gemini API:** When you run Extract Design (or test your AI connection in Settings), design data from the page you selected is sent to Google's Gemini API. Your use of that service is also governed by Google's terms and privacy policy. See:
  - Google Privacy Policy: https://policies.google.com/privacy
  - Google AI terms and data policies: https://ai.google.dev/gemini-api/terms
- We do not otherwise share your data.

---

## 4. Data retention and deletion

- Settings and history are kept only on your device, for as long as you choose to keep them.
- You can delete individual history entries (including stored design archives) at any time from the History screen.
- You can remove your API key by clearing the AI Configuration field in Settings and saving.
- To erase all Extension data, remove the Extension from your browser, or clear the site data for the Extension from `chrome://extensions`. Removing the Extension deletes all locally stored settings, history, and archives.

---

## 5. Security

- All communication with Google's Gemini API is over HTTPS.
- Your API key and history never leave your device except as needed to authenticate Gemini requests.
- The Extension uses the minimal permissions required to function (see the store listing for details) and requests access to the Gemini API host only when you first use the AI feature.

---

## 6. Children's privacy

The Extension is not directed to children and does not knowingly collect personal information from children.

---

## 7. Changes to this policy

We may update this policy from time to time. The "Last updated" date at the top of this page reflects the most recent version. Material changes will be noted on the store listing page.

---

## 8. Contact

For questions about this policy or the Extension, contact:

**Clement Phoshoko**
support@akovolabs.co.za
