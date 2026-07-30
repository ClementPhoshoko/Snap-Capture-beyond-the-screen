import { motion } from "framer-motion";
import styles from "./ActionCard.module.css";

export default function ActionCard({ icon: Icon, label, onClick, variant = "default" }) {
  const isPrimary = variant === "primary";
  return (
    <motion.button
      className={`${styles.card} ${styles[variant]}`}
      onClick={onClick}
      whileHover={isPrimary ? { y: -2, boxShadow: "0 6px 24px rgba(124, 92, 252, 0.35)" } : { scale: 1.02 }}
      whileTap={isPrimary ? { scale: 0.97, y: 0 } : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.iconWrap}>
        <Icon size={isPrimary ? 15 : 18} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </motion.button>
  );
}
