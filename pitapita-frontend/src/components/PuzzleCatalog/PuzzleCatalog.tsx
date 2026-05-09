import { useState, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "@/i18n/LanguageContext";
import { PUZZLES, PUZZLE_CATEGORIES, PuzzleOption } from "@/data/puzzles";
import styles from "./PuzzleCatalog.module.css";

interface PuzzleCatalogProps {
  currentImageUrl: string;
  onSelect: (url: string) => void;
}

export default function PuzzleCatalog({ currentImageUrl, onSelect }: PuzzleCatalogProps) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }
      const url = URL.createObjectURL(file);
      onSelect(url);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const categories = ["All", ...PUZZLE_CATEGORIES];
  const filteredPuzzles = activeCategory === "All"
    ? PUZZLES
    : PUZZLES.filter(p => p.category === activeCategory);

  return (
    <div className={styles.catalog}>
      <div className={styles.filterRow}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {t(`hero.categories.${cat.toLowerCase()}`)}
          </button>
        ))}
        <button className={styles.uploadTriggerBtn} onClick={triggerUpload}>
          📤 {t("hero.uploadCustom")}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        {/* Spacer to prevent truncation of the last item */}
        <div style={{ minWidth: '24px', height: '1px' }} aria-hidden="true" />
      </div>

      <div className={styles.grid}>
        {filteredPuzzles.map(puzzle => (
          <button
            key={puzzle.id}
            className={`${styles.item} ${currentImageUrl === puzzle.imageUrl ? styles.itemActive : ""}`}
            onClick={() => onSelect(puzzle.imageUrl)}
            aria-label={`Select ${puzzle.title}`}
          >
            <div className={styles.imageContainer}>
              <Image
                src={puzzle.previewUrl}
                alt={puzzle.title}
                fill
                sizes="(max-width: 768px) 100px, 120px"
                className={styles.image}
              />
              {currentImageUrl === puzzle.imageUrl && (
                <div className={styles.checkBadge}>✓</div>
              )}
            </div>
            <span className={styles.itemTitle}>{puzzle.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
