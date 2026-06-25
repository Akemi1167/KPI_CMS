"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  defaultLocale,
  formatMessage,
  getDictionary,
  type Dictionary,
} from "@/i18n";
import type { Locale, Theme } from "@/i18n/types";
import {
  applyThemeToDocument,
  defaultTheme,
  LOCALE_STORAGE,
  readStoredLocale,
  readStoredTheme,
  setPreferenceCookies,
  THEME_STORAGE,
} from "@/lib/preferences";

interface PreferencesContextValue {
  locale: Locale;
  theme: Theme;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  t: (template: string, params?: Record<string, string | number>) => string;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

interface PreferencesProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
  initialTheme?: Theme;
}

export function PreferencesProvider({
  children,
  initialLocale = defaultLocale,
  initialTheme = defaultTheme,
}: PreferencesProviderProps) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale() ?? initialLocale);
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme() ?? initialTheme);

  const dict = useMemo(() => getDictionary(locale), [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      localStorage.setItem(LOCALE_STORAGE, next);
      setPreferenceCookies(next, theme);
      document.documentElement.lang = next;
      router.refresh();
    },
    [router, theme],
  );

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(THEME_STORAGE, next);
    setPreferenceCookies(locale, next);
    applyThemeToDocument(next);
  }, [locale]);

  useLayoutEffect(() => {
    applyThemeToDocument(theme);
    document.documentElement.lang = locale;
  }, [theme, locale]);

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function onChange() {
      if (theme === "system") applyThemeToDocument("system");
    }
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const t = useCallback(
    (template: string, params?: Record<string, string | number>) =>
      formatMessage(template, params),
    [],
  );

  const value = useMemo(
    () => ({ locale, theme, dict, setLocale, setTheme, t }),
    [locale, theme, dict, setLocale, setTheme, t],
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return ctx;
}

export function useTranslation() {
  const { dict, locale, t, setLocale, setTheme, theme } = usePreferences();
  return { dict, locale, t, setLocale, setTheme, theme };
}
