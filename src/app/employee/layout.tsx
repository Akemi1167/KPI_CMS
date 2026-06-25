import { EmployeeProtectedLayout } from "@/components/layout/employee-protected-layout";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <EmployeeProtectedLayout>{children}</EmployeeProtectedLayout>;
}
