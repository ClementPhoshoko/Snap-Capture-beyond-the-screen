import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X, Search, Camera, Monitor } from "lucide-react";
import GlassCard from "../../components/GlassCard";
import HistoryCard from "../../components/HistoryCard";
import GlassButton from "../../components/GlassButton";
import { getCaptureHistory } from "../../../shared/storage";
import styles from "./History.module.css";

const pageVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2 } } };

export default function History({ onClose }) {
  const [search, setSearch] = useState("");
  const [captures, setCaptures] = useState([]);
  useEffect(() => { getCaptureHistory().then(setCaptures).catch(() => {}); }, []);
  const visible = useMemo(() => captures.filter((item) => `${item.title} ${item.domain}`.toLowerCase().includes(search.toLowerCase())), [captures, search]);

  return (
    <motion.div className={styles.screen} variants={pageVariants} initial="hidden" animate="visible">
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerCenter}>
            <div className={styles.logo}><img src={new URL("../../assets/Snap Logo.png", import.meta.url).href} alt="AkovoLabs Snap" className={styles.logoImg} /></div>
            <div className={styles.headerText}><span className={styles.headerTitle}>AkovoLabs <span className={styles.accent}>Snap</span></span><span className={styles.headerSubtitle}>Capture beyond the screen.</span></div>
          </div>
          <button className={styles.headerBtn} onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className={styles.divider} />
        <div className={styles.titleBlock}><h2 className={styles.pageTitle}>History</h2><p className={styles.pageSubtitle}>Recent capture metadata is kept on this device.</p></div>
        <div className={styles.divider} />
      </div>
      {captures.length ? (
        <div className={styles.scrollArea}>
          <div className={styles.content}><div className={styles.searchWrap}><Search size={14} className={styles.searchIcon} /><input className={styles.searchInput} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search captures..." /></div></div>
          <div className={styles.content}>
            <h3 className={styles.sectionTitle}>{visible.length ? "Recent" : "No matches"}</h3>
            {visible.length > 0 && <GlassCard className={styles.card}>{visible.map((item, index) => <div key={item.id}>{index > 0 && <div className={styles.divider} />}<HistoryCard {...item} time={new Date(item.capturedAt).toLocaleString()} /></div>)}</GlassCard>}
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}><div className={styles.emptyIcon}><Camera size={32} /></div><h3 className={styles.emptyTitle}>No captures yet</h3><p className={styles.emptyDesc}>Capture metadata will appear here after your first screenshot.</p><GlassButton variant="primary" icon={Monitor} iconPosition="left" onClick={onClose}>Capture Page</GlassButton></div>
      )}
    </motion.div>
  );
}
