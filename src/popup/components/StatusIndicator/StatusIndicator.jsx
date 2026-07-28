import { motion } from "framer-motion";
import { Check, Loader2, Circle, X } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import styles from "./StatusIndicator.module.css";

const iconComponents = {
  completed: Check,
  active: Loader2,
  pending: Circle,
  error: X,
};

export default function StatusIndicator({ status = "pending", size = 18 }) {
  const reducedMotion = useReducedMotion();
  const Icon = iconComponents[status] || Circle;

  return (
    <div
      className={`${styles.indicator} ${styles[status]}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label={status}
    >
      {status === "active" && !reducedMotion && (
        <div className={styles.glow} />
      )}
      {status === "completed" ? (
        <motion.div
          className={styles.iconWrapper}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.5 }}
        >
          <Icon size={size * 0.6} strokeWidth={3} />
        </motion.div>
      ) : status === "active" ? (
        <motion.div
          className={styles.iconWrapper}
          animate={{ rotate: 360 }}
          transition={{
            duration: reducedMotion ? 0 : 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Icon size={size * 0.6} strokeWidth={2.5} />
        </motion.div>
      ) : (
        <div className={styles.iconWrapper}>
          <Icon size={size * 0.55} strokeWidth={status === "error" ? 2.5 : 2} />
        </div>
      )}
    </div>
  );
}
