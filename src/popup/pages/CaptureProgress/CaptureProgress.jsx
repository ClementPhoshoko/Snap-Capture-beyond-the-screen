import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  X,
  Maximize2,
  Monitor,
  Clock,
  Camera,
  Scissors,
  Image,
  FileDown,
  ScanLine,
  Layers,
} from "lucide-react";
import ProgressRing from "../../components/ProgressRing";
import CapturePipeline from "../../components/CapturePipeline";
import CaptureStats from "../../components/CaptureStats";
import {
  buildStartCapture,
  buildCancelCapture,
  sendToBackground,
  onMessage,
  offMessage,
} from "../../../shared/messages";
import styles from "./CaptureProgress.module.css";

const PIPELINE_ITEMS = [
  {
    id: "analyze",
    title: "Analyzing page",
    description: "Measuring height and detecting elements",
    status: "pending",
    icon: ScanLine,
  },
  {
    id: "scroll",
    title: "Scrolling",
    description: "Moving through the page",
    status: "pending",
    icon: Camera,
  },
  {
    id: "capture",
    title: "Capturing sections",
    description: "Capturing section 1 of 1",
    status: "pending",
    icon: Layers,
  },
  {
    id: "merge",
    title: "Merging images",
    description: "Stitching all sections together",
    status: "pending",
    icon: Scissors,
  },
  {
    id: "finalize",
    title: "Finalizing",
    description: "Generating final image",
    status: "pending",
    icon: FileDown,
  },
];

const STAGE_ORDER = ["analyze", "scroll", "capture", "merge", "finalize"];

export default function CaptureProgressScreen({ params, onBack, onClose, onComplete }) {
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [pipelineItems, setPipelineItems] = useState(PIPELINE_ITEMS);
  const [stats, setStats] = useState(null);
  const startedRef = useRef(false);

  const cancelAndClose = () => {
    sendToBackground(buildCancelCapture()).catch(() => {});
    onClose?.();
  };

  const handleMessage = useCallback((message, sender) => {
    if (sender?.tab) return;
    switch (message.type) {
      case "SNAP/CAPTURE_PROGRESS": {
        const { stage, percent, currentSection, totalSections, message: msg } = message.payload;

        setProgress(Math.round(percent));

        setPipelineItems((prev) => {
          const stageIdx = STAGE_ORDER.indexOf(stage);
          return prev.map((item, i) => {
            if (i < stageIdx) return { ...item, status: "completed" };
            if (i === stageIdx) {
              const desc =
                stage === "capture" && currentSection != null && totalSections != null
                  ? `Capturing section ${currentSection} of ${totalSections}`
                  : msg || item.description;
              return { ...item, status: "active", description: desc };
            }
            return item;
          });
        });

        if (currentSection != null && totalSections != null) {
          setStats((prev) => ({
            ...prev,
            currentSection,
            totalSections,
          }));
        }
        break;
      }

      case "SNAP/CAPTURE_COMPLETE": {
        onComplete?.(message.payload);
        break;
      }

      case "SNAP/CAPTURE_ERROR": {
        setError(message.payload);
        break;
      }
    }
  }, [onComplete]);

  useEffect(() => {
    onMessage(handleMessage);
    return () => offMessage(handleMessage);
  }, [handleMessage]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const mode = params?.mode ?? "fullpage";
    const settings = params?.settings ?? {};

    console.log("[Snap Popup] Sending START_CAPTURE", { mode, settings });
    sendToBackground(buildStartCapture(mode, settings)).then((res) => {
      console.log("[Snap Popup] START_CAPTURE response:", res);
      if (!res.success) {
        setError({ code: "START_FAILED", message: res.error || "Background did not respond" });
      }
    });
  }, [params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress === 0 && !error) {
        setError({ code: "TIMEOUT", message: "Capture did not start. Check the browser console for details." });
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
          <button className={styles.headerBtn} onClick={cancelAndClose} aria-label="Cancel capture">
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
          <button className={styles.headerBtn} onClick={cancelAndClose} aria-label="Cancel capture">
            <X size={18} />
          </button>
        </div>

        <div className={styles.errorState}>
          <div className={styles.errorIcon}>!</div>
          <h3 className={styles.errorTitle}>Capture failed</h3>
          <p className={styles.errorMessage}>{error.message}</p>
          <motion.button
            className={styles.retryBtn}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={cancelAndClose}
          >
            Try Again
          </motion.button>
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
        <button className={styles.headerBtn} onClick={cancelAndClose} aria-label="Cancel capture">
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
        <button className={styles.headerBtn} onClick={cancelAndClose} aria-label="Cancel capture">
          <X size={18} />
        </button>
      </div>

      <div className={styles.progressRow}>
        <span className={styles.subtitle}>
          Please don't close this window or switch tabs.
        </span>
        <div className={styles.progressSection}>
          <ProgressRing progress={progress} size={120} strokeWidth={6}>
            <div className={styles.progressMeta}>
              <span className={styles.progressLabel}>Progress</span>
              <span className={styles.progressCount}>{progress}%</span>
            </div>
          </ProgressRing>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>
              {progress < 100 ? "Capturing page..." : "Finalizing..."}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.glassCard}>
        <CapturePipeline items={pipelineItems} />
      </div>

      {stats && (
        <CaptureStats
          stats={[
            { label: "Sections Captured", value: `${stats.currentSection ?? 0} of ${stats.totalSections ?? 0}`, icon: Layers },
            { label: "Progress", value: `${progress}%`, icon: Monitor },
            { label: "Status", value: progress < 100 ? "In Progress" : "Complete", icon: Clock },
          ]}
        />
      )}
    </motion.div>
  );
}
