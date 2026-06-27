"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ChangePasswordDialog } from "@/features/auth/components/change-password-dialog";
import { LanguageSwitcher } from "@/components/admin/language-switcher";
import { ThemeSwitcher } from "@/components/admin/theme-switcher";
import { Button } from "@/components/ui/button";
import { KeyRound, LogOut } from "lucide-react";
import { useTranslation } from "@/providers/preferences-provider";
import type { User } from "@/types/api";

export function AdminTopbar({ user }: { user: User }) {
  const { logout } = useAuth();
  const { dict } = useTranslation();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-6">
        <div className="text-[13px] text-text-secondary">
          {dict.topbar.greeting}{" "}
          <span className="font-medium text-text-primary">{user.fullName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-[12px] text-text-muted md:inline">{user.email}</span>
          <LanguageSwitcher compact />
          <ThemeSwitcher compact />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChangePasswordOpen(true)}
            type="button"
          >
            <KeyRound size={14} />
            <span className="hidden sm:inline">{dict.topbar.changePassword}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={logout} type="button">
            <LogOut size={14} />
            {dict.topbar.signOut}
          </Button>
        </div>
      </header>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </>
  );
}
