import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X, SlidersHorizontal, Clock, EyeOff, FileText, Palette, SunMoon, RefreshCw, Key, Check, AlertCircle } from "lucide-react";
import GlassCard from "../../components/GlassCard";
import SettingsRow from "../../components/SettingsRow";
import SettingsSelect from "../../components/SettingsSelect";
import ThemeSelector from "../../components/ThemeSelector";
import AccentPicker from "../../components/AccentPicker";
import { getAIConfig, saveAIConfig } from "../../../shared/storage";
import { GEMINI_ORIGIN } from "../../../shared/constants";
import styles from "./Settings.module.css";

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const qualityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const delayOptions = [
  { value: "0", label: "None" },
  { value: "2", label: "2 seconds" },
  { value: "5", label: "5 seconds" },
  { value: "10", label: "10 seconds" },
];

const floatingOptions = [
  { value: "smart", label: "Hide headers & footers" },
  { value: "none", label: "Keep all floating UI" },
  { value: "all", label: "Hide all floating UI" },
];

const namingOptions = [
  { value: "Snap_{date}-{time}", label: "Snap_date-time" },
  { value: "Snap_{title}-{date}-{time}", label: "Snap_title-date-time" },
  { value: "Snap_{title}", label: "Snap_title" },
  { value: "Snap_{date}", label: "Snap_date" },
];

export default function Settings({ onBack, onClose, theme, accent, onThemeChange, onAccentChange, settings, onSettingsChange, onResetSettings }) {
  const update = (key, value) => onSettingsChange({ ...settings, [key]: value });
  const [aiConfig, setAIConfig] = useState(null);
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState(null);
  const [testStatus, setTestStatus] = useState("idle");
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    getAIConfig().then(setAIConfig).catch(() => {});
  }, []);

  const updateAIKey = (apiKey) => {
    const next = { ...aiConfig, apiKey };
    setAIConfig(next);
  };

  const saveKey = async () => {
    await saveAIConfig(aiConfig);
    setKeyStatus("saved");
    setTimeout(() => setKeyStatus(null), 2000);
  };

  const testConnection = async () => {
    setTestStatus("testing");
    setTestResult(null);
    try {
      const apiKey = aiConfig?.apiKey;
      if (!apiKey) {
        setTestResult({ success: false, error: "No API key saved" });
        setTestStatus("error");
        return;
      }
      try {
        const hasPermission = await chrome.permissions.contains({ origins: [GEMINI_ORIGIN] });
        if (!hasPermission) {
          const granted = await chrome.permissions.request({ origins: [GEMINI_ORIGIN] });
          if (!granted) {
            setTestResult({ success: false, error: "Permission to contact Google's Gemini API was denied. Grant it when prompted." });
            setTestStatus("error");
            return;
          }
        }
      } catch {
        // permissions API unavailable; proceed and let the request surface the error
      }
      const base = "https://generativelanguage.googleapis.com/v1beta";
      const revision = "2026-05-20";
      const modelsToProbe = ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.1-pro-preview"];

      let found = false;
      let probeErrors = [];
      for (const model of modelsToProbe) {
        for (const label of ["interactions", "genContent"]) {
          let url, body, headers;
          if (label === "interactions") {
            url = "interactions";
            headers = { "Api-Revision": revision };
            body = { model, input: { parts: [{ text: "ping" }] }, config: { generation_config: { max_output_tokens: 10 } } };
          } else {
            url = `models/${model}:generateContent`;
            headers = {};
            body = { contents: [{ parts: [{ text: "ping" }] }] };
          }
          const genResp = await fetch(`${base}/${url}?key=${apiKey}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...headers,
            },
            body: JSON.stringify(body),
          });
          if (genResp.ok) {
            setTestResult({ success: true, models: modelsToProbe });
            setTestStatus("success");
            found = true;
            break;
          }
          const errData = await genResp.json().catch(() => ({}));
          const msg = errData.error?.message || `HTTP ${genResp.status}`;
          if (msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("limit") || msg.toLowerCase().includes("rate")) {
            setTestResult({ success: false, error: msg, models: modelsToProbe });
            setTestStatus("error");
            found = true;
            break;
          }
          probeErrors.push(`${model} (${label}): ${msg}`);
        }
        if (found) break;
      }
      if (!found) {
        setTestResult({
          success: false,
          error: `No working model. Errors:\n${probeErrors.slice(0, 6).join("\n")}`,
          models: modelsToProbe,
        });
        setTestStatus("error");
      }
    } catch (err) {
      setTestResult({ success: false, error: err.message });
      setTestStatus("error");
    }
  };

  return (
    <motion.div
      className={styles.screen}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className={styles.content} variants={itemVariants}>
        <div className={styles.header}>
          <button className={styles.headerBtn} onClick={onBack} aria-label="Go back">
            <ArrowLeft size={18} />
          </button>
          <div className={styles.headerCenter}>
            <div className={styles.logo}>
              <img
                src={new URL("../../assets/Snap Logo.png", import.meta.url).href}
                alt="AkovoLabs Snap"
                className={styles.logoImg}
                draggable={false}
              />
            </div>
            <div className={styles.headerText}>
              <span className={styles.headerTitle}>AkovoLabs <span className={styles.accent}>Snap</span></span>
              <span className={styles.headerSubtitle}>Capture beyond the screen.</span>
            </div>
          </div>
          <button className={styles.headerBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
      </motion.div>

      {/* Page Title */}
      <motion.div className={styles.content} variants={itemVariants}>
        <div className={styles.divider} />
        <div className={styles.titleBlock}>
          <h2 className={styles.pageTitle}>Settings</h2>
          <p className={styles.pageSubtitle}>Customize how AkovoLabs Snap works for you.</p>
        </div>
        <div className={styles.divider} />
      </motion.div>

      <div className={styles.scrollArea}>
        {/* Section: Capture */}
        <motion.div className={styles.content} variants={itemVariants}>
          <h3 className={styles.sectionTitle}>Capture</h3>
          <GlassCard className={styles.card}>
            <SettingsRow
              icon={SlidersHorizontal}
              label="Image Quality"
              description="Output compression level"
              control={
                <SettingsSelect
                  options={qualityOptions}
                  value={settings.quality}
                  onChange={(v) => update("quality", v)}
                />
              }
            />
            <div className={styles.divider} />
            <SettingsRow
              icon={EyeOff}
              label="Floating Navigation"
              description="Hide wide fixed or sticky bars at the top and bottom"
              variant="column"
              control={
                <SettingsSelect
                  options={floatingOptions}
                  value={settings.floatingMode}
                  onChange={(v) => update("floatingMode", v)}
                />
              }
            />
            <div className={styles.divider} />
            <SettingsRow
              icon={Clock}
              label="Capture Delay"
              description="Wait time before capture"
              control={
                <SettingsSelect
                  options={delayOptions}
                  value={settings.delay}
                  onChange={(v) => update("delay", v)}
                />
              }
            />
          </GlassCard>
        </motion.div>

        {/* Section: AI Configuration */}
        {aiConfig && (
          <motion.div className={styles.content} variants={itemVariants}>
            <h3 className={styles.sectionTitle}>AI Configuration</h3>
            <GlassCard className={styles.card}>
              <div className={styles.aiRow}>
                <div className={styles.aiRowHeader}>
                  <div className={styles.aiRowLeft}>
                    <div className={styles.aiIconWrap}>
                      <Key size={13} />
                    </div>
                    <span className={styles.aiLabel}>Gemini API Key</span>
                  </div>
                </div>
                <div className={styles.aiInputRow}>
                  <div className={styles.aiInputWrap}>
                    <input
                      type={showKey ? "text" : "password"}
                      className={styles.aiKeyInput}
                      value={aiConfig.apiKey || ""}
                      onChange={(e) => updateAIKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      aria-label="Gemini API Key"
                    />
                    <button
                      className={styles.toggleBtn}
                      onClick={() => setShowKey(!showKey)}
                      aria-label={showKey ? "Hide key" : "Show key"}
                      type="button"
                    >
                      {showKey ? <EyeOff size={14} /> : <Key size={14} />}
                    </button>
                  </div>
                  <motion.button
                    className={styles.saveBtn}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={saveKey}
                    disabled={!aiConfig.apiKey}
                    aria-label="Save API key"
                  >
                    {keyStatus === "saved" ? <Check size={14} /> : "Save"}
                  </motion.button>
                </div>
                <span className={styles.aiDesc}>Your Google AI Studio API key for design extraction</span>
                {keyStatus === "saved" && (
                  <div className={styles.statusMsg}>
                    <Check size={12} /> Key saved successfully
                  </div>
                )}
                <div className={styles.testRow}>
                  <motion.button
                    className={styles.testBtn}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={testConnection}
                    disabled={testStatus === "testing" || !aiConfig.apiKey}
                    aria-label="Test API connection"
                  >
                    {testStatus === "testing" ? "Testing..." : "Test Connection"}
                  </motion.button>
                </div>
                {testResult && (
                  <div className={testResult.success ? styles.testSuccess : styles.testError}>
                    {testResult.success ? (
                      <>
                        <Check size={12} /> API key valid
                        {testResult.models.length > 0 && (
                          <div className={styles.modelList}>
                            Available models: {testResult.models.join(", ")}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className={styles.testErrorText}>
                        <AlertCircle size={12} /> {testResult.error}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Section: Output */}
        <motion.div className={styles.content} variants={itemVariants}>
          <h3 className={styles.sectionTitle}>Output</h3>
          <GlassCard className={styles.card}>
            <SettingsRow
              icon={FileText}
              label="File Naming Pattern"
              description="Template for generated filenames"
              variant="column"
              control={
                <SettingsSelect
                  options={namingOptions}
                  value={settings.namingPattern}
                  onChange={(v) => update("namingPattern", v)}
                  menuZIndex={200}
                />
              }
            />
          </GlassCard>
        </motion.div>

        {/* Section: Appearance */}
        <motion.div className={styles.content} variants={itemVariants}>
          <h3 className={styles.sectionTitle}>Appearance</h3>
          <GlassCard className={styles.card}>
            <SettingsRow
              icon={SunMoon}
              label="Theme"
              description="Choose your preferred appearance"
              variant="column"
              control={
                <ThemeSelector
                  value={theme}
                  onChange={onThemeChange}
                />
              }
            />
            <div className={styles.divider} />
            <SettingsRow
              icon={Palette}
              label="Accent Color"
              description="Primary brand color throughout the UI"
              variant="column"
              control={
                <AccentPicker
                  value={accent}
                  onChange={onAccentChange}
                />
              }
            />
          </GlassCard>
        </motion.div>
      </div>

      {/* Section: Advanced */}
      <motion.div className={styles.content} variants={itemVariants}>
        <h3 className={styles.sectionTitle}>Advanced</h3>
        <GlassCard className={styles.card}>
          <SettingsRow
            icon={RefreshCw}
            label="Reset Settings"
            description="Restore all settings to their defaults"
            control={
              <motion.button
                className={styles.resetBtn}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
                onClick={onResetSettings}
                aria-label="Reset settings"
              >
                Reset
              </motion.button>
            }
          />
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
