import styles from "./CaptureStats.module.css";

export default function CaptureStats({ stats }) {
  return (
    <div className={styles.grid}>
      {stats.map((stat, index) => (
        <CaptureStatCard key={index} stat={stat} />
      ))}
    </div>
  );
}

function CaptureStatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}>
        <Icon size={16} />
      </div>
      <div className={styles.text}>
        <span className={styles.label}>{stat.label}</span>
        <span className={styles.value}>{stat.value}</span>
      </div>
    </div>
  );
}
