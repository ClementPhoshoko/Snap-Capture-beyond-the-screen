import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Header from "../../components/Header";
import CurrentTabCard from "../../components/CurrentTabCard";
import CaptureMode from "../../components/CaptureMode";
import QuickSettings from "../../components/QuickSettings";
import CaptureButton from "../../components/CaptureButton";
import ActionCard from "../../components/ActionCard";
import styles from "./Home.module.css";

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

export default function Home({ onStartCapture, onExtractDesign, onSettingsClick, settings, onSettingsChange }) {
  const [captureMode, setCaptureMode] = useState("fullpage");
  const [tab, setTab] = useState(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([activeTab]) => setTab(activeTab)).catch(() => {});
  }, []);

  const handleCapture = () => {
    onStartCapture?.({ mode: captureMode, settings });
  };

  return (
    <motion.div
      className={styles.popup}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.content} variants={itemVariants}>
        <Header onSettingsClick={onSettingsClick} />
      </motion.div>

      <motion.div className={styles.content} variants={itemVariants}>
        <CurrentTabCard
          title={tab?.title}
          url={tab?.url}
          favicon={tab?.favIconUrl}
        />
      </motion.div>

      <motion.div className={styles.content} variants={itemVariants}>
        <CaptureMode value={captureMode} onChange={setCaptureMode} />
      </motion.div>

      <motion.div className={styles.content} variants={itemVariants}>
        <QuickSettings settings={settings} onChange={onSettingsChange} />
      </motion.div>

      <motion.div className={styles.actionRow} variants={itemVariants}>
        <CaptureButton onClick={handleCapture} />
        <ActionCard
          icon={Sparkles}
          label="Extract Design"
          onClick={onExtractDesign}
          variant="primary"
        />
      </motion.div>
    </motion.div>
  );
}
