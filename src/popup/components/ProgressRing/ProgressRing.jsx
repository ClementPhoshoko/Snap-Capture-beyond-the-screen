import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import styles from "./ProgressRing.module.css";

export default function ProgressRing({ progress = 0, size = 160, strokeWidth = 6, label }) {
  const reducedMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className={styles.wrapper}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Capture progress: ${Math.round(progress)} percent`}
    >
      <svg className={styles.svg} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-primary)" />
            <stop offset="100%" stopColor="var(--brand-secondary)" />
          </linearGradient>
        </defs>
        <circle
          className={styles.track}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          className={styles.progress}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="url(#progress-gradient)"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: reducedMotion ? 0 : 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </svg>
      <div className={styles.content}>
        {label && <span className={styles.label}>{label}</span>}
        <span className={styles.percentage}>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
