import { KpiResultBreakdownView } from "@/features/kpi/results/components/kpi-result-breakdown-view";

export default async function KpiResultBreakdownPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <KpiResultBreakdownView resultId={id} />;
}
