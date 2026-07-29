import { useState } from "react";
import { motion } from "framer-motion";
import { X, Search, Camera, Monitor, Folder } from "lucide-react";
import GlassCard from "../../components/GlassCard";
import HistoryCard from "../../components/HistoryCard";
import GlassButton from "../../components/GlassButton";
import styles from "./History.module.css";

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const mockCaptures = {
  today: [
    { id: "1", title: "Getting Started — Documentation", domain: "akovolabs.dev", url: "https://akovolabs.dev/docs", resolution: "1920 × 1080", format: "PNG", size: "2.4 MB", time: "2:30 PM" },
    { id: "2", title: "API Reference — v2.0", domain: "akovolabs.dev", url: "https://akovolabs.dev/api", resolution: "3840 × 2160", format: "PNG", size: "5.8 MB", time: "1:15 PM" },
  ],
  yesterday: [
    { id: "3", title: "Dashboard — Analytics", domain: "app.akovolabs.com", url: "https://app.akovolabs.com/dashboard", resolution: "1920 × 1080", format: "JPG", size: "1.2 MB", time: "4:45 PM" },
  ],
  lastWeek: [
    { id: "4", title: "Landing Page — Redesign", domain: "akovolabs.com", url: "https://akovolabs.com", resolution: "2560 × 1440", format: "PNG", size: "3.6 MB", time: "Mon, 10:20 AM" },
    { id: "5", title: "Blog Post — Getting Started", domain: "blog.akovolabs.com", url: "https://blog.akovolabs.com/getting-started", resolution: "1920 × 1080", format: "PNG", size: "1.8 MB", time: "Sun, 3:10 PM" },
    { id: "6", title: "Settings — Profile Page", domain: "app.akovolabs.com", url: "https://app.akovolabs.com/settings", resolution: "1440 × 900", format: "JPG", size: "0.9 MB", time: "Sat, 11:00 AM" },
  ],
};

export default function History({ onClose }) {
  const [search, setSearch] = useState("");

  const hasCaptures = Object.values(mockCaptures).some((arr) => arr.length > 0);

  return (
    <motion.div
      className={styles.screen}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.content} variants={itemVariants}>
        <div className={styles.header}>
          <div className={styles.headerCenter}>
            <div className={styles.logo}>
              <img
                src={new URL("../../assets/Snap Logo.png", import.meta.url).href}
                alt="AkovoLabs Snap"
                className={styles.logoImg}
                draggable={false}
              />
            </div>
            <div className={styles.headerText}>
              <span className={styles.headerTitle}>AkovoLabs <span className={styles.accent}>Snap</span></span>
              <span className={styles.headerSubtitle}>Capture beyond the screen.</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.headerBtn} onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div className={styles.content} variants={itemVariants}>
        <div className={styles.divider} />
        <div className={styles.titleRow}>
          <div className={styles.titleBlock}>
            <h2 className={styles.pageTitle}>History</h2>
            <p className={styles.pageSubtitle}>Your recent captures.</p>
          </div>
          <div className={styles.titleActions}>
            {/*
              Filter dropdown — reserved for future use (Version 4).
              <div className={styles.filterWrap} ref={filterRef}>
                <motion.button ...>
                  <Filter size={14} />
                  <span>Filter</span>
                </motion.button>
                <AnimatePresence>
                  {filterOpen && (
                    <motion.ul ...>
                      {filterOptions.map(...)}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            */}
            <motion.button
              className={styles.titleBtn}
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              aria-label="More options"
            >
              <Folder size={16} />
              <span>More</span>
            </motion.button>
          </div>
        </div>
        <div className={styles.divider} />
      </motion.div>

      {hasCaptures ? (
        <div className={styles.scrollArea}>
          <motion.div className={styles.content} variants={itemVariants}>
            <div className={styles.searchWrap}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search captures..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </motion.div>

          {mockCaptures.today.length > 0 && (
            <motion.div className={styles.content} variants={itemVariants}>
              <h3 className={styles.sectionTitle}>Today</h3>
              <GlassCard className={styles.card}>
                {mockCaptures.today.map((item, i) => (
                  <div key={item.id}>
                    {i > 0 && <div className={styles.divider} />}
                    <HistoryCard {...item} />
                  </div>
                ))}
              </GlassCard>
            </motion.div>
          )}

          {mockCaptures.yesterday.length > 0 && (
            <motion.div className={styles.content} variants={itemVariants}>
              <h3 className={styles.sectionTitle}>Yesterday</h3>
              <GlassCard className={styles.card}>
                {mockCaptures.yesterday.map((item, i) => (
                  <div key={item.id}>
                    {i > 0 && <div className={styles.divider} />}
                    <HistoryCard {...item} />
                  </div>
                ))}
              </GlassCard>
            </motion.div>
          )}

          {mockCaptures.lastWeek.length > 0 && (
            <motion.div className={styles.content} variants={itemVariants}>
              <h3 className={styles.sectionTitle}>Last Week</h3>
              <GlassCard className={styles.card}>
                {mockCaptures.lastWeek.map((item, i) => (
                  <div key={item.id}>
                    {i > 0 && <div className={styles.divider} />}
                    <HistoryCard {...item} />
                  </div>
                ))}
              </GlassCard>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div className={styles.emptyState} variants={itemVariants}>
          <div className={styles.emptyIcon}>
            <Camera size={32} />
          </div>
          <h3 className={styles.emptyTitle}>No captures yet</h3>
          <p className={styles.emptyDesc}>Your screenshots will appear here once you start capturing.</p>
          <GlassButton variant="primary" icon={Monitor} iconPosition="left" onClick={onClose}>
            Capture Page
          </GlassButton>
        </motion.div>
      )}
    </motion.div>
  );
}
