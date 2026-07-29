import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CaptureProgress from "./pages/CaptureProgress";
import CaptureComplete from "./pages/CaptureComplete";
import Settings from "./pages/Settings";
import History from "./pages/History";
import { DEFAULT_SETTINGS } from "../shared/constants";
import { getSettings, saveSettings, resetSettings, recordCapture } from "../shared/storage";

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

function App() {
  const [page, setPage] = useState("home");
  const [prevPage, setPrevPage] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("purple");
  const [captureParams, setCaptureParams] = useState(null);
  const [captureResult, setCaptureResult] = useState(null);
  const [captureSettings, setCaptureSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    getSettings().then(setCaptureSettings).catch(() => {});
  }, []);

  const updateCaptureSettings = (next) => {
    setCaptureSettings(next);
    saveSettings(next).catch(() => {});
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const acc = accentValues[accent] || accentValues.purple;
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", acc.primary);
    root.style.setProperty("--brand-primary-light", acc.light);
    root.style.setProperty("--brand-primary-dark", acc.dark);
    root.style.setProperty("--glass-border-focus", hexToRgba(acc.primary, 0.5));
    root.style.setProperty("--text-accent", acc.light);
  }, [accent]);

  const navMap = {
    home: "home",
    capture: "home",
    complete: "home",
    settings: "settings",
    history: "history",
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
            onComplete={(result) => {
              setCaptureResult(result);
              recordCapture(result).catch(() => {});
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
            theme={theme}
            accent={accent}
            onThemeChange={setTheme}
            onAccentChange={setAccent}
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
      </AnimatePresence>
    </Layout>
  );
}

export default App;
