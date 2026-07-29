import { motion } from "framer-motion";
import { ExternalLink, Monitor, Globe } from "lucide-react";
import styles from "./HistoryCard.module.css";

export default function HistoryCard({
  title,
  domain,
  url,
  favicon,
  thumbnail,
  resolution,
  format,
  size,
  time,
  onOpen,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} className={styles.thumbImg} loading="lazy" />
        ) : (
          <div className={styles.thumbPlaceholder}>
            <Monitor size={18} />
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.topRow}>
          {favicon ? (
            <img src={favicon} alt="" className={styles.favicon} />
          ) : (
            <div className={styles.faviconPlaceholder}>
              <Globe size={10} />
            </div>
          )}
          <span className={styles.name}>{title}</span>
        </div>
        <span className={styles.domain}>{domain}</span>
        <span className={styles.meta}>{resolution} &middot; {format} &middot; {size}</span>
        <span className={styles.time}>{time}</span>
      </div>

      <div className={styles.actions}>
        <motion.button
          className={styles.actionBtn}
          whileHover={{ scale: 1.1, y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.12 }}
          onClick={(e) => { e.stopPropagation(); onOpen?.(e); }}
          aria-label="Open original page"
        >
          <ExternalLink size={14} />
        </motion.button>
      </div>
    </div>
  );
}
