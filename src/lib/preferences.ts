import type { Locale, Theme } from "@/i18n/types";

export const LOCALE_COOKIE = "cms-locale";
export const THEME_COOKIE = "cms-theme";
export const LOCALE_STORAGE = "cms-locale";
export const THEME_STORAGE = "cms-theme";

export const defaultTheme: Theme = "system";

export function isValidTheme(value: string | undefined): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "light" || theme === "dark") return theme;
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export function applyThemeToDocument(theme: Theme) {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;

  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  root.dataset.theme = resolved;
}

export function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(THEME_STORAGE);
    return isValidTheme(stored ?? undefined) ? (stored as Theme) : null;
  } catch {
    return null;
  }
}

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(LOCALE_STORAGE);
    return stored === "vi" || stored === "en" || stored === "zh" ? stored : null;
  } catch {
    return null;
  }
}

export function setPreferenceCookies(locale: Locale, theme: Theme) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${maxAge};SameSite=Lax`;
  document.cookie = `${THEME_COOKIE}=${theme};path=/;max-age=${maxAge};SameSite=Lax`;
}

export function getThemeClassName(theme: Theme): string {
  return theme === "dark" ? "dark" : "";
}
