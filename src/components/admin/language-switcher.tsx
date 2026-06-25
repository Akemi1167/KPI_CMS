"use client";

import { Globe } from "lucide-react";
import { locales, nativeLocaleLabels } from "@/i18n";
import type { Locale } from "@/i18n/types";
import { useTranslation } from "@/providers/preferences-provider";

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { dict, locale, setLocale } = useTranslation();

  return (
    <div className={compact ? "" : "space-y-2"}>
      {!compact && (
        <label className="block text-[13px] font-medium text-text-primary">
          {dict.locale.label}
        </label>
      )}
      <div className="relative">
        <Globe
          size={14}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          aria-label={dict.locale.label}
          className={`h-8 appearance-none rounded-md border border-border-default bg-bg-surface pl-8 text-[13px] text-text-primary outline-none transition-colors focus:border-border-strong ${compact ? "pr-7" : "w-full pr-8"}`}
        >
          {locales.map((loc) => (
            <option key={loc} value={loc}>
              {nativeLocaleLabels[loc]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
