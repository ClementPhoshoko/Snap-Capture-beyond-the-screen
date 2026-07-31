import { motion } from "framer-motion";
import { useCallback, useRef, useState, useEffect } from "react";
import { ExternalLink, Monitor, Globe, Download, Copy, EllipsisVertical, Trash2, Share2, FileDown } from "lucide-react";
import styles from "./HistoryCard.module.css";

export default function HistoryCard({
  id,
  title,
  domain,
  url,
  favicon,
  thumbnail,
  resolution,
  format,
  size,
  time,
  designExtract,
  onOpen,
  onDownload,
  onDownloadDesign,
  onCopy,
  onDelete,
  onShare,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const isZipCard = format === "ZIP" || resolution === "Design extract" || Boolean(designExtract?.archiveId && !thumbnail);

  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e) => { if (menuRef.current && !menuRef.current.contains(e.target) && !btnRef.current?.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [menuOpen]);

  const handleDownload = useCallback((e) => { e.stopPropagation(); setMenuOpen(false); onDownload?.(id, thumbnail); }, [id, thumbnail, onDownload]);
  const handleDownloadDesign = useCallback((e) => { e.stopPropagation(); setMenuOpen(false); onDownloadDesign?.(id, designExtract); }, [id, designExtract, onDownloadDesign]);
  const handleCopy = useCallback((e) => { e.stopPropagation(); setMenuOpen(false); onCopy?.(id, thumbnail); }, [id, thumbnail, onCopy]);
  const handleDelete = useCallback((e) => { e.stopPropagation(); setMenuOpen(false); onDelete?.(id); }, [id, onDelete]);
  const handleShare = useCallback((e) => { e.stopPropagation(); setMenuOpen(false); onShare?.(id, thumbnail, url); }, [id, thumbnail, url, onShare]);

  const imageActions = (
    <div className={styles.actions}>
      <motion.button
        className={styles.actionBtn}
        whileHover={{ scale: 1.1, y: -1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.12 }}
        onClick={(e) => { e.stopPropagation(); onOpen?.(e); }}
        aria-label="Open original page"
      >
        <ExternalLink size={14} />
      </motion.button>
      <motion.button
        className={styles.actionBtn}
        whileHover={{ scale: 1.1, y: -1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.12 }}
        onClick={handleDownload}
        aria-label="Download image"
      >
        <Download size={14} />
      </motion.button>
      <motion.button
        className={styles.actionBtn}
        whileHover={{ scale: 1.1, y: -1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.12 }}
        onClick={handleCopy}
        aria-label="Copy image to clipboard"
      >
        <Copy size={14} />
      </motion.button>
      <div className={styles.menuWrap}>
        <motion.button
          ref={btnRef}
          className={styles.actionBtn}
          whileHover={{ scale: 1.1, y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.12 }}
          onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
          aria-label="More actions"
        >
          <EllipsisVertical size={14} />
        </motion.button>
        {menuOpen && (
          <div ref={menuRef} className={styles.dropdown}>
            <button className={styles.dropdownItem} onClick={handleDelete}><Trash2 size={14} /> Delete</button>
            <button className={styles.dropdownItem} onClick={handleShare}><Share2 size={14} /> Share</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`${styles.card} ${isZipCard ? styles.zipCard : styles.imageCard}`}>
      <div className={styles.thumbnail}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} className={styles.thumbImg} loading="lazy" />
        ) : isZipCard ? (
          <div className={styles.thumbPlaceholder}>
            <FileDown size={18} />
          </div>
        ) : (
          <div className={styles.thumbPlaceholder}>
            <Monitor size={18} />
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.topRow}>
          {favicon ? (
            <img src={favicon} alt="" className={styles.favicon} />
          ) : (
            <div className={styles.faviconPlaceholder}>
              <Globe size={10} />
            </div>
          )}
          <span className={styles.name}>{title}</span>
        </div>
        <span className={styles.domain}>{domain}</span>
        <span className={styles.meta}>{resolution} &middot; {format} &middot; {size}</span>
        <span className={styles.time}>{time}</span>
        {!isZipCard && imageActions}
      </div>

      {isZipCard && (
        <div className={styles.actions}>
          <>
            <motion.button
              className={styles.actionBtn}
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.12 }}
              onClick={handleDownloadDesign}
              aria-label="Download extracted design ZIP"
              title="Download extracted design ZIP"
            >
              <FileDown size={14} />
            </motion.button>
            <motion.button
              className={styles.actionBtn}
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.12 }}
              onClick={handleDelete}
              aria-label="Delete"
              title="Delete"
            >
              <Trash2 size={14} />
            </motion.button>
          </>
        </div>
      )}
    </div>
  );
}
