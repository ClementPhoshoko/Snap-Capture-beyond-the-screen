import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import logoUrl from "../../assets/Snap Logo.png";
import styles from "./Header.module.css";

export default function Header({ onSettingsClick }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <img src={logoUrl} alt="Snap logo" className={styles.logoImg} />
        </div>
        <div className={styles.text}>
          <h1 className={styles.title}>
            AkovoLabs <span className={styles.accent}>Snap</span>
          </h1>
          <p className={styles.subtitle}>Capture beyond the screen.</p>
        </div>
      </div>

      <motion.button
        className={styles.settingsBtn}
        onClick={onSettingsClick}
        whileHover={{ scale: 1.08, y: -1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        aria-label="Settings"
      >
        <Settings size={16} />
      </motion.button>
    </header>
  );
}
