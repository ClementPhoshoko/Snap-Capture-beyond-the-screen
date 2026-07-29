import { useState, useEffect, useRef } from "react";
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
import styles from "./CaptureProgress.module.css";

const PIPELINE_ITEMS = [
  {
    id: "analyze",
    title: "Analyzing page",
    description: "Measuring height and detecting elements",
    status: "completed",
    icon: ScanLine,
  },
  {
    id: "scroll",
    title: "Scrolling",
    description: "Moving through the page",
    status: "completed",
    icon: Camera,
  },
  {
    id: "capture",
    title: "Capturing sections",
    description: "Capturing section 6 of 16",
    status: "active",
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

const STATS = [
  { label: "Page Height", value: "18,420 px", icon: Maximize2 },
  { label: "Viewport Size", value: "1280 × 800", icon: Monitor },
  { label: "Est. Time", value: "~18 sec", icon: Clock },
];

export default function CaptureProgressScreen({ onClose, onBack, onComplete }) {
  const [progress, setProgress] = useState(34);
  const [pipelineItems, setPipelineItems] = useState(PIPELINE_ITEMS);
  const completedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 6;
        return next >= 100 ? 100 : next;
      });
    }, 800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100 && !completedRef.current) {
      completedRef.current = true;
      setPipelineItems((prev) =>
        prev.map((item) => {
          if (item.status === "active") return { ...item, status: "completed" };
          if (item.status === "pending") return { ...item, status: "active" };
          return item;
        })
      );
      const timeout = setTimeout(() => onComplete?.(), 600);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

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
        <button
          className={styles.headerBtn}
          onClick={onBack}
          aria-label="Go back"
        >
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
            <span className={styles.headerSubtitle}>
              Capture beyond the screen.
            </span>
          </div>
        </div>

        <button
          className={styles.headerBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress Ring */}
      <div className={styles.progressRow}>
        <span className={styles.subtitle}>
          Please don't close this window or switch tabs.
        </span>
        <div className={styles.progressSection}>
          <ProgressRing progress={progress} size={120} strokeWidth={6}>
            <div className={styles.progressMeta}>
              <span className={styles.progressLabel}>Captured</span>
              <span className={styles.progressCount}>6 of 16 sections</span>
            </div>
          </ProgressRing>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>Scrolling and capturing...</span>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <GlassCard>
        <CapturePipeline items={pipelineItems} />
      </GlassCard>

      {/* Stats */}
      <CaptureStats stats={STATS} />
    </motion.div>
  );
}

function GlassCard({ children }) {
  return <div className={styles.glassCard}>{children}</div>;
}
