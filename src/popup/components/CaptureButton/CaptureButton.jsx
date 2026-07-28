import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import styles from "./CaptureButton.module.css";

export default function CaptureButton({ onClick, disabled, label = "Start Capture" }) {
  return (
    <motion.button
      className={styles.btn}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -2, boxShadow: "0 6px 24px rgba(124, 92, 252, 0.35)" } : undefined}
      whileTap={!disabled ? { scale: 0.97, y: 0 } : undefined}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      <Camera size={15} className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </motion.button>
  );
}
