import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CaptureProgress from "./pages/CaptureProgress";
import CaptureComplete from "./pages/CaptureComplete";
import Settings from "./pages/Settings";

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
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("purple");

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
  };

  const handleNavChange = (navId) => {
    if (navId === "settings") setPage("settings");
    else setPage("home");
  };

  return (
    <Layout navPage={navMap[page]} onNavChange={handleNavChange}>
      <AnimatePresence mode="wait">
        {page === "home" && (
          <Home
            key="home"
            onStartCapture={() => setPage("capture")}
            onSettingsClick={() => setPage("settings")}
          />
        )}
        {page === "capture" && (
          <CaptureProgress
            key="capture"
            onBack={() => setPage("home")}
            onClose={() => setPage("home")}
            onComplete={() => setPage("complete")}
          />
        )}
        {page === "complete" && (
          <CaptureComplete
            key="complete"
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
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;
