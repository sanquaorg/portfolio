export function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <ol className="relative space-y-8 border-l border-[var(--border)] pl-6">{children}</ol>
  );
}

export function TimelineItem({
  title,
  subtitle,
  period,
  children,
}: {
  title: string;
  subtitle?: string;
  period?: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="relative">
      <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-[var(--bg)] bg-brand" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        {period && <span className="muted text-sm">{period}</span>}
      </div>
      {subtitle && <p className="muted mt-0.5 text-sm">{subtitle}</p>}
      {children && <div className="mt-3">{children}</div>}
    </li>
  );
}
