"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { KpiResultBreakdownView } from "@/features/kpi/results/components/kpi-result-breakdown-view";
import { PageLoading } from "@/components/layout/page-loading";

function PreviewContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? undefined;
  const periodId = searchParams.get("periodId") ?? undefined;

  return <KpiResultBreakdownView userId={userId} periodId={periodId} />;
}

export default function KpiResultPreviewPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <PreviewContent />
    </Suspense>
  );
}
