interface EmptyStateProps {
  title?: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {title && <p className="text-[14px] font-medium text-text-primary">{title}</p>}
      <p
        className={`max-w-sm text-[13px] text-text-secondary ${title ? "mt-1" : ""}`}
      >
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
