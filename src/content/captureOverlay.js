const OVERLAY_ID = "snap-capture-overlay";
const STYLE_ID = "snap-overlay-styles";

const MODES = {
  screenshot: {
    status: "Preparing capture",
    subtext: "Capturing visible area",
  },
  fullpage: {
    status: "Preparing capture",
    subtext: "Measuring page dimensions",
  },
};

let overlayEl = null;
let styleEl = null;
let hideTimer = null;

function getOverlayCSS() {
  return `
#${OVERLAY_ID} {
  --brand-primary: #7c5cfc;
  --brand-primary-light: #a78bfa;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.68);
  --text-tertiary: rgba(255, 255, 255, 0.42);
  --glass-blur-xl: 40px;
  --glass-bg: rgba(15, 12, 41, 0.82);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-border-strong: rgba(255, 255, 255, 0.22);
  --font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-size-sm: 13px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --duration-slow: 350ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);

  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out);
  pointer-events: auto;
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  color-scheme: dark;
}

#${OVERLAY_ID}.snap-visible {
  opacity: 1;
}

#${OVERLAY_ID}.snap-hiding {
  opacity: 0;
  transition: opacity 150ms var(--ease-out);
}

.snap-overlay-bg {
  position: absolute;
  inset: 0;
  background: var(--glass-bg);
}

.snap-corners {
  position: absolute;
  inset: var(--space-4);
  pointer-events: none;
}

.snap-corner {
  position: absolute;
  width: 36px;
  height: 36px;
  border-color: var(--glass-border-strong);
  border-style: solid;
  border-width: 0;
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out), border-color 1.2s ease;
}

.snap-visible .snap-corner {
  opacity: 1;
}

.snap-visible.snap-hiding .snap-corner {
  border-color: var(--brand-primary-light) !important;
  opacity: 0;
  transition: opacity 200ms var(--ease-out), border-color 150ms ease;
}

.snap-corner-tl {
  top: 0;
  left: 0;
  border-top-width: 3px;
  border-left-width: 3px;
  transition-delay: 0s;
}

.snap-corner-tl.animate {
  animation: cornerGlow 2.4s ease-in-out infinite;
  animation-delay: 0s;
}

.snap-corner-tr {
  top: 0;
  right: 0;
  border-top-width: 3px;
  border-right-width: 3px;
  transition-delay: 0.1s;
}

.snap-corner-tr.animate {
  animation: cornerGlow 2.4s ease-in-out infinite;
  animation-delay: 0.6s;
}

.snap-corner-br {
  bottom: 0;
  right: 0;
  border-bottom-width: 3px;
  border-right-width: 3px;
  transition-delay: 0.2s;
}

.snap-corner-br.animate {
  animation: cornerGlow 2.4s ease-in-out infinite;
  animation-delay: 1.2s;
}

.snap-corner-bl {
  bottom: 0;
  left: 0;
  border-bottom-width: 3px;
  border-left-width: 3px;
  transition-delay: 0.3s;
}

.snap-corner-bl.animate {
  animation: cornerGlow 2.4s ease-in-out infinite;
  animation-delay: 1.8s;
}

@keyframes cornerGlow {
  0%, 100% { border-color: var(--glass-border); }
  40% { border-color: var(--brand-primary); }
  70% { border-color: var(--brand-primary-light); }
}

.snap-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  text-align: center;
  pointer-events: none;
}

.snap-status {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
}

.snap-subtext {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  line-height: var(--line-height-normal);
}

.snap-dots {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.snap-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-primary-light);
  opacity: 0.15;
  animation: dotPulse 1.4s ease-in-out infinite;
}

.snap-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.snap-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%, 80%, 100% { opacity: 0.15; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-4px); }
}

.snap-flash {
  position: absolute;
  inset: 0;
  background: #ffffff;
  opacity: 0;
  pointer-events: none;
  animation: flashFade 300ms ease-out;
}

@keyframes flashFade {
  0% { opacity: 0.5; }
  100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  #${OVERLAY_ID},
  #${OVERLAY_ID} .snap-corner,
  #${OVERLAY_ID} .snap-dot,
  #${OVERLAY_ID} .snap-flash,
  #${OVERLAY_ID} .snap-corner.animate {
    animation: none !important;
    transition-duration: 10ms !important;
    transition-delay: 0s !important;
  }

  #${OVERLAY_ID} .snap-corner {
    opacity: 1;
  }

  #${OVERLAY_ID} .snap-dot {
    opacity: 0.5;
    transform: none !important;
  }
}
`;
}

export function showCaptureOverlay({ mode = "screenshot" } = {}) {
  if (overlayEl) return;

  const config = MODES[mode] || MODES.screenshot;

  styleEl = document.createElement("style");
  styleEl.id = STYLE_ID;
  styleEl.textContent = getOverlayCSS();
  document.head.appendChild(styleEl);

  overlayEl = document.createElement("div");
  overlayEl.id = OVERLAY_ID;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  overlayEl.innerHTML = `
    <div class="snap-overlay-bg"></div>
    <div class="snap-corners">
      <div class="snap-corner snap-corner-tl${prefersReducedMotion ? " animate" : ""}"></div>
      <div class="snap-corner snap-corner-tr${prefersReducedMotion ? " animate" : ""}"></div>
      <div class="snap-corner snap-corner-br${prefersReducedMotion ? " animate" : ""}"></div>
      <div class="snap-corner snap-corner-bl${prefersReducedMotion ? " animate" : ""}"></div>
    </div>
    <div class="snap-content">
      <p class="snap-status">${config.status}</p>
      <p class="snap-subtext">${config.subtext}</p>
      <div class="snap-dots">
        <span class="snap-dot"></span>
        <span class="snap-dot"></span>
        <span class="snap-dot"></span>
      </div>
    </div>
  `;

  document.body.appendChild(overlayEl);

  requestAnimationFrame(() => {
    overlayEl.classList.add("snap-visible");

    if (!prefersReducedMotion) {
      requestAnimationFrame(() => {
        const corners = overlayEl.querySelectorAll(".snap-corner");
        corners.forEach((c) => c.classList.add("animate"));
      });
    }
  });

  if (mode === "screenshot") {
    hideTimer = setTimeout(() => {
      hideCaptureOverlay();
    }, 2000);
  }
}

export function hideCaptureOverlay() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }

  if (!overlayEl) return;

  const flash = document.createElement("div");
  flash.className = "snap-flash";
  overlayEl.appendChild(flash);

  overlayEl.classList.remove("snap-visible");
  overlayEl.classList.add("snap-hiding");

  setTimeout(() => {
    if (overlayEl && overlayEl.parentNode) {
      overlayEl.parentNode.removeChild(overlayEl);
    }
    if (styleEl && styleEl.parentNode) {
      styleEl.parentNode.removeChild(styleEl);
    }
    overlayEl = null;
    styleEl = null;
  }, 400);
}
