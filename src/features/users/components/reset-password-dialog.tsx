"use client";

import { useEffect, useRef, useState } from "react";
import { usersService } from "@/features/users/services/usersService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useTranslation } from "@/providers/preferences-provider";
import type { User } from "@/types/api";

interface ResetPasswordDialogProps {
  user: User | null;
  onClose: () => void;
}

export function ResetPasswordDialog({ user, onClose }: ResetPasswordDialogProps) {
  const { dict, t } = useTranslation();
  const p = dict.password;
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const open = Boolean(user);

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
    if (!user) return;
    setError("");

    if (newPassword.length < 6) {
      setError(p.minLength);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(p.mismatch);
      return;
    }

    setLoading(true);
    try {
      await usersService.resetPassword(user.id, { newPassword });
      setSuccess(true);
      setTimeout(handleClose, 1500);
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors));
    } finally {
      setLoading(false);
    }
  }

  if (!open || !user) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-full max-w-[480px] rounded-lg border border-border-default bg-bg-surface p-0 shadow-lg backdrop:bg-black/40"
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <h2 className="text-[16px] font-semibold text-text-primary">{dict.users.resetPasswordTitle}</h2>
          <p className="mt-1 text-[13px] text-text-secondary">
            {t(dict.users.resetPasswordDesc, { name: user.fullName })}
          </p>

          {success ? (
            <p className="mt-4 rounded-md border border-success/30 bg-success-subtle px-4 py-3 text-[13px] text-success">
              {dict.users.resetPasswordSuccess}
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {error && (
                <div className="rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
                  {error}
                </div>
              )}
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
              {loading ? dict.users.resettingPassword : dict.users.resetPassword}
            </Button>
          )}
        </div>
      </form>
    </dialog>
  );
}
