export default function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand";
}) {
  const cls =
    tone === "brand"
      ? "bg-brand/10 text-brand border-brand/20"
      : "border-[var(--border)] text-[var(--text-muted)] bg-[var(--bg-subtle)]";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}
