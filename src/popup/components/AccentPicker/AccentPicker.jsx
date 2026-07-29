import { motion } from "framer-motion";
import styles from "./AccentPicker.module.css";

const accentColors = [
  { id: "purple", color: "#7c5cfc" },
  { id: "blue", color: "#6bc5ff" },
  { id: "green", color: "#06d6a0" },
  { id: "orange", color: "#ff9f43" },
  { id: "red", color: "#ff6b6b" },
];

export default function AccentPicker({ value = "purple", onChange }) {
  return (
    <div className={styles.row} role="radiogroup" aria-label="Accent color">
      {accentColors.map((accent) => {
        const isSelected = value === accent.id;
        return (
          <motion.button
            key={accent.id}
            className={`${styles.swatch} ${isSelected ? styles.selected : ""}`}
            style={{ background: accent.color }}
            onClick={() => onChange(accent.id)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
            role="radio"
            aria-checked={isSelected}
            aria-label={accent.id}
          >
            {isSelected && (
              <motion.span
                className={styles.inner}
                layoutId="accentDot"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
