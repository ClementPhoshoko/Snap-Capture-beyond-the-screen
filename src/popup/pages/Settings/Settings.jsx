import { motion } from "framer-motion";
import { ArrowLeft, X, SlidersHorizontal, Clock, EyeOff, FileText, Palette, SunMoon, RefreshCw } from "lucide-react";
import GlassCard from "../../components/GlassCard";
import SettingsRow from "../../components/SettingsRow";
import SettingsSelect from "../../components/SettingsSelect";
import ThemeSelector from "../../components/ThemeSelector";
import AccentPicker from "../../components/AccentPicker";
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
