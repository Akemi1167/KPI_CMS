"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/preferences-provider";
import type { PaginatedMeta } from "@/types/api";

interface PaginationBarProps {
  meta: PaginatedMeta;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ meta, onPageChange }: PaginationBarProps) {
  const { dict, t } = useTranslation();

  return (
    <div className="flex items-center justify-between border-t border-border-default px-4 py-3 text-[13px] text-text-secondary">
      <span>
        {t(dict.common.pagination, {
          page: meta.page,
          totalPages: meta.totalPages,
          total: meta.total,
        })}
      </span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          type="button"
        >
          {dict.common.previous}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
          type="button"
        >
          {dict.common.next}
        </Button>
      </div>
    </div>
  );
}
