import { motion } from "framer-motion";
import styles from "./ThemeSelector.module.css";

const themes = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
];

export default function ThemeSelector({ value = "dark", onChange }) {
  return (
    <div className={styles.segmented} role="radiogroup" aria-label="Theme">
      {themes.map((theme) => {
        const isSelected = value === theme.id;
        return (
          <motion.button
            key={theme.id}
            className={`${styles.option} ${isSelected ? styles.selected : ""}`}
            onClick={() => onChange(theme.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
            role="radio"
            aria-checked={isSelected}
            aria-label={theme.label}
          >
            {isSelected && (
              <motion.div
                className={styles.indicator}
                layoutId="themeIndicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={styles.label}>{theme.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
