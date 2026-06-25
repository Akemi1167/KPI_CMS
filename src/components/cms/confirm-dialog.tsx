"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  processingLabel?: string;
  loading?: boolean;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  processingLabel = "Processing...",
  loading = false,
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-full max-w-[480px] rounded-lg border border-border-default bg-bg-surface p-0 shadow-lg backdrop:bg-black/40"
      onClose={onCancel}
    >
      <div className="p-6">
        <div className="flex gap-4">
          {variant === "danger" && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger-subtle">
              <AlertTriangle size={20} className="text-danger" />
            </div>
          )}
          <div>
            <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
            <p className="mt-2 text-[13px] text-text-secondary">{description}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t border-border-default px-6 py-4">
        <Button variant="secondary" onClick={onCancel} disabled={loading} type="button">
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "danger" ? "danger" : "primary"}
          onClick={onConfirm}
          disabled={loading}
          type="button"
        >
          {loading ? processingLabel : confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
