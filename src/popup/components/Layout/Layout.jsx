import BottomNav from "../BottomNav";
import styles from "./Layout.module.css";

export default function Layout({ children, navPage = "home", onNavChange, constrainHeight }) {
  return (
    <div className={`${styles.layout} ${constrainHeight ? styles.constrained : ""}`}>
      <div className={styles.page}>{children}</div>
      <BottomNav active={navPage} onChange={onNavChange} />
    </div>
  );
}
