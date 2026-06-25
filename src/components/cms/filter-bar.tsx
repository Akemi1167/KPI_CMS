"use client";

import { Search, X } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/preferences-provider";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusValue?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: FilterOption[];
  onReset?: () => void;
  hasActiveFilters?: boolean;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  statusValue,
  onStatusChange,
  statusOptions,
  onReset,
  hasActiveFilters,
}: FilterBarProps) {
  const { dict } = useTranslation();

  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-border-default bg-bg-surface px-4 py-3">
      <div className="min-w-[200px] flex-1">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder ?? dict.common.search}
            className="w-full rounded-md border border-border-default bg-bg-surface py-2 pl-9 pr-3 text-[13px] text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-border-strong"
            aria-label={dict.common.search}
          />
        </div>
      </div>

      {statusOptions && onStatusChange && (
        <div className="w-40">
          <Select
            label={dict.common.status}
            name="status"
            value={statusValue}
            onChange={(e) => onStatusChange(e.target.value)}
            options={statusOptions}
            className="text-[13px]"
          />
        </div>
      )}

      {hasActiveFilters && onReset && (
        <Button variant="ghost" size="sm" onClick={onReset} type="button">
          <X size={14} />
          {dict.common.reset}
        </Button>
      )}
    </div>
  );
}
