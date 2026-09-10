"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { translations, type Language } from "./translations";

type TranslateOptions = Record<string, string | number>;

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
  t: (path: string, options?: TranslateOptions) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "ahmedredcar-lang";

function getByPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
      obj
    );
}

function interpolate(value: string, options?: TranslateOptions): string {
  if (!options) return value;
  return Object.entries(options).reduce(
    (str, [key, val]) => str.replaceAll(`{${key}}`, String(val)),
    value
  );
}

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(
    initialLanguage ?? "fr"
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (
      (stored === "fr" || stored === "en" || stored === "ar") &&
      stored !== initialLanguage
    ) {
      setLanguageState(stored);
    }
    // Only run on mount - initialLanguage is the SSR-provided source of truth
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    // Also set a cookie for server-side reading
    document.cookie = `ahmedredcar-lang=${language}; path=/; max-age=31536000`;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
    // Set cookie as well
    document.cookie = `ahmedredcar-lang=${lang}; path=/; max-age=31536000`;
  }, []);

  const t = useCallback(
    (path: string, options?: TranslateOptions) => {
      const value = getByPath(translations[language], path);
      if (typeof value === "string") {
        return interpolate(value, options);
      }
      // Missing or non-string key: fall back to the path itself
      return path;
    },
    [language]
  );

  const dir: "ltr" | "rtl" = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
