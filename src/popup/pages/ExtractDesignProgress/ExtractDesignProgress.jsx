import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  X,
  Camera,
  Code,
  Palette,
  Variable,
  FileType,
  Image,
  Layers,
  Layout,
  Move,
  Package,
  Zap,
  Sparkles,
  FileDown,
  ScanLine,
  Check,
  Download,
  Clipboard,
} from "lucide-react";
import ProgressRing from "../../components/ProgressRing";
import CapturePipeline from "../../components/CapturePipeline";
import CaptureStats from "../../components/CaptureStats";
import ActionCard from "../../components/ActionCard";
import {
  sendToBackground,
  onMessage,
  offMessage,
} from "../../../shared/messages";
import { clearExtractDesignStatus } from "../../../shared/storage";
import { getDesignExtractArchive } from "../../../shared/designArchive";
import styles from "../CaptureProgress/CaptureProgress.module.css";

const PIPELINE_ITEMS = [
  { id: "capture", title: "Capturing page", description: "Taking full-page screenshot", status: "pending", icon: Camera },
  { id: "dom", title: "Analyzing DOM", description: "Extracting page structure", status: "pending", icon: Code },
  { id: "styles", title: "Collecting styles", description: "Gathering computed styles", status: "pending", icon: Palette },
  { id: "css-vars", title: "CSS Variables", description: "Extracting design tokens", status: "pending", icon: Variable },
  { id: "fonts", title: "Fonts", description: "Identifying typography", status: "pending", icon: FileType },
  { id: "images", title: "Images", description: "Collecting media assets", status: "pending", icon: Image },
  { id: "svgs", title: "SVGs", description: "Extracting vector graphics", status: "pending", icon: Layers },
  { id: "icons", title: "Icons", description: "Collecting icon assets", status: "pending", icon: Sparkles },
  { id: "layout", title: "Layout analysis", description: "Detecting page layout", status: "pending", icon: Layout },
  { id: "spacing", title: "Spacing", description: "Measuring gaps and alignment", status: "pending", icon: Move },
  { id: "assets", title: "Assets", description: "Organizing collected assets", status: "pending", icon: Package },
  { id: "payload", title: "AI Payload", description: "Preparing data for Gemini", status: "pending", icon: Zap },
  { id: "generate", title: "Generating", description: "AI reconstructing project", status: "pending", icon: Sparkles },
  { id: "verify", title: "Verifying", description: "Checking visual accuracy", status: "pending", icon: ScanLine },
  { id: "improve", title: "Improving", description: "Fixing discrepancies", status: "pending", icon: Code },
  { id: "export", title: "Exporting", description: "Packaging project files", status: "pending", icon: FileDown },
];

const STAGE_ORDER = PIPELINE_ITEMS.map((i) => i.id);

export default function ExtractDesignProgress({ onBack, onClose, onComplete }) {
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(null);
  const [progress, setProgress] = useState(0);
  const [pipelineItems, setPipelineItems] = useState(PIPELINE_ITEMS);
  const [stats, setStats] = useState(null);
  const startedRef = useRef(false);

  const handleClose = useCallback(() => {
    if (completed || error) {
      clearExtractDesignStatus().catch(() => {});
    }
    onClose?.();
  }, [completed, error, onClose]);

  const handleDownloadZip = useCallback(async () => {
    if (completed?.zipDataUrl) {
      chrome.downloads.download({
        url: completed.zipDataUrl,
        filename: `${completed.projectName || "extracted-design"}.zip`,
        saveAs: true,
      });
      return;
    }
    if (!completed?.archiveId) return;
    const blob = await getDesignExtractArchive(completed.archiveId);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url,
      filename: `${completed.projectName || "extracted-design"}.zip`,
      saveAs: true,
    });
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, [completed]);

  const handleCopyZip = useCallback(async () => {
    try {
      let blob = null;
      if (completed?.archiveId) {
        blob = await getDesignExtractArchive(completed.archiveId);
      }
      if (!blob && completed?.zipDataUrl) {
        const response = await fetch(completed.zipDataUrl);
        blob = await response.blob();
      }
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ "application/zip": blob }),
      ]);
    } catch (error) {
      console.error("ZIP clipboard write failed", error);
      alert("Your browser blocked copying the ZIP. Please use Download instead.");
    }
  }, [completed]);

  const applyProgress = useCallback(({ stage, percent, currentSection, totalSections, message: msg }) => {
    setProgress(Math.round(percent));
    setPipelineItems((prev) => {
      const stageIdx = STAGE_ORDER.indexOf(stage);
      return prev.map((item, i) => {
        if (i < stageIdx) return { ...item, status: "completed" };
        if (i === stageIdx) {
          const desc = msg || item.description;
          return { ...item, status: "active", description: desc };
        }
        return item;
      });
    });
    if (currentSection != null && totalSections != null) {
      setStats((prev) => ({ ...prev, currentSection, totalSections }));
    }
  }, []);

  const handleMessage = useCallback((message) => {
    switch (message.type) {
      case "SNAP/EXTRACT_DESIGN_PROGRESS": {
        applyProgress(message.payload);
        break;
      }
      case "SNAP/EXTRACT_DESIGN_COMPLETE": {
        onComplete?.(message.payload);
        setCompleted(message.payload);
        break;
      }
      case "SNAP/EXTRACT_DESIGN_ERROR": {
        setError(message.payload);
        break;
      }
    }
  }, [applyProgress, onComplete]);

  useEffect(() => {
    onMessage(handleMessage);
    return () => offMessage(handleMessage);
  }, [handleMessage]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    sendToBackground({ type: "SNAP/EXTRACT_DESIGN_STATUS", payload: {} }).then((statusRes) => {
      const status = statusRes.data;
      if (status?.state === "running" && status.payload) {
        applyProgress(status.payload);
        return null;
      }
      if (status?.state === "complete" && status.result) {
        setProgress(100);
        setPipelineItems((prev) => prev.map((item) => ({ ...item, status: "completed" })));
        setCompleted(status.result);
        return null;
      }
      if (status?.state === "error" && status.error) {
        setError(status.error);
        return null;
      }
      return sendToBackground({ type: "SNAP/EXTRACT_DESIGN", payload: {} });
    }).then((res) => {
      if (!res) return;
      if (!res.success) {
        setError({ code: "START_FAILED", message: res.error || "Extraction did not start" });
      } else if (res.data) {
        setCompleted(res.data);
      }
    });
  }, [applyProgress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress === 0 && !error) {
        setError({ code: "TIMEOUT", message: "Extraction did not start. Check the browser console for details." });
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [progress, error]);

  if (error) {
    return (
      <motion.div
        className={styles.screen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className={styles.header}>
          <button className={styles.headerBtn} onClick={handleClose} aria-label="Close">
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
              <span className={styles.headerSubtitle}>Extract Design</span>
            </div>
          </div>
          <button className={styles.headerBtn} onClick={handleClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>!</div>
          <h3 className={styles.errorTitle}>Extraction failed</h3>
          <p className={styles.errorMessage}>{error.message}</p>
          <motion.button
            className={styles.retryBtn}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleClose}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (completed) {
    return (
      <motion.div
        className={styles.screen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className={styles.header}>
          <button className={styles.headerBtn} onClick={handleClose} aria-label="Close">
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
              <span className={styles.headerSubtitle}>Extract Design</span>
            </div>
          </div>
          <button className={styles.headerBtn} onClick={handleClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className={styles.completeState}>
          <div className={styles.completeIcon}>
            <Check size={32} />
          </div>
          <h3 className={styles.completeTitle}>Extraction Complete</h3>
          <p className={styles.completeMessage}>
            Design extracted with {completed.similarityScore || 0}% similarity
          </p>
          <div className={styles.completeStats}>
            <div className={styles.completeStat}>
              <span className={styles.completeStatValue}>{completed.extractionData?.domElements || 0}</span>
              <span className={styles.completeStatLabel}>Elements</span>
            </div>
            <div className={styles.completeStat}>
              <span className={styles.completeStatValue}>{completed.extractionData?.stylesCollected || 0}</span>
              <span className={styles.completeStatLabel}>Styles</span>
            </div>
            <div className={styles.completeStat}>
              <span className={styles.completeStatValue}>{completed.files || 0}</span>
              <span className={styles.completeStatLabel}>Files</span>
            </div>
          </div>
          <div className={styles.completeActions}>
            <ActionCard icon={Download} label="Download" onClick={handleDownloadZip} />
            <ActionCard icon={Clipboard} label="Copy" onClick={handleCopyZip} />
            <ActionCard icon={X} label="Close" onClick={handleClose} />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.header}>
        <button className={styles.headerBtn} onClick={onClose} aria-label="Cancel">
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
            <span className={styles.headerSubtitle}>Extract Design</span>
          </div>
        </div>
        <button className={styles.headerBtn} onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className={styles.progressRow}>
        <span className={styles.subtitle}>
          AI is analyzing and reconstructing the page.
        </span>
        <div className={styles.progressSection}>
          <ProgressRing progress={progress} size={120} strokeWidth={6}>
            <div className={styles.progressMeta}>
              <span className={styles.progressLabel}>Progress</span>
              <span className={styles.progressCount}>{progress}%</span>
            </div>
          </ProgressRing>
        </div>
      </div>

      <div className={styles.glassCard}>
        <CapturePipeline items={pipelineItems} />
      </div>

      {stats && (
        <CaptureStats
          stats={[
            { label: "Sections", value: `${stats.currentSection ?? 0} of ${stats.totalSections ?? 0}`, icon: Layers },
            { label: "Progress", value: `${progress}%`, icon: Camera },
            { label: "Status", value: progress < 100 ? "In Progress" : "Complete", icon: Sparkles },
          ]}
        />
      )}
    </motion.div>
  );
}
