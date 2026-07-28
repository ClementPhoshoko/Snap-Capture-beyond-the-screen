import { motion } from "framer-motion";
import { FileText, Monitor, ScanSearch } from "lucide-react";
import styles from "./CaptureMode.module.css";

const modes = [
  {
    id: "fullpage",
    label: "Capture Full Page",
    description: "Capture the entire scrollable page",
    icon: FileText,
  },
  {
    id: "visible",
    label: "Capture Visible",
    description: "Capture only the visible area",
    icon: Monitor,
  },
  {
    id: "selection",
    label: "Capture Selection",
    description: "Select an area to capture",
    icon: ScanSearch,
    comingSoon: true,
  },
];

export default function CaptureMode({ value, onChange }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Capture Mode</h2>
      <div className={styles.grid}>
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = value === mode.id;
          const isDisabled = mode.comingSoon;

          return (
            <motion.button
              key={mode.id}
              className={`${styles.card} ${isSelected ? styles.selected : ""} ${isDisabled ? styles.disabled : ""}`}
              onClick={() => !isDisabled && onChange(mode.id)}
              whileHover={!isDisabled ? { scale: 1.02 } : undefined}
              whileTap={!isDisabled ? { scale: 0.97 } : undefined}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              disabled={isDisabled}
              aria-pressed={isSelected}
            >
              {isDisabled && <span className={styles.badge}>Soon</span>}
              <div
                className={`${styles.iconWrap} ${isSelected ? styles.iconSelected : ""}`}
              >
                <Icon size={18} />
              </div>
              <span className={styles.label}>{mode.label}</span>
              <span className={styles.desc}>{mode.description}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
