interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className = "" }: FormSectionProps) {
  return (
    <section
      className={`rounded-lg border border-border-default bg-bg-surface p-6 ${className}`}
    >
      <div className="mb-4">
        <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="mt-0.5 text-[13px] text-text-secondary">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
