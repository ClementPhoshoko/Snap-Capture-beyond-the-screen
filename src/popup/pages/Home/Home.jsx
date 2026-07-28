import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import CurrentTabCard from "../../components/CurrentTabCard";
import CaptureMode from "../../components/CaptureMode";
import QuickSettings from "../../components/QuickSettings";
import CaptureButton from "../../components/CaptureButton";
import BottomNav from "../../components/BottomNav";
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

export default function Home() {
  const [captureMode, setCaptureMode] = useState("fullpage");
  const [nav, setNav] = useState("home");
  const [settings, setSettings] = useState({
    format: "png",
    location: "downloads",
    autoDownload: true,
  });

  const handleCapture = () => {
    console.log("Capture:", { captureMode, settings });
  };

  return (
    <motion.div
      className={styles.popup}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.content} variants={itemVariants}>
        <Header />
      </motion.div>

      <motion.div className={styles.content} variants={itemVariants}>
        <CurrentTabCard
          title="Getting Started — AkovoLabs"
          url="https://akovolabs.dev/docs"
        />
      </motion.div>

      <motion.div className={styles.content} variants={itemVariants}>
        <CaptureMode value={captureMode} onChange={setCaptureMode} />
      </motion.div>

      <motion.div className={styles.content} variants={itemVariants}>
        <QuickSettings settings={settings} onChange={setSettings} />
      </motion.div>

      <motion.div className={styles.content} variants={itemVariants}>
        <CaptureButton onClick={handleCapture} />
      </motion.div>

      <BottomNav active={nav} onChange={setNav} />
    </motion.div>
  );
}
