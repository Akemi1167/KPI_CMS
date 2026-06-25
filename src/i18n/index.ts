import { en } from "./locales/en";
import { vi } from "./locales/vi";
import { zh } from "./locales/zh";
import type { Dictionary, Locale } from "./types";

export type { Dictionary, Locale, Theme } from "./types";

export const locales: Locale[] = ["vi", "en", "zh"];
export const defaultLocale: Locale = "vi";

const dictionaries: Record<Locale, Dictionary> = { vi, en, zh };

const dateLocaleMap: Record<Locale, string> = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function isValidLocale(value: string | undefined): value is Locale {
  return value === "vi" || value === "en" || value === "zh";
}

export function formatMessage(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`,
  );
}

export function formatDate(date: string | Date, locale: Locale): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(dateLocaleMap[locale]);
}

export const nativeLocaleLabels: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
  zh: "中文",
};
