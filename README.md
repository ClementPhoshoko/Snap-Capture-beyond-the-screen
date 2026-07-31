# AkovoLabs Snap

> **Capture beyond the screen.**

AkovoLabs Snap is a modern Chrome Extension that captures **full-page scrolling screenshots** with a single click — and now **extracts any webpage into a ready-to-run React project with AI**.

It automatically scrolls through a webpage, captures each viewport, stitches the images into one seamless screenshot, and downloads the result. Or, with **Extract Design**, it analyzes a page's structure, styles, fonts, and layout, then uses **Gemini AI** to rebuild it as a Vite + React project you can download, open, and edit.

Built with **React**, **JavaScript**, **Vite**, and **Chrome Extension Manifest V3**, Snap is fast, lightweight, and privacy-friendly — everything runs locally except the optional AI calls you explicitly trigger.

---

# Table of Contents

- [Why Snap?](#why-snap)
- [Features](#features)
- [Use Cases](#use-cases)
- [Requirements](#requirements)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Loading the Extension](#loading-the-extension)
- [How to Use](#how-to-use)
- [Extract Design (AI)](#extract-design-ai)
- [How It Works](#how-it-works)
- [Permissions & Privacy](#permissions--privacy)
- [Capture Limits](#capture-limits)
- [Roadmap](#roadmap)
- [License](#license)

---

# Why Snap?

| Pain point | How Snap solves it |
|---|---|
| Screenshots cut off mid-page | One click captures the **entire page** and stitches it seamlessly |
| Repeated headers in long captures | **Smart floating-navigation handling** keeps the top viewport natural, then removes repeated bars |
| You see a design you love but can't rebuild it | **Extract Design** turns any page into a downloadable React project |
| Sharing design feedback is hard | Capture, annotate mentally, and share via **History** with copy/share support |
| You want a starting point for a redesign | Snap hands you the **exact layout, colors, spacing, and fonts** as code |

---

# Features

## ⚡ AI — Extract Design

The flagship feature: **turn any webpage into a runnable React project**.

- Extracts the full design system of a page: **DOM structure, computed styles, CSS variables (design tokens), typography, images, SVGs, icons, layout, and spacing**.
- Captures multiple **full-page screenshots** as visual references for the AI.
- **Gemini AI** reconstructs the page as a **Vite + React + plain CSS** project (App.jsx, App.css, index.jsx, package.json, index.html).
- **Visual verification** scores the result (0–100% similarity) and runs an **auto-improve loop** to close gaps.
- Output is a **ZIP you download, unzip, and run**: `npm install && npm run dev`.
- **Smart text policy** — headings, buttons, and labels are transcribed exactly; long body copy becomes skeleton placeholders, so extraction is fast and cheap without losing the design.
- **Reliable model handling**:
  - **Model cascade** — tries your primary model first, then automatically falls back to backup models.
  - **Deprecated-model filtering** — never wastes requests on retired or unsupported models.
  - **Dual endpoint fallback** — transparently switches between the Gemini Interactions API and the classic `generateContent` endpoint.
  - **Timeouts** on every AI call so the popup never hangs.
  - **Token budgeting** — compresses screenshots (JPEG q30) and caps payload size so each extraction stays affordable.
- **Live pipeline UI** — watch 16 stages from *Capturing page* to *Exporting project*, with per-stage status and a progress ring.
- **Re-download anytime** — every extraction is archived locally in IndexedDB and recoverable from History.

## 📸 Capture

- **Full-page scrolling capture** — measures the page, scrolls at a browser-safe rate, and captures every viewport.
- **Visible viewport capture** — grab just what's on screen.
- **Seamless stitching** — overlapping viewports are cropped and merged with no duplicate seams.
- **Smart floating navigation** — three modes:
  - **Smart** (recommended): keep the first viewport natural, then hide repeated top/bottom bars.
  - **Keep floating UI**: capture the page exactly as displayed.
  - **Hide all floating UI**: aggressive fixed/sticky removal.
- **PNG, JPEG, and WebP** export.
- **Copy to clipboard** — paste straight into Slack, Figma, or a doc.
- **Download with configurable filenames** — templates like `Snap_title-date-time`, with optional "save as" prompt.
- **Configurable quality and capture delay** — wait 2–10s for animations or lazy content to settle.
- **Restores the page** — original scroll position and page styles are restored after capture.

## 🛡 Robustness

- **Nested scroll containers** are detected and expanded so nothing is missed.
- **Videos paused, animations settled**, and a **tail-retry loop** ensures the last bit of the page is captured.
- **Canvas safety limits** — extreme page heights error cleanly instead of producing corrupted images.
- **Browser-safe pacing** between captures to avoid throttling and flicker.
- **Overlay-free captures** — double `requestAnimationFrame` plus forced style recalcs keep extension UI out of the image.

## 🕘 History

- **Local capture history** with thumbnails, page title, favicon, and URL.
- **Time-grouped views** — Today, Yesterday, This Week, This Month, This Year.
- **Search** across titles and domains.
- Actions per entry: **download, copy, share, open, delete**.
- **Design extracts are archived** — re-download any AI-generated ZIP later.

## 🎨 UI / UX

- Modern **glassmorphism** interface with a polished, accessible design.
- **Dark / light themes** and a picker of **accent colors** — persisted locally.
- Smooth **animated page transitions** (Framer Motion).
- Compact bottom navigation: Home, History, Settings.
- Live **capture pipeline view** with per-section progress and stats.

## 🔒 Privacy

- Uses the user-invoked **`activeTab` permission** — no blanket access to your browsing.
- Everything (settings, history, archives) stays **on your device** in `chrome.storage` / IndexedDB.
- The Gemini API key is stored locally and only used for extraction requests you start.
- No analytics, no tracking.

---

# Use Cases

- **Design inspiration → working code.** See a landing page you love? Extract Design turns it into a React project you can study, remix, and evolve.
- **Kickstart a redesign.** Capture your current site as code, then change colors, copy, and layout without rebuilding from scratch.
- **Handoff-ready references.** Full-page screenshots are perfect for design reviews, bug reports, or sharing with developers and designers.
- **Learning from the web.** Inspect how a page's spacing, type scale, and design tokens are built — in your own editor.
- **Archiving.** Save clean, readable full-page screenshots of pages before they change, get paywalled, or disappear.
- **Documentation & support.** Paste a full-page capture into tickets and docs instead of three cropped images.
- **Before/after tracking.** Periodically capture pages to track design changes over time, all searchable in History.

---

# Requirements

## Browser

- Google Chrome 120+
- Microsoft Edge (Chromium)
- Brave Browser
- Opera GX
- Any Chromium-based browser

## Development

- Node.js 22+
- npm
- Git
- Visual Studio Code (Recommended)

## AI (optional — only for Extract Design)

- A **Google AI Studio** API key, configured under **Settings → AI Configuration**.
- Snap works with a small, curated set of active Gemini models and automatically falls back across them.
- Pricing is pay-as-you-go and per extraction (typically fractions of a cent for a typical page).

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| React | Popup Interface |
| JavaScript (ES6+) | Application Logic |
| Vite | Development & Build Tool |
| CSS / CSS Modules | User Interface Styling |
| Chrome Extension Manifest V3 | Extension Platform |
| Chrome Extension APIs | Browser Integration |
| HTML5 Canvas API | Image Stitching |
| Gemini API | AI Design Extraction |
| IndexedDB | Design Archive Storage |
| JSZip | Project ZIP Export |
| Framer Motion | Animated UI |
| Lucide Icons | UI Iconography |

---

# Project Structure

```text
akovolabs-snap/
│
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── assets/
│
├── src/
│   ├── popup/                  # Extension UI (React)
│   │   ├── components/         # GlassCard, ActionCard, BottomNav, HistoryCard, ...
│   │   ├── pages/              # Home, CaptureProgress, CaptureComplete,
│   │   │                       # ExtractDesignProgress, History, Settings
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── background/             # Service worker (MV3)
│   │   ├── service-worker.js   # Capture + Extract Design orchestration
│   │   └── services/
│   │       ├── geminiService.js    # Gemini calls, model cascade, fallbacks
│   │       ├── payloadBuilder.js   # AI input payload assembly
│   │       ├── projectExporter.js  # React/Vite ZIP generation
│   │       └── visualVerifier.js   # Similarity scoring & diff reporting
│   │
│   ├── content/                # Injected into the captured page
│   │   ├── captureManager.js
│   │   ├── scrollController.js
│   │   ├── pageAnalyzer.js
│   │   ├── captureOverlay.js
│   │   ├── messaging.js
│   │   ├── index.js
│   │   └── extractors/         # Design data collection
│   │       ├── domExtractor.js
│   │       ├── styleExtractor.js
│   │       ├── layoutAnalyzer.js
│   │       └── assetCollector.js
│   │
│   ├── utils/
│   │   ├── imageMerger.js      # Seamless stitching
│   │   ├── cropper.js
│   │   ├── download.js
│   │   └── canvas.js
│   │
│   ├── shared/
│   │   ├── constants.js
│   │   ├── storage.js          # Settings + capture history
│   │   ├── designArchive.js    # IndexedDB design ZIP archive
│   │   ├── messages.js
│   │   └── helpers.js
│   │
│   └── styles/
│       ├── global-tokens.css
│       └── globals.css
│
├── package.json
├── vite.config.js
├── vite.content.config.js
└── README.md
```

---

# Getting Started

Clone the repository.

```bash
git clone https://github.com/ClementPhoshoko/akovolabs-snap.git
```

Move into the project.

```bash
cd akovolabs-snap
```

Install dependencies.

```bash
npm install
```

---

# Development

Start the development server.

```bash
npm run dev
```

Build the extension.

```bash
npm run build
```

Preview the production build.

```bash
npm run preview
```

---

# Loading the Extension

After building the project:

1. Open Chrome.
2. Navigate to:

```text
chrome://extensions
```

3. Enable **Developer Mode**.
4. Click **Load unpacked**.
5. Select the project's build output folder (`dist/`).
6. Pin **AkovoLabs Snap** to the Chrome toolbar.

---

# How to Use

## Capture a screenshot

1. Open any webpage.
2. Click the **AkovoLabs Snap** extension icon.
3. Choose a capture mode:
   - **Capture Full Page** — the entire scrollable page.
   - **Capture Visible Screen** — just the current viewport.
4. Snap measures the page, captures each viewport (handling floating navigation), and stitches the result.
5. **Download** the final screenshot or **copy it to the clipboard**.

### Floating Navigation

Full-page screenshots keep the navigation visible in the first viewport, then hide detected repeated floating bars in subsequent viewports. This makes the image read like a document instead of repeating the same header or footer.

Choose **Settings → Floating Navigation** to select:

- **Smart (top/bottom bars)** — recommended; detects wide edge-anchored navigation layers.
- **Keep floating UI** — captures the page exactly as displayed.
- **Hide all floating UI** — more aggressive fixed/sticky removal.

Elements marked with `data-snap-keep` are never hidden. Some browser-owned UI, closed shadow roots, and cross-origin frames cannot be modified by an extension.

## Extract Design (AI)

1. Open the page whose design you want.
2. Click the extension icon, then **Extract Design**.
3. Watch the 16-stage pipeline: capturing, analyzing DOM/styles/fonts/layout, then AI generation.
4. Review the **similarity score** and download the **ZIP** (or copy it).
5. Unzip, then run:

```bash
npm install
npm run dev
```

### Setup: one time

1. Go to **Settings → AI Configuration**.
2. Paste your **Gemini API key** (from [Google AI Studio](https://aistudio.google.com/apikey)).
3. Click **Test Connection** to verify the key and available models.

### What's inside the ZIP

```text
extracted-design/
├── package.json      # Vite + React dependencies and scripts
├── index.html        # Loads /index.jsx
├── index.jsx         # Mounts <App />
├── App.jsx           # The reconstructed page
├── App.css           # Plain CSS with the page's design
├── public/           # Extracted image assets
├── source-screenshots/  # Full-page captures used as visual references
└── EXTRACTION_REPORT.json  # Metadata, similarity score, and notes
```

The exporter normalizes common AI output automatically (e.g. `App.module.css` → `App.css`, `className={styles.foo}` → `className="foo"`, ensures `index.jsx` exists), so the ZIP always builds out of the box.

---

# How It Works

## Capture flow

```text
User
 │
 ▼
Popup (React)
 │
 ▼
Background Service Worker
 │
 ▼
Inject Content Script
 │
 ▼
Analyze Webpage
 │
 ▼
Calculate Scroll Positions
 │
 ▼
Scroll & Capture
 │
 ▼
Merge Images
 │
 ▼
Generate Final Image
 │
 ▼
Download / Clipboard
```

## Extract Design flow

```text
User clicks "Extract Design"
 │
 ▼
Capture full-page screenshots (visual references)
 │
 ▼
Collect design data (content script)
 DOM · styles · CSS variables · fonts ·
 images · SVGs · icons · layout · spacing
 │
 ▼
Build AI payload (token-budgeted, screenshot references attached)
 │
 ▼
Gemini AI reconstructs project
 (model cascade → Interactions / generateContent fallback)
 │
 ▼
Visual verification + similarity score
 │
 ▼
Auto-improve loop (fix discrepancies)
 │
 ▼
Export Vite React ZIP
 │
 ▼
Archive to IndexedDB · Download / Copy
```

---

# Permissions & Privacy

| Permission | Purpose |
|------------|---------|
| `activeTab` | Access the active tab |
| `tabs` | Capture browser tabs |
| `scripting` | Inject content scripts |
| `storage` | Save extension settings and history |
| `downloads` | Download screenshots and project ZIPs |
| `https://generativelanguage.googleapis.com/*` | Send design data to Gemini **only** when you run Extract Design |

Snap uses the user-invoked `activeTab` permission rather than persistent access to every website. Settings, capture history, and extracted design archives live only on your device.

## Capture Limits

- Designed for desktop Chromium browsers (Chrome 120+, Edge, Brave, Opera, and similar browsers).
- Browser-internal pages, PDF viewers, and pages that block script injection cannot be captured as full pages.
- Extremely tall/high-resolution pages may exceed safe browser canvas limits; Snap stops with an error instead of creating a corrupted image.
- Dynamic, infinite-scroll pages can change while being captured. For the most predictable result, wait for the page to finish loading before starting a capture.

---

# Roadmap

## Done ✅

- Full-page and visible capture
- PNG, JPEG, and WebP export
- Smart floating-navigation handling
- Copy to clipboard and configurable filenames
- Capture delay and quality settings
- **AI Extract Design** (React project reconstruction via Gemini)
- Capture history with search, grouping, and sharing
- Design archive (re-download extracted projects)
- Themes, accent colors, and glassmorphism UI

## Next 🚀

- PDF export
- Keyboard shortcuts
- Annotation tools
- Blur sensitive information
- Watermark support
- OCR text extraction
- AI page summarization
- Cloud synchronization
- Team sharing

---

# License

This project is licensed under the MIT License.

---

# AkovoLabs

**AkovoLabs Snap**

> **Capture beyond the screen.**

Building modern tools that make everyday workflows faster, simpler, and more productive.
