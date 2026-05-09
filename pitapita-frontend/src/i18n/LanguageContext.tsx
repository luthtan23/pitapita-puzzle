"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "./locales/en";
import { id } from "./locales/id";

type Language = "en" | "id";
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, replacements?: Record<string, string | number>) => string;
  tRaw: (path: string) => any;
}

const translations: Record<Language, Translations> = { en, id };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "id")) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (path: string, replacements?: Record<string, string | number>) => {
    const keys = path.split(".");
    let value: any = translations[language];

    for (const key of keys) {
      if (value[key] === undefined) {
        console.warn(`Translation key not found: ${path}`);
        return path;
      }
      value = value[key];
    }

    if (typeof value !== "string") {
      return path;
    }

    if (replacements) {
      let result = value;
      Object.entries(replacements).forEach(([key, val]) => {
        result = result.replace(`{${key}}`, String(val));
      });
      return result;
    }

    return value;
  };

  const tRaw = (path: string) => {
    const keys = path.split(".");
    let value: any = translations[language];

    for (const key of keys) {
      if (value[key] === undefined) {
        console.warn(`Translation key not found: ${path}`);
        return undefined;
      }
      value = value[key];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tRaw }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
