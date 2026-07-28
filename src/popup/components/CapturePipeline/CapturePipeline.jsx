import { motion } from "framer-motion";
import StatusIndicator from "../StatusIndicator";
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
  const Icon = item.icon;

  return (
    <motion.div
      className={styles.item}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <div className={styles.left}>
        {Icon && (
          <div className={`${styles.iconBox} ${item.status === "completed" ? styles.iconBoxCompleted : ""} ${isActive ? styles.iconBoxActive : ""}`}>
            <Icon size={14} />
          </div>
        )}
        <div className={styles.text}>
          <span className={`${styles.title} ${isActive ? styles.titleActive : ""}`}>
            {item.title}
          </span>
          <span className={styles.description}>{item.description}</span>
        </div>
      </div>
      <StatusIndicator status={item.status} size={16} />
    </motion.div>
  );
}
