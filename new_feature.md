# Build Specification: AkovoLabs Snap AI — Extract Design

## Objective

Build a **new premium feature** called **Extract Design** inside the existing AkovoLabs Snap Chrome Extension.

This is **not** a redesign of the application. It must integrate seamlessly into the existing architecture, design system, components, animations, overlays, typography, spacing, and code conventions.

Everything should feel like it has always been part of AkovoLabs Snap.

---

# Core Goal

Allow a user to open any webpage and press **Extract Design**.

The system should intelligently analyze the page, reconstruct it into clean production-ready code, verify visual accuracy against the original page, automatically improve discrepancies, and finally export a downloadable project.

This feature should prioritize **high visual fidelity** rather than attempting to recover the website's original source code.

Target visual similarity:

> **90–98%**

---

# UI Integration

Do NOT redesign anything.

Reuse every existing component whenever possible.

The feature should simply extend the current application.

---

## Home Page

Keep all current cards.

Add one additional card:

```
Extract Design
```

Description:

```
AI-powered design extraction.
Reconstruct webpages into production-ready code.
```

Use the same sizing, hover effects, typography, spacing and animation as every existing action card.

---

# Settings Page

Add a new section.

```
AI Configuration
```

Contents:

Gemini API Key

```
[__________________________]

Save
```

Requirements

* securely stored using chrome.storage.local
* masked input
* reveal/hide toggle
* validation
* connection test
* clear error messages
* never hardcode API keys
* reusable API service

---

# Overlay

Current capture overlay stays unchanged.

When **Extract Design** is active:

Keep every existing animation.

Only enhance the corners.

Instead of normal accent colors,

the four overlay corners should display an animated AI gradient.

Example feeling:

* soft purple
* cyan
* blue
* green

Glow should remain subtle.

The overlay should immediately communicate

> "AI Analysis Active"

without changing the overall design language.

Everything else remains identical.

---

# New Pipeline

Implement the following architecture.

```
User

↓

Extract Design

↓

Capture full webpage

↓

Extract DOM

↓

Extract Computed Styles

↓

Extract CSS Variables

↓

Extract Fonts

↓

Extract Images

↓

Extract SVGs

↓

Extract Icons

↓

Extract Layout

↓

Extract Spacing

↓

Collect Assets

↓

Generate AI Payload

↓

Gemini

↓

Generate React Project

↓

Render Generated Project

↓

Visual Comparison

↓

Fix Differences

↓

Repeat Until Threshold

↓

Export Project
```

---

# Phase 1

## Capture

Reuse existing scrolling engine.

Do not duplicate logic.

Reuse current:

* scrolling
* stitching
* viewport management
* progress
* cancellation

Output:

```
full-page screenshot
```

---

# Phase 2

## DOM Extraction

Create a DOM extractor.

Collect:

* hierarchy
* semantic tags
* ids
* classes
* text
* links
* buttons
* forms
* inputs
* lists
* tables
* videos
* canvases
* images
* iframes (metadata only where cross-origin prevents access)

Store structure as JSON.

---

# Phase 3

## Computed Styles

For every visible element gather computed values such as:

* width
* height
* margin
* padding
* gap
* display
* flex
* grid
* alignment
* positioning
* overflow
* z-index
* font family
* font size
* font weight
* letter spacing
* line height
* colors
* opacity
* transforms
* transitions
* animations
* border
* border radius
* box shadow
* filters
* background
* gradients

Avoid collecting unnecessary browser defaults to reduce payload size.

---

# Phase 4

## CSS Variables

Extract

```
:root
```

variables

including

* colors
* spacing
* shadows
* typography
* radii

Preserve names when available.

---

# Phase 5

## Assets

Collect every asset.

Images

SVG

Icons

Logos

Background images

Favicons

Fonts

Convert relative URLs into absolute URLs.

Download assets where licensing and browser access allow; otherwise preserve URLs with clear metadata.

Deduplicate identical assets.

---

# Phase 6

## Layout Analysis

Determine

* containers
* grids
* flex layouts
* sections
* navigation
* hero
* cards
* footer
* sidebar
* responsive groupings

Infer reusable components.

---

# Phase 7

## AI Payload

Send structured JSON.

Never send only screenshots.

Payload should resemble:

```json
{
  "dom": {},
  "computedStyles": {},
  "cssVariables": {},
  "fonts": {},
  "images": [],
  "icons": [],
  "svgs": [],
  "layout": {},
  "spacing": {},
  "assets": {},
  "screenshot": "..."
}
```

Compress large payloads if necessary and chunk them when they exceed model limits.

---

# Phase 8

## AI Reconstruction

Gemini should generate:

```
React

HTML

CSS

Assets

Project Structure
```

Requirements

clean code

well organized

components

reusable

responsive

accessible

no inline styles unless unavoidable

modern CSS

clear naming

production quality

Do not claim to recreate proprietary source code; generate an equivalent implementation.

---

# Phase 9

## Visual Verification

This is mandatory.

Do not stop after first generation.

Instead

Render the generated page.

Take a screenshot.

Compare against original screenshot.

Measure

* spacing
* alignment
* colors
* typography
* sizing
* image placement
* missing sections
* overflow
* clipping

Produce a structured diff.

---

# Phase 10

## Automatic Improvement Loop

If similarity score is below threshold:

```
Original

↓

Generated

↓

Visual Diff

↓

Gemini Fix

↓

Render Again

↓

Compare Again
```

Repeat until

```
95%+

```

or

```
maximum iteration count
```

Display progress during iterations.

---

# Export

Allow exporting:

* React project
* HTML/CSS project

Package into a ZIP with a clear folder structure.

Include an extraction report describing unsupported or approximated features.

---

# Code Architecture

Create isolated modules.

Suggested services:

```
captureService

domExtractor

styleExtractor

layoutAnalyzer

assetCollector

payloadBuilder

geminiService

visualVerifier

diffEngine

projectExporter
```

Each module should have one clear responsibility.

Avoid tight coupling.

---

# Performance

Requirements

* non-blocking UI
* background processing where appropriate
* progress updates
* cancellation support
* memory efficient
* chunk large datasets
* cache repeated assets
* graceful failure handling

---

# UX

Show progress such as:

```
Capturing page...

Analyzing DOM...

Collecting styles...

Downloading assets...

Preparing AI payload...

Generating project...

Verifying output...

Applying improvements...

Packaging export...
```

Every stage should provide visible feedback.

---

# Error Handling

Gracefully handle:

* missing Gemini key
* invalid Gemini key
* network failures
* model rate limits
* inaccessible assets
* CORS restrictions
* cross-origin iframes
* oversized pages
* unsupported browser APIs

Provide actionable messages without crashing the extension.

---

# Constraints

* Do not modify existing Snap functionality.
* Preserve current UI, animations, theme, and design tokens.
* Add this as a separate feature.
* Reuse existing infrastructure wherever possible.
* Write maintainable, modular, documented code.
* Keep future support for additional AI providers by abstracting the AI service behind a provider interface rather than hardcoding Gemini throughout the feature.
