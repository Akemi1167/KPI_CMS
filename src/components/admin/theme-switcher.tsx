"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import type { Theme } from "@/i18n/types";
import { useTranslation } from "@/providers/preferences-provider";

interface ThemeSwitcherProps {
  compact?: boolean;
}

const themes: { value: Theme; icon: typeof Sun; labelKey: "light" | "dark" | "system" }[] = [
  { value: "light", icon: Sun, labelKey: "light" },
  { value: "dark", icon: Moon, labelKey: "dark" },
  { value: "system", icon: Monitor, labelKey: "system" },
];

export function ThemeSwitcher({ compact = false }: ThemeSwitcherProps) {
  const { dict, theme, setTheme } = useTranslation();

  if (compact) {
    const current = themes.find((t) => t.value === theme) ?? themes[2];
    const Icon = current.icon;

    return (
      <div className="relative">
        <Icon
          size={14}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          aria-label={dict.theme.label}
          className="h-8 appearance-none rounded-md border border-border-default bg-bg-surface pl-8 pr-7 text-[13px] text-text-primary outline-none transition-colors focus:border-border-strong"
        >
          {themes.map((t) => (
            <option key={t.value} value={t.value}>
              {dict.theme[t.labelKey]}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-[13px] font-medium text-text-primary">
        {dict.theme.label}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((t) => {
          const Icon = t.icon;
          const active = theme === t.value;

          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setTheme(t.value)}
              className={`flex flex-col items-center gap-1.5 rounded-md border px-3 py-2.5 text-[12px] font-medium transition-colors ${
                active
                  ? "border-primary bg-primary-subtle text-primary"
                  : "border-border-default bg-bg-surface text-text-secondary hover:bg-bg-subtle"
              }`}
            >
              <Icon size={16} />
              {dict.theme[t.labelKey]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
