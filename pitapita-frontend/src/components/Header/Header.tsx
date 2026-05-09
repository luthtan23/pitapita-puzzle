"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import styles from "./Header.module.css";

interface HeaderProps {
  onLeaderboard: () => void;
  onHowTo: () => void;
}

export default function Header({ onLeaderboard, onHowTo }: HeaderProps) {
  const { t, language, setLanguage } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleAction = (fn: () => void) => {
    fn();
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon} aria-hidden="true">🧩</span>
          <span className={styles.logoText}>
            Pita<strong>Pita</strong>
          </span>
          <span className="badge badge-accent" style={{ fontSize: "0.65rem" }}>Beta</span>
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          {/* Desktop Nav */}
          <div className={styles.desktopNav}>
            <button
              id="btn-leaderboard"
              className={`btn-ghost ${styles.navBtn}`}
              onClick={onLeaderboard}
              aria-label={t("header.leaderboard")}
            >
              <span aria-hidden="true">🏆</span> {t("header.leaderboard")}
            </button>
            <button
              id="btn-howto"
              className={`btn-ghost ${styles.navBtn}`}
              onClick={onHowTo}
              aria-label={t("header.howToPlay")}
            >
              <span aria-hidden="true">❓</span> {t("header.howToPlay")}
            </button>

            <div className={styles.langSwitcher}>
              <button 
                className={`${styles.langBtn} ${language === 'en' ? styles.langBtnActive : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
              <span className={styles.langDivider}>|</span>
              <button 
                className={`${styles.langBtn} ${language === 'id' ? styles.langBtnActive : ''}`}
                onClick={() => setLanguage('id')}
              >
                ID
              </button>
            </div>
          </div>

          {/* Mobile Nav (Three Dots) */}
          <div className={styles.mobileNav} ref={menuRef}>
            <button
              id="btn-more"
              className={`btn-ghost ${styles.moreBtn} ${menuOpen ? styles.moreBtnActive : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="More options"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <span aria-hidden="true">•••</span>
            </button>

            {menuOpen && (
              <div className={styles.dropdown}>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleAction(onLeaderboard)}
                >
                  <span aria-hidden="true">🏆</span> {t("header.leaderboard")}
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleAction(onHowTo)}
                >
                  <span aria-hidden="true">❓</span> {t("header.howToPlay")}
                </button>
                <div className={styles.dropdownDivider} />
                <div className={styles.mobileLangRow}>
                   <button 
                    className={`${styles.langBtn} ${language === 'en' ? styles.langBtnActive : ''}`}
                    onClick={() => setLanguage('en')}
                  >
                    EN
                  </button>
                  <button 
                    className={`${styles.langBtn} ${language === 'id' ? styles.langBtnActive : ''}`}
                    onClick={() => setLanguage('id')}
                  >
                    ID
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
