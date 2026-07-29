import styles from "./SettingsRow.module.css";

export default function SettingsRow({ icon: Icon, label, description, control, variant }) {
  if (variant === "column") {
    return (
      <div className={styles.rowColumn}>
        <div className={styles.topLine}>
          <div className={styles.left}>
            <div className={styles.iconWrap}>
              <Icon size={13} />
            </div>
            <span className={styles.label}>{label}</span>
          </div>
          {control && <div className={styles.control}>{control}</div>}
        </div>
        {description && <span className={styles.descriptionCol}>{description}</span>}
      </div>
    );
  }

  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <div className={styles.iconWrap}>
          <Icon size={13} />
        </div>
        <div className={styles.text}>
          <span className={styles.label}>{label}</span>
          {description && <span className={styles.description}>{description}</span>}
        </div>
      </div>
      {control && <div className={styles.control}>{control}</div>}
    </div>
  );
}
