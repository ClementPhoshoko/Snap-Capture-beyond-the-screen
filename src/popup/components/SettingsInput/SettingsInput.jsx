import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import styles from "./SettingsInput.module.css";

export default function SettingsInput({ value = "", onChange, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (onCopy) onCopy(value);
    else navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label="File naming pattern"
      />
      <motion.button
        className={styles.copyBtn}
        onClick={handleCopy}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.12 }}
        aria-label={copied ? "Copied" : "Copy pattern"}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </motion.button>
    </div>
  );
}
