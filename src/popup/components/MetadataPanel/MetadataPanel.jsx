import { motion } from "framer-motion";
import styles from "./MetadataPanel.module.css";

function GlassInfoCard({ icon: Icon, label, value }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}>
        <Icon size={14} />
      </div>
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>
    </div>
  );
}

export default function MetadataPanel({ items }) {
  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {items.map((item, i) => (
        <GlassInfoCard key={i} icon={item.icon} label={item.label} value={item.value} />
      ))}
    </motion.div>
  );
}
