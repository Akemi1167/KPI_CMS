"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, UserRound } from "lucide-react";
import { useTranslation } from "@/providers/preferences-provider";

export function EmployeeSidebar() {
  const pathname = usePathname();
  const { dict } = useTranslation();

  const navItems = [
    {
      href: "/employee/kpi-info",
      label: dict.employee.nav.kpiInfo,
      icon: BookOpen,
    },
    {
      href: "/employee/my-kpi",
      label: dict.employee.nav.myKpi,
      icon: UserRound,
    },
  ];

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-border-default bg-bg-surface">
      <div className="border-b border-border-default px-5 py-5">
        <Link href="/employee/my-kpi" className="text-[16px] font-semibold text-text-primary">
          {process.env.NEXT_PUBLIC_APP_NAME ?? "KPI Management CMS"}
        </Link>
        <p className="mt-0.5 text-[12px] text-text-muted">{dict.employee.tagline}</p>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-[13px] font-medium transition-colors ${
                isActive
                  ? "border-l-primary bg-primary-subtle text-primary"
                  : "border-l-transparent text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
