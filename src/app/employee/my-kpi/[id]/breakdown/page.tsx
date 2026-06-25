import { EmployeeBreakdownPage } from "@/features/employee/my-kpi/components/employee-breakdown-page";

export default async function EmployeeBreakdownRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EmployeeBreakdownPage resultId={id} />;
}
