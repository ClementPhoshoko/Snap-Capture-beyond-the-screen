import { motion } from "framer-motion";
import { X, ExternalLink, Download, Clipboard, Camera, Maximize2, Monitor, FileImage, HardDrive, Calendar } from "lucide-react";
import SuccessBanner from "../../components/SuccessBanner";
import ScreenshotPreviewCard from "../../components/ScreenshotPreviewCard";
import MetadataPanel from "../../components/MetadataPanel";
import ActionCard from "../../components/ActionCard";
import styles from "./CaptureComplete.module.css";
import { makeFilename } from "../../../shared/helpers";

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

const defaultResult = {
  imageUrl: null,
  dimensions: "—",
  format: "PNG",
  size: "—",
  capturedAt: new Date().toLocaleString(),
  source: "—",
};

const metadataItems = (result) => [
  { label: "Dimensions", value: result.dimensions, icon: Maximize2 },
  { label: "Format", value: result.format, icon: FileImage },
  { label: "File Size", value: result.size, icon: HardDrive },
  { label: "Captured", value: result.capturedAt, icon: Calendar },
  { label: "Source", value: result.source, icon: Monitor },
];

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/png";
  const bytes = atob(parts[1]);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export default function CaptureCompleteScreen({ onBack, onClose, captureResult }) {
  const imageData = captureResult?.imageData;
  const result = { ...defaultResult, ...captureResult, imageUrl: imageData ?? defaultResult.imageUrl };

  const handleDownload = () => {
    if (!imageData) return;
    chrome.downloads.download({
      url: imageData,
      filename: makeFilename(result.settings?.namingPattern, result.title, result.settings?.format),
      saveAs: result.settings?.location === "ask",
      conflictAction: "uniquify",
    });
  };

  const handleCopy = async () => {
    if (!imageData) return;
    try {
      const blob = dataUrlToBlob(imageData);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    } catch (error) {
      console.error("Image clipboard write failed", error);
      alert("Your browser blocked copying the image. Please use Download instead.");
    }
  };

  const handleOpenTab = () => {
    if (!imageData) return;
    window.open(imageData, "_blank");
  };

  return (
    <motion.div
      className={styles.screen}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.content} variants={itemVariants}>
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
              <span className={styles.headerTitle}>AkovoLabs <span className={styles.accent}>Snap</span></span>
              <span className={styles.headerSubtitle}>Capture beyond the screen.</span>
            </div>
          </div>
          <button className={styles.headerBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
      </motion.div>

      <motion.div className={styles.content} variants={itemVariants}>
        <div className={styles.divider} />
        <SuccessBanner />
        <div className={styles.divider} />
      </motion.div>

      <motion.div className={styles.content} variants={itemVariants}>
        <div className={styles.contentGrid}>
          <ScreenshotPreviewCard imageUrl={result.imageUrl} dimensions={result.dimensions} />
          <MetadataPanel items={metadataItems(result)} />
        </div>
      </motion.div>

      <motion.div className={styles.content} variants={itemVariants}>
        <div className={styles.actions}>
          <ActionCard icon={Download} label="Download" onClick={handleDownload} variant="primary" />
          <ActionCard icon={Clipboard} label="Copy" onClick={handleCopy} />
          <ActionCard icon={Camera} label="New" onClick={onBack} />
        </div>
      </motion.div>

      <motion.div className={styles.content} variants={itemVariants}>
        <div className={styles.footer}>
          <button className={styles.externalBtn} onClick={handleOpenTab}>
            <ExternalLink size={14} />
            <span>Open in New Tab</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
