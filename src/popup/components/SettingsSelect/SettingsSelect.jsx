import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import styles from "./SettingsSelect.module.css";

export default function SettingsSelect({ options = [], value, onChange, menuZIndex }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({});
  const ref = useRef(null);
  const triggerRef = useRef(null);
  const selected = options.find((o) => o.value === value);

  const updatePos = useCallback(() => {
    if (open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({
        top: r.bottom + 4,
        right: window.innerWidth - r.right,
        minWidth: Math.max(130, r.width),
      });
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    updatePos();
    if (open) {
      window.addEventListener("scroll", updatePos, true);
      window.addEventListener("resize", updatePos);
      return () => {
        window.removeEventListener("scroll", updatePos, true);
        window.removeEventListener("resize", updatePos);
      };
    }
  }, [open, updatePos]);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.triggerText}>{selected?.label || "Select"}</span>
        <ChevronDown
          size={13}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.ul
              className={styles.menu}
              style={{ position: "fixed", ...pos, zIndex: menuZIndex }}
              role="listbox"
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
            >
              {options.map((opt) => (
                <li
                  key={opt.value}
                  className={`${styles.option} ${opt.value === value ? styles.optionActive : ""}`}
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                >
                  {opt.label}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
