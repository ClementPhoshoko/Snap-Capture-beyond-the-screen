# AkovoLabs Snap

> **Capture beyond the screen.**

AkovoLabs Snap is a lightweight Chrome Extension that captures **high-quality full-page scrolling screenshots** by automatically scrolling through webpages, capturing each viewport, stitching the images together, and exporting a seamless final image.

Designed for developers, designers, QA engineers, technical writers, marketers, students, and anyone who needs to capture entire webpages with a single click.

---

# Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development Setup](#development-setup)
- [How to Use](#how-to-use)
- [How It Works](#how-it-works)
- [Permissions](#permissions)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

# Features

- Full-page scrolling screenshots
- Visible viewport capture
- Fast image stitching
- High-resolution output
- Automatic download
- Copy image to clipboard
- Dark mode support
- Configurable capture settings
- Smart handling of sticky headers
- Restore original scroll position
- PNG export
- Lightweight and privacy-friendly

---

# Requirements

## Browser

- Google Chrome 120+
- Microsoft Edge (Chromium)
- Brave Browser
- Opera GX
- Any Chromium-based browser

---

## Development

- Node.js 22+
- npm or pnpm
- Git
- Visual Studio Code (recommended)

---

## Chrome APIs

- chrome.tabs
- chrome.scripting
- chrome.storage
- chrome.downloads
- chrome.runtime
- chrome.action

---

# Technology Stack

| Technology | Purpose |
|------------|----------|
| React | Popup UI |
| TypeScript | Type safety |
| Vite | Build tool |
| Chrome Extension Manifest V3 | Extension platform |
| Chrome APIs | Browser integration |
| Canvas API | Image stitching |
| CSS | Styling |

---

# Project Structure

```text
akovolabs-snap/
│
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── assets/
│
├── src/
│   │
│   ├── popup/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── App.tsx
│   │
│   ├── background/
│   │   └── service-worker.ts
│   │
│   ├── content/
│   │   ├── capture.ts
│   │   ├── scroll.ts
│   │   ├── analyzer.ts
│   │   └── helpers.ts
│   │
│   ├── stitching/
│   │   ├── canvas.ts
│   │   ├── crop.ts
│   │   └── merge.ts
│   │
│   ├── services/
│   │   ├── download.ts
│   │   ├── storage.ts
│   │   └── clipboard.ts
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── styles/
│   │
│   └── main.tsx
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# Installation

Clone the repository.

```bash
git clone https://github.com/yourusername/akovolabs-snap.git
```

Move into the project.

```bash
cd akovolabs-snap
```

Install dependencies.

```bash
npm install
```

Build the extension.

```bash
npm run build
```

---

# Development Setup

Run the development server.

```bash
npm run dev
```

Build production files.

```bash
npm run build
```

Preview production build.

```bash
npm run preview
```

---

# How to Use

## 1. Load the Extension

Open Chrome.

Navigate to

```
chrome://extensions
```

Enable **Developer Mode**.

Select

```
Load unpacked
```

Choose the generated extension folder.

---

## 2. Open Any Website

Navigate to the webpage you want to capture.

---

## 3. Launch AkovoLabs Snap

Click the extension icon in the Chrome toolbar.

---

## 4. Choose Capture Mode

- Capture Visible Screen
- Capture Full Page

---

## 5. Capture Process

AkovoLabs Snap will automatically:

- Measure the page
- Scroll the page
- Capture every viewport
- Stitch images together
- Restore the original scroll position

---

## 6. Export

Choose to:

- Download PNG
- Copy to Clipboard

---

# How It Works

```text
User
 │
 ▼
Popup
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
Capture Viewports
 │
 ▼
Merge Images
 │
 ▼
Crop Overlap
 │
 ▼
Generate PNG
 │
 ▼
Download
```

---

# Permissions

| Permission | Purpose |
|------------|----------|
| tabs | Capture current tab |
| activeTab | Access active page |
| scripting | Inject content scripts |
| storage | Save user settings |
| downloads | Download screenshots |
| host_permissions | Capture webpage contents |

---

# Roadmap

## Version 1

- Full page screenshots
- Visible screenshots
- PNG export

---

## Version 2

- JPEG export
- PDF export
- Copy to clipboard
- Keyboard shortcuts

---

## Version 3

- Annotations
- Blur sensitive information
- Watermarks
- OCR

---

## Version 4

- AI page summarization
- Cloud synchronization
- Screenshot history
- Team sharing

---

# Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

# License

MIT License

---

# AkovoLabs

**AkovoLabs Snap**

> **Capture beyond the screen.**

Building modern tools that make everyday workflows faster, simpler, and more productive.
