interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function SurfaceCard({ children, className = "", padding = true }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-lg border border-border-default bg-bg-surface ${padding ? "p-6" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
