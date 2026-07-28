import { motion } from "framer-motion";
import styles from "./GlassCard.module.css";

export default function GlassCard({
  children,
  className = "",
  hover = false,
  active = false,
  disabled = false,
  onClick,
  ...props
}) {
  return (
    <motion.div
      className={`${styles.card} ${hover ? styles.hover : ""} ${active ? styles.active : ""} ${disabled ? styles.disabled : ""} ${className}`}
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      onClick={disabled ? undefined : onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
