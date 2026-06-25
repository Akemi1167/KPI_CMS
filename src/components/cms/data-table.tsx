interface DataTableProps {
  children?: React.ReactNode;
  filter?: React.ReactNode;
  footer?: React.ReactNode;
  empty?: React.ReactNode;
}

export function DataTable({ children, filter, footer, empty }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-bg-surface">
      {filter}
      {empty ?? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">{children}</table>
          </div>
          {footer}
        </>
      )}
    </div>
  );
}

export function DataTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-border-default bg-bg-subtle text-left text-[12px] font-medium text-text-secondary">
        {children}
      </tr>
    </thead>
  );
}

export function DataTableHeaderCell({
  children,
  align = "left",
  className = "",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <th className={`px-4 py-3 ${alignClass} ${className}`}>{children}</th>
  );
}

export function DataTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border-default">{children}</tbody>;
}

export function DataTableRow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={`transition-colors hover:bg-bg-subtle/60 ${className}`}>{children}</tr>
  );
}

export function DataTableCell({
  children,
  align = "left",
  className = "",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <td className={`px-4 py-3.5 text-[13px] ${alignClass} ${className}`}>{children}</td>
  );
}

export function DataTableFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-t border-border-default px-4 py-3 text-[13px] text-text-secondary">
      {children}
    </div>
  );
}
