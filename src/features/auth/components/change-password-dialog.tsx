"use client";

import { useEffect, useRef, useState } from "react";
import { authService } from "@/features/auth/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useTranslation } from "@/providers/preferences-provider";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
  const { dict } = useTranslation();
  const p = dict.password;
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError(p.minLength);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(p.mismatch);
      return;
    }
    if (newPassword === currentPassword) {
      setError(p.sameAsOld);
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setTimeout(handleClose, 1500);
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-full max-w-[480px] rounded-lg border border-border-default bg-bg-surface p-0 shadow-lg backdrop:bg-black/40"
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <h2 className="text-[16px] font-semibold text-text-primary">{p.changeTitle}</h2>
          <p className="mt-1 text-[13px] text-text-secondary">{p.changeDesc}</p>

          {success ? (
            <p className="mt-4 rounded-md border border-success/30 bg-success-subtle px-4 py-3 text-[13px] text-success">
              {p.changeSuccess}
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {error && (
                <div className="rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
                  {error}
                </div>
              )}
              <Input
                label={p.currentPassword}
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <Input
                label={p.newPassword}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                helperText={p.minLength}
                required
                autoComplete="new-password"
              />
              <Input
                label={p.confirmPassword}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-border-default px-6 py-4">
          <Button variant="secondary" onClick={handleClose} disabled={loading} type="button">
            {dict.common.cancel}
          </Button>
          {!success && (
            <Button type="submit" disabled={loading}>
              {loading ? p.changing : p.changeSubmit}
            </Button>
          )}
        </div>
      </form>
    </dialog>
  );
}
