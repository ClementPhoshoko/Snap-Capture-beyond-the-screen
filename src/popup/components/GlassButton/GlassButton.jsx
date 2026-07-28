import { motion } from "framer-motion";
import styles from "./GlassButton.module.css";

export default function GlassButton({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  iconPosition = "left",
  disabled = false,
  onClick,
  ...props
}) {
  return (
    <motion.button
      className={`${styles.button} ${styles[variant]} ${className}`}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && iconPosition === "left" && (
        <Icon size={16} className={styles.icon} />
      )}
      <span className={styles.label}>{children}</span>
      {Icon && iconPosition === "right" && (
        <Icon size={16} className={styles.icon} />
      )}
    </motion.button>
  );
}
