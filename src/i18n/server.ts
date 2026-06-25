import { cookies } from "next/headers";
import { isValidTheme, defaultTheme } from "@/lib/preferences";
import { defaultLocale, getDictionary, isValidLocale } from "./index";
import type { Locale, Theme } from "./types";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("cms-locale")?.value;
  return isValidLocale(value) ? value : defaultLocale;
}

export async function getServerTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  const value = cookieStore.get("cms-theme")?.value;
  return isValidTheme(value) ? value : defaultTheme;
}

export async function getServerPreferences() {
  const [locale, theme] = await Promise.all([getServerLocale(), getServerTheme()]);
  return { locale, theme, dict: getDictionary(locale) };
}

export async function getServerDictionary() {
  const { locale, dict } = await getServerPreferences();
  return { locale, dict };
}
