import type { LucideIcon } from "lucide-react";

export default function Section({
  title,
  icon: Icon,
  children,
  id,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon size={18} strokeWidth={2} />
        </span>
        <h2 className="text-xl font-semibold">
          {title}
          <span className="mt-1 block h-0.5 w-10 rounded bg-brand" />
        </h2>
      </div>
      {children}
    </section>
  );
}
