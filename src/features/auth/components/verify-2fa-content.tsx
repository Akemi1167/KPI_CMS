"use client";

import Link from "next/link";
import { SurfaceCard } from "@/components/cms/surface-card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/preferences-provider";

export function Verify2FAContent() {
  const { dict } = useTranslation();

  return (
    <SurfaceCard className="mx-auto w-full max-w-md text-center">
      <h1 className="text-[18px] font-semibold text-text-primary">{dict.twoFactor.title}</h1>
      <p className="mt-2 text-[13px] text-text-secondary">{dict.twoFactor.description}</p>
      <Link href="/login" className="mt-4 inline-block">
        <Button variant="secondary">{dict.twoFactor.backToLogin}</Button>
      </Link>
    </SurfaceCard>
  );
}
