import { motion } from "framer-motion";
import styles from "./ActionCard.module.css";

export default function ActionCard({ icon: Icon, label, onClick, variant = "default" }) {
  return (
    <motion.button
      className={`${styles.card} ${styles[variant]}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.iconWrap}>
        <Icon size={18} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </motion.button>
  );
}
