# AkovoLabs Snap — Store Listing Kit

Draft copy and assets checklist for publishing on the Chrome Web Store and Edge Add-ons.

---

## Product name

**AkovoLabs Snap**

## Short description (max 132 chars)

> Capture full-page screenshots and extract any webpage into a ready-to-run React project with AI.

_(101 chars — fits the limit.)_

## Detailed description (Chrome Web Store)

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

## Category

**Productivity** (or **Developer Tools** — pick one; Productivity has the broadest audience).

## Language

English.

## Screenshots (min 1, max 5; 1280×800 or 640×400)

1. **Home / Capture** — the popup with the current tab card, capture mode, and the Capture + Extract Design buttons.
2. **Extract Design pipeline** — the live progress view (16 stages) mid-extraction.
3. **Extract Design complete** — the completion screen with similarity score and Download/Copy actions.
4. **History** — grouped, searchable capture history with thumbnails.
5. **Settings** — capture options and AI configuration (API key + Test Connection).

## Promotional tiles

- **Small promotional tile:** 440×280
- **Large promotional tile:** 1400×560 (optional, featured placement)

## Optional

- Promo video (≤ 200 seconds) showing a full-page capture, then an Extract Design run.
- Website URL (homepage) — recommended; also required to host the privacy policy.

## Permission & data-safety summary (used in the store forms)

| Permission | Why |
|---|---|
| `activeTab` | Capture the page you're currently on |
| `scripting` | Inject the capture/analysis content script |
| `storage` | Save your settings and capture history locally |
| `downloads` | Save screenshots and extracted project ZIPs |
| Optional: Gemini API host | Only used when you run Extract Design or test the AI connection — requested on first use |

**Data collection:** page URL, page title, and page content/screenshot data while a capture or extraction runs. This is processed on your device, except when you explicitly run **Extract Design**, where the page's design data is sent to Google's Gemini API to generate the project. Your Gemini API key is stored locally and used only for these requests.

**No** personal information, **no** tracking, **no** advertising, **no** selling of data. Data deletion is available in-app via History.

---

## Edge Add-ons (Microsoft) notes

- Free Microsoft Partner Center account.
- Same package and listing materials.
- Edge has its own store listing fields; reuse this copy verbatim.

## Opera add-ons notes

- Register on addons.opera.com and upload the CRX/ZIP of `dist/`.
- Reuse the same description and screenshots.
