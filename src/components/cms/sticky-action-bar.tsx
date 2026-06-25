interface StickyActionBarProps {
  children: React.ReactNode;
  left?: React.ReactNode;
}

export function StickyActionBar({ children, left }: StickyActionBarProps) {
  return (
    <div className="sticky bottom-0 -mx-6 mt-6 border-t border-border-default bg-bg-surface/95 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div>{left}</div>
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </div>
  );
}
