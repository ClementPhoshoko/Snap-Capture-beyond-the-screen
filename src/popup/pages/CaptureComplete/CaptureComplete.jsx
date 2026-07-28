import { motion } from "framer-motion";
import { X, ExternalLink, Download, Clipboard, Camera, Maximize2, Monitor, FileImage, HardDrive, Calendar } from "lucide-react";
import SuccessBanner from "../../components/SuccessBanner";
import ScreenshotPreviewCard from "../../components/ScreenshotPreviewCard";
import MetadataPanel from "../../components/MetadataPanel";
import ActionCard from "../../components/ActionCard";
import styles from "./CaptureComplete.module.css";

const defaultResult = {
  imageUrl: null,
  dimensions: "18,420 × 1,280 px",
  format: "PNG",
  size: "4.2 MB",
  capturedAt: new Date().toLocaleString(),
  source: "akovo.dev — Getting Started",
};

const metadataItems = (result) => [
  { label: "Dimensions", value: result.dimensions, icon: Maximize2 },
  { label: "Format", value: result.format, icon: FileImage },
  { label: "File Size", value: result.size, icon: HardDrive },
  { label: "Captured", value: result.capturedAt, icon: Calendar },
  { label: "Source", value: result.source, icon: Monitor },
];

export default function CaptureCompleteScreen({ onBack, onClose, captureResult }) {
  const result = { ...defaultResult, ...captureResult };

  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className={styles.header}>
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
            <span className={styles.headerTitle}>AkovoLabs Snap</span>
            <span className={styles.headerSubtitle}>Capture beyond the screen.</span>
          </div>
        </div>
        <button className={styles.headerBtn} onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      {/* Success Banner */}
      <div className={styles.divider} />
      <SuccessBanner />
      <div className={styles.divider} />

      {/* Preview + Metadata */}
      <div className={styles.contentGrid}>
        <ScreenshotPreviewCard imageUrl={result.imageUrl} dimensions={result.dimensions} />
        <MetadataPanel items={metadataItems(result)} />
      </div>

      {/* Action Cards */}
      <div className={styles.actions}>
        <ActionCard icon={Download} label="Download" onClick={() => {}} variant="primary" />
        <ActionCard icon={Clipboard} label="Copy" onClick={() => {}} />
        <ActionCard icon={Camera} label="New" onClick={onBack} />
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.externalBtn} onClick={() => {}}>
          <ExternalLink size={14} />
          <span>Open in New Tab</span>
        </button>
      </div>
    </motion.div>
  );
}
