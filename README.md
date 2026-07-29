# AkovoLabs Snap

> **Capture beyond the screen.**

AkovoLabs Snap is a modern Chrome Extension that captures high-quality **full-page scrolling screenshots** with a single click. It automatically scrolls through the webpage, captures each viewport, stitches the images into one seamless screenshot, and downloads the final image.

Built with **React**, **JavaScript**, **Vite**, and **Chrome Extension Manifest V3**, Snap is designed to be fast, lightweight, and privacy-friendly.

---

# Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Loading the Extension](#loading-the-extension)
- [How to Use](#how-to-use)
- [How It Works](#how-it-works)
- [Permissions](#permissions)
- [Roadmap](#roadmap)
- [License](#license)

---

# Features

- Full-page scrolling screenshots
- Visible viewport capture
- Seamless, cropped image stitching without duplicate final viewports
- PNG, JPEG, and WebP export
- Copy screenshots to clipboard
- Download screenshots with configurable, safe filenames
- Restore the original scroll position and page styles after capture
- Smart floating navigation handling: keep the first viewport natural, then hide repeated top/bottom bars
- Configurable quality, capture delay, output format, save prompt, and floating UI behavior
- Local settings and metadata-only capture history
- Modern AkovoLabs interface
- Fast and lightweight

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

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| React | Popup Interface |
| JavaScript (ES6+) | Application Logic |
| Vite | Development & Build Tool |
| CSS | User Interface Styling |
| Chrome Extension Manifest V3 | Extension Platform |
| Chrome Extension APIs | Browser Integration |
| HTML5 Canvas API | Image Stitching |

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
│   │
│   ├── popup/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── background/
│   │   └── service-worker.js
│   │
│   ├── content/
│   │   ├── captureManager.js
│   │   ├── scrollController.js
│   │   ├── pageAnalyzer.js
│   │   └── messaging.js
│   │
│   ├── utils/
│   │   ├── imageMerger.js
│   │   ├── cropper.js
│   │   ├── download.js
│   │   └── canvas.js
│   │
│   ├── shared/
│   │   ├── constants.js
│   │   ├── storage.js
│   │   └── helpers.js
│   │
│   └── styles/
│       ├── global-tokens.css
│       └── globals.css
│
├── package.json
├── vite.config.js
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
5. Select the project's build output folder.
6. Pin **AkovoLabs Snap** to the Chrome toolbar.

---

# How to Use

1. Open any webpage.
2. Click the **AkovoLabs Snap** extension icon.
3. Choose one of the available capture modes:
   - Capture Visible Screen
   - Capture Full Page
4. Wait while Snap:
   - Measures the webpage
   - Captures the first viewport as it appears
   - Hides repeated floating navigation for later viewports when Smart mode is enabled
   - Scrolls automatically at a browser-safe capture rate
   - Captures each viewport
   - Stitches and crops images into one output
5. Download the final screenshot or copy it to your clipboard.

### Floating Navigation

Full-page screenshots keep the navigation visible in the first viewport, then hide detected repeated floating bars in subsequent viewports. This makes the image read like a document instead of repeating the same header or footer.

Choose **Settings → Floating Navigation** to select:

- **Smart (top/bottom bars)** — recommended; detects wide edge-anchored navigation layers.
- **Keep floating UI** — captures the page exactly as displayed.
- **Hide all floating UI** — more aggressive fixed/sticky removal.

Elements marked with `data-snap-keep` are never hidden. Some browser-owned UI, closed shadow roots, and cross-origin frames cannot be modified by an extension.

---

# How It Works

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
Generate Final PNG
 │
 ▼
Download / Clipboard
```

---

# Permissions

| Permission | Purpose |
|------------|---------|
| `activeTab` | Access the active tab |
| `tabs` | Capture browser tabs |
| `scripting` | Inject content scripts |
| `storage` | Save extension settings |
| `downloads` | Download screenshots |

Snap uses the user-invoked `activeTab` permission rather than persistent access to every website.

## Capture Limits

- Designed for desktop Chromium browsers (Chrome 120+, Edge, Brave, Opera, and similar browsers).
- Browser-internal pages, PDF viewers, and pages that block script injection cannot be captured as full pages.
- Extremely tall/high-resolution pages may exceed safe browser canvas limits; Snap stops with an error instead of creating a corrupted image.
- Dynamic, infinite-scroll pages can change while being captured. For the most predictable result, wait for the page to finish loading before starting a capture.

---

# Roadmap

## Version 1

- Full-page capture
- Visible viewport capture
- PNG export

## Version 2

- PDF export
- JPEG export
- Keyboard shortcuts
- Capture timer

## Version 3

- Annotation tools
- Blur sensitive information
- Watermark support
- OCR text extraction

## Version 4

- AI page summarization
- Screenshot history
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
