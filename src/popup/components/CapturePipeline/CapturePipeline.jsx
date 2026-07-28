import { motion } from "framer-motion";
import StatusIndicator from "../StatusIndicator";
import GlassCard from "../GlassCard";
import styles from "./CapturePipeline.module.css";

export default function CapturePipeline({ items }) {
  return (
    <div className={styles.pipeline}>
      {items.map((item, index) => (
        <CapturePipelineItem
          key={item.id}
          item={item}
          index={index}
        />
      ))}
    </div>
  );
}

function CapturePipelineItem({ item, index }) {
  const isActive = item.status === "active";

  return (
    <motion.div
      className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <div className={styles.left}>
        <StatusIndicator status={item.status} size={22} />
        <div className={styles.text}>
          <span className={styles.title}>{item.title}</span>
          <span className={styles.description}>{item.description}</span>
        </div>
      </div>
    </motion.div>
  );
}
