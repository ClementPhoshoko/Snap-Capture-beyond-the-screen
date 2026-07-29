import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut } from "lucide-react";
import styles from "./ScreenshotPreviewCard.module.css";

export default function ScreenshotPreviewCard({ imageUrl, dimensions }) {
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    setZoom(100);
  }, [imageUrl]);

  const zoomIn = () => setZoom((z) => Math.min(z + 10, 300));
  const zoomOut = () => setZoom((z) => Math.max(z - 10, 10));

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.preview}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Screenshot preview"
            className={styles.image}
            style={{ transform: `scale(${zoom / 100})` }}
            draggable={false}
          />
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholderBar} style={{ width: "70%", height: 12 }} />
            <div className={styles.placeholderBar} style={{ width: "50%", height: 8 }} />
            <div className={styles.placeholderBar} style={{ width: "85%", height: 10 }} />
            <div className={styles.placeholderBar} style={{ width: "40%", height: 6 }} />
            <div className={styles.placeholderBar} style={{ width: "65%", height: 9 }} />
          </div>
        )}
      </div>

      <div className={styles.toolbar}>
        <button className={styles.zoomBtn} onClick={zoomOut} aria-label="Zoom out">
          <ZoomOut size={14} />
        </button>
        <span className={styles.zoomLabel}>{zoom}%</span>
        <button className={styles.zoomBtn} onClick={zoomIn} aria-label="Zoom in">
          <ZoomIn size={14} />
        </button>
      </div>
    </motion.div>
  );
}
