import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X, Search, Camera, Monitor } from "lucide-react";
import GlassCard from "../../components/GlassCard";
import HistoryCard from "../../components/HistoryCard";
import GlassButton from "../../components/GlassButton";
import { getCaptureHistory, deleteCaptureEntry } from "../../../shared/storage";
import { deleteDesignExtractArchive, getDesignExtractArchive } from "../../../shared/designArchive";
import styles from "./History.module.css";

const pageVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2 } } };

function dataURLtoBlob(dataURL) {
  const [header, base64] = dataURL.split(",", 2);
  const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function timeGroup(capturedAt) {
  const now = new Date();
  const date = new Date(capturedAt);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This Week";
  if (diffDays < 30) return "This Month";
  if (diffDays < 365) return "This Year";
  return "Older";
}

const GROUP_ORDER = ["Today", "Yesterday", "This Week", "This Month", "This Year", "Older"];

function groupCaptures(captures) {
  const groups = {};
  for (const item of captures) {
    const group = timeGroup(item.capturedAt);
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
  }
  return GROUP_ORDER.filter((g) => groups[g]?.length).map((g) => ({ label: g, items: groups[g] }));
}

export default function History({ onClose }) {
  const [search, setSearch] = useState("");
  const [captures, setCaptures] = useState([]);
  useEffect(() => { getCaptureHistory().then(setCaptures).catch(() => {}); }, []);

  const handleDownload = useCallback((_id, dataUrl) => {
    if (!dataUrl) return;
    const blob = dataURLtoBlob(dataUrl);
    const objUrl = URL.createObjectURL(blob);
    chrome.downloads.download({ url: objUrl, filename: `snap-capture-${Date.now()}.jpg`, saveAs: true });
    setTimeout(() => URL.revokeObjectURL(objUrl), 10000);
  }, []);

  const handleDownloadDesign = useCallback(async (_id, designExtract) => {
    if (!designExtract?.archiveId) return;
    const blob = await getDesignExtractArchive(designExtract.archiveId);
    if (!blob) return;
    const objUrl = URL.createObjectURL(blob);
    chrome.downloads.download({
      url: objUrl,
      filename: designExtract.filename || `${designExtract.projectName || "extracted-design"}.zip`,
      saveAs: true,
    });
    setTimeout(() => URL.revokeObjectURL(objUrl), 10000);
  }, []);

  const handleCopy = useCallback(async (_id, dataUrl) => {
    if (!dataUrl) return;
    try {
      const blob = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement("canvas");
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          const ctx = c.getContext("2d");
          ctx.drawImage(img, 0, 0);
          c.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
        };
        img.onerror = reject;
        img.src = dataUrl;
      });
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    } catch { /* silent */ }
  }, []);

  const handleDelete = useCallback(async (id) => {
    const entry = captures.find((e) => e.id === id);
    setCaptures((prev) => prev.filter((e) => e.id !== id));
    if (entry?.designExtract?.archiveId) {
      deleteDesignExtractArchive(entry.designExtract.archiveId).catch(() => {});
    }
    try { await deleteCaptureEntry(id); } catch { /* silent */ }
  }, [captures]);

  const handleShare = useCallback(async (_id, dataUrl, pageUrl) => {
    try {
      if (!navigator.share) return;
      const shareData = { title: "Snap Capture", url: pageUrl || undefined };
      if (dataUrl) {
        const blob = dataURLtoBlob(dataUrl);
        const file = new File([blob], "snap-capture.jpg", { type: blob.type });
        shareData.files = [file];
      }
      await navigator.share(shareData);
    } catch { /* silent */ }
  }, []);

  const visible = useMemo(() => captures.filter((item) => `${item.title} ${item.domain}`.toLowerCase().includes(search.toLowerCase())), [captures, search]);
  const groups = useMemo(() => groupCaptures(visible), [visible]);

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
          {groups.length > 0 ? groups.map((group) => (
            <div className={styles.content} key={group.label}>
              <h3 className={styles.sectionTitle}>{group.label}</h3>
              <GlassCard className={styles.card}>{group.items.map((item, index) => <div key={item.id}>{index > 0 && <div className={styles.divider} />}<HistoryCard {...item} time={new Date(item.capturedAt).toLocaleString()} onOpen={() => item.url && chrome.tabs.create({ url: item.url })} onDownload={handleDownload} onDownloadDesign={handleDownloadDesign} onCopy={handleCopy} onDelete={handleDelete} onShare={handleShare} /></div>)}</GlassCard>
            </div>
          )) : (
            <div className={styles.content}><h3 className={styles.sectionTitle}>No matches</h3></div>
          )}
        </div>
      ) : (
        <div className={styles.emptyState}><div className={styles.emptyIcon}><Camera size={32} /></div><h3 className={styles.emptyTitle}>No captures yet</h3><p className={styles.emptyDesc}>Capture metadata will appear here after your first screenshot.</p><GlassButton variant="primary" icon={Monitor} iconPosition="left" onClick={onClose}>Capture Page</GlassButton></div>
      )}
    </motion.div>
  );
}
