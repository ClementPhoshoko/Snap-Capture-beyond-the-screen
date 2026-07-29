import { motion } from "framer-motion";
import { History, Building2, SlidersHorizontal } from "lucide-react";
import styles from "./BottomNav.module.css";

const navItems = [
  { id: "history", label: "History", icon: History },
  { id: "home", label: "Snap", icon: Building2 },
  { id: "settings", label: "Settings", icon: SlidersHorizontal },
];

export default function BottomNav({ active = "home", onChange }) {
  return (
    <nav className={styles.nav} role="tablist">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;

        return (
          <motion.button
            key={item.id}
            className={`${styles.item} ${isActive ? styles.active : ""}`}
            onClick={() => onChange(item.id)}
            whileHover={{ color: "var(--text-primary)" }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.12 }}
            role="tab"
            aria-selected={isActive}
            aria-label={item.label}
          >
            <Icon size={14} className={styles.icon} />
            <span className={styles.label}>{item.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
