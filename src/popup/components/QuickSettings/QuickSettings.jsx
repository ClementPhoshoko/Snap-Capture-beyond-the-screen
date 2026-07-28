import { Image, Download, Zap } from "lucide-react";
import GlassCard from "../GlassCard";
import Dropdown from "../Dropdown";
import Switch from "../Switch";
import styles from "./QuickSettings.module.css";

const formatOptions = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
];

const locationOptions = [
  { value: "downloads", label: "Downloads" },
  { value: "desktop", label: "Desktop" },
  { value: "ask", label: "Ask each time" },
];

export default function QuickSettings({ settings, onChange }) {
  const { format, location, autoDownload } = settings;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Quick Settings</h2>
      <GlassCard className={styles.card}>
        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <div className={styles.rowIcon}>
              <Image size={14} />
            </div>
            <span className={styles.rowLabel}>Image Format</span>
          </div>
          <Dropdown
            options={formatOptions}
            value={format}
            onChange={(v) => onChange({ ...settings, format: v })}
            icon={Image}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <div className={styles.rowIcon}>
              <Download size={14} />
            </div>
            <span className={styles.rowLabel}>Save Location</span>
          </div>
          <Dropdown
            options={locationOptions}
            value={location}
            onChange={(v) => onChange({ ...settings, location: v })}
            icon={Download}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <div className={styles.rowIcon}>
              <Zap size={14} />
            </div>
            <span className={styles.rowLabel}>Auto Download</span>
          </div>
          <Switch
            checked={autoDownload}
            onChange={(v) => onChange({ ...settings, autoDownload: v })}
            id="auto-download"
          />
        </div>
      </GlassCard>
    </section>
  );
}
