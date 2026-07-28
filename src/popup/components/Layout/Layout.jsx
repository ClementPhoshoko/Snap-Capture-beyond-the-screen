import { useState } from "react";
import BottomNav from "../BottomNav";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  const [nav, setNav] = useState("home");

  return (
    <div className={styles.layout}>
      <div className={styles.page}>{children}</div>
      <BottomNav active={nav} onChange={setNav} />
    </div>
  );
}
