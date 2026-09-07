import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="font-display text-6xl font-bold text-brand">404</p>
      <p className="muted max-w-sm">This page doesn&apos;t exist — it may have moved or never been here.</p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-[var(--brand-fg)] transition hover:opacity-90"
      >
        <ArrowLeft size={16} /> Back home
      </Link>
    </div>
  );
}
