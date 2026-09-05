# AkovoLabs Snap — Store Submission Form (copy-paste)

Filled-out fields for the Chrome Web Store developer dashboard and Edge Add-ons.
Text in `>` blocks is ready to paste. Anything marked `[ ]` is a checkbox choice.

---

## 1. Basic info

**Product name**
> AkovoLabs Snap

**Product URL** — your website (optional but recommended)
> https://snap.akovolabs.co.za

**Privacy policy URL** — REQUIRED
> https://snap.akovolabs.co.za/privacy

**Short description** (max 132 chars)
> Capture full-page screenshots and extract any webpage into a ready-to-run React project with AI.

**Detailed description**
> **Capture beyond the screen.**
>
> AkovoLabs Snap turns your browser into a screenshot and design-extraction studio. One click captures an entire webpage — no scrolling, no stitching, no missing content. And with the new **Extract Design** feature, you can turn any webpage into a downloadable React project, rebuilt by AI with its real layout, colors, spacing, and fonts.
>
> **Capture**
> - Full-page scrolling screenshots with seamless stitching.
> - Visible-viewport capture for quick grabs.
> - Smart floating-navigation handling: the first viewport stays natural, repeated headers and footers are removed from the rest.
> - Export as PNG, JPEG, or WebP.
> - Copy straight to clipboard or download with configurable filenames.
> - Optional capture delay to let animations and lazy content settle.
> - Your original scroll position and page styles are restored automatically.
>
> **Extract Design (AI)**
> - Analyze a page's structure, computed styles, design tokens, typography, images, icons, and layout.
> - Gemini AI rebuilds it as a Vite + React + plain CSS project.
> - Download a ready-to-run ZIP: unzip, `npm install`, `npm run dev`.
> - Visual verification scores the result and an auto-improve loop closes the gaps.
> - Extracted projects are archived locally so you can re-download them anytime.
>
> **History**
> - Every capture is saved with a thumbnail, page title, and URL.
> - Time-grouped and searchable.
> - Download, copy, share, or delete from one screen.
>
> **Privacy-first**
> - Runs locally. Your settings, history, and archives stay on your device.
> - Capture needs only the tab you're on (`activeTab`).
> - AI extraction is opt-in: your page data is sent to Google's Gemini API only when you click **Extract Design**.
>
> Fast, lightweight, and built with a modern glassmorphism UI in light and dark themes.

**Category**
> Productivity

**Language** — English

---

## 2. Screenshots & tiles (upload)

| Slot | Image |
|---|---|
| Screenshot 1 | Home / Capture popup |
| Screenshot 2 | Extract Design pipeline (mid-run) |
| Screenshot 3 | Extract Design complete |
| Screenshot 4 | History |
| Screenshot 5 | Settings + AI Configuration |

All at exactly **1280×800** (or **640×400**) PNG/JPEG.
Optional: large promotional tile 1400×560, small tile 440×280.

---

## 3. Listing visibility

- [x] **Public**
- [ ] Unlisted
- [ ] Private

---

## 4. Single purpose

**What is the single purpose of your extension?**
> Capture and analyze web pages the user explicitly selects: full-page screenshots, and on-demand AI extraction of a page's design into a runnable React project.

**Are there any additional features?** — yes (AI Extract Design is one product: capture & analyze)

**Explain additional features:**
> Both features belong to one workflow — capturing and analyzing a web page. Capture saves the page as an image; Extract Design analyzes the same page's design and produces a React project. There is no unrelated functionality.

---

## 5. Permission justification

**`activeTab`**
> Required to capture and analyze the currently active tab when the user clicks the extension icon. Snap only ever operates on the tab the user is on.

**`scripting`**
> Required to inject the content script that scrolls the page, captures each viewport, and extracts design data (DOM, styles, layout, assets).

**`storage`**
> Required to persist the user's settings and capture history locally on the device.

**`downloads`**
> Required to save screenshot images and extracted project ZIP files to the user's device.

**Optional host permission — `https://generativelanguage.googleapis.com/*`**
> Requested on first use of the AI Extract Design feature. Required to send the user-selected page's design data to Google's Gemini API to generate a React project. Not required for screenshots, and never granted automatically.

---

## 6. Data safety form

### Does your extension handle user data?
- [x] Yes
- [ ] No (only if you decide to disable/remove AI + history — not the case here)

### Data collection categories

| Category | Collected? | Shared with third parties? | Purpose / notes |
|---|---|---|---|
| Page content (DOM, styles, screenshots) | Yes | Yes (only via Gemini, on explicit Extract Design action) | To capture and to rebuild the page as a React project |
| Web browsing — URLs/titles of captured pages | Yes | No | Shown in the current-tab card and local History |
| Files & documents (extracted project data) | Yes | No | Stored locally; exported as a ZIP on user action |
| User-provided data (Gemini API key) | Yes | No (only sent to Google for auth) | Stored locally, used only for AI requests |
| Photos & videos | Yes (screenshots the user takes) | Yes (via Gemini, on explicit action) | The screenshots the user captures |
| Personal info (name, email, phone, address) | No | — | — |
| Financial, health, contacts, location, audio, messages | No | — | — |

### How is data handled?
- **Processed on the user's device** — settings, history, and archives never leave the device.
- **Shared with third parties:** only Google's Gemini API, only when the user clicks Extract Design or tests the AI connection. Covered by Google's privacy policy and terms.
- **Data used for advertising?** No.
- **Data sold?** No.
- **Encrypted in transit?** Yes — all Gemini requests use HTTPS.
- **Data deletion:** In-app deletion is available from the History screen (including stored design archives). Removing the extension deletes all locally stored data.

---

## 7. Publisher / verification

**Developer / publisher name:** Clement Phoshoko
**Contact email:** support@akovolabs.co.za
**Verification:** Complete email (and later domain) verification in the dashboard.

---

## 8. Edge Add-ons (Microsoft) extra notes

- Same text, same screenshots, same ZIP (`release/Snap-v1.2.1.zip`).
- Edge requires the same privacy policy URL and its own data-usage declaration.
- Verify your publisher identity in the Microsoft Partner Center.

---

## 9. Upload package — v1.2.1

**Package file:** `release/Snap-v1.2.1.zip` (contents of `dist/`)

**What's new in 1.2.1 — paste into the CWS "Version Description / What's new" field:**

> **Fixed:**
> - "The extension gallery cannot be scripted" error when opening the popup on the Chrome Web Store, Google Accounts, or other Google-protected pages. Capture and Extract Design now show a friendly, accurate message instead of the raw Chrome error.
> - Protected Google domains (Chrome Web Store, Accounts, My Account, Clients) are explicitly blocked before any scripting attempt, for a clearer UX and fewer review-surface errors.
> - Any future scripting-permission error from Chrome is now caught and mapped to a user-facing message.
>
> **Improved:**
> - Popup height consistency when switching between Home, Settings, and History pages. Settings & History now use a constrained viewport height so the popup doesn't collapse to its content height on Chrome's popup window.
> - Differentiated error messages for unsupported pages: non-http(s) pages get the existing hint, while https pages on Chrome-protected hosts get a specific "protected by Chrome" note.
>
