import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import styles from "./SuccessBanner.module.css";

export default function SuccessBanner({ title = "Capture Complete!", subtitle = "Your full page screenshot is ready." }) {
  return (
    <motion.div
      className={styles.banner}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.iconWrap}>
        <CheckCircle2 size={28} strokeWidth={2} />
      </div>
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </motion.div>
  );
}
