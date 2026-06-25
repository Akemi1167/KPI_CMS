"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarRange,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  Tags,
  Users,
} from "lucide-react";
import { useTranslation } from "@/providers/preferences-provider";

export function AdminSidebar() {
  const pathname = usePathname();
  const { dict } = useTranslation();

  const navItems = [
    { href: "/admin", label: dict.nav.dashboard, icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: dict.nav.users, icon: Users },
    { href: "/admin/kpi-periods", label: dict.nav.kpiPeriods, icon: CalendarRange },
    { href: "/admin/kpi-event-types", label: dict.nav.kpiEventTypes, icon: Tags },
    { href: "/admin/kpi-events", label: dict.nav.kpiEvents, icon: ClipboardList },
    { href: "/admin/kpi-results", label: dict.nav.kpiResults, icon: ListChecks },
  ];

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-border-default bg-bg-surface">
      <div className="border-b border-border-default px-5 py-5">
        <Link href="/admin" className="text-[16px] font-semibold text-text-primary">
          {process.env.NEXT_PUBLIC_APP_NAME ?? "KPI Management CMS"}
        </Link>
        <p className="mt-0.5 text-[12px] text-text-muted">{dict.nav.tagline}</p>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
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
