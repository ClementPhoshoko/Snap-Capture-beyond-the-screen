import { motion } from "framer-motion";
import { ExternalLink, Globe } from "lucide-react";
import GlassCard from "../GlassCard";
import styles from "./CurrentTabCard.module.css";

export default function CurrentTabCard({ title, url, favicon }) {
  const displayUrl = url
    ? new URL(url).hostname.replace("www.", "")
    : "";

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Current Tab</h2>
      <GlassCard className={styles.card} hover>
        <div className={styles.cardContent}>
          <div className={styles.favicon}>
            {favicon ? (
              <img src={favicon} alt="" className={styles.faviconImg} />
            ) : (
              <Globe size={16} className={styles.faviconIcon} />
            )}
          </div>
          <div className={styles.info}>
            <span className={styles.title}>{title || "No tab selected"}</span>
            <span className={styles.url}>{displayUrl}</span>
          </div>
        </div>

        <motion.button
          className={styles.openBtn}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.12 }}
          aria-label="Open in new tab"
          onClick={() => url && window.open(url, "_blank")}
        >
          <ExternalLink size={14} />
        </motion.button>
      </GlassCard>
    </section>
  );
}
