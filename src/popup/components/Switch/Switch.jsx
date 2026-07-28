import { motion } from "framer-motion";
import styles from "./Switch.module.css";

export default function Switch({ checked = false, onChange, label, id }) {
  const handleToggle = () => onChange?.(!checked);

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        className={`${styles.track} ${checked ? styles.on : ""}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <motion.span
          className={styles.thumb}
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
