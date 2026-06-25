"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useAuth, useLoginForm } from "@/features/auth/hooks/useAuth";
import { LanguageSwitcher } from "@/components/admin/language-switcher";
import { ThemeSwitcher } from "@/components/admin/theme-switcher";
import { SurfaceCard } from "@/components/cms/surface-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getHomeRoute } from "@/lib/auth/roles";
import { useTranslation } from "@/providers/preferences-provider";

export function LoginForm() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { handleLogin, error, isSubmitting } = useLoginForm();
  const { dict } = useTranslation();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getHomeRoute(user.role));
    }
  }, [isLoading, user, router]);

  if (isLoading || user) {
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await handleLogin(email, password);
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex justify-end gap-2">
        <LanguageSwitcher compact />
        <ThemeSwitcher compact />
      </div>
      <SurfaceCard className="mx-auto w-full">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle">
            <ShieldCheck size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-[20px] font-semibold text-text-primary">{dict.auth.loginTitle}</h1>
            <p className="text-[13px] text-text-secondary">{dict.auth.loginDesc}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-danger/30 bg-danger-subtle px-4 py-3 text-[13px] text-danger">
              {error}
            </div>
          )}

          <Input
            label={dict.common.email}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label={dict.auth.password}
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? dict.auth.signingIn : dict.auth.signIn}
          </Button>
        </form>

        <p className="mt-4 text-[12px] text-text-muted">{dict.auth.defaultAccount}</p>
      </SurfaceCard>
    </div>
  );
}
