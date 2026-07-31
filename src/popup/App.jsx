import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CaptureProgress from "./pages/CaptureProgress";
import CaptureComplete from "./pages/CaptureComplete";
import Settings from "./pages/Settings";
import History from "./pages/History";
import ExtractDesignProgress from "./pages/ExtractDesignProgress";
import { DEFAULT_SETTINGS, GEMINI_ORIGIN } from "../shared/constants";
import { getExtractDesignStatus, getSettings, saveSettings, resetSettings, recordCapture } from "../shared/storage";

const accentValues = {
  purple: { primary: "#7c5cfc", light: "#a78bfa", dark: "#5b3fd4" },
  blue: { primary: "#6bc5ff", light: "#9dd5ff", dark: "#4a9fdf" },
  green: { primary: "#06d6a0", light: "#34ebc1", dark: "#05b388" },
  orange: { primary: "#ff9f43", light: "#ffb976", dark: "#e0862e" },
  red: { primary: "#ff6b6b", light: "#ff9999", dark: "#e05555" },
};

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function generateThumbnail(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX_W = 200;
      const scale = Math.min(1, MAX_W / img.naturalWidth);
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.5));
    };
    img.onerror = () => resolve("");
    img.src = dataUrl;
  });
}

function App() {
  const [page, setPage] = useState("home");
  const [prevPage, setPrevPage] = useState(null);
  const [captureParams, setCaptureParams] = useState(null);
  const [captureResult, setCaptureResult] = useState(null);
  const [captureSettings, setCaptureSettings] = useState(DEFAULT_SETTINGS);
  const [extractResult, setExtractResult] = useState(null);

  useEffect(() => {
    getSettings().then(setCaptureSettings).catch(() => {});
    getExtractDesignStatus().then((status) => {
      if (status?.state === "running" || status?.state === "complete") setPage("extract");
    }).catch(() => {});
  }, []);

  const updateCaptureSettings = (next) => {
    setCaptureSettings(next);
    saveSettings(next).catch(() => {});
  };

  useEffect(() => {
    document.documentElement.dataset.theme = captureSettings.theme;
  }, [captureSettings.theme]);

  useEffect(() => {
    const acc = accentValues[captureSettings.accent] || accentValues.purple;
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", acc.primary);
    root.style.setProperty("--brand-primary-light", acc.light);
    root.style.setProperty("--brand-primary-dark", acc.dark);
    root.style.setProperty("--glass-border-focus", hexToRgba(acc.primary, 0.5));
    root.style.setProperty("--text-accent", acc.light);
  }, [captureSettings.accent]);

  const handleExtractDesign = async () => {
    try {
      const hasPermission = await chrome.permissions.contains({ origins: [GEMINI_ORIGIN] });
      if (!hasPermission) {
        const granted = await chrome.permissions.request({ origins: [GEMINI_ORIGIN] });
        if (!granted) {
          alert("Extract Design needs permission to contact Google's Gemini API. Grant it when prompted to enable AI design extraction.");
          return;
        }
      }
    } catch {
      // permissions API unavailable; let the extraction surface any error instead
    }
    setPage("extract");
  };

  const handleExtractComplete = (result) => {
    setExtractResult(result);
  };

  const navMap = {
    home: "home",
    capture: "home",
    complete: "home",
    settings: "settings",
    history: "history",
    extract: "home",
  };

  const handleNavChange = (navId) => {
    if (navId === "settings") setPage("settings");
    else if (navId === "history") setPage("history");
    else setPage("home");
  };

  const constrainHeight = page === "settings" || prevPage === "settings" || page === "history" || prevPage === "history";

  return (
    <Layout navPage={navMap[page]} onNavChange={handleNavChange} constrainHeight={constrainHeight}>
      <AnimatePresence mode="wait" onExitComplete={() => setPrevPage(page)}>
        {page === "home" && (
          <Home
            key="home"
            onStartCapture={(params) => {
              setCaptureParams(params);
              setPage("capture");
            }}
            onExtractDesign={handleExtractDesign}
            onSettingsClick={() => setPage("settings")}
            settings={captureSettings}
            onSettingsChange={updateCaptureSettings}
          />
        )}
        {page === "capture" && (
          <CaptureProgress
            key="capture"
            params={captureParams}
            onBack={() => setPage("home")}
            onClose={() => setPage("home")}
            onComplete={async (result) => {
              setCaptureResult(result);
              const thumbnail = await generateThumbnail(result.imageData);
              recordCapture({ ...result, thumbnail }).catch(() => {});
              setPage("complete");
            }}
          />
        )}
        {page === "complete" && (
          <CaptureComplete
            key="complete"
            captureResult={captureResult}
            onBack={() => setPage("capture")}
            onClose={() => setPage("home")}
          />
        )}
        {page === "settings" && (
          <Settings
            key="settings"
            onBack={() => setPage("home")}
            onClose={() => setPage("home")}
            theme={captureSettings.theme}
            accent={captureSettings.accent}
            onThemeChange={(t) => updateCaptureSettings({ ...captureSettings, theme: t })}
            onAccentChange={(a) => updateCaptureSettings({ ...captureSettings, accent: a })}
            settings={captureSettings}
            onSettingsChange={updateCaptureSettings}
            onResetSettings={async () => updateCaptureSettings(await resetSettings())}
          />
        )}
        {page === "history" && (
          <History
            key="history"
            onClose={() => setPage("home")}
          />
        )}
        {page === "extract" && (
          <ExtractDesignProgress
            key="extract"
            onBack={() => setPage("home")}
            onClose={() => setPage("home")}
            onComplete={handleExtractComplete}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;
